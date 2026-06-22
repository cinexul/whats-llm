//! 学習データの中核。埋め込み SQLite に「設問カード / 復習ログ / 読了 / 設定」を持ち、
//! FSRS でスケジュールする。Tauri シェルからは薄いコマンド経由で呼ぶだけにする
//! (重い tauri/onnx ツリーから切り離し、この crate 単体で `cargo test` できるようにするため)。
//!
//! このファイルはまず永続化層(スキーマ + 開閉 + 移行 + 基本 CRUD)を固める。
//! FSRS スケジューリングは次段で `schedule` モジュールとして足す。

use std::path::Path;

use rusqlite::{params, Connection, OptionalExtension, Result};

mod schedule;
pub use schedule::{Rating, Scheduled, Scheduler, DEFAULT_RETENTION};

/// カードの学習段階。定着度はおもに stability/interval から導くので、ここは補助的。
pub const STATE_NEW: i64 = 0;
pub const STATE_LEARNING: i64 = 1;
pub const STATE_REVIEW: i64 = 2;
pub const STATE_RELEARNING: i64 = 3;

/// この crate のエラー。SQLite と FSRS の両方を畳む。
#[derive(Debug)]
pub enum StudyError {
    Sqlite(rusqlite::Error),
    Fsrs(fsrs::FSRSError),
}

