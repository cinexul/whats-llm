//! FSRS によるスケジューリング。選択式クイズの正誤を FSRS の評価へ写像し、
//! カードの記憶状態(stability / difficulty)と次回復習日を更新する。
//! ここは DB 非依存の純粋計算に保ち、単体でテストできるようにする。
use fsrs::{ItemState, MemoryState, NextStates, DEFAULT_PARAMETERS, FSRS};

use crate::{Card, StudyResult, STATE_RELEARNING, STATE_REVIEW};

/// 目標保持率(この確率で思い出せる頃に次回を組む)。Anki 既定と同じ 0.9。
pub const DEFAULT_RETENTION: f32 = 0.9;
const DAY_MS: i64 = 86_400_000;

/// FSRS の 4 段階評価。選択式では対=Good / 誤=Again の 2 値だけ使う。
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Rating {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
}

/// 1 回の採点結果。
pub struct Scheduled {
    pub card: Card,
    pub rating: Rating,
    pub interval_days: i64,
}

pub struct Scheduler {
    fsrs: FSRS,
    retention: f32,
}

impl Scheduler {
    /// パラメータ(None で FSRS-6 既定)と保持率からスケジューラを作る。
    /// あとで利用者自身の復習ログから学習したパラメータを差し込めるよう、引数で受ける。
    pub fn new(params: Option<&[f32]>, retention: f32) -> StudyResult<Self> {
        let fsrs = FSRS::new(params.unwrap_or(&DEFAULT_PARAMETERS))?;
        Ok(Self { fsrs, retention })
    }

    /// 既定パラメータ・既定保持率。
    pub fn with_defaults() -> Self {
        Self::new(None, DEFAULT_RETENTION).expect("FSRS default parameters are always valid")
    }

    /// 選択式の正誤 → 評価。対=Good、誤=Again。
    pub fn rating_from_correct(correct: bool) -> Rating {
        if correct {
            Rating::Good
        } else {
            Rating::Again
        }
    }

    /// 1 回の作答でカードを更新した結果を返す(純粋計算)。
    /// `card` が new(stability/difficulty が None)なら初回として扱う。
    pub fn apply(&self, card: &Card, rating: Rating, now_ms: i64) -> StudyResult<Scheduled> {
        let memory = match (card.stability, card.difficulty) {
            (Some(s), Some(d)) => Some(MemoryState {
                stability: s as f32,
                difficulty: d as f32,
            }),
            _ => None,
        };
        let days_elapsed = match card.last_review {
            Some(last) => ((now_ms - last).max(0) / DAY_MS) as u32,
            None => 0,
        };

        let next: NextStates = self.fsrs.next_states(memory, self.retention, days_elapsed)?;
        let item: ItemState = match rating {
            Rating::Again => next.again,
            Rating::Hard => next.hard,
            Rating::Good => next.good,
            Rating::Easy => next.easy,
        };

        // FSRS の interval は日数(浮動)。最低 1 日に丸める。
        let interval_days = (item.interval.round() as i64).max(1);
        let is_lapse = matches!(rating, Rating::Again) && card.reps > 0;

        let mut updated = card.clone();
        updated.stability = Some(item.memory.stability as f64);
        updated.difficulty = Some(item.memory.difficulty as f64);
        updated.state = if matches!(rating, Rating::Again) {
            STATE_RELEARNING
        } else {
            STATE_REVIEW
        };
        updated.last_review = Some(now_ms);
        updated.due = Some(now_ms + interval_days * DAY_MS);
        updated.reps += 1;
        if is_lapse {
            updated.lapses += 1;
        }

        Ok(Scheduled {
            card: updated,
            rating,
            interval_days,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{card_id, Card, STATE_NEW};

    fn new_card() -> Card {
        Card {
            id: card_id("zh", "what-is-llm", "h"),
            lang: "zh".into(),
            slug: "what-is-llm".into(),
            qn: 1,
            qhash: "h".into(),
            stability: None,
            difficulty: None,
            state: STATE_NEW,
            due: None,
            last_review: None,
            reps: 0,
            lapses: 0,
        }
    }

    #[test]
    fn good_reviews_grow_the_interval() {
        let s = Scheduler::with_defaults();
        let mut card = new_card();
        let mut now = 1_000_000_000_000i64;
        let mut intervals = vec![];
        for _ in 0..4 {
            let r = s.apply(&card, Rating::Good, now).unwrap();
            intervals.push(r.interval_days);
            now = r.card.due.unwrap(); // 期限ちょうどで次を解く
            card = r.card;
        }
        assert!(
            intervals.first().unwrap() < intervals.last().unwrap(),
            "interval should grow with repeated Good: {intervals:?}"
        );
        assert!(card.stability.unwrap() > 0.0);
        assert_eq!(card.lapses, 0);
    }

    #[test]
    fn again_after_learning_lapses_and_shrinks() {
        let s = Scheduler::with_defaults();
        let mut card = new_card();
        let mut now = 1_000_000_000_000i64;
        for _ in 0..3 {
            let r = s.apply(&card, Rating::Good, now).unwrap();
            now = r.card.due.unwrap();
            card = r.card;
        }
        let big = card.due.unwrap() - card.last_review.unwrap();
        let r = s.apply(&card, Rating::Again, now).unwrap();
        let small = r.card.due.unwrap() - r.card.last_review.unwrap();
        assert!(small < big, "Again should shorten the next interval");
        assert_eq!(r.card.lapses, 1);
    }
}
