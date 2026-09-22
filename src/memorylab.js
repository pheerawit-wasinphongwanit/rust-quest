// RustQuest Memory Lab (M3) — 7 interactive memory-model scenes.
// Left: code stepper. Right: live stack/heap SVG panel (declarative state renderer).
// Exposes window.RQ_LAB.open(). Depends on engine hooks: RQ_ENGINE.show/getSave/persist.
(function () {
  "use strict";

  // ---------- tiny helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var C = { k: "#f78166", g: "#7ee787", b: "#79c0ff", p: "#d2a8ff", c: "#56d4dd", d: "#6e7681", w: "#e6edf3", m: "#8b949e" };

  // ---------- declarative memory-state renderer ----------
  // state: { stackTitle, slots: [{t, sub, c, x(strike), d(dashed), dim}], heapTitle,
  //          blocks: [{label, c, free, cells: [{t, c, dash}], y}], arrows: [{s, b, ci, d, gray}], extra }
  function renderState(st) {
    var svg = '<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace,monospace">';
    svg += '<defs><marker id="la" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 Z" fill="' + C.k + '"/></marker>' +
           '<marker id="lag" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 Z" fill="' + C.d + '"/></marker></defs>';
    // stack panel
    svg += '<rect x="20" y="34" width="270" height="286" rx="12" fill="#12181f" stroke="' + C.b + '" stroke-opacity=".5"/>';
    svg += '<text x="35" y="60" fill="' + C.b + '" font-size="14">' + esc(st.stackTitle || "STACK") + "</text>";
    (st.slots || []).forEach(function (s, i) {
      var y = 74 + i * 56, col = s.c ? C[s.c] : "#30363d";
      svg += '<rect x="45" y="' + y + '" width="220" height="44" rx="8" fill="#0d1117" stroke="' + col + '"' +
        (s.d ? ' stroke-dasharray="5,4"' : "") + ' stroke-opacity="' + (s.dim ? ".3" : ".9") + '"/>';
      var tc = s.dim ? C.d : (s.c ? C[s.c] : C.w);
      svg += '<text x="60" y="' + (y + 28) + '" fill="' + tc + '" font-size="14"' + (s.x ? ' text-decoration="line-through"' : "") + ">" + esc(s.t) + "</text>";
      if (s.sub) svg += '<text x="60" y="' + (y + 40) + '" fill="' + C.m + '" font-size="10.5">' + esc(s.sub) + "</text>";
    });
    // heap panel
    if (st.blocks) {
      svg += '<rect x="340" y="34" width="285" height="286" rx="12" fill="#12181f" stroke="' + C.k + '" stroke-opacity=".45"/>';
      svg += '<text x="355" y="60" fill="' + C.k + '" font-size="14">' + esc(st.heapTitle || "HEAP") + "</text>";
      st.blocks.forEach(function (b) {
        var col = b.free ? C.d : (b.c ? C[b.c] : "#30363d");
        svg += '<rect x="355" y="' + b.y + '" width="255" height="' + (b.h || 74) + '" rx="10" fill="#0d1117" stroke="' + col + '"' +
          (b.free ? ' stroke-dasharray="5,4"' : "") + ' stroke-opacity=".85"/>';
        svg += '<text x="367" y="' + (b.y + 19) + '" fill="' + col + '" font-size="11.5">' + esc(b.label) + "</text>";
        (b.cells || []).forEach(function (cell, i) {
          var cx = 367 + i * 44, cc = cell.c ? C[cell.c] : "#30363d";
          svg += '<rect x="' + cx + '" y="' + (b.y + 26) + '" width="38" height="32" rx="5" fill="#0d1117" stroke="' + cc + '"' +
            (cell.dash || b.free ? ' stroke-dasharray="4,3"' : "") + "/>";
          svg += '<text x="' + (cx + 7) + '" y="' + (b.y + 47) + '" fill="' + (b.free ? C.d : (cell.c ? C[cell.c] : C.w)) + '" font-size="14">' + esc(cell.t) + "</text>";
        });
      });
    }
    // arrows: from slot i right edge to block b cell ci
    (st.arrows || []).forEach(function (a) {
      var sy = 74 + a.s * 56 + 22;
      var b = st.blocks[a.b];
      var tx = 367 + (a.ci || 0) * 44 + 8, ty = b.y + 26 + 6;
      svg += '<line x1="267" y1="' + sy + '" x2="' + tx + '" y2="' + ty + '" stroke="' + (a.gray ? C.d : C.k) +
        '" stroke-width="2"' + (a.d ? ' stroke-dasharray="6,4"' : "") + ' marker-end="url(#' + (a.gray ? "lag" : "la") + ')"/>';
    });
    if (st.extra) st.extra.forEach(function (t) {
      svg += '<text x="' + t.x + '" y="' + t.y + '" fill="' + (t.c ? C[t.c] : C.d) + '" font-size="' + (t.s || 11) + '">' + esc(t.t) + "</text>";
    });
    return svg + "</svg>";
  }

  // ---------- scenes ----------
  // Each scene: lines (code), steps [{at: line index, note, state}], quiz (question id)
  var SCENES = [
    {
      id: "s1", emoji: "📦", title: "Stack กับ Heap",
      desc: "ข้อมูลอยู่ที่ไหน และทำไมต้องแยกสองที่",
      lines: [
        "fn main() {",
        "    let n = 42;",
        "    let s = String::from(\"สวัสดี\");",
        "    println!(\"{} {}\", n, s.len());",
        "}"
      ],
      steps: [
        { at: 0, note: "เริ่มต้น: ทุกตัวแปรในฟังก์ชันอยู่บน STACK ของ main — กองจานที่ใส่/เอาออกเร็วมาก",
          state: { stackTitle: "STACK · เฟรมของ main", slots: [] } },
        { at: 1, note: "let n = 42 — ตัวเลข i32 ขนาดคงที่ (4 bytes) รู้ขนาดตอนคอมไพล์ → วางบน stack ได้เลย",
          state: { stackTitle: "STACK · เฟรมของ main", slots: [{ t: "n = 42", sub: "i32 · 4 bytes · คงที่", c: "b" }] } },
        { at: 2, note: "String ต่างออกไป: ตัวอักษรยืดหยุ่นได้ ไม่รู้ขนาดล่วงหน้า → หัว (ptr/len/cap) อยู่ stack แต่ตัวข้อมูลอยู่บน HEAP",
          state: { stackTitle: "STACK · เฟรมของ main",
            slots: [{ t: "n = 42", sub: "i32 · 4 bytes", c: "b" }, { t: "s ─ ptr ▸ len 18 cap 18", sub: "หัว 24 bytes", c: "k" }],
            heapTitle: "HEAP · จองตอนรัน", blocks: [{ label: "bytes ของ \"สวัสดี\" (6 อักษร × 3 bytes)", c: "k", y: 80, cells: [{ t: "ส" }, { t: "ว" }, { t: "ั" }, { t: "ส" }, { t: "ด" }, { t: "ี" }] }],
            arrows: [{ s: 1, b: 0, ci: 0 }] } },
        { at: 3, note: "ใช้งานได้ทั้งคู่ — n อ่านจาก stack ตรง ๆ ส่วน s.len() อ่านค่า len จากหัว (18 bytes) ไม่ต้องแตะ heap เลย",
          state: { stackTitle: "STACK · เฟรมของ main",
            slots: [{ t: "n = 42", c: "b" }, { t: "s ─ ptr ▸ len 18 cap 18", c: "k" }],
            heapTitle: "HEAP · จองตอนรัน", blocks: [{ label: "bytes ของ \"สวัสดี\"", c: "k", y: 80, cells: [{ t: "ส" }, { t: "ว" }, { t: "ั" }, { t: "ส" }, { t: "ด" }, { t: "ี" }] }],
            arrows: [{ s: 1, b: 0, ci: 0 }],
            extra: [{ t: "s.len() = 18 (นับ byte) · chars().count() = 6", x: 355, y: 240, c: "c" }] } }
      ],
      quiz: "q082"
    },
    {
      id: "s2", emoji: "📤", title: "Move — ย้ายเจ้าของ",
      desc: "ทำไม let t = s; แล้วใช้ s ต่อไม่ได้",
      lines: [
        "fn main() {",
        "    let s = String::from(\"hi\");",
        "    let t = s;",
        "    println!(\"{}\", t);",
        "    // println!(\"{}\", s); // ใช้ s ต่อ → error E0382!",
        "}"
      ],
      steps: [
        { at: 1, note: "s เป็นเจ้าของข้อความ: หัวบน stack ชี้ไป bytes บน heap",
          state: { stackTitle: "STACK", slots: [{ t: "s ─ ptr ▸ len 2", sub: "หัว 24 bytes", c: "k" }],
            heapTitle: "HEAP", blocks: [{ label: "\"hi\"", c: "k", y: 80, cells: [{ t: "h" }, { t: "i" }] }], arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 2, note: "let t = s — MOVE! ก๊อปหัว 24 bytes ให้ t แล้ว s หมดสิทธิ์ทันที — heap ไม่ได้ก๊อป (ก้อนเดิม) สังเกต: ไม่มีลูกศรจาก s แล้ว",
          state: { stackTitle: "STACK",
            slots: [{ t: "s — หมดสิทธิ์", sub: "ใช้ต่อ = E0382", c: "d", x: true, dim: true, d: true }, { t: "t ─ ptr ▸ len 2", sub: "เจ้าของใหม่", c: "g" }],
            heapTitle: "HEAP · ก้อนเดิม ไม่ได้ย้าย", blocks: [{ label: "\"hi\"", c: "k", y: 80, cells: [{ t: "h" }, { t: "i" }] }], arrows: [{ s: 1, b: 0, ci: 0 }] } },
        { at: 3, note: "ใช้ t ได้ปกติ — คนเดียวเป็นเจ้าของ = ตอน drop คืน heap ครั้งเดียว ไม่มี double-free",
          state: { stackTitle: "STACK",
            slots: [{ t: "s — หมดสิทธิ์", c: "d", x: true, dim: true, d: true }, { t: "t ─ ptr ▸ len 2", c: "g" }],
            heapTitle: "HEAP", blocks: [{ label: "\"hi\"", c: "k", y: 80, cells: [{ t: "h" }, { t: "i" }] }], arrows: [{ s: 1, b: 0, ci: 0 }] } },
        { at: 4, note: "ถ้ายืมบรรทัดนี้ออกมา: ใช้ s หลัง move → error[E0382] borrow of moved value — compiler จับได้ก่อนโปรแกรมรัน!",
          state: { stackTitle: "STACK",
            slots: [{ t: "s — หมดสิทธิ์", c: "d", x: true, dim: true, d: true }, { t: "t ─ ptr ▸ len 2", c: "g" }],
            heapTitle: "HEAP", blocks: [{ label: "\"hi\"", c: "k", y: 80, cells: [{ t: "h" }, { t: "i" }] }], arrows: [{ s: 1, b: 0, ci: 0 }],
            extra: [{ t: "compile error ดีกว่า runtime bug — ทั้งชีวิตไม่ต้อง debug use-after-move", x: 30, y: 330, c: "c" }] } }
      ],
      quiz: "q061"
    },
    {
      id: "s3", emoji: "👀", title: "ยืมอ่าน &",
      desc: "หลายคนดูพร้อมกันได้ แก้ไม่ได้",
      lines: [
        "fn main() {",
        "    let s = String::from(\"data\");",
        "    let r1 = &s;",
        "    let r2 = &s;",
        "    println!(\"{} {}\", r1.len(), r2.len());",
        "}"
      ],
      steps: [
        { at: 1, note: "s เป็นเจ้าของข้อมูลตามปกติ",
          state: { stackTitle: "STACK", slots: [{ t: "s ─ ptr ▸ len 4", c: "k" }],
            heapTitle: "HEAP", blocks: [{ label: "\"data\"", c: "k", y: 80, cells: [{ t: "d" }, { t: "a" }, { t: "t" }, { t: "a" }] }], arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 2, note: "let r1 = &s — สร้าง reference (ยืมอ่าน): r1 ไม่ใช่เจ้าของ แค่ชี้ตามหัวของ s — สังเกตลูกศรสีจาง",
          state: { stackTitle: "STACK", slots: [{ t: "s ─ ptr ▸ len 4", c: "k" }, { t: "r1 = &s", sub: "ยืมอ่านอย่างเดียว", c: "c" }],
            heapTitle: "HEAP", blocks: [{ label: "\"data\"", c: "k", y: 80, cells: [{ t: "d" }, { t: "a" }, { t: "t" }, { t: "a" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }, { s: 1, b: 0, ci: 1, d: true, gray: true }] } },
        { at: 3, note: "r2 = &s — ยืมอ่านได้อีกกี่คนก็ได้! หลายคน \"อ่านพร้อมกัน\" ปลอดภัยเพราะไม่มีใครแก้",
          state: { stackTitle: "STACK", slots: [{ t: "s ─ ptr ▸ len 4", c: "k" }, { t: "r1 = &s", c: "c" }, { t: "r2 = &s", c: "c" }],
            heapTitle: "HEAP · ก้อนเดียว แชร์กันอ่าน", blocks: [{ label: "\"data\"", c: "k", y: 80, cells: [{ t: "d" }, { t: "a" }, { t: "t" }, { t: "a" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }, { s: 1, b: 0, ci: 1, d: true, gray: true }, { s: 2, b: 0, ci: 2, d: true, gray: true }] } },
        { at: 4, note: "ผ่าน reference เรียก .len() ได้ (อ่าน) แต่เรียก push/push_str (แก้) ไม่ได้ — ลองแล้วจะเจอ E0596",
          state: { stackTitle: "STACK", slots: [{ t: "s ─ ptr ▸ len 4", c: "k" }, { t: "r1 = &s", c: "c" }, { t: "r2 = &s", c: "c" }],
            heapTitle: "HEAP · ก้อนเดียว แชร์กันอ่าน", blocks: [{ label: "\"data\"", c: "k", y: 80, cells: [{ t: "d" }, { t: "a" }, { t: "t" }, { t: "a" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }, { s: 1, b: 0, ci: 1, d: true, gray: true }, { s: 2, b: 0, ci: 2, d: true, gray: true }],
            extra: [{ t: "กฎยืม: อ่านได้หลายคนพร้อมกัน หรือ เขียนคนเดียว — เลือกได้ทีละแบบ", x: 30, y: 330, c: "c" }] } }
      ],
      quiz: "q064"
    },
    {
      id: "s4", emoji: "✍️", title: "ยืมแก้ &mut",
      desc: "ของชิ้นเดียว แก้ได้ทีละคน",
      lines: [
        "fn main() {",
        "    let mut s = String::from(\"go\");",
        "    let a = &mut s;",
        "    a.push_str(\"!\");",
        "    println!(\"{}\", a);",
        "}"
      ],
      steps: [
        { at: 1, note: "ประกาศ mut ไว้ตั้งแต่ต้น — สิทธิ์แก้ค่าที่ s ผูกอยู่",
          state: { stackTitle: "STACK", slots: [{ t: "s (mut) ─ ptr ▸ len 2", c: "k" }],
            heapTitle: "HEAP", blocks: [{ label: "\"go\" · cap 2", c: "k", y: 80, cells: [{ t: "g" }, { t: "o" }] }], arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 2, note: "a = &mut s — ยืมแบบแก้ได้: ตอนนี้ a ถือ \"กุญแจหลัก\" ใครจะยืม s ต่อไม่ได้จนกว่า a ใช้เสร็จ (E0499 ถ้าฝืน)",
          state: { stackTitle: "STACK", slots: [{ t: "s (mut) ─ ptr ▸ len 2", c: "k", dim: true }, { t: "a = &mut s", sub: "กุญแจหลัก · แก้ได้", c: "p" }],
            heapTitle: "HEAP", blocks: [{ label: "\"go\" · cap 2", c: "k", y: 80, cells: [{ t: "g" }, { t: "o" }] }], arrows: [{ s: 1, b: 0, ci: 0 }] } },
        { at: 3, note: "a.push_str(\"!\") — เติมผ่านกุญแจหลัก: heap ยังมีที่ (cap 2→เต็ม) จึงต้องจองใหม่ใหญ่ขึ้นแล้วย้าย (ดูฉาก Vec growth)",
          state: { stackTitle: "STACK", slots: [{ t: "s (mut) ─ len 3 cap 4", c: "k", dim: true }, { t: "a = &mut s", c: "p" }],
            heapTitle: "HEAP · โตแล้ว (ย้ายบ้าน)", blocks: [{ label: "บล็อกเดิม cap 2 — คืนแล้ว", free: true, y: 74, cells: [{ t: "g" }, { t: "o" }] }, { label: "บล็อกใหม่ cap 4", c: "p", y: 190, cells: [{ t: "g" }, { t: "o" }, { t: "!", c: "g" }] }],
            arrows: [{ s: 1, b: 1, ci: 0 }] } },
        { at: 4, note: "อ่านผ่าน a ได้เช่นกัน: ได้ \"go!\" — เมื่อ a ใช้ครั้งสุดท้าย (จบบรรทัดนี้) สิทธิ์ยืมคืนให้ s อัตโนมัติ (NLL)",
          state: { stackTitle: "STACK", slots: [{ t: "s (mut) ─ len 3 cap 4", c: "k" }, { t: "a — คืนสิทธิ์แล้ว", c: "d", dim: true, d: true }],
            heapTitle: "HEAP", blocks: [{ label: "บล็อกใหม่ cap 4 · \"go!\"", c: "k", y: 110, cells: [{ t: "g" }, { t: "o" }, { t: "!", c: "g" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }],
            extra: [{ t: "ถ้ามี b = &mut s ตอน a ยังใช้อยู่ → error[E0499] ทันที", x: 30, y: 330, c: "c" }] } }
      ],
      quiz: "q073"
    },
    {
      id: "s5", emoji: "🧬", title: "Clone — ก๊อปจริง",
      desc: "สองเจ้าของอิสระ สองก้อนบน heap",
      lines: [
        "fn main() {",
        "    let a = String::from(\"x\");",
        "    let b = a.clone();",
        "    println!(\"{} {}\", a, b);",
        "}"
      ],
      steps: [
        { at: 1, note: "a เป็นเจ้าของ \"x\" ตามปกติ",
          state: { stackTitle: "STACK", slots: [{ t: "a ─ ptr ▸ len 1", c: "k" }],
            heapTitle: "HEAP", blocks: [{ label: "\"x\"", c: "k", y: 80, cells: [{ t: "x" }] }], arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 2, note: "a.clone() — ก๊อปลึก (deep copy): สร้าง buffer ใหม่บน heap ก๊อป bytes ทั้งก้อน แล้วสร้างหัวใหม่ให้ b — สองก้อนแยกกันสนิท",
          state: { stackTitle: "STACK", slots: [{ t: "a ─ ptr ▸ len 1", c: "k" }, { t: "b ─ ptr ▸ len 1", sub: "หัวใหม่ · ก๊อปมา", c: "g" }],
            heapTitle: "HEAP · สองก้อนอิสระ", blocks: [{ label: "ของ a", c: "k", y: 80, cells: [{ t: "x" }] }, { label: "ของ b (สำเนา)", c: "g", y: 190, cells: [{ t: "x", c: "g" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }, { s: 1, b: 1, ci: 0 }] } },
        { at: 3, note: "ใช้ได้ทั้งคู่ — ต่างจาก move (ข้อ 2): a ยังมีชีวิต! ราคาคือ heap ก้อนที่สอง + เวลาก๊อป — ใช้เมื่อจำเป็นจริง ๆ",
          state: { stackTitle: "STACK", slots: [{ t: "a ─ ptr ▸ len 1", c: "k" }, { t: "b ─ ptr ▸ len 1", c: "g" }],
            heapTitle: "HEAP · สองก้อนอิสระ", blocks: [{ label: "ของ a", c: "k", y: 80, cells: [{ t: "x" }] }, { label: "ของ b (สำเนา)", c: "g", y: 190, cells: [{ t: "x", c: "g" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }, { s: 1, b: 1, ci: 0 }],
            extra: [{ t: "แก้ b.push('y') ก็แก้แค่ก้อนของ b — a ไม่กระเทือน (ต่างจากภาษาที่ object อ้างอิงร่วม)", x: 30, y: 330, c: "c" }] } }
      ],
      quiz: "q083"
    },
    {
      id: "s6", emoji: "🌱", title: "Vec โตอย่างไร",
      desc: "capacity เต็มแล้ว push — ย้ายบ้านทั้งก้อน",
      lines: [
        "fn main() {",
        "    let mut v = vec![1, 2];",
        "    v.push(3);",
        "    println!(\"len {} cap {}\", v.len(), v.capacity());",
        "}"
      ],
      steps: [
        { at: 1, note: "vec![1, 2] — len 2, cap 2: ที่จองเต็มเป๊ะพอดีกับข้อมูล",
          state: { stackTitle: "STACK", slots: [{ t: "v ─ ptr ▸ len 2 cap 2", c: "k" }],
            heapTitle: "HEAP · เต็มพอดี", blocks: [{ label: "บล็อกเดิม · cap 2 (เต็ม!)", c: "k", y: 90, cells: [{ t: "1" }, { t: "2" }] }], arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 2, note: "push(3) มาแล้ว แต่ที่เต็ม → จองบล็อกใหม่ใหญ่ขึ้น (โดยทั่วไป ×2 = cap 4) แล้วย้าย 1, 2 ไปก่อน",
          state: { stackTitle: "STACK", slots: [{ t: "v ─ ptr ▸ len 2 cap 2", c: "k" }],
            heapTitle: "HEAP · กำลังย้าย",
            blocks: [{ label: "บล็อกเดิม cap 2 — กำลังคืน", free: true, y: 74, cells: [{ t: "1" }, { t: "2" }] },
                     { label: "บล็อกใหม่ · cap 4", c: "p", y: 186, cells: [{ t: "1" }, { t: "2" }, { t: "3", c: "g" }] }],
            arrows: [{ s: 0, b: 1, ci: 0 }] } },
        { at: 3, note: "เสร็จแล้ว: หัวของ v ชี้บล็อกใหม่ len 3 cap 4 — push ต่ออีก 1 ตัวไม่ต้องย้าย (มีที่เหลือ) — โตแบบ amortized: เฉลี่ยแล้ว push คือ O(1)",
          state: { stackTitle: "STACK", slots: [{ t: "v ─ ptr ▸ len 3 cap 4", c: "g" }],
            heapTitle: "HEAP · อยู่บ้านใหม่", blocks: [{ label: "บล็อกใหม่ · cap 4 (เหลือที่อีก 1)", c: "g", y: 100, cells: [{ t: "1" }, { t: "2" }, { t: "3" }, { t: "·", c: "d", dash: true }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }],
            extra: [{ t: "ที่อยู่ข้อมูลเปลี่ยนหลังย้าย — เหตุผลที่ยึด &v[0] ไว้แล้ว push ต่อไม่ได้ (E0502)", x: 30, y: 330, c: "c" }] } }
      ],
      quiz: "q085"
    },
    {
      id: "s7", emoji: "📡", title: "Arc + Channel",
      desc: "แชร์ข้อมูลข้าม thread + ส่งข้อความ",
      lines: [
        "use std::sync::{Arc, mpsc};",
        "fn main() {",
        "    let data = Arc::new(String::from(\"hi\"));",
        "    let (tx, rx) = mpsc::channel();",
        "    let d2 = Arc::clone(&data);",
        "    std::thread::spawn(move || tx.send(d2));",
        "    println!(\"{} {}\", rx.recv(), Arc::strong_count(&data));",
        "}"
      ],
      steps: [
        { at: 2, note: "Arc::new — ข้อมูลอยู่บน heap พร้อมตัวนับผู้ถือ = 1 (หัวของ data บน stack แค่ชี้มา)",
          state: { stackTitle: "STACK · main", slots: [{ t: "data ─ ptr ▸", c: "k" }],
            heapTitle: "HEAP", blocks: [{ label: "Arc · count = 1", c: "k", y: 80, h: 92, cells: [{ t: "\"", c: "d" }, { t: "h" }, { t: "i" }, { t: "\"", c: "d" }] }], arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 3, note: "เปิด channel mpsc: ฝั่งส่ง (tx) กับฝั่งรับ (rx) — สายพานส่งของระหว่าง thread",
          state: { stackTitle: "STACK · main", slots: [{ t: "data ─ ptr ▸", c: "k" }, { t: "tx ─▸ คิว", c: "c" }, { t: "rx ◂─ คิว", c: "c" }],
            heapTitle: "HEAP", blocks: [{ label: "Arc · count = 1", c: "k", y: 74, h: 88, cells: [{ t: "\"", c: "d" }, { t: "h" }, { t: "i" }, { t: "\"", c: "d" }] },
                                     { label: "คิวข้อความ (ว่าง)", c: "c", y: 200, h: 60, cells: [] }],
            arrows: [{ s: 0, b: 0, ci: 0 }] } },
        { at: 4, note: "Arc::clone(&data) — ไม่ก๊อปข้อมูล! แค่เพิ่มตัวนับ 1→2 แล้วสร้างหัวใหม่ (d2) ชี้ก้อนเดิม",
          state: { stackTitle: "STACK · main", slots: [{ t: "data ─ ptr ▸", c: "k" }, { t: "tx ─▸ คิว", c: "c" }, { t: "rx ◂─ คิว", c: "c" }, { t: "d2 ─ ptr ▸ (clone)", c: "g" }],
            heapTitle: "HEAP · ก้อนเดิม แชร์กัน", blocks: [{ label: "Arc · count = 2 ▲", c: "g", y: 74, h: 88, cells: [{ t: "\"", c: "d" }, { t: "h" }, { t: "i" }, { t: "\"", c: "d" }] },
                                     { label: "คิวข้อความ (ว่าง)", c: "c", y: 200, h: 60, cells: [] }],
            arrows: [{ s: 0, b: 0, ci: 0 }, { s: 3, b: 0, ci: 2, d: true, gray: true }] } },
        { at: 5, note: "spawn thread ใหม่ (move): ยึด tx กับ d2 ไป — ข้างในส่ง d2 เข้าคิว จากนั้น thread จบ d2 ตาย ตัวนับกลับเป็น 1",
          state: { stackTitle: "STACK · main", slots: [{ t: "data ─ ptr ▸", c: "k" }, { t: "rx ◂─ คิว", c: "c" }],
            heapTitle: "HEAP", blocks: [{ label: "Arc · count = 1 (คืนแล้ว)", c: "k", y: 74, h: 88, cells: [{ t: "\"", c: "d" }, { t: "h" }, { t: "i" }, { t: "\"", c: "d" }] },
                                     { label: "คิว · มีข้อความ 1 ชิ้น (Arc)", c: "p", y: 200, h: 66, cells: [{ t: "📦", c: "p" }] }],
            arrows: [{ s: 0, b: 0, ci: 0 }],
            extra: [{ t: "STACK ของ thread ลูก (จบแล้ว): tx, d2 — ถูกทิ้งตอน thread จบ", x: 30, y: 300, c: "d" }] } },
        { at: 6, note: "main รับข้อความผ่าน rx.recv() ได้ Arc กลับมา (พิมพ์ hi) และ strong_count = 1 — แชร์ข้าม thread โดยไม่ก๊อปข้อมูลก้อนใหญ่: นี่คือพลังของ Arc",
          state: { stackTitle: "STACK · main", slots: [{ t: "data ─ ptr ▸", c: "k" }, { t: "rx ◂─ รับแล้ว ✓", c: "c" }],
            heapTitle: "HEAP", blocks: [{ label: "Arc · count = 1", c: "k", y: 80, h: 92, cells: [{ t: "\"", c: "d" }, { t: "h" }, { t: "i" }, { t: "\"", c: "d" }] },
                                     { label: "คิว (ว่างอีกครั้ง)", c: "c", y: 210, h: 60, cells: [] }],
            arrows: [{ s: 0, b: 0, ci: 0 }],
            extra: [{ t: "เมื่อ data ตาย ตัวนับเป็น 0 → heap ถูกคืนอัตโนมัติ — ไม่มี leak ไม่มี double-free", x: 30, y: 330, c: "c" }] } }
      ],
      quiz: "q088"
    }
  ];

  // ---------- UI ----------
  var cur = null; // {scene, step}

  function qmap() {
    var m = {};
    (window.RQ_QUESTIONS || []).forEach(function (q) { m[q.id] = q; });
    return m;
  }
  function labDone(id) {
    var S = window.RQ_ENGINE.getSave();
    if (!S.lab) S.lab = {};
    return !!S.lab[id];
  }
  function markDone(id) {
    var S = window.RQ_ENGINE.getSave();
    if (!S.lab) S.lab = {};
    S.lab[id] = true;
    window.RQ_ENGINE.persist();
  }
  function doneCount() { return SCENES.filter(function (s) { return labDone(s.id); }).length; }

  function open() {
    window.RQ_ENGINE.show("screen-lab");
    renderList();
  }

  function renderList() {
    var list = $("lab-list"); list.innerHTML = "";
    var head = document.createElement("div");
    head.className = "lab-head";
    head.innerHTML = "<h2>🧠 Memory Lab</h2><p>ดู stack/heap มีชีวิตตอนโค้ดรันทีละบรรทัด — " + doneCount() + "/" + SCENES.length + " ฉากผ่านแล้ว</p>";
    list.appendChild(head);
    SCENES.forEach(function (sc) {
      var row = document.createElement("div");
      var done = labDone(sc.id);
      row.className = "lab-row" + (done ? " done" : "");
      row.innerHTML = '<span class="lab-emoji">' + sc.emoji + "</span>" +
        '<div class="lab-info"><h3>' + sc.title + (done ? ' <span class="lab-check">✓ ผ่านแล้ว</span>' : "") + "</h3><p>" + sc.desc + "</p></div>" +
        '<span class="lab-go">' + (done ? "เล่นอีก" : "เริ่ม") + " →</span>";
      row.onclick = function () { startScene(sc); };
      list.appendChild(row);
    });
  }

  function startScene(sc) {
    cur = { scene: sc, step: 0, quizDone: false };
    var view = $("lab-scene");
    view.style.display = "block";
    $("lab-list").style.display = "none";
    $("lab-back").style.display = "none";
    $("lab-exit").style.display = "inline-block";
    renderStep();
  }

  function codeLineHtml(line, i) {
    var cls = "lab-line";
    if (cur.scene.steps.some(function (st) { return st.at === i && cur.scene.steps.indexOf(st) <= cur.step; })) cls += " hit";
    if (cur.scene.steps[cur.step] && cur.scene.steps[cur.step].at === i) cls += " active";
    return '<div class="' + cls + '"><span class="n">' + (i + 1) + "</span>" + esc(line) + "</div>";
  }

  function renderStep() {
    var sc = cur.scene, st = sc.steps[cur.step];
    var view = $("lab-scene");
    var last = cur.step === sc.steps.length - 1;
    var html = '<div class="lab-top"><h3>' + sc.emoji + " " + sc.title + '</h3><span class="lab-stepno">ขั้น ' + (cur.step + 1) + "/" + sc.steps.length + "</span></div>";
    html += '<div class="lab-grid"><div class="lab-code"><div class="lab-codebox">' +
      sc.lines.map(function (l, i) { return codeLineHtml(l, i); }).join("") + "</div></div>";
    html += '<div class="lab-panel"><div class="mem-box">' + renderState(st.state) + "</div>" +
      '<div class="lab-note">' + st.note + "</div></div></div>";
    html += '<div class="lab-nav">' +
      '<button class="btn" id="lab-prev" ' + (cur.step === 0 ? "disabled" : "") + ">← ก่อนหน้า</button>" +
      '<span class="lab-hint">อ่านโค้ดซ้าย → ดูหน่วยความจำขวา</span>' +
      '<button class="btn primary" id="lab-next">' + (last ? "ทำแบบทดสอบ →" : "ถัดไป →") + "</button></div>";
    if (last) html += '<div class="lab-quiz" id="lab-quiz"></div>';
    view.innerHTML = html;
    $("lab-prev").onclick = function () { if (cur.step > 0) { cur.step--; renderStep(); } };
    $("lab-next").onclick = function () {
      if (cur.step < sc.steps.length - 1) { cur.step++; renderStep(); }
      else if (!cur.quizDone) renderQuiz();
    };
    if (last && !cur.quizDone) renderQuiz();
  }

  function renderQuiz() {
    var host = $("lab-quiz");
    if (!host) return;
    var q = qmap()[cur.scene.quiz];
    if (!q) { finishScene(); return; }
    var st = window.RQ_ENGINE.getSave();
    var stat = (st.qstats && st.qstats[q.id]) || { seen: 0, wrong: 0 };
    host.innerHTML = '<div class="lab-quiz-title">🎯 แบบทดสอบท้ายฉาก — ตอบถูกเพื่อเก็บฉากนี้</div>' +
      '<div class="q-prompt" style="margin-top:8px">' + q.prompt + "</div>" +
      '<div class="choices" id="lab-quiz-choices"></div><div class="fb" id="lab-quiz-fb"></div>';
    var wrap = $("lab-quiz-choices");
    wrap.innerHTML = ""; // reset (in case quiz re-renders)
    $("lab-quiz-fb").innerHTML = "";
    $("lab-quiz-fb").className = "fb";
    q.payload.choices.forEach(function (c, i) {
      var b = document.createElement("button");
      b.className = "choice";
      b.innerHTML = '<span class="k">' + (i + 1) + "</span><span>" + esc(c) + "</span>";
      b.onclick = function () { quizAnswer(q, i, b, wrap, stat); };
      wrap.appendChild(b);
    });
  }

  function quizAnswer(q, chosen, btn, wrap, stat) {
    var correct = chosen === q.payload.answer;
    var _cs = wrap.children, _c2 = [];
    for (var _i = 0; _i < _cs.length; _i++) if (_cs[_i].className.indexOf("choice") >= 0) _c2.push(_cs[_i]);
    _c2.forEach(function (b, i) {
      b.disabled = true;
      if (i === q.payload.answer) b.classList.add("correct");
      else if (i === chosen) b.classList.add("wrong");
    });
    var fb = $("lab-quiz-fb");
    fb.className = "fb show " + (correct ? "good" : "bad");
    fb.innerHTML = '<div class="verdict">' + (correct ? "✅ ถูกต้อง — ผ่านฉากนี้แล้ว!" : "❌ ยังไม่ใช่ ลองเลือกใหม่") + "</div>" +
      '<div class="explain">' + q.explain + '</div><div class="src">📚 ' + q.source + "</div>";
    if (!correct) {
      var again = document.createElement("button");
      again.className = "btn primary"; again.style.marginTop = "12px";
      again.textContent = "ตอบใหม่";
      again.onclick = function () { renderQuiz(); };
      fb.appendChild(again);
    } else {
      markDone(cur.scene.id);
      cur.quizDone = true;
      var doneBtn = document.createElement("button");
      doneBtn.className = "btn primary"; doneBtn.style.marginTop = "12px";
      doneBtn.textContent = "กลับหน้าฉาก ✓";
      doneBtn.onclick = function () { exitScene(); };
      fb.appendChild(doneBtn);
    }
  }

  function exitScene() {
    cur = null;
    $("lab-scene").style.display = "none";
    $("lab-list").style.display = "block";
    $("lab-back").style.display = "inline-block";
    $("lab-exit").style.display = "none";
    renderList();
  }

  window.RQ_LAB = {
    open: open,
    scenes: SCENES,
    renderState: renderState,
    _startScene: startScene, _exitScene: exitScene, _getCur: function () { return cur; }
  };
})();
