use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;

use search_core::{cosine_topk, load_index, Embedder, SearchHit, SearchIndex};
use tauri::{path::BaseDirectory, Manager, State};

// マーカー・メモの保存先: 実行ファイルと同じフォルダの annotations.json
// (インストール不要の単体配布でも、exe の隣に注釈データを持ち運べるようにする)
fn annotations_path() -> Result<PathBuf, String> {
  let exe = std::env::current_exe().map_err(|e| e.to_string())?;
  let dir = exe
    .parent()
    .ok_or_else(|| String::from("実行ファイルの場所を取得できません"))?;
  Ok(dir.join("annotations.json"))
}

#[tauri::command]
fn load_annotations() -> Result<String, String> {
  let path = annotations_path()?;
  if !path.exists() {
    return Ok(String::from("[]"));
  }
  fs::read_to_string(&path).map_err(|e| e.to_string())
}

// 一時ファイルへ書き切ってから rename で置き換える。
// 書き込み途中のクラッシュ・電源断で既存の annotations.json を壊さないため
#[tauri::command]
fn save_annotations(data: String) -> Result<(), String> {
  let path = annotations_path()?;
  let tmp = path.with_extension("json.tmp");
  fs::write(&tmp, data).map_err(|e| e.to_string())?;
  fs::rename(&tmp, &path).map_err(|e| e.to_string())
}

// 外部リンクを OS の既定ブラウザで開く。
// WebView 内で外部サイトへ遷移するとアプリ画面に戻れなくなるため、
// フロント側(+layout.svelte)がリンクのクリックを横取りしてこのコマンドを呼ぶ
#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
  // https のみ・安全な文字だけを許可する(シェル経由の起動に余計な文字を渡さない)
  let safe = url.starts_with("https://")
    && url
      .chars()
      .all(|c| c.is_ascii_alphanumeric() || "-._~:/?#=&%+".contains(c));
  if !safe {
    return Err(String::from("この URL は開けません"));
  }
  #[cfg(target_os = "windows")]
  let result = Command::new("explorer").arg(&url).spawn();
  #[cfg(target_os = "macos")]
  let result = Command::new("open").arg(&url).spawn();
  #[cfg(all(unix, not(target_os = "macos")))]
  let result = Command::new("xdg-open").arg(&url).spawn();
  result.map(|_| ()).map_err(|e| e.to_string())
}

// ===== セマンティック検索(章内 RAG) =====
// EmbeddingGemma を ONNX で動かし、事前計算した章の索引とコサイン類似度で
// 「意味の近い節」を返す。モデルと索引は resources/ に同梱する(完全オフライン)。

// モデルと索引は初回検索時に一度だけ読み込み、以後は使い回す。
// embed には可変参照が要るので Mutex で包む。
#[derive(Default)]
struct SearchState {
  engine: Mutex<Option<Engine>>,
}

struct Engine {
  embedder: Embedder,
  indices: HashMap<String, SearchIndex>,
}

// resources/model のモデルと resources/search-index/<lang>.idx を読み込む
fn init_engine(app: &tauri::AppHandle) -> Result<Engine, String> {
  let res = app
    .path()
    .resolve("resources", BaseDirectory::Resource)
    .map_err(|e| e.to_string())?;
  let embedder = Embedder::load(&res.join("model")).map_err(|e| e.to_string())?;
  let index_dir = res.join("search-index");
  let mut indices = HashMap::new();
  for lang in ["zh", "ja", "en"] {
    if let Ok(index) = load_index(&index_dir.join(format!("{lang}.idx"))) {
      indices.insert(lang.to_string(), index);
    }
  }
  Ok(Engine { embedder, indices })
}

#[tauri::command]
fn semantic_search(
  app: tauri::AppHandle,
  state: State<SearchState>,
  query: String,
  lang: String,
  k: usize,
) -> Result<Vec<SearchHit>, String> {
  let q = query.trim();
  if q.is_empty() {
    return Ok(Vec::new());
  }
  let mut guard = state.engine.lock().map_err(|e| e.to_string())?;
  if guard.is_none() {
    *guard = Some(init_engine(&app)?);
  }
  let engine = guard.as_mut().unwrap();
  if !engine.indices.contains_key(&lang) {
    return Ok(Vec::new()); // 索引未生成の言語
  }
  let query_vec = engine.embedder.embed_query(q).map_err(|e| e.to_string())?;
  let index = &engine.indices[&lang];
  Ok(cosine_topk(index, &query_vec, k.clamp(1, 50)))
}

