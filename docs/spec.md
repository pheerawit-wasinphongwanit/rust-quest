# Game Spec — RustQuest (ทบทวน Rust ผ่านเกม)

> Status: M1 (approved plan 2026-09-21). This file is the single source of truth for scope and acceptance criteria. Changes here precede code changes.

## 1. Vision

Thai-language review game for Rust syntax, common patterns, and memory-model intuition. Continues the Goose learning series (docs live in nexus-agent/output/goose-rust-patterns/). Player answers fast, gets instant feedback with detailed explanations, and *sees* memory during execution in the Memory Lab.

## 2. Modes

| Mode | Description | Milestone |
|---|---|---|
| 🗺️ Campaign | Levels grouped by category; pass to unlock next; 1–3 stars by accuracy | M1 (1 level live, structure for all) |
| 🧠 Memory Lab | 7 interactive scenes: code steps on the left, live Stack/Heap SVG panel on the right | M3 |
| ⚔️ Boss Rush | Timed mixed quiz, streak multiplier, best-score tracking | M2 |

## 3. Question bank — 150 questions (M2 target; M1 ships 10 across all types)

Categories & mix (of total):
- **Syntax & std basics (Cookbook-grounded)** ~40% — Vec/HashMap/sort (Algorithms), strings & text processing, type conversion, randomness, CLI-ish basics
- **Goose patterns** ~35% — tagged enum, fluent setter, Display, trait + default method, thiserror/anyhow-style error categories, retry, channel, select! + CancellationToken, macro_rules, operation pipeline
- **Memory & ownership** ~25% — stack vs heap, move, borrow &, &mut, clone, Vec growth, Arc refcount, channel queues (ties into Memory Lab scenes)

Question types (engine supports all from M1):
1. `mcq` — 4 choices, concept
2. `output` — predict program output (code MUST be rustc-verified)
3. `bug` — spot the bug / name the error (code MUST fail with the claimed error)
4. `fill` — fill the blank(s) in code
5. `order` — tap-to-order shuffled code lines
6. `memory` — answer from a (static in M1, live in M3) memory diagram

Difficulty: easy→hard slope per level and across campaign (user decision 2026-09-21).

Every question carries: `id, type, cat, diff (1-3), prompt (Thai), payload, explain (Thai, detailed), source (cookbook section / goose pattern # / lesson ref)`.

## 4. Game systems

- XP per correct (base 10 × difficulty × streak multiplier), streak counter
- Stars per level: ≤1 miss = 3★, ≤25% miss = 2★, pass = 1★
- Progress + stats in localStorage (`rustquest.save.v1`); wrong-answer hotlist surfaced for review (smart review queue)
- All UI text Thai; code stays English (Rust is English-keyed)

## 5. Non-goals

- No backend, no accounts, no network calls (offline single file)
- No real Rust execution in-browser (verified outputs are baked at build time)
- Not a course — assumes the player read the Goose docs; this is review/practice

## 6. Acceptance criteria (M1)

- [ ] Home screen with 3 mode cards; Campaign opens level map with level 1 playable (10 questions), Memory Lab & Boss Rush marked "เร็ว ๆ นี้"
- [ ] All 6 question types playable with answer checking + detailed explanation reveal
- [ ] XP/streak/stars compute and persist across reloads
- [ ] All 10 questions' code claims rustc-verified; `tools/verify-questions.mjs` green
- [ ] `dist/rust-quest.html` built by `tools/build.mjs`, opens offline, 60KB–120KB
- [ ] Repo pushed to github.com/pheerawit-wasinphongwanit/rust-quest

## 7. Art direction (user decision 2026-09-21)

- Primary: emoji + hand-built SVG (diagrams must be precise)
- AI-art mascot allowed for structural-explanation framing; style TBD (pending user pick — M4 concern)
