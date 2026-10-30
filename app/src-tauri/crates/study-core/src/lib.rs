//! 学習データの中核。埋め込みSQLiteに「設問カード / 復習ログ / 読了 / 設定」を持ち、
//! FSRSでスケジュールする。Tauriシェルからは薄いコマンド経由で呼ぶだけにする
//! 与Tauri外壳分离，可独立编译和检查。
//!
//! このファイルはまず永続化層(スキーマ + 開閉 + 移行 + 基本CRUD)を固める。
//! FSRSスケジューリングは次段で `schedule` モジュールとして足す。

use std::path::Path;

use rusqlite::{params, Connection, OptionalExtension, Result};

mod schedule;
mod snapshot;
pub use schedule::{Rating, Scheduled, Scheduler, DEFAULT_RETENTION};
pub use snapshot::{SnapshotRead, SnapshotReview, StudySnapshot};

/// カードの学習段階。定着度はおもにstability/intervalから導くので、ここは補助的。
pub const STATE_NEW: i64 = 0;
pub const STATE_LEARNING: i64 = 1;
pub const STATE_REVIEW: i64 = 2;
pub const STATE_RELEARNING: i64 = 3;

/// このcrateのエラー。SQLiteとFSRSの両方を畳む。
#[derive(Debug)]
pub enum StudyError {
    Sqlite(rusqlite::Error),
    Fsrs(fsrs::FSRSError),
    InvalidSnapshot(String),
    /// 更新的应用写过的数据库。旧程序看不懂新格式，宁可不打开也不能改坏它。
    NewerDatabase(i64),
}

impl std::fmt::Display for StudyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            StudyError::Sqlite(e) => write!(f, "sqlite: {e}"),
            StudyError::Fsrs(e) => write!(f, "fsrs: {e:?}"),
            StudyError::InvalidSnapshot(e) => write!(f, "snapshot: {e}"),
            StudyError::NewerDatabase(v) => write!(
                f,
                "the learning database uses schema v{v}, which this version of the app can't read; please update the app"
            ),
        }
    }
}

impl std::error::Error for StudyError {}

impl From<rusqlite::Error> for StudyError {
    fn from(e: rusqlite::Error) -> Self {
        StudyError::Sqlite(e)
    }
}

impl From<fsrs::FSRSError> for StudyError {
    fn from(e: fsrs::FSRSError) -> Self {
        StudyError::Fsrs(e)
    }
}

pub type StudyResult<T> = std::result::Result<T, StudyError>;

/// 現在のスキーマ版。破壊的変更のたびに上げ、`migrate` に分岐を足す。
const SCHEMA_VERSION: i64 = 1;

