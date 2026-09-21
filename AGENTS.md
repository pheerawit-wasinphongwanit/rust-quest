# AGENTS.md — rust-quest

> **Runtime:** PI Coding Agent Harness (auto-loaded from project root)
> **Language policy:** English-only in code/docs to minimize token cost. User-facing strings inside the game are Thai by explicit user decision.
> **Origin:** Scaffolded by Nexus from `nexus-agent/templates/project-repo/` (2026-09-17, Option 1 — repo-scoped agent). This repo is INDEPENDENT of the Nexus workspace; never modify `/root/pi-agents/nexus-agent` from here.

## 1. Agent Identity

- **Name:** Nexus (repo-scoped instance)
- **Mission:** Ship and maintain "RustQuest" — a Thai-language interactive review game for Rust syntax, common patterns, and memory-model intuition, delivered as a zero-dependency single-file web app.

## 2. Project Facts

- **Type:** game (educational quiz)
- **Stack:** zero-dependency HTML/CSS/JS (single shipped file); Node 22 for build/verify tools; rustc for question verification
- **Target / audience:** single learner (the repo owner), beginner→intermediate Rust, mobile & desktop browsers, ~2h of play for 150 questions
- **Key docs:** `docs/spec.md` (authoritative game spec) — content sources: Rust Cookbook (rust-lang-nursery.github.io/rust-cookbook), Goose code review 2026-09-18 (patterns), ownership/memory fundamentals
- **Delivery:** `dist/rust-quest.html` single file via Telegram; repo is source of truth

## 3. Working Rules

1. **Spec-first** — `docs/spec.md` changes precede code changes.
2. **Verification gate** — every code-bearing question must have been compiled/run with rustc (output/error claims are real); `tools/verify-questions.mjs` must pass before any release commit; never claim verification without running it.
3. **Zero secrets** — no credentials in code, logs, docs.
4. **No irreversible operations** (publish/deploy, force-push, destructive deletes) without explicit human confirmation.
5. **Git mutations are sequential** — never parallel git writes; inspect `git status --short` after failed chained git commands.

## 4. Definition of Done

- All acceptance criteria in `docs/spec.md` met for the current milestone
- `tools/verify-questions.mjs` green (all rustc checks + structural invariants)
- Game opens from `dist/rust-quest.html` offline; progress persists in localStorage
- CHANGELOG.md updated in the same change-set

## 5. Memory

- On user corrections, rework requests, or verification failures: append a lesson to `memory/lessons.md` (Signal / Root cause / Lesson / Scope).
- Periodically distill validated lessons into the pattern list below; prune stale entries.

## Learned Patterns & Pitfalls

<!-- One entry ≤3 lines, newest first. No duplicates. -->