// ===== 学習(間隔反復 + 進捗): 埋め込み SQLite + FSRS =====
// 重い処理・スキーマ・FSRS は study-core 側でテスト済み。ここは Mutex で包んで呼ぶだけ。

struct StudyState(Mutex<Option<study_core::Store>>);

// 学習 DB の場所:
//  - 便携(無安装)版: exe の隣に `data/` フォルダがあればそこへ(フォルダごと持ち運べる)
//  - 安装版: OS のアプリデータ領域(常に書き込め、外には出ない)
fn study_db_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
  if let Ok(exe) = std::env::current_exe() {
    if let Some(dir) = exe.parent() {
      let portable = dir.join("data");
      if portable.is_dir() {
        return Ok(portable.join("whatsllm.db"));
      }
    }
  }
  let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
  std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  Ok(dir.join("whatsllm.db"))
}

fn with_store<T>(
  state: &State<StudyState>,
  f: impl FnOnce(&study_core::Store) -> study_core::StudyResult<T>,
) -> Result<T, String> {
  let guard = state.0.lock().map_err(|e| e.to_string())?;
  let store = guard
    .as_ref()
    .ok_or_else(|| String::from("学習データベースを利用できません"))?;
  f(store).map_err(|e| e.to_string())
}

#[tauri::command]
#[allow(clippy::too_many_arguments)]
fn study_record_answer(
  state: State<StudyState>,
  lang: String,
  slug: String,
  qn: i64,
  qhash: String,
  correct: bool,
  elapsed_ms: Option<i64>,
  now: i64,
) -> Result<study_core::Card, String> {
  with_store(&state, |s| {
    s.record_answer(
      study_core::CardMeta { lang, slug, qn, qhash },
      correct,
      elapsed_ms,
      now,
    )
  })
}

#[tauri::command]
fn study_due(state: State<StudyState>, lang: String, now: i64) -> Result<Vec<study_core::Card>, String> {
  with_store(&state, |s| s.due_cards(&lang, now))
}

#[tauri::command]
fn study_all_cards(state: State<StudyState>, lang: String) -> Result<Vec<study_core::Card>, String> {
  with_store(&state, |s| s.all_cards(&lang))
}

#[tauri::command]
fn study_all_reviews(
  state: State<StudyState>,
  lang: String,
) -> Result<Vec<study_core::Review>, String> {
  with_store(&state, |s| s.all_reviews(&lang))
}

#[tauri::command]
fn study_mark_read(
  state: State<StudyState>,
  lang: String,
  slug: String,
  ts: i64,
) -> Result<(), String> {
  with_store(&state, |s| s.mark_read(&lang, &slug, ts))
}

#[tauri::command]
fn study_read_slugs(state: State<StudyState>, lang: String) -> Result<Vec<String>, String> {
  with_store(&state, |s| s.read_slugs(&lang))
}

#[tauri::command]
fn study_kv_get(state: State<StudyState>, key: String) -> Result<Option<String>, String> {
  with_store(&state, |s| s.kv_get(&key))
}

#[tauri::command]
fn study_kv_set(state: State<StudyState>, key: String, value: String) -> Result<(), String> {
  with_store(&state, |s| s.kv_set(&key, &value))
}

#[tauri::command]
fn study_reset(state: State<StudyState>) -> Result<(), String> {
  with_store(&state, |s| s.reset_progress())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(SearchState::default())
    .invoke_handler(tauri::generate_handler![
      load_annotations,
      save_annotations,
      open_external,
      semantic_search,
      study_record_answer,
      study_due,
      study_all_cards,
      study_all_reviews,
      study_mark_read,
      study_read_slugs,
      study_kv_get,
      study_kv_set,
      study_reset
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      // 学習 DB を開く。失敗してもアプリ自体は動かす(コマンド呼び出し時にエラーを返す)。
      let store = study_db_path(app.handle())
        .and_then(|p| study_core::Store::open(&p).map_err(|e| e.to_string()));
      match store {
        Ok(s) => {
          app.manage(StudyState(Mutex::new(Some(s))));
        }
        Err(e) => {
          log::warn!("study store init failed: {e}");
          app.manage(StudyState(Mutex::new(None)));
        }
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