const SCHEMA_V1: &str = r#"
-- 設問カード(粒度は「1設問 = 1カード」)。id = lang:slug:qhash。
CREATE TABLE IF NOT EXISTS cards (
  id           TEXT PRIMARY KEY,
  lang         TEXT NOT NULL,
  slug         TEXT NOT NULL,
  qn           INTEGER NOT NULL,            -- 章内の設問番号(表示・並び用)
  qhash        TEXT NOT NULL,               -- 安定した評価ID (旧データは設問文のハッシュ)
  stability    REAL,                        -- FSRS記憶状態
  difficulty   REAL,
  state        INTEGER NOT NULL DEFAULT 0,  -- 0 new / 1 learning / 2 review / 3 relearning
  due          INTEGER,                     -- 次回復習(epoch ms)
  last_review  INTEGER,                     -- 最終復習(epoch ms)
  reps         INTEGER NOT NULL DEFAULT 0,
  lapses       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(lang, due);

-- 1回ごとの作答イベント(状態はここから再生できる = 成長/分析/パラメータ学習の素)。
CREATE TABLE IF NOT EXISTS reviews (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id        TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  ts             INTEGER NOT NULL,          -- epoch ms
  rating         INTEGER NOT NULL,          -- 1 Again / 2 Hard / 3 Good / 4 Easy
  elapsed_ms     INTEGER,                   -- 解答にかかった時間
  stability      REAL,                      -- 採点後のスナップショット
  difficulty     REAL,
  scheduled_days INTEGER
);
CREATE INDEX IF NOT EXISTS idx_reviews_card ON reviews(card_id, ts);
CREATE INDEX IF NOT EXISTS idx_reviews_ts ON reviews(ts);

-- 読了(章末まで到達)。言語別。
CREATE TABLE IF NOT EXISTS read_progress (
  lang TEXT NOT NULL,
  slug TEXT NOT NULL,
  ts   INTEGER NOT NULL,
  PRIMARY KEY (lang, slug)
);

-- 雑多な設定(theme / lang / font-scales等)。
CREATE TABLE IF NOT EXISTS kv (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
"#;

/// 設問カード1件。`Option` の列は「まだ一度も解いていない(new)」を表す。
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    pub id: String,
    pub lang: String,
    pub slug: String,
    pub qn: i64,
    pub qhash: String,
    pub stability: Option<f64>,
    pub difficulty: Option<f64>,
    pub state: i64,
    pub due: Option<i64>,
    pub last_review: Option<i64>,
    pub reps: i64,
    pub lapses: i64,
}

/// ファイルを開いて(無ければ作成)スキーマを最新へ移行する。
pub fn open(path: &Path) -> StudyResult<Connection> {
    let conn = Connection::open(path)?;
    // WAL = 書き込み中の読みを止めない・クラッシュ耐性。synchronous=NORMALはWALでの実用既定。
    conn.execute_batch(
        "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA synchronous=NORMAL;",
    )?;
    migrate(&conn)?;
    Ok(conn)
}

/// テスト・一時用途のオンメモリDB。
pub fn open_in_memory() -> StudyResult<Connection> {
    let conn = Connection::open_in_memory()?;
    conn.execute_batch("PRAGMA foreign_keys=ON;")?;
    migrate(&conn)?;
    Ok(conn)
}

fn migrate(conn: &Connection) -> StudyResult<()> {
    let v: i64 = conn.pragma_query_value(None, "user_version", |r| r.get(0))?;
    if v > SCHEMA_VERSION {
        return Err(StudyError::NewerDatabase(v));
    }
    if v < 1 {
        conn.execute_batch(SCHEMA_V1)?;
    }
    // 将来: if v < 2 { ... }
    conn.pragma_update(None, "user_version", SCHEMA_VERSION)?;
    Ok(())
}

/// 設問カードのID。`lang:slug:qhash`。qhashは安定した評価ID (旧データは設問文のハッシュ)。
pub fn card_id(lang: &str, slug: &str, qhash: &str) -> String {
    format!("{lang}:{slug}:{qhash}")
}

/// カードを1件upsert(無ければ作成、あればFSRS状態を更新)。
pub fn upsert_card(conn: &Connection, c: &Card) -> Result<()> {
    conn.execute(
        r#"
        INSERT INTO cards (id, lang, slug, qn, qhash, stability, difficulty, state, due, last_review, reps, lapses)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
        ON CONFLICT(id) DO UPDATE SET
          qn=excluded.qn, qhash=excluded.qhash,
          stability=excluded.stability, difficulty=excluded.difficulty,
          state=excluded.state, due=excluded.due, last_review=excluded.last_review,
          reps=excluded.reps, lapses=excluded.lapses
        "#,
        params![
            c.id, c.lang, c.slug, c.qn, c.qhash,
            c.stability, c.difficulty, c.state, c.due, c.last_review, c.reps, c.lapses
        ],
    )?;
    Ok(())
}

fn row_to_card(r: &rusqlite::Row<'_>) -> Result<Card> {
    Ok(Card {
        id: r.get(0)?,
        lang: r.get(1)?,
        slug: r.get(2)?,
        qn: r.get(3)?,
        qhash: r.get(4)?,
        stability: r.get(5)?,
        difficulty: r.get(6)?,
        state: r.get(7)?,
        due: r.get(8)?,
        last_review: r.get(9)?,
        reps: r.get(10)?,
        lapses: r.get(11)?,
    })
}

const CARD_COLS: &str =
    "id, lang, slug, qn, qhash, stability, difficulty, state, due, last_review, reps, lapses";

pub fn get_card(conn: &Connection, id: &str) -> Result<Option<Card>> {
    conn.query_row(
        &format!("SELECT {CARD_COLS} FROM cards WHERE id = ?1"),
        params![id],
        row_to_card,
    )
    .optional()
}

/// その言語で、`now` 時点で期限の来ているカードを期限の早い順に返す。
pub fn due_cards(conn: &Connection, lang: &str, now: i64) -> Result<Vec<Card>> {
    let mut stmt = conn.prepare(&format!(
        "SELECT {CARD_COLS} FROM cards WHERE lang = ?1 AND due IS NOT NULL AND due <= ?2 ORDER BY due ASC"
    ))?;
    let rows = stmt.query_map(params![lang, now], row_to_card)?;
    rows.collect()
}

/// その言語の全カード(slug, qn順)。進捗ページ・Insight用。
pub fn all_cards(conn: &Connection, lang: &str) -> Result<Vec<Card>> {
    let mut stmt = conn.prepare(&format!(
        "SELECT {CARD_COLS} FROM cards WHERE lang = ?1 ORDER BY slug, qn"
    ))?;
    let rows = stmt.query_map(params![lang], row_to_card)?;
    rows.collect()
}

/// 復習イベント1件(分析用に最小限の列だけ)。
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Review {
    pub card_id: String,
    pub ts: i64,
    pub rating: i64,
    pub elapsed_ms: Option<i64>,
    pub scheduled_days: Option<i64>,
}

/// その言語の全復習ログ(時刻昇順)。ヒートマップ・留存率・正答率の素材。
pub fn all_reviews(conn: &Connection, lang: &str) -> Result<Vec<Review>> {
    let mut stmt = conn.prepare(
        "SELECT r.card_id, r.ts, r.rating, r.elapsed_ms, r.scheduled_days
         FROM reviews r JOIN cards c ON c.id = r.card_id
         WHERE c.lang = ?1 ORDER BY r.ts ASC",
    )?;
    let rows = stmt.query_map(params![lang], |r| {
        Ok(Review {
            card_id: r.get(0)?,
            ts: r.get(1)?,
            rating: r.get(2)?,
            elapsed_ms: r.get(3)?,
            scheduled_days: r.get(4)?,
        })
    })?;
    rows.collect()
}

/// 設定など雑多な値の取得/保存(theme / lang / font-scales / 目標保持率…)。
pub fn kv_get(conn: &Connection, key: &str) -> Result<Option<String>> {
    conn.query_row("SELECT value FROM kv WHERE key = ?1", params![key], |r| {
        r.get(0)
    })
    .optional()
}

pub fn kv_set(conn: &Connection, key: &str, value: &str) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO kv (key, value) VALUES (?1, ?2)",
        params![key, value],
    )?;
    Ok(())
}

