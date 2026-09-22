# Changelog

## Unreleased

- CI: feedback-intake workflow — new GitHub issues get `feedback` label + ack comment, owner notified via Telegram

## 0.5.0 — M5 (2026-09-22)

- **🪿 ใบงาน Goose (Goose Quest)** — โหมดใหม่จากเมนูหลัก: mini-project 99 ใบงาน จาก goose code review จริง (repo ปัก commit `1e83e89f5`)
  - 9 ชั้น × 11 ใบงาน เรียงง่าย→ยาก: รู้จักโปรเจกต์ → workspace → CI/Docker/supply chain → design patterns → resource/output → security → subprocess/shell → findings/verdict → capstone
  - ไปทำงานจริง (สำรวจ repo goose บน GitHub ที่ commit ตรึก) แล้วกลับมาพิมพ์คำตอบในเกม — ตรวจคำตอบแบบ normalize (case/วรรค/ลูกน้ำ) รับหลายรูปแบบ
  - ไม่มี hint: ตอบผิดนับครั้ง ไม่มีการเฉลย · ตอบถูกครั้งแรกได้อ่าน "เฉลย + แนวคิด + 🛠 tools" ที่เกี่ยวข้อง พร้อม file:line จริง
  - XP สะสม ชั้นละ 10×ชั้น (รวม 4,950 XP) เข้ากอง XP เดิม · ปลดล็อกเรียงลำดับ (ผ่าน n → เปิด n+1) · เก็บใน localStorage (`SAVE.gq`) แสดง x/99 ที่การ์ดเมนู + จอสถิติ
- เครื่องมือใหม่: `tools/bank/goosequest.json` → `tools/assemble-gq.mjs` → `src/goosequest.js`; `tools/verify-gq.mjs` (640 checks: structural + fact-check ทุกข้อเทียบ clone goose จริงผ่าน `GOOSE_REPO=...`)
- กันเฉลยรั่ว: verify-gq ตรวจว่าเนื้อใบงานไม่มีคำตอบฝังอยู่ (จับได้ 6 ข้อตอน author แล้วแก้หมด)
- smoke-test ครอบ goose quest: ผิดไม่ปลดล็อก/ไม่เฉลย, ถูกได้ XP+ปลดล็อก+เฉลย, persistence ผ่าน reload
- dist 295.1 KB (เพิ่มจาก 193.9 KB — คือเนื้อหาใบงาน 99 ข้อ 46.4 KB + โค้ดโหมด) — เกิน budget เดิม 250KB แต่ยัง single-file offline ได้ตามสเปก

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

## 0.4.0 — M4 (2026-09-22)

- **Mascot AI-art 3 ท่า** (สไตล์ A flat cartoon — default ตามมติ รอเลือกสไตล์จริง): hello/cheer/encourage — ครอป+ย่อ 256px JPEG (38KB รวม) inline เป็น data URI · tools/make-mascots.py สร้างใหม่ได้
- **Smart review queue**: การ์ด "ทบทวนข้อที่พลาด" — hotlist 12 ข้อที่ผิดบ่อยสุด (จัดอันดับด้วย wrong/seen)
- **จอสถิติ**: XP/ดาว/streak/Boss/Lab + ความแม่นยำรวม-แยกหมวด + ความคืบหน้าด่าน
- แก้ ES5-compat: NodeList.forEach → qsa() helper, String.repeat → rep() (WebKit เก่ารันได้ครบ)
- QC: smoke-test ครอบ review+stats (PASS) · render QC 5 จอ แยกลายเฉพาะ ผ่านครบ (พบและแก้ false-positive ของ detector รุ่นก่อน)
