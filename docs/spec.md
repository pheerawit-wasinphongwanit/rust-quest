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
| 🪿 ใบงาน Goose (Goose Quest) | 99 assignment levels (9 tiers × 11, easy→hard) turned from the goose code review into mini-projects: go explore the pinned goose commit, come back, type the answer; no hints; explanation (หลักคิด + tools) unlocks after a correct answer; cumulative XP | M5 |

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

**Bank layout (M2):** questions are authored as JSON batches in `tools/bank/b*.json` + level assignments in `tools/bank/levels.json`; `tools/assemble.mjs` concatenates them into `src/questions.js` (the engine-facing build artifact). Verify runs against the assembled file. Level sizes: L1 10 · L2 35 · L3 38 · L4 40 · L5 27 = 150.

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

## 7. Goose Quest — ใบงาน 99 ด่าน (M5, user request 2026-09-22)

Turns the goose code review (reviews/2026-09-18-goose-code-review.md, repo pinned at commit `1e83e89f556fc60fd396df1fd0f2992f8b2f2dc1`) into 99 mini-project assignments the player solves *outside* the game (reading/exploring the goose repo) and then answers inside the game.

- **99 levels, 9 tiers × 11** sorted easy→hard: orientation → workspace → CI/Docker/supply-chain → design patterns → resource/output engineering → security layers → subprocess/shell engineering → review findings/verdict → capstone synthesis.
- **No hints, no reveal**: a wrong answer only counts an attempt; the correct answer is never displayed (solved levels re-open to re-read the explanation).
- **Answer checking**: typed short answer, normalized (casefold, trim, collapse whitespace, strip commas/quotes/asterisks), matched against an authored list of acceptable variants (numbers, English tokens, file paths; Thai variants only where natural).
- **Scoring**: tier × 10 XP per level (4,950 XP total), added to the global XP pool; progress in `SAVE.gq` (solved map + attempts + XP), persisted in localStorage; home card shows `x/99`.
- **Progression**: sequential unlock (level n+1 unlocks when n is solved); all levels listable grouped by tier.
- **Explanation after correct** (user requirement): หลักคิด/หลักการทำงาน + วิธีที่ goose ทำ (file:line จริง) + 🛠 tools ที่เกี่ยวข้อง.
- **Fact discipline**: every answer-bearing fact verified against the local goose clone at the pinned commit via `tools/verify-gq.mjs` (structural checks always; fact greps when `GOOSE_REPO` env points at a clone).

**Data pipeline:** `tools/bank/goosequest.json` → `tools/assemble-gq.mjs` → `src/goosequest.js` (`window.RQ_GQ`), inlined by `tools/build.mjs` like every other src script.

**Acceptance criteria (M5):**
- [ ] Home menu shows the 🪿 mode card with live `x/99` badge; list renders 99 levels grouped in 9 tiers
- [ ] Level 1 unlocked; each correct answer unlocks exactly the next level; wrong answers never reveal the answer
- [ ] Correct answer → explanation incl. หลักคิด + tools; XP = tier×10 awarded once, cumulative in HUD/stats
- [ ] `tools/verify-gq.mjs` green (structural + fact checks vs pinned goose clone)
- [ ] `tools/smoke-test.mjs` extended and green (wrong/right flow, unlock chain, persistence across reload)
- [ ] `tools/verify-questions.mjs` still green; `dist/rust-quest.html` builds offline single-file

## 8. Art direction (user decision 2026-09-21)

- Primary: emoji + hand-built SVG (diagrams must be precise)
- AI-art mascot allowed for structural-explanation framing; style TBD (pending user pick — M4 concern)
