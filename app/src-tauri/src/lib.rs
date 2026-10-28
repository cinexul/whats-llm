use std::fs;
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;

use tauri::{Manager, State};

// マーカー・メモの保存先: 学習DBと同じフォルダのannotations.json
fn annotations_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(data_dir(app)?.join("annotations.json"))
}

// 以前はexeの隣に保存していた。新しい場所にまだ無ければこちらを読む
fn legacy_annotations_path() -> Option<PathBuf> {
    let exe = std::env::current_exe().ok()?;
    Some(exe.parent()?.join("annotations.json"))
}

#[tauri::command]
fn load_annotations(app: tauri::AppHandle) -> Result<String, String> {
    let path = annotations_path(&app)?;
    if path.exists() {
        return fs::read_to_string(&path).map_err(|e| e.to_string());
    }
    match legacy_annotations_path() {
        Some(old) if old.exists() => fs::read_to_string(&old).map_err(|e| e.to_string()),
        _ => Ok(String::from("[]")),
    }
}

// 一時ファイルへ書き切ってからrenameで置き換える。
// 書き込み途中のクラッシュ・電源断で既存のannotations.jsonを壊さないため
#[tauri::command]
fn save_annotations(app: tauri::AppHandle, data: String) -> Result<(), String> {
    let path = annotations_path(&app)?;
    let tmp = path.with_extension("json.tmp");
    let mut file = fs::File::create(&tmp).map_err(|e| e.to_string())?;
    file.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
    // renameの前に中身を確実にディスクへ書き出す(しないと停電後に空ファイルが残りうる)
    file.sync_all().map_err(|e| e.to_string())?;
    drop(file);
    fs::rename(&tmp, &path).map_err(|e| e.to_string())
}

// 外部リンクをOSの既定ブラウザで開く。
// WebView内で外部サイトへ遷移するとアプリ画面に戻れなくなるため、
// フロント側(+layout.svelte)がリンクのクリックを横取りしてこのコマンドを呼ぶ
#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    // httpsのみ・安全な文字だけを許可する(シェル経由の起動に余計な文字を渡さない)
    let safe = url.starts_with("https://")
        && url
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || "-._~:/?#=&%+".contains(c));
    if !safe {
        return Err(String::from("このURLは開けません"));
    }
    #[cfg(target_os = "windows")]
    let result = Command::new("explorer").arg(&url).spawn();
    #[cfg(target_os = "macos")]
    let result = Command::new("open").arg(&url).spawn();
    #[cfg(all(unix, not(target_os = "macos")))]
    let result = Command::new("xdg-open").arg(&url).spawn();
    result.map(|_| ()).map_err(|e| e.to_string())
}

// ===== 学習(間隔反復 + 進捗): 埋め込みSQLite + FSRS =====
// 重い処理・スキーマ・FSRSはstudy-core側でテスト済み。ここはMutexで包んで呼ぶだけ。

// 開けなかったときは理由を持っておき、画面に出す(空の進捗だけ見せて黙らない)。
struct StudyState(Mutex<Result<study_core::Store, String>>);

// 学習DBと注釈の保存先:
//  - 便携(無安装)版: exeの隣に `data/` フォルダがあればそこへ(フォルダごと持ち運べる)
//  - 安装版: OSのアプリデータ領域(常に書き込め、外には出ない)
fn data_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            let portable = dir.join("data");
            if portable.is_dir() {
                return Ok(portable);
            }
        }
    }
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn study_db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(data_dir(app)?.join("whatsllm.db"))
}

fn with_store<T>(
    state: &State<StudyState>,
    f: impl FnOnce(&study_core::Store) -> study_core::StudyResult<T>,
) -> Result<T, String> {
    let guard = state.0.lock().map_err(|e| e.to_string())?;
    let store = guard.as_ref().map_err(|e| e.clone())?;
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
            study_core::CardMeta {
                lang,
                slug,
                qn,
                qhash,
            },
            correct,
            elapsed_ms,
            now,
        )
    })
}

#[tauri::command]
fn study_all_cards(
    state: State<StudyState>,
    lang: String,
) -> Result<Vec<study_core::Card>, String> {
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

/// 学習DBを開けなかった理由。開けていればNone。
#[tauri::command]
fn study_open_error(state: State<StudyState>) -> Option<String> {
    match state.0.lock() {
        Ok(guard) => guard.as_ref().err().cloned(),
        Err(e) => Some(e.to_string()),
    }
}

#[tauri::command]
fn study_reset(state: State<StudyState>) -> Result<(), String> {
    with_store(&state, |s| s.reset_progress())
}

#[tauri::command]
fn study_export_snapshot(state: State<StudyState>) -> Result<study_core::StudySnapshot, String> {
    with_store(&state, |s| s.export_snapshot())
}

#[tauri::command]
fn study_import_snapshot(
    state: State<StudyState>,
    snapshot: study_core::StudySnapshot,
) -> Result<(), String> {
    with_store(&state, |s| s.import_snapshot(&snapshot))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_annotations,
            save_annotations,
            open_external,
            study_record_answer,
            study_all_cards,
            study_all_reviews,
            study_mark_read,
            study_read_slugs,
            study_reset,
            study_open_error,
            study_export_snapshot,
            study_import_snapshot
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            // 学習DBを開く。失敗してもアプリ自体は動かし、理由は画面に出す(study_open_error)。
            let store = study_db_path(app.handle())
                .and_then(|p| study_core::Store::open(&p).map_err(|e| e.to_string()));
            if let Err(e) = &store {
                log::warn!("study store init failed: {e}");
            }
            app.manage(StudyState(Mutex::new(store)));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
