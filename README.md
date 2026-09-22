# 🦀 RustQuest

เกมทบทวนภาษา Rust ภาษาไทย — syntax ที่ใช้บ่อย · patterns จาก code review จริงของ [goose](https://github.com/block/goose) · และโครงสร้างข้อมูลในหน่วยความจำตอนโปรแกรมทำงาน

> ผู้เล่น: คนเรียน Rust ระดับเริ่มต้น–กลาง · เล่นในเบราว์เซอร์ (มือถือ/คอม) ออฟไลน์ได้ · ความคืบหน้าเก็บในเครื่อง

## เล่นเลย

เปิดไฟล์ **`dist/rust-quest.html`** (ไฟล์เดียวจบ ไม่พึ่งเน็ต) หรือเปิด `index.html` จาก repo

## โหมด

| โหมด | สถานะ | คำอธิบาย |
|---|---|---|
| 🗺️ Campaign | ✅ M2 — 150 ข้อ 8 ด่าน | ไล่ด่านตามหมวด ง่าย→ยาก เก็บดาว/XP/streak |
| 🧠 Memory Lab | ✅ M3 — 7 ฉาก | ดู stack/heap มีชีวิต ตอนโค้ดรันทีละบรรทัด |
| ⚔️ Boss Rush | ✅ M2 | จับเวลา 2:30 สุ่มรวมทุกหมวด |
| 🪿 ใบงาน Goose | ✅ M5 — 99 ใบงาน | Mini-project จาก goose code review จริง: ไปสำรวจ repo แล้วกลับมาตอบ · ไม่มี hint · ตอบถูกอ่านแนวคิด + tools |
| 🔁 ทบทวนข้อที่พลาด | ✅ M4 | รวบข้อที่ตอบผิดบ่อยมาซ้อม (hotlist) |
| 📊 สถิติ | ✅ M4 | XP · ดาว · ความแม่นยำแยกหมวด · Boss · Lab |

## พัฒนา (M1)

```bash
# ตรวจคลังคำถาม (structural + rustc จริงทุกข้อที่มีโค้ด) — release gate
node tools/verify-questions.mjs

# ตรวจใบงาน Goose 99 ข้อ (structural + fact-check เทียบ clone goose จริง)
GOOSE_REPO=/path/to/goose node tools/verify-gq.mjs

# สร้าง src/goosequest.js ใหม่หลังแก้ tools/bank/goosequest.json
node tools/assemble-gq.mjs

# build ไฟล์เดี่ยวสำหรับส่งมอบ
node tools/build.mjs   # → dist/rust-quest.html
```

- คลังคำถาม: `src/questions.js` (source of truth)
- สเปกเกม: `docs/spec.md`

## แหล่งเนื้อหา

- [Rust Cookbook](https://rust-lang-nursery.github.io/rust-cookbook/) — หมวด Algorithms / Data Structures / Text Processing / Concurrency / Asynchronous
- Goose code review (2026-09-18) — 13 patterns จากโค้ดจริง ~297K บรรทัด
- พื้นฐาน ownership / memory model

## หลักการสำคัญของ repo นี้

**คำถามทุกข้อที่มีโค้ด ต้องผ่านการคอมไพล์/รันจริงด้วย rustc** — output และ error ที่อ้างในเกมมาจากการรันจริงเสมอ (บังคับโดย `tools/verify-questions.mjs` ก่อน release ทุกครั้ง)