/// 学習進捗(カード・復習ログ・読了)を全消去する。設定(kv)は残す。
pub fn reset_progress(conn: &Connection) -> Result<()> {
    conn.execute_batch("DELETE FROM reviews; DELETE FROM cards; DELETE FROM read_progress;")?;
    Ok(())
}

pub fn mark_read(conn: &Connection, lang: &str, slug: &str, ts: i64) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO read_progress (lang, slug, ts) VALUES (?1, ?2, ?3)",
        params![lang, slug, ts],
    )?;
    Ok(())
}

pub fn read_slugs(conn: &Connection, lang: &str) -> Result<Vec<String>> {
    let mut stmt = conn.prepare("SELECT slug FROM read_progress WHERE lang = ?1")?;
    let rows = stmt.query_map(params![lang], |r| r.get(0))?;
    rows.collect()
}

/// カードを一意に決める素材(フロントから渡る)。
pub struct CardMeta {
    pub lang: String,
    pub slug: String,
    pub qn: i64,
    pub qhash: String,
}

/// 1設問への作答を記録する: カードを取得(無ければ新規)→ FSRSで更新 → 保存 → 復習ログに追記。
/// 採点後のカードを返す。
pub fn record_answer(
    conn: &Connection,
    scheduler: &Scheduler,
    meta: CardMeta,
    correct: bool,
    elapsed_ms: Option<i64>,
    now_ms: i64,
) -> StudyResult<Card> {
    let id = card_id(&meta.lang, &meta.slug, &meta.qhash);
    // 卡片和答题记录要么一起写进去，要么都不写
    let tx = conn.unchecked_transaction()?;
    let base = get_card(&tx, &id)?.unwrap_or(Card {
        id: id.clone(),
        lang: meta.lang,
        slug: meta.slug,
        qn: meta.qn,
        qhash: meta.qhash,
        stability: None,
        difficulty: None,
        state: STATE_NEW,
        due: None,
        last_review: None,
        reps: 0,
        lapses: 0,
    });

    let rating = Scheduler::rating_from_correct(correct);
    let scheduled = scheduler.apply(&base, rating, now_ms)?;
    upsert_card(&tx, &scheduled.card)?;
    tx.execute(
        "INSERT INTO reviews (card_id, ts, rating, elapsed_ms, stability, difficulty, scheduled_days)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            id,
            now_ms,
            rating as i64,
            elapsed_ms,
            scheduled.card.stability,
            scheduled.card.difficulty,
            scheduled.interval_days
        ],
    )?;
    tx.commit()?;
    Ok(scheduled.card)
}

