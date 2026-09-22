# Changelog

## 0.1.0 — M1 (2026-09-21)

- Repo scaffold (AGENTS.md, spec, tools) + push to GitHub
- Game engine: screens (home/levels/quiz/result), 6 question types (mcq, output, bug, fill, order, memory), XP/streak/stars, localStorage save
- Campaign: ด่าน 1 เปิดเล่น (10 ข้อ ง่าย→ยาก), ด่าน 2–5 แสดง preview ล็อกไว้
- คำถาม 10 ข้อครอบคลุมทุกประเภท · 6 ข้อมีโค้ด rustc-verified (output/fail จริง)
- tools: `verify-questions.mjs` (122 checks green), `build.mjs` → `dist/rust-quest.html` (39.7 KB)

## 0.2.0 — M2 (2026-09-22)

- Question bank 10 → **150** (rustc-verified: 1,826 checks green) — syntax ~40% / goose ~32% / memory ~28%
- Bank pipeline: `tools/bank/b*.json` (8 batches) + `tools/bank/levels.json` → `tools/assemble.mjs` → `src/questions.js`
- Campaign 8 ด่าน (10/25/25/20/18/20/18/14) — ง่าย→ยากภายในด่าน, ปลดล็อกไล่โซ่
- **Boss Rush**: จับเวลา 2:30 · 20 ข้อสุ่มจากทั้ง bank · ตอบผิด −5 วิ · บันทึกสถิติดีสุด
- Memory diagrams ใหม่ 3 ใบ (move / String head / Vec growth) สำหรับคำถามประเภท memory
- `tools/smoke-test.mjs` — headless DOM-stub test รันทั้ง campaign + boss ครบวงจร (PASS)
- GitHub Pages live: https://pheerawit-wasinphongwanit.github.io/rust-quest/

## 0.3.0 — M3 (2026-09-22)

- **Memory Lab** — 7 interactive scenes: stack/heap, move, borrow &, &mut, clone, Vec growth, Arc+channel
- Code stepper ซ้าย (ไลน์ active ไฮไลต์) + live stack/heap SVG panel ขวา (declarative state renderer ใน src/memorylab.js)
- Mini-quiz ท้ายฉาก (ดึงจาก bank เดิม) — ตอบถูกเก็บฉาก บันทึกใน SAVE.lab, หน้าแรกแสดงความคืบหน้า x/7
- build.mjs: inline ทุก <script src="src/..."> (questions + memorylab) → dist 193.9 KB
- smoke-test ขยายครอบ lab 7 ฉาก (PASS), render QC ผ่าน (SVG panel + arrows)
