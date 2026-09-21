# 🦀 RustQuest

เกมทบทวนภาษา Rust ภาษาไทย — syntax ที่ใช้บ่อย · patterns จาก code review จริงของ [goose](https://github.com/block/goose) · และโครงสร้างข้อมูลในหน่วยความจำตอนโปรแกรมทำงาน

> ผู้เล่น: คนเรียน Rust ระดับเริ่มต้น–กลาง · เล่นในเบราว์เซอร์ (มือถือ/คอม) ออฟไลน์ได้ · ความคืบหน้าเก็บในเครื่อง

## เล่นเลย

เปิดไฟล์ **`dist/rust-quest.html`** (ไฟล์เดียวจบ ไม่พึ่งเน็ต) หรือเปิด `index.html` จาก repo

## โหมด

| โหมด | สถานะ | คำอธิบาย |
|---|---|---|
| 🗺️ Campaign | ✅ M1 เปิดด่าน 1 | ไล่ด่านตามหมวด ง่าย→ยาก เก็บดาว/XP/streak |
| 🧠 Memory Lab | 🔜 M3 | ดู stack/heap มีชีวิต ตอนโค้ดรันทีละบรรทัด |
| ⚔️ Boss Rush | 🔜 M2 | จับเวลา สุ่มรวมทุกหมวด |

## พัฒนา (M1)

```bash
# ตรวจคลังคำถาม (structural + rustc จริงทุกข้อที่มีโค้ด) — release gate
node tools/verify-questions.mjs

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
