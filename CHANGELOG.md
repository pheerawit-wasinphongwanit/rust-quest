# Changelog

## 0.1.0 — M1 (2026-09-21)

- Repo scaffold (AGENTS.md, spec, tools) + push to GitHub
- Game engine: screens (home/levels/quiz/result), 6 question types (mcq, output, bug, fill, order, memory), XP/streak/stars, localStorage save
- Campaign: ด่าน 1 เปิดเล่น (10 ข้อ ง่าย→ยาก), ด่าน 2–5 แสดง preview ล็อกไว้
- คำถาม 10 ข้อครอบคลุมทุกประเภท · 6 ข้อมีโค้ด rustc-verified (output/fail จริง)
- tools: `verify-questions.mjs` (122 checks green), `build.mjs` → `dist/rust-quest.html` (39.7 KB)
