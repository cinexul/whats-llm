//! FSRSによるスケジューリング。選択式クイズの正誤をFSRSの評価へ写像し、
//! カードの記憶状態(stability / difficulty)と次回復習日を更新する。
//! ここはDB非依存の純粋計算に保ち、単体でテストできるようにする。
use fsrs::{ItemState, MemoryState, NextStates, DEFAULT_PARAMETERS, FSRS};

use crate::{Card, StudyResult, STATE_RELEARNING, STATE_REVIEW};

/// 目標保持率(この確率で思い出せる頃に次回を組む)。Anki既定と同じ0.9。
pub const DEFAULT_RETENTION: f32 = 0.9;
const DAY_MS: i64 = 86_400_000;

/// FSRSの4段階評価。選択式では対=Good / 誤=Againの2値だけ使う。
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Rating {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
}

impl Rating {
    /// 答题记录里存的数字(1–4)换回评价。
    pub fn from_i64(value: i64) -> Option<Rating> {
        match value {
            1 => Some(Rating::Again),
            2 => Some(Rating::Hard),
            3 => Some(Rating::Good),
            4 => Some(Rating::Easy),
            _ => None,
        }
    }
}

/// 1回の採点結果。
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
    /// パラメータ(NoneでFSRS-6既定)と保持率からスケジューラを作る。
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

    /// 1回の作答でカードを更新した結果を返す(純粋計算)。
    /// `card` がnew(stability/difficultyがNone)なら初回として扱う。
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

        let next: NextStates = self
            .fsrs
            .next_states(memory, self.retention, days_elapsed)?;
        let item: ItemState = match rating {
            Rating::Again => next.again,
            Rating::Hard => next.hard,
            Rating::Good => next.good,
            Rating::Easy => next.easy,
        };

        // FSRSのintervalは日数(浮動)。最低1日に丸める。
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

    /// 从空白卡片开始，按时间顺序重放答题记录。卡片状态完全由答题记录决定，
    /// 所以两台设备的记录合并后重放一遍，结果和在一台设备上依次作答相同。
    pub fn replay(&self, base: &Card, reviews: &[(i64, Rating)]) -> StudyResult<Card> {
        let mut card = Card {
            stability: None,
            difficulty: None,
            state: crate::STATE_NEW,
            due: None,
            last_review: None,
            reps: 0,
            lapses: 0,
            ..base.clone()
        };
        for &(ts, rating) in reviews {
            card = self.apply(&card, rating, ts)?.card;
        }
        Ok(card)
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