/// アプリ(Tauriシェル)向けの不透明ハンドル。rusqlite型を外へ出さず、
/// スケジューラも内側に1つだけ持つ。コマンドはこれを `Mutex` で包んで呼ぶだけ。
pub struct Store {
    conn: Connection,
    scheduler: Scheduler,
}

impl Store {
    pub fn open(path: &Path) -> StudyResult<Self> {
        Ok(Store {
            conn: open(path)?,
            scheduler: Scheduler::with_defaults(),
        })
    }

    pub fn open_in_memory() -> StudyResult<Self> {
        Ok(Store {
            conn: open_in_memory()?,
            scheduler: Scheduler::with_defaults(),
        })
    }

    pub fn record_answer(
        &self,
        meta: CardMeta,
        correct: bool,
        elapsed_ms: Option<i64>,
        now_ms: i64,
    ) -> StudyResult<Card> {
        record_answer(
            &self.conn,
            &self.scheduler,
            meta,
            correct,
            elapsed_ms,
            now_ms,
        )
    }

    pub fn due_cards(&self, lang: &str, now: i64) -> StudyResult<Vec<Card>> {
        Ok(due_cards(&self.conn, lang, now)?)
    }

    pub fn all_cards(&self, lang: &str) -> StudyResult<Vec<Card>> {
        Ok(all_cards(&self.conn, lang)?)
    }

    pub fn all_reviews(&self, lang: &str) -> StudyResult<Vec<Review>> {
        Ok(all_reviews(&self.conn, lang)?)
    }

    pub fn mark_read(&self, lang: &str, slug: &str, ts: i64) -> StudyResult<()> {
        Ok(mark_read(&self.conn, lang, slug, ts)?)
    }

    pub fn read_slugs(&self, lang: &str) -> StudyResult<Vec<String>> {
        Ok(read_slugs(&self.conn, lang)?)
    }

    pub fn kv_get(&self, key: &str) -> StudyResult<Option<String>> {
        Ok(kv_get(&self.conn, key)?)
    }

    pub fn kv_set(&self, key: &str, value: &str) -> StudyResult<()> {
        Ok(kv_set(&self.conn, key, value)?)
    }

    pub fn reset_progress(&self) -> StudyResult<()> {
        Ok(reset_progress(&self.conn)?)
    }
}
