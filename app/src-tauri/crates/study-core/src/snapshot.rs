//! 可导入导出的快照，包含已停用卡片及完整的复习和阅读元数据。
//! 导入时先校验，再在同一个SQLite事务中合并所有表。
use crate::{
    get_card, row_to_card, upsert_card, Card, Rating, Store, StudyError, StudyResult, CARD_COLS,
};
use rusqlite::{params, Connection};
use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SnapshotReview {
    pub card_id: String,
    pub ts: i64,
    pub rating: i64,
    pub elapsed_ms: Option<i64>,
    pub scheduled_days: Option<i64>,
    pub stability: Option<f64>,
    pub difficulty: Option<f64>,
}
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SnapshotRead {
    pub lang: String,
    pub slug: String,
    pub ts: i64,
}
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct StudySnapshot {
    pub cards: Vec<Card>,
    pub reviews: Vec<SnapshotReview>,
    pub read: Vec<SnapshotRead>,
    pub kv: BTreeMap<String, String>,
}
const MAX_SAFE: i64 = 9_007_199_254_740_991;
const MAX_TIMESTAMP: i64 = 8_640_000_000_000_000;
fn valid_lang(s: &str) -> bool {
    matches!(s, "zh" | "en" | "ja")
}
fn valid_id(s: &str) -> bool {
    !s.trim().is_empty()
        && s.chars().count() <= 512
        && !s.chars().any(|c| c == ':' || c.is_control())
        && !matches!(s, "__proto__" | "constructor" | "prototype")
}
fn valid_number(n: i64) -> bool {
    (0..=MAX_SAFE).contains(&n)
}
fn optional_number(n: Option<i64>) -> bool {
    n.map_or(true, valid_number)
}
fn timestamp(n: i64) -> bool {
    (0..=MAX_TIMESTAMP).contains(&n)
}
fn optional_timestamp(n: Option<i64>) -> bool {
    n.map_or(true, timestamp)
}
fn optional_float(n: Option<f64>, max: f64) -> bool {
    n.map_or(true, |n| n.is_finite() && n >= 0.0 && n <= max)
}
fn invalid() -> StudyError {
    StudyError::InvalidSnapshot("Invalid or oversized study snapshot".into())
}
impl StudySnapshot {
    pub fn validate(&self) -> StudyResult<()> {
        if self.cards.len() > 50_000
            || self.reviews.len() > 200_000
            || self.read.len() > 20_000
            || self.kv.len() > 200
        {
            return Err(invalid());
        }
        let mut ids = HashSet::new();
        for c in &self.cards {
            if !valid_lang(&c.lang)
                || !valid_id(&c.slug)
                || c.qhash.trim().is_empty()
                || c.qhash.chars().count() > 512
                || c.id != crate::card_id(&c.lang, &c.slug, &c.qhash)
                || !ids.insert(&c.id)
                || !(0..=100_000).contains(&c.qn)
                || !(0..=3).contains(&c.state)
                || !valid_number(c.reps)
                || !valid_number(c.lapses)
                || !optional_timestamp(c.due)
                || !optional_timestamp(c.last_review)
                || !optional_float(c.stability, 1e9)
                || !optional_float(c.difficulty, 10.0)
            {
                return Err(invalid());
            }
        }
        for r in &self.reviews {
            if !ids.contains(&r.card_id)
                || !timestamp(r.ts)
                || !(1..=4).contains(&r.rating)
                || !optional_number(r.elapsed_ms)
                || !optional_number(r.scheduled_days)
                || !optional_float(r.stability, 1e9)
                || !optional_float(r.difficulty, 10.0)
            {
                return Err(invalid());
            }
        }
        let mut read = HashSet::new();
        for r in &self.read {
            if !valid_lang(&r.lang)
                || !valid_id(&r.slug)
                || !timestamp(r.ts)
                || !read.insert((&r.lang, &r.slug))
            {
                return Err(invalid());
            }
        }
        for (key, value) in &self.kv {
            if !valid_id(key) || value.chars().count() > 100_000 {
                return Err(invalid());
            }
        }
        Ok(())
    }
}
fn snapshot(conn: &Connection) -> StudyResult<StudySnapshot> {
    let cards = conn
        .prepare(&format!("SELECT {CARD_COLS} FROM cards ORDER BY id"))?
        .query_map([], row_to_card)?
        .collect::<rusqlite::Result<Vec<_>>>()?;
    let reviews = conn.prepare("SELECT card_id, ts, rating, elapsed_ms, scheduled_days, stability, difficulty FROM reviews ORDER BY ts, id")?
        .query_map([], |r| Ok(SnapshotReview { card_id: r.get(0)?, ts: r.get(1)?, rating: r.get(2)?, elapsed_ms: r.get(3)?, scheduled_days: r.get(4)?, stability: r.get(5)?, difficulty: r.get(6)? }))?
        .collect::<rusqlite::Result<Vec<_>>>()?;
    let read = conn
        .prepare("SELECT lang, slug, ts FROM read_progress ORDER BY lang, slug")?
        .query_map([], |r| {
            Ok(SnapshotRead {
                lang: r.get(0)?,
                slug: r.get(1)?,
                ts: r.get(2)?,
            })
        })?
        .collect::<rusqlite::Result<Vec<_>>>()?;
    let kv = conn
        .prepare("SELECT key, value FROM kv ORDER BY key")?
        .query_map([], |r| Ok((r.get(0)?, r.get(1)?)))?
        .collect::<rusqlite::Result<BTreeMap<_, _>>>()?;
    Ok(StudySnapshot {
        cards,
        reviews,
        read,
        kv,
    })
}
impl Store {
    pub fn export_snapshot(&self) -> StudyResult<StudySnapshot> {
        snapshot(&self.conn)
    }
    pub fn import_snapshot(&self, incoming: &StudySnapshot) -> StudyResult<()> {
        incoming.validate()?;
        let tx = self.conn.unchecked_transaction()?;
        for c in &incoming.cards {
            let old = get_card(&tx, &c.id)?;
            // 时间戳相同时保留本设备的值，与浏览器的合并规则一致。
            if old.as_ref().map_or(true, |old| {
                c.last_review.unwrap_or(0) > old.last_review.unwrap_or(0)
            }) {
                upsert_card(&tx, c)?;
            }
        }
        // 保留重复事件的实际数量，但重复导入同一快照不会增加事件。
        let mut seen = HashMap::<String, i64>::new();
        for r in &incoming.reviews {
            let key = format!(
                "{:?}",
                (
                    r.card_id.as_str(),
                    r.ts,
                    r.rating,
                    r.elapsed_ms,
                    r.scheduled_days,
                    r.stability,
                    r.difficulty
                )
            );
            let occurrence = seen.entry(key).or_insert(0);
            *occurrence += 1;
            let count: i64 = tx.query_row(
                "SELECT COUNT(*) FROM reviews WHERE card_id=?1 AND ts=?2 AND rating=?3 AND elapsed_ms IS ?4 AND scheduled_days IS ?5 AND stability IS ?6 AND difficulty IS ?7",
                params![r.card_id, r.ts, r.rating, r.elapsed_ms, r.scheduled_days, r.stability, r.difficulty], |row| row.get(0))?;
            if *occurrence > count {
                tx.execute("INSERT INTO reviews (card_id, ts, rating, elapsed_ms, scheduled_days, stability, difficulty) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
                    params![r.card_id, r.ts, r.rating, r.elapsed_ms, r.scheduled_days, r.stability, r.difficulty])?;
            }
        }
        // 合并后的答题记录是唯一依据：受影响的卡片都按完整记录重算一遍，
        // 不会出现“卡片状态来自一台设备、记录来自两台设备”的矛盾。
        let touched: BTreeSet<&str> = incoming
            .cards
            .iter()
            .map(|c| c.id.as_str())
            .chain(incoming.reviews.iter().map(|r| r.card_id.as_str()))
            .collect();
        for id in touched {
            let history = tx
                .prepare("SELECT ts, rating FROM reviews WHERE card_id=?1 ORDER BY ts, id")?
                .query_map(params![id], |r| {
                    Ok((r.get::<_, i64>(0)?, r.get::<_, i64>(1)?))
                })?
                .collect::<rusqlite::Result<Vec<_>>>()?;
            if history.is_empty() {
                continue;
            }
            let ratings = history
                .into_iter()
                .map(|(ts, rating)| {
                    Rating::from_i64(rating)
                        .map(|r| (ts, r))
                        .ok_or_else(invalid)
                })
                .collect::<StudyResult<Vec<_>>>()?;
            if let Some(base) = get_card(&tx, id)? {
                upsert_card(&tx, &self.scheduler.replay(&base, &ratings)?)?;
            }
        }
        for r in &incoming.read {
            tx.execute("INSERT INTO read_progress (lang, slug, ts) VALUES (?1, ?2, ?3) ON CONFLICT(lang, slug) DO UPDATE SET ts=MAX(read_progress.ts, excluded.ts)", params![r.lang, r.slug, r.ts])?;
        }
        for (key, value) in &incoming.kv {
            tx.execute(
                "INSERT INTO kv (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO NOTHING",
                params![key, value],
            )?;
        }
        tx.commit()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::CardMeta;
    fn seed(store: &Store, hash: &str, now: i64) {
        store
            .record_answer(
                CardMeta {
                    lang: "en".into(),
                    slug: "rag".into(),
                    qn: 1,
                    qhash: hash.into(),
                },
                true,
                Some(100),
                now,
            )
            .unwrap();
        store.mark_read("en", "rag", now).unwrap();
        store.kv_set("theme", "dark").unwrap();
    }
    #[test]
    fn complete_roundtrip_and_repeat_import_are_lossless() {
        let source = Store::open_in_memory().unwrap();
        seed(&source, "retired-question", 1000);
        seed(&source, "current-question", 2000);
        // 完全相同的事件也可能真实发生；每次导出再导入都要保留其数量。
        source.conn.execute("INSERT INTO reviews (card_id, ts, rating, elapsed_ms, scheduled_days, stability, difficulty) SELECT card_id, ts, rating, elapsed_ms, scheduled_days, stability, difficulty FROM reviews LIMIT 1", []).unwrap();
        let exported = source.export_snapshot().unwrap();
        let target = Store::open_in_memory().unwrap();
        target.import_snapshot(&exported).unwrap();
        let once = target.export_snapshot().unwrap();
        assert_eq!(once.reviews, exported.reviews);
        assert_eq!(once.read, exported.read);
        assert_eq!(once.kv, exported.kv);
        // 卡片按导入的完整记录重算；重复导入不再改变任何东西
        target.import_snapshot(&exported).unwrap();
        assert_eq!(target.export_snapshot().unwrap(), once);
    }
    #[test]
    fn import_rebuilds_cards_from_the_combined_review_log() {
        let local = Store::open_in_memory().unwrap();
        seed(&local, "q", 2000);
        let remote = Store::open_in_memory().unwrap();
        seed(&remote, "q", 1000);
        local
            .import_snapshot(&remote.export_snapshot().unwrap())
            .unwrap();
        // 结果和在同一台设备上先后作答两次一样
        let together = Store::open_in_memory().unwrap();
        seed(&together, "q", 1000);
        seed(&together, "q", 2000);
        assert_eq!(
            local.all_cards("en").unwrap(),
            together.all_cards("en").unwrap()
        );
        assert_eq!(local.all_cards("en").unwrap()[0].reps, 2);
        assert_eq!(local.all_reviews("en").unwrap().len(), 2);
        assert_eq!(local.export_snapshot().unwrap().read[0].ts, 2000);
    }
    #[test]
    fn corrupt_snapshot_changes_nothing() {
        let local = Store::open_in_memory().unwrap();
        seed(&local, "local", 1000);
        let before = local.export_snapshot().unwrap();
        let mut bad = before.clone();
        bad.cards[0].id = "bad".into();
        assert!(local.import_snapshot(&bad).is_err());
        assert_eq!(local.export_snapshot().unwrap(), before);
        let mut bad = before.clone();
        bad.reviews[0].card_id = "missing".into();
        assert!(local.import_snapshot(&bad).is_err());
        assert_eq!(local.export_snapshot().unwrap(), before);
        let mut bad = before.clone();
        bad.cards[0].stability = Some(f64::NAN);
        assert!(local.import_snapshot(&bad).is_err());
        assert_eq!(local.export_snapshot().unwrap(), before);
    }
    #[test]
    fn sqlite_failure_rolls_back_cards_reviews_and_read_progress() {
        let local = Store::open_in_memory().unwrap();
        seed(&local, "local", 1000);
        let before = local.export_snapshot().unwrap();
        let remote = Store::open_in_memory().unwrap();
        seed(&remote, "remote", 2000);
        local.conn.execute_batch("CREATE TRIGGER fail_read BEFORE INSERT ON read_progress BEGIN SELECT RAISE(ABORT, 'disk-like failure'); END;").unwrap();
        assert!(local
            .import_snapshot(&remote.export_snapshot().unwrap())
            .is_err());
        assert_eq!(local.export_snapshot().unwrap(), before);
    }
}