impl std::fmt::Display for StudyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            StudyError::Sqlite(e) => write!(f, "sqlite: {e}"),
            StudyError::Fsrs(e) => write!(f, "fsrs: {e:?}"),
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
-- 設問カード(粒度は「1 設問 = 1 カード」)。id = lang:slug:qhash。
CREATE TABLE IF NOT EXISTS cards (
  id           TEXT PRIMARY KEY,
  lang         TEXT NOT NULL,
  slug         TEXT NOT NULL,
  qn           INTEGER NOT NULL,            -- 章内の設問番号(表示・並び用)
  qhash        TEXT NOT NULL,               -- 設問文のハッシュ(本文改訂の検知用)
  stability    REAL,                        -- FSRS 記憶状態
  difficulty   REAL,
  state        INTEGER NOT NULL DEFAULT 0,  -- 0 new / 1 learning / 2 review / 3 relearning
  due          INTEGER,                     -- 次回復習(epoch ms)
  last_review  INTEGER,                     -- 最終復習(epoch ms)
  reps         INTEGER NOT NULL DEFAULT 0,
  lapses       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(lang, due);

-- 1 回ごとの作答イベント(状態はここから再生できる = 成長/分析/パラメータ学習の素)。
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

-- 雑多な設定(theme / lang / font-scales 等)。
CREATE TABLE IF NOT EXISTS kv (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
"#;

/// 設問カード 1 件。`Option` の列は「まだ一度も解いていない(new)」を表す。
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
pub fn open(path: &Path) -> Result<Connection> {
    let conn = Connection::open(path)?;
    // WAL = 書き込み中の読みを止めない・クラッシュ耐性。synchronous=NORMAL は WAL での実用既定。
    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA synchronous=NORMAL;")?;
    migrate(&conn)?;
    Ok(conn)
}

/// テスト・一時用途のオンメモリ DB。
pub fn open_in_memory() -> Result<Connection> {
    let conn = Connection::open_in_memory()?;
    conn.execute_batch("PRAGMA foreign_keys=ON;")?;
    migrate(&conn)?;
    Ok(conn)
}

fn migrate(conn: &Connection) -> Result<()> {
    let v: i64 = conn.pragma_query_value(None, "user_version", |r| r.get(0))?;
    if v < 1 {
        conn.execute_batch(SCHEMA_V1)?;
    }
    // 将来: if v < 2 { ... }
    conn.pragma_update(None, "user_version", SCHEMA_VERSION)?;
    Ok(())
}

/// 設問カードの ID。`lang:slug:qhash`。設問文が変われば別カード扱いになる。
pub fn card_id(lang: &str, slug: &str, qhash: &str) -> String {
    format!("{lang}:{slug}:{qhash}")
}

/// カードを 1 件 upsert(無ければ作成、あれば FSRS 状態を更新)。
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

/// その言語の全カード(slug, qn 順)。進捗ページ・Insight 用。
pub fn all_cards(conn: &Connection, lang: &str) -> Result<Vec<Card>> {
    let mut stmt = conn.prepare(&format!(
        "SELECT {CARD_COLS} FROM cards WHERE lang = ?1 ORDER BY slug, qn"
    ))?;
    let rows = stmt.query_map(params![lang], row_to_card)?;
    rows.collect()
}

/// 復習イベント 1 件(分析用に最小限の列だけ)。
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
    conn.query_row("SELECT value FROM kv WHERE key = ?1", params![key], |r| r.get(0))
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

/// 1 設問への作答を記録する: カードを取得(無ければ新規)→ FSRS で更新 → 保存 → 復習ログに追記。
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
    let base = get_card(conn, &id)?.unwrap_or(Card {
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
    upsert_card(conn, &scheduled.card)?;
    conn.execute(
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
    Ok(scheduled.card)
}

/// アプリ(Tauri シェル)向けの不透明ハンドル。rusqlite 型を外へ出さず、
/// スケジューラも内側に 1 つだけ持つ。コマンドはこれを `Mutex` で包んで呼ぶだけ。
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
        record_answer(&self.conn, &self.scheduler, meta, correct, elapsed_ms, now_ms)
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

#[cfg(test)]
mod tests {
    use super::*;

    fn sample(now: i64) -> Card {
        Card {
            id: card_id("zh", "what-is-llm", "abc123"),
            lang: "zh".into(),
            slug: "what-is-llm".into(),
            qn: 1,
            qhash: "abc123".into(),
            stability: Some(3.5),
            difficulty: Some(5.0),
            state: 2,
            due: Some(now + 6 * 86_400_000),
            last_review: Some(now),
            reps: 2,
            lapses: 0,
        }
    }

    #[test]
    fn migrates_and_sets_version() {
        let conn = open_in_memory().unwrap();
        let v: i64 = conn
            .pragma_query_value(None, "user_version", |r| r.get(0))
            .unwrap();
        assert_eq!(v, SCHEMA_VERSION);
    }

    #[test]
    fn card_roundtrip_and_upsert() {
        let conn = open_in_memory().unwrap();
        let mut c = sample(1_000_000);
        upsert_card(&conn, &c).unwrap();
        assert_eq!(get_card(&conn, &c.id).unwrap().as_ref(), Some(&c));

        // 再 upsert で状態が更新される(行は増えない)
        c.reps = 3;
        c.stability = Some(9.9);
        upsert_card(&conn, &c).unwrap();
        let got = get_card(&conn, &c.id).unwrap().unwrap();
        assert_eq!(got.reps, 3);
        assert_eq!(got.stability, Some(9.9));
        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM cards", [], |r| r.get(0))
            .unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn due_query_orders_and_filters() {
        let conn = open_in_memory().unwrap();
        let now = 10_000_000i64;
        for (i, due) in [now - 100, now + 100, now - 50].into_iter().enumerate() {
            let c = Card {
                id: card_id("zh", "slug", &format!("h{i}")),
                qn: i as i64,
                qhash: format!("h{i}"),
                due: Some(due),
                ..sample(now)
            };
            upsert_card(&conn, &c).unwrap();
        }
        let due = due_cards(&conn, "zh", now).unwrap();
        // now 以下の 2 件だけ、かつ早い順
        assert_eq!(due.len(), 2);
        assert!(due[0].due.unwrap() <= due[1].due.unwrap());
    }

    #[test]
    fn read_progress_roundtrip() {
        let conn = open_in_memory().unwrap();
        mark_read(&conn, "ja", "rag", 5).unwrap();
        mark_read(&conn, "ja", "rag", 7).unwrap(); // 上書き
        mark_read(&conn, "ja", "what-is-agent", 8).unwrap();
        let mut slugs = read_slugs(&conn, "ja").unwrap();
        slugs.sort();
        assert_eq!(slugs, vec!["rag".to_string(), "what-is-agent".to_string()]);
    }

    #[test]
    fn record_answer_creates_card_due_in_future_and_logs() {
        let conn = open_in_memory().unwrap();
        let sched = Scheduler::with_defaults();
        let now = 1_700_000_000_000i64;
        let meta = || CardMeta {
            lang: "en".into(),
            slug: "rag".into(),
            qn: 2,
            qhash: "q2".into(),
        };

        // 初回正解 → カード生成、未来に due、復習 1 件
        let card = record_answer(&conn, &sched, meta(), true, Some(4200), now).unwrap();
        assert!(card.due.unwrap() > now);
        assert_eq!(card.reps, 1);
        assert!(card.stability.unwrap() > 0.0);

        // 同じ設問にもう一度(誤答) → 行は増えず、復習は 2 件、ラプス計上
        let card2 = record_answer(&conn, &sched, meta(), false, None, card.due.unwrap()).unwrap();
        assert_eq!(card2.reps, 2);
        assert_eq!(card2.lapses, 1);

        let cards: i64 = conn
            .query_row("SELECT COUNT(*) FROM cards", [], |r| r.get(0))
            .unwrap();
        let reviews: i64 = conn
            .query_row("SELECT COUNT(*) FROM reviews", [], |r| r.get(0))
            .unwrap();
        assert_eq!(cards, 1);
        assert_eq!(reviews, 2);
    }

    #[test]
    fn store_facade_works() {
        let store = Store::open_in_memory().unwrap();
        let now = 1_700_000_000_000i64;
        let card = store
            .record_answer(
                CardMeta {
                    lang: "zh".into(),
                    slug: "rag".into(),
                    qn: 1,
                    qhash: "h1".into(),
                },
                true,
                Some(1000),
                now,
            )
            .unwrap();
        assert!(card.due.unwrap() > now);
        assert_eq!(store.all_cards("zh").unwrap().len(), 1);
        store.mark_read("zh", "rag", now).unwrap();
        assert_eq!(store.read_slugs("zh").unwrap(), vec!["rag".to_string()]);
        store.reset_progress().unwrap();
        assert!(store.all_cards("zh").unwrap().is_empty());
    }

    #[test]
    fn all_cards_reviews_kv_and_reset() {
        let conn = open_in_memory().unwrap();
        let sched = Scheduler::with_defaults();
        let now = 1_700_000_000_000i64;
        for (slug, qn) in [("rag", 1), ("rag", 2), ("what-is-llm", 1)] {
            record_answer(
                &conn,
                &sched,
                CardMeta {
                    lang: "en".into(),
                    slug: slug.into(),
                    qn,
                    qhash: format!("{slug}-{qn}"),
                },
                qn != 2, // rag/2 だけ誤答
                None,
                now,
            )
            .unwrap();
        }

        let cards = all_cards(&conn, "en").unwrap();
        assert_eq!(cards.len(), 3);
        // slug, qn 順に並ぶ
        assert_eq!((cards[0].slug.as_str(), cards[0].qn), ("rag", 1));

        let reviews = all_reviews(&conn, "en").unwrap();
        assert_eq!(reviews.len(), 3);
        // 誤答は 1 件(rating Again=1)
        assert_eq!(reviews.iter().filter(|r| r.rating == 1).count(), 1);
        // 他言語は空
        assert!(all_cards(&conn, "zh").unwrap().is_empty());

        kv_set(&conn, "retention", "0.9").unwrap();
        assert_eq!(kv_get(&conn, "retention").unwrap().as_deref(), Some("0.9"));
        assert_eq!(kv_get(&conn, "missing").unwrap(), None);

        reset_progress(&conn).unwrap();
        assert!(all_cards(&conn, "en").unwrap().is_empty());
        assert!(all_reviews(&conn, "en").unwrap().is_empty());
        // 設定は残る
        assert_eq!(kv_get(&conn, "retention").unwrap().as_deref(), Some("0.9"));
    }
}
