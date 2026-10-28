//! 网页版(src/lib/fsrs.ts)按同一份对照数据检查，保证两边排出的复习日期一致。
//! 改了调度规则或升级fsrs库时，用 `FSRS_FIXTURE_WRITE=1 cargo test -p study-core` 重新生成。
use serde_json::{json, Value};
use study_core::{card_id, Card, Rating, Scheduler, STATE_NEW};

const DAY: i64 = 86_400_000;
const START: i64 = 1_700_000_000_000;

/// 每一步：距离上一次到期日的偏移(天，可为负或小数)，以及是否答对。
fn cases() -> Vec<(&'static str, Vec<(f64, bool)>)> {
    vec![
        ("good on time", vec![(0.0, true); 6]),
        (
            "wrong first, then good",
            vec![
                (0.0, false),
                (0.0, true),
                (0.0, true),
                (0.0, true),
                (0.0, true),
            ],
        ),
        (
            "lapse after learning",
            vec![
                (0.0, true),
                (0.0, true),
                (0.0, true),
                (0.0, false),
                (0.0, true),
                (0.0, true),
            ],
        ),
        (
            "same-day repeats",
            vec![(0.0, true), (-0.99, true), (-0.98, false), (0.0, true)],
        ),
        (
            "late reviews",
            vec![
                (0.0, true),
                (5.0, true),
                (20.0, true),
                (60.0, false),
                (3.0, true),
            ],
        ),
        (
            "early reviews",
            vec![(0.0, true), (-0.5, true), (-1.0, true), (-2.0, true)],
        ),
        (
            "alternating",
            vec![
                (0.0, true),
                (0.0, false),
                (0.0, true),
                (0.0, false),
                (0.0, true),
                (0.0, false),
            ],
        ),
        ("long run", vec![(0.0, true); 10]),
    ]
}

fn generate() -> Value {
    let scheduler = Scheduler::with_defaults();
    let cases = cases()
        .into_iter()
        .map(|(name, steps)| {
            let mut card = Card {
                id: card_id("en", "what-is-llm", "q01"),
                lang: "en".into(),
                slug: "what-is-llm".into(),
                qn: 1,
                qhash: "q01".into(),
                stability: None,
                difficulty: None,
                state: STATE_NEW,
                due: None,
                last_review: None,
                reps: 0,
                lapses: 0,
            };
            let steps = steps
                .into_iter()
                .map(|(offset, correct)| {
                    let base = card.due.unwrap_or(START);
                    let at =
                        (base + (offset * DAY as f64) as i64).max(card.last_review.unwrap_or(0));
                    let rating = if correct { Rating::Good } else { Rating::Again };
                    let scheduled = scheduler.apply(&card, rating, at).unwrap();
                    card = scheduled.card;
                    json!({
                        "at": at,
                        "correct": correct,
                        "expect": {
                            "stability": card.stability,
                            "difficulty": card.difficulty,
                            "state": card.state,
                            "due": card.due,
                            "lastReview": card.last_review,
                            "reps": card.reps,
                            "lapses": card.lapses,
                            "intervalDays": scheduled.interval_days
                        }
                    })
                })
                .collect::<Vec<_>>();
            json!({ "name": name, "steps": steps })
        })
        .collect::<Vec<_>>();
    json!({ "fsrs": "fsrs-rs 6.6.1, default parameters, retention 0.9", "cases": cases })
}

#[test]
fn schedule_matches_the_shared_fixture() {
    let path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../../tests/fixtures/fsrs-schedule.json"
    );
    let generated = serde_json::to_string_pretty(&generate()).unwrap() + "\n";
    if std::env::var_os("FSRS_FIXTURE_WRITE").is_some() {
        std::fs::write(path, &generated).unwrap();
    }
    // 按文本比较：浮点数原样写出，不受解析精度影响
    assert_eq!(
        generated,
        std::fs::read_to_string(path).unwrap(),
        "scheduler output changed; regenerate the fixture and check the web version"
    );
}

#[test]
fn replaying_the_log_gives_the_same_card_as_answering_step_by_step() {
    let scheduler = Scheduler::with_defaults();
    let fixture = generate();
    for case in fixture["cases"].as_array().unwrap() {
        let steps = case["steps"].as_array().unwrap();
        let log: Vec<(i64, Rating)> = steps
            .iter()
            .map(|s| {
                (
                    s["at"].as_i64().unwrap(),
                    if s["correct"].as_bool().unwrap() {
                        Rating::Good
                    } else {
                        Rating::Again
                    },
                )
            })
            .collect();
        let base = Card {
            id: card_id("en", "what-is-llm", "q01"),
            lang: "en".into(),
            slug: "what-is-llm".into(),
            qn: 1,
            qhash: "q01".into(),
            stability: Some(99.0),
            difficulty: Some(9.0),
            state: 2,
            due: Some(1),
            last_review: Some(1),
            reps: 42,
            lapses: 7,
        };
        let replayed = scheduler.replay(&base, &log).unwrap();
        let last = &steps.last().unwrap()["expect"];
        assert_eq!(replayed.reps, last["reps"].as_i64().unwrap());
        assert_eq!(replayed.lapses, last["lapses"].as_i64().unwrap());
        assert_eq!(replayed.due, last["due"].as_i64());
        assert_eq!(replayed.stability, last["stability"].as_f64());
    }
}
