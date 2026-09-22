// RustQuest question bank — ASSEMBLED from tools/bank/*.json by tools/assemble.mjs.
// Do not edit by hand; edit the JSON batches and re-run assemble.
// Invariants (enforced by tools/verify-questions.mjs):
//  - every output/bug question's code claims were rustc-verified
//  - fields: id, type, cat, diff, prompt, payload, explain, source
window.RQ_QUESTIONS = [
  {
    "id": "q001",
    "type": "mcq",
    "cat": "memory",
    "diff": 1,
    "prompt": "โค้ด `let x = 42;` — ค่า 42 ถูกเก็บไว้ที่ไหน?",
    "payload": {
      "choices": [
        "บน Stack (กองซ้าย) — ขนาดคงที่ รู้ตอนคอมไพล์",
        "บน Heap (กองขวา) — จองเองตอนรัน",
        "ใน CPU register เท่านั้น",
        "ฝังอยู่ในชื่อตัวแปร x"
      ],
      "answer": 0
    },
    "explain": "ตัวเลข integer ขนาดคงที่ (i32) ตอนคอมไพล์รู้ขนาดแน่นอนอยู่แล้ว → เก็บบน stack ของฟังก์ชันที่ประกาศ ใช้เสร็จคืนอัตโนมัติ (pop) เร็วมาก ส่วน Heap สงวนไว้สำหรับของที่ 'ขนาดไม่แน่นอน/ยืดหยุ่น' อย่าง String, Vec",
    "source": "พื้นฐาน ownership — Memory Lab ฉาก 1 (ยังไม่เปิด)"
  },
  {
    "id": "q002",
    "type": "output",
    "cat": "syntax",
    "diff": 1,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (คิดดี ๆ — เกี่ยวกับภาษาไทยด้วย)",
    "payload": {
      "code": "fn main() {\n    println!(\"{}\", \"ทารก\".len());\n}",
      "choices": [
        "4",
        "12",
        "3",
        "8"
      ],
      "answer": 1,
      "verify": {
        "kind": "output",
        "expected": "12"
      }
    },
    "explain": "คำตอบคือ 12 — `len()` นับเป็น **byte** ไม่ใช่ตัวอักษร! ภาษาไทยแต่ละตัวอักษรใช้ 3 bytes ใน UTF-8 (ท+า+ร+ก = 4 ตัวอักษร × 3 = 12) ถ้าอยากได้ 4 ต้องใช้ `\"ทารก\".chars().count()` — บั๊กสากลที่คนไทยเจอบ่อยที่สุดใน Rust/Go/Python",
    "source": "Cookbook · Text Processing (string เป็น UTF-8 เสมอ)"
  },
  {
    "id": "q003",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "enum แบบไหนคือแบบที่ Goose ใช้ทำ 'กล่องข่าวติดป้าย' (พกข้อมูลในตัว)?",
    "payload": {
      "choices": [
        "enum Mood { Happy, Tired }",
        "enum Pet { Cat(String), Fish { count: u32 } }",
        "enum Color { Red = 1, Green = 2 }",
        "let x: enum = 5;"
      ],
      "answer": 1
    },
    "explain": "แบบที่ 2 คือ enum ที่แต่ละตัวเลือก 'พกข้อมูลของตัวเอง' — Cat พก String, Fish พก count — นี่แหละหัวใจของ `MessageContentBlock` ใน goose: ข้อความ/รูป/คำขอเครื่องมือ อยู่ใน enum เดียว แล้ว match บังคับให้ดูครบทุกป้าย (ลืมดู = คอมไพล์ไม่ผ่าน E0004)",
    "source": "Goose pattern #2 Tagged Enum · บทเรียนบทที่ 2"
  },
  {
    "id": "q004",
    "type": "bug",
    "cat": "memory",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — คอมไพเลอร์จะบอกอะไร?",
    "payload": {
      "code": "fn main() {\n    let s = String::from(\"สวัสดี\");\n    let t = s;\n    println!(\"{s}\");\n}",
      "choices": [
        "error[E0382]: borrow of moved value: `s`",
        "error[E0106]: missing lifetime specifier",
        "คอมไพล์ผ่านปกติ พิมพ์ สวัสดี",
        "error[E0507]: cannot move out of `s`"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0382"
      }
    },
    "explain": "E0382 borrow of moved value: `s` — บรรทัด `let t = s;` ไม่ได้ 'ก็อป' แต่ย้ายความเป็นเจ้าของ (move) ให้ t แล้ว s หมดอายุทันที จะใช้ต่อไม่ได้ (ป้องกันของชิ้นเดียวมีสองเจ้า) · ทางแก้: ใช้ `t` แทน, ยืม `let t = &s;` หรือก็อปจริง `s.clone()`",
    "source": "พื้นฐาน ownership — Memory Lab ฉาก 2 (ยังไม่เปิด)"
  },
  {
    "id": "q005",
    "type": "fill",
    "cat": "syntax",
    "diff": 1,
    "prompt": "เติมคำสั่งที่ขาด เพื่อเพิ่มเลข 3 เข้าท้าย vector",
    "payload": {
      "code": "let mut v = vec![1, 2];\nv.___((3));",
      "choices": [
        "push",
        "add",
        "append",
        "insert_end"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`v.push(3)` — push เติม 'ท้าย' vector เสมอ เป็น O(1) เฉลี่ย (พอ capacity ไม่พอมันจะโตเอง — Memory Lab ฉาก 6 ให้ดู live) · `append` ใช้กับ vector อีกตัว, `add` ไม่มีใน Vec",
    "source": "Cookbook · Data Structures — Vec"
  },
  {
    "id": "q006",
    "type": "order",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เรียงบรรทัดให้โปรแกรมพิมพ์ 'สวัสดี Rust' (แตะตามลำดับบน→ล่าง)",
    "payload": {
      "lines": [
        "println!(\"{msg}\");",
        "fn main() {",
        "}",
        "let msg = format!(\"{} {}\", \"สวัสดี\", \"Rust\");"
      ],
      "answer": [
        1,
        3,
        0,
        2
      ],
      "verify": {
        "kind": "orderOutput",
        "expected": "สวัสดี Rust"
      }
    },
    "explain": "ลำดับที่ถูก: `fn main() {` → `let msg = format!(...)` → `println!(\"{msg}\");` → `}` — Rust ต้องประกาศตัวแปรก่อนใช้เสมอ และ format! สร้าง String จาก template ได้เหมือน println",
    "source": "พื้นฐาน syntax — โครงโปรแกรม Rust"
  },
  {
    "id": "q007",
    "type": "memory",
    "cat": "memory",
    "diff": 1,
    "prompt": "ดูแผนภาพหน่วยความจำของโค้ด `let n = 42; let s = String::from(\"สวัสดี\");` — ในกล่อง HEAP มีอะไรอยู่?",
    "payload": {
      "svg": "mem1",
      "choices": [
        "bytes ของข้อความ 'สวัสดี' (18 bytes)",
        "ตัวแปร s ทั้งก้อน",
        "ตัวแปร n ทั้งก้อน",
        "ฟังก์ชัน main"
      ],
      "answer": 0
    },
    "explain": "String = 'หัว' กับ 'ตัว' แยกกัน: หัว (ptr, len, capacity) เก็บบน stack ของ main ส่วน 'ตัว' (bytes จริงของ สวัสดี = 6 code points × 3 bytes = 18) อยู่บน heap แล้วหัวชี้มาหา — เหตุผล: ขนาดข้อมูลยืดหยุ่นได้ จองตอนรัน (ตรวจจริง: \"สวัสดี\".len() = 18, chars().count() = 6)",
    "source": "พื้นฐาน ownership — Memory Lab ฉาก 1 (ยังไม่เปิด)"
  },
  {
    "id": "q008",
    "type": "mcq",
    "cat": "goose",
    "diff": 1,
    "prompt": "ในโลกของ Goose, trait เปรียบเสมือนอะไร?",
    "payload": {
      "choices": [
        "แบบฟอร์มที่มีช่องให้กรอก",
        "สัญญา/ปลั๊กมาตรฐาน — ใครจะเสียบเข้าระบบต้องมีช่องตามที่กำหนด",
        "แม่พิมพ์ที่ปั๊มโค้ดซ้ำให้",
        "สายพานส่งข่าวระหว่างส่วนของโปรแกรม"
      ],
      "answer": 1
    },
    "explain": "trait = สัญญา (interface) เช่น `Provider` ของ goose กำหนดว่าต้องมี name() + stream() — OpenAI/Anthropic/Google เสียบหัวปลั๊กตามสัญญาเดียวกัน โค้ดส่วนอื่นเลยเรียกผ่าน `Box<dyn Provider>` ได้โดยไม่สนยี่ห้อ · ส่วน 'แม่พิมพ์' คือ macro (#12) และ 'สายพานข่าว' คือ channel (#9)",
    "source": "Goose pattern #5 Trait + Arc<dyn> · บทเรียนบทที่ 5"
  },
  {
    "id": "q009",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v = vec![3, 1, 2];\n    v.sort();\n    println!(\"{:?}\", v);\n}",
      "choices": [
        "[3, 1, 2]",
        "[1, 2, 3]",
        "[2, 1, 3]",
        "คอมไพล์ไม่ผ่าน เพราะ sort ต้องมี template"
      ],
      "answer": 1,
      "verify": {
        "kind": "output",
        "expected": "[1, 2, 3]"
      }
    },
    "explain": "`sort()` เรียง in-place จากน้อยไปมาก (ต้อง `mut`) ได้ `[1, 2, 3]` · `{:?}` คือ Debug print ที่เหมาะกับ vector — Cookbook หมวด Algorithms ยังมี sort แบบ key (sort_by_key), แบบ float (sort_by partial_cmp) และ shuffle แบบสุ่มด้วย",
    "source": "Cookbook · Algorithms — Sort a Vector of Integers"
  },
  {
    "id": "q010",
    "type": "bug",
    "cat": "goose",
    "diff": 2,
    "prompt": "Fluent setter ตัวนี้พัง — อาการคืออะไร?",
    "payload": {
      "code": "struct AgentConfig { model: String }\nimpl AgentConfig {\n    fn new(model: &str) -> Self { AgentConfig { model: model.into() } }\n    fn with_temperature(mut self, t: f32) {\n        let _ = t;\n        // ลืมอะไรบางอย่าง!\n    }\n}\nfn main() {\n    let a = AgentConfig::new(\"gpt\").with_temperature(0.5);\n    println!(\"{}\", a.model);\n}",
      "choices": [
        "error[E0609]: no field `model` on type `()`",
        "error[E0382]: borrow of moved value",
        "รันได้ปกติ ได้ gpt",
        "error[E0046]: not all trait items implemented"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0609"
      }
    },
    "explain": "E0609 no field `model` on type `()` — `with_temperature` ลืมคืน `self` จึงคืนค่าว่าง () โซ่ต่อทอยขาด: a กลายเป็น () ไม่ใช่ AgentConfig · สูตร with_* ครบ 3 จุด: `mut self` → แก้ค่า → `self` บรรทัดสุดท้าย (บทเรียนบทที่ 3)",
    "source": "Goose pattern #3 Fluent Setter · บทเรียนบทที่ 3"
  },
  {
    "id": "q011",
    "type": "mcq",
    "cat": "syntax",
    "diff": 1,
    "prompt": "สร้าง vector เปล่าที่เพิ่มข้อมูลทีหลังได้ ใช้แบบไหน?",
    "payload": {
      "choices": [
        "let mut v: Vec<i32> = Vec::new();",
        "let v = [i32; 0];",
        "let v = vec![i32];",
        "let v = Vec<i32>::new"
      ],
      "answer": 0
    },
    "explain": "`Vec::new()` สร้าง vector เปล่า (capacity 0) รอ push ภายหลัง ต้องมี `mut` ถึงจะเพิ่มข้อมูลได้ · ส่วน array `[T; N]` ความยาวคงที่ตายตัว และ `vec![1, 2]` คือมาโครสร้างพร้อมข้อมูลเริ่มต้น",
    "source": "Cookbook · Data Structures — Vec"
  },
  {
    "id": "q012",
    "type": "output",
    "cat": "syntax",
    "diff": 1,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v: Vec<i32> = Vec::new();\n    v.push(10);\n    v.push(20);\n    println!(\"{}\", v.len());\n}",
      "choices": [
        "2",
        "20",
        "0",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "2"
      }
    },
    "explain": "`len()` บอกจำนวนข้อมูลจริงในตอนนี้ (สองตัว) — ต่างจาก `capacity()` ที่บอกที่จองไว้ ซึ่งอาจมากกว่า len เพราะ Vec จองเผื่อล่วงหน้า",
    "source": "Cookbook · Data Structures — Vec"
  },
  {
    "id": "q013",
    "type": "output",
    "cat": "syntax",
    "diff": 1,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v = vec![1, 2, 3];\n    let last = v.pop();\n    println!(\"{:?} {:?}\", last, v);\n}",
      "choices": [
        "Some(3) [1, 2]",
        "3 [1, 2]",
        "Some(3) [1, 2, 3]",
        "None [1, 2]"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "Some(3) [1, 2]"
      }
    },
    "explain": "`pop()` ดึงตัวท้ายออกแล้วคืน `Option<T>` — มีของคืน `Some(3)` ถ้า vector ว่างคืน `None` (ไม่ panic แบบ index เกิน) — นี่คือเหตุผลที่ API แบบ \"อาจไม่มีค่า\" ใน Rust ใช้ Option เสมอ",
    "source": "Cookbook · Data Structures — Vec"
  },
  {
    "id": "q014",
    "type": "fill",
    "cat": "syntax",
    "diff": 1,
    "prompt": "เติมเมธอดที่ขาด เพื่อใส่ค่า key-value เข้า HashMap",
    "payload": {
      "code": "use std::collections::HashMap;\nlet mut v: HashMap<&str, i32> = HashMap::new();\nv.___(\"a\", 1);",
      "choices": [
        "insert",
        "push",
        "set",
        "add"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`insert(key, value)` คือคำสั่งใส่ค่าของ HashMap — ถ้า key ซ้ำจะทับของเดิมแล้วคืนค่าเก่า (Option) ส่วน push เป็นของ Vec, set/add ไม่มีใน HashMap",
    "source": "Cookbook · Data Structures — HashMap"
  },
  {
    "id": "q015",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "use std::collections::HashMap;\nfn main() {\n    let mut m = HashMap::new();\n    m.insert(\"a\", 1);\n    println!(\"{:?} {:?}\", m.get(\"a\"), m.get(\"b\"));\n}",
      "choices": [
        "Some(1) None",
        "1 0",
        "Some(1) Some(0)",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "Some(1) None"
      }
    },
    "explain": "`get()` คืน `Option<&V>` — เจอคืน `Some(1)`, ไม่เจอคืน `None` (ไม่ใช่ 0 หรือ error!) เพราะ compiler บังคับให้จัดการทั้งสองกรณี — ปรัชญา \"ไม่มีค่า null หลุดรอด\" ของ Rust",
    "source": "Cookbook · Data Structures — HashMap"
  },
  {
    "id": "q016",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "`*m.entry(word).or_insert(0) += 1;` ทำอะไร?",
    "payload": {
      "choices": [
        "ถ้า key ยังไม่มีให้เริ่มที่ 0 แล้วบวก 1 — นับความถี่แบบบรรทัดเดียว",
        "เพิ่ม key ใหม่เสมอ แม้มีอยู่แล้ว",
        "ลบ key ที่มีค่า 0 แล้วบวก 1",
        "คืน error ถ้า key ไม่มี"
      ],
      "answer": 0
    },
    "explain": "Entry API คือ idiom นับความถี่มาตรฐาน: `entry` เข้าถึงช่องของ key (มีหรือยังไม่มี), `or_insert(0)` ถ้าไม่มีให้ใส่ 0 ก่อน แล้วคืน `&mut V` ให้แก้ค่าได้ทันที — Cookbook หมวด Algorithms ใช้ pattern นี้หาคำที่พบบ่อยสุด",
    "source": "Cookbook · Algorithms — Map & Collect"
  },
  {
    "id": "q017",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "use std::collections::HashMap;\nfn main() {\n    let mut m: HashMap<&str, i32> = HashMap::new();\n    for w in [\"a\", \"b\", \"a\"] {\n        *m.entry(w).or_insert(0) += 1;\n    }\n    println!(\"{:?}\", m.get(\"a\").copied());\n}",
      "choices": [
        "Some(2)",
        "Some(3)",
        "Some(1)",
        "None"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "Some(2)"
      }
    },
    "explain": "\"a\" ปรากฏ 2 ครั้งใน array → นับได้ 2 · `get().copied()` แปลง `Option<&i32>` เป็น `Option<i32>` จึงได้ `Some(2)` — นี่คือโค้ดนับความถี่คำ (word frequency) ฉบับเต็มตาม Cookbook",
    "source": "Cookbook · Algorithms — Map & Collect"
  },
  {
    "id": "q018",
    "type": "bug",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — compiler จะบอกอะไร?",
    "payload": {
      "code": "use std::collections::HashMap;\nfn main() {\n    let mut m: HashMap<&str, i32> = HashMap::new();\n    m.insert(\"a\", 1);\n    for (k, v) in &m {\n        m.insert(k, v + 1);\n    }\n}",
      "choices": [
        "error[E0502]: cannot borrow `m` as mutable because it is also borrowed as immutable",
        "error[E0382]: borrow of moved value: `m`",
        "error[E0499]: cannot borrow `m` as mutable more than once",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0502"
      }
    },
    "explain": "E0502 — วน `for` ยืม `&m` (อ่าน) อยู่ แต่ในลูปกลับ `insert` (ยืมแบบ mutable) พร้อมกัน: Rust กันการอ่าน-เขียนพร้อมกันเพราะ insert อาจจัดสรรหน่วยความจำใหม่ทำให้ iterator เพี้ยน · ทางแก้: เก็บผลลัพธ์ไว้ใน HashMap ใหม่ หรือ collect ก่อนแล้วค่อยแก้",
    "source": "Cookbook · Data Structures — HashMap iteration"
  },
  {
    "id": "q019",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v = vec![5, 1, 4];\n    v.sort();\n    v.reverse();\n    println!(\"{:?}\", v);\n}",
      "choices": [
        "[5, 4, 1]",
        "[1, 4, 5]",
        "[5, 1, 4]",
        "[4, 5, 1]"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[5, 4, 1]"
      }
    },
    "explain": "`sort()` เรียงน้อย→มาก ได้ [1, 4, 5] แล้ว `reverse()` กลับด้านเป็นมาก→น้อย [5, 4, 1] — Cookbook มี `sort_unstable` (เร็วกว่าเล็กน้อย ไม่รักษาลำดับของตัวเท่ากัน) ให้เลือกใช้ด้วย",
    "source": "Cookbook · Algorithms — Sort"
  },
  {
    "id": "q020",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (เรียง tuple ด้วยคีย์)",
    "payload": {
      "code": "fn main() {\n    let mut v = vec![(2, \"b\"), (1, \"a\")];\n    v.sort_by_key(|t| t.0);\n    println!(\"{:?}\", v);\n}",
      "choices": [
        "[(1, \"a\"), (2, \"b\")]",
        "[(2, \"b\"), (1, \"a\")]",
        "[a, b]",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[(1, \"a\"), (2, \"b\")]"
      }
    },
    "explain": "`sort_by_key(|t| t.0)` เรียงตาม field แรกของ tuple → [(1, \"a\"), (2, \"b\")] · pattern เดียวกันใช้เรียง struct ตาม field ไหนก็ได้ เช่น sort_by_key(|s| s.priority) — เป็นพื้นฐานของ cookbook \"sort vector of structs\"",
    "source": "Cookbook · Algorithms — Sort by key"
  },
  {
    "id": "q021",
    "type": "order",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เรียงบรรทัดให้โปรแกรมเอาตัวเลขซ้ำออก (ผลลัพธ์ [1, 2, 3])",
    "payload": {
      "lines": [
        "v.sort();",
        "fn main() {",
        "let mut v = vec![3, 1, 2, 1];",
        "println!(\"{:?}\", v);",
        "v.dedup();",
        "}"
      ],
      "answer": [
        1,
        2,
        0,
        4,
        3,
        5
      ],
      "verify": {
        "kind": "orderOutput",
        "expected": "[1, 2, 3]"
      }
    },
    "explain": "ต้อง `sort()` ก่อน `dedup()` เสมอ! dedup ลบเฉพาะค่าซ้ำที่ \"ติดกัน\" — [3,1,2,1] sort เป็น [1,1,2,3] แล้ว dedup จึงได้ [1, 2, 3] · ลืม sort = ตัวซ้ำที่ไม่ติดกันรอดไป (bug คลาสสิกจาก Cookbook)",
    "source": "Cookbook · Algorithms — Remove duplicates"
  },
  {
    "id": "q022",
    "type": "mcq",
    "cat": "syntax",
    "diff": 1,
    "prompt": "`let v = vec![1, 2, 3]; println!(\"{}\", v[5]);` จะเกิดอะไรขึ้น?",
    "payload": {
      "choices": [
        "panic ตอนรัน: index out of bounds",
        "คอมไพล์ไม่ผ่าน: index เกินตั้งแต่ compile time",
        "พิมพ์ 0",
        "พิมพ์ค่าที่อยู่ใน memory ถัดไป (undefined behavior)"
      ],
      "answer": 0
    },
    "explain": "index ขอบเกิน = panic ทันทีตอนรัน (message: index out of bounds: the len is 3 but the index is 5) — ไม่ใช่ UB แบบ C — Rust เช็คขอบทุกครั้งที่ access ผ่าน [] · อยากปลอดภัยกว่านั้นใช้ `v.get(5)` ซึ่งคืน Option",
    "source": "Cookbook · Data Structures — Vec access"
  },
  {
    "id": "q023",
    "type": "fill",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เติมเมธอดตรวจว่า vector มีเลข 2 หรือไม่",
    "payload": {
      "code": "let v = vec![1, 2, 3];\nlet has_two = v.___(&2);",
      "choices": [
        "contains",
        "includes",
        "has",
        "find"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`v.contains(&2)` คืน bool — สังเกตต้องส่ง `&2` (reference) เพราะ contains รับ `&T` เพื่อไม่ยุ่งกับความเป็นเจ้าของ · includes/has เป็นชื่อภาษาอื่น (Python/Java) ใน Rust ใช้ contains",
    "source": "Cookbook · Data Structures — Vec search"
  },
  {
    "id": "q024",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let v = vec![1, 2, 3];\n    let total: i32 = v.iter().sum();\n    println!(\"{}\", total);\n}",
      "choices": [
        "6",
        "123",
        "[1, 2, 3]",
        "คอมไพล์ไม่ผ่าน เพราะ sum ต้องระบุชนิดที่ v"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "6"
      }
    },
    "explain": "`iter().sum()` รวมทุกตัวได้ 6 — ต้องประกาศชนิดให้ตัวรับ (`let total: i32`) เพราะ sum สามารถรวมได้หลายชนิด (turbofish ก็ได้: `v.iter().sum::<i32>()`)",
    "source": "Cookbook · Algorithms — Sum"
  },
  {
    "id": "q025",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (map ยกกำลัง แล้วกรองเลขคู่)",
    "payload": {
      "code": "fn main() {\n    let v: Vec<i32> = vec![1, 2, 3, 4]\n        .iter()\n        .map(|x| x * x)\n        .filter(|x| x % 2 == 0)\n        .collect();\n    println!(\"{:?}\", v);\n}",
      "choices": [
        "[4, 16]",
        "[1, 4, 9, 16]",
        "[2, 4]",
        "[16]"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[4, 16]"
      }
    },
    "explain": "map กำลังสองทุกตัว: 1, 4, 9, 16 → filter เหลือคู่: 4, 16 → collect เป็น Vec — iterator adapter เรียงต่อกันเป็น pipeline อ่านเหมือนประโยค (จากซ้ายไปขวา) ต่างจากการเขียน for ซ้อนกัน",
    "source": "Cookbook · Functional — map/filter/collect"
  },
  {
    "id": "q026",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "`collect::<Vec<_>>()` — การเขียนแบบ turbofish (`::<_>`) มีไว้ทำอะไร?",
    "payload": {
      "choices": [
        "บอก collect ให้รวมผลเป็น Vec โดยให้ compiler เดาชนิดข้างในเอง",
        "ทำให้ collect ทำงานแบบขนาน (parallel)",
        "ก๊อปข้อมูลกันพังทั้ง vector",
        "แปลง Vec เป็น iterator"
      ],
      "answer": 0
    },
    "explain": "collect เป็น generic ที่รวมได้เป็นหลายชนิด (Vec, HashMap, String...) จึงต้องมีใครสักคนบอกปลายทาง — turbofish `::<Vec<_>>` ระบุที่ collect โดยตรง (`_` ให้ infer ต่อ) หรือจะประกาศชนิดที่ตัวแปรก็ได้: `let v: Vec<_> = ...`",
    "source": "Cookbook · Functional — collect"
  },
  {
    "id": "q027",
    "type": "bug",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let v: Vec<i32> = vec![1, 2];\n    let out = v.iter().map(|x| x + 1).collect();\n    println!(\"{:?}\", out);\n}",
      "choices": [
        "error[E0283]: type annotations needed — ไม่รู้จะ collect เป็นชนิดอะไร",
        "error[E0507]: cannot move out of `v`",
        "error[E0382]: borrow of moved value: `v`",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0283"
      }
    },
    "explain": "E0283 — `out` ไม่มี annotation และ collect เป็น generic ที่ปลายทางไม่แน่นอน compiler เดาไม่ได้ · แก้ด้วย `let out: Vec<i32> = ...` หรือ `collect::<Vec<i32>>()` — บั๊กที่เจอบ่อยมากเมื่อเริ่มใช้ iterator",
    "source": "Cookbook · Functional — collect type annotation"
  },
  {
    "id": "q028",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (enumerate คู่กับ chars)",
    "payload": {
      "code": "fn main() {\n    let e: Vec<(usize, char)> = \"กา\".chars().enumerate().collect();\n    println!(\"{:?}\", e);\n}",
      "choices": [
        "[(0, 'ก'), (1, 'า')]",
        "[(0, \"ก\"), (1, \"า\")]",
        "[(0, 'ก'), (3, 'า')]",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[(0, 'ก'), (1, 'า')]"
      }
    },
    "explain": "chars() ให้ char (single quote) ทีละตัวอักษร แล้ว enumerate ติดหมายเลข 0, 1, 2... ตามลำดับตัวอักษร (ไม่ใช่ byte) — ได้ [(0, 'ก'), (1, 'า')] · ใช้บ่อยมากกับข้อความไทยที่ byte-index ใช้ตรง ๆ ไม่ได้",
    "source": "Cookbook · Text Processing — chars & enumerate"
  },
  {
    "id": "q029",
    "type": "mcq",
    "cat": "syntax",
    "diff": 1,
    "prompt": "Vec<T> กับ [T; 3] (array) ต่างกันตรงไหน?",
    "payload": {
      "choices": [
        "Vec ยืดความยาวได้ (ข้อมูลบน heap) · array ความยาวคงที่ตายตัว",
        "Vec เก็บได้แค่ตัวเลข · array เก็บอะไรก็ได้",
        "อาร์เรย์เร็วกว่าเพราะใช้ heap เสมอ",
        "เหมือนกันทุกอย่าง ต่างแค่ชื่อ"
      ],
      "answer": 0
    },
    "explain": "array `[T; N]` ขนาดคงที่รู้ตอน compile เก็บในตำแหน่งที่ประกาศ (มัก stack) เหมาะข้อมูลคงที่ · Vec เป็น struct (ptr/len/cap) ชี้ไปหน่วยความจำบน heap ยืดหยุ่นได้ — เลือกใช้ตามธรรมชาติของข้อมูล",
    "source": "พื้นฐาน syntax — Vec vs array"
  },
  {
    "id": "q030",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "`Vec::with_capacity(1000)` มีประโยชน์เมื่อไหร่?",
    "payload": {
      "choices": [
        "รู้ล่วงหน้าว่าจะ push ~1000 ตัว — จองที่เดียวจบ ไม่ต้องย้ายข้อมูลหลายรอบ",
        "ทำให้ push เร็วขึ้นเป็น 2 เท่าเสมอ",
        "ทำให้ index ไม่ต้องเช็คขอบอีกต่อไป",
        "ลดขนาดของข้อมูลแต่ละตัวใน vector"
      ],
      "answer": 0
    },
    "explain": "Vec โตด้วยการจองใหม่+ย้ายทุกครั้งที่ capacity เต็ม (2 เท่าทีละครั้งโดยทั่วไป) — ถ้ารู้จำนวนล่วงหน้า `with_capacity` จองครั้งเดียว ตัด reallocation ทิ้งหมด · Cookbook แนะนำ pattern นี้เมื่อวนลูป push จำนวนมาก",
    "source": "Cookbook · Data Structures — Vec capacity"
  },
  {
    "id": "q031",
    "type": "bug",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v = vec![1];\n    for x in &v {\n        v.push(*x);\n    }\n}",
      "choices": [
        "error[E0502]: วนอ่าน `&v` อยู่ แต่กลับ push (แก้ `v`) ระหว่างวน — ยืมสองแบบชนกัน",
        "error[E0499]: cannot borrow as mutable more than once",
        "error[E0382]: borrow of moved value: `v`",
        "คอมไพล์ผ่าน แต่ลูปไม่รู้จบ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0502"
      }
    },
    "explain": "E0502 — `for x in &v` ยืมแบบอ่านทั้งลูป แต่ `v.push` ต้องยืมแบบเขียน: ต้องแก้ของที่กำลังอ่านอยู่ = ห้าม เพราะ push อาจย้ายหน่วยความจำ ทำให้ iterator อ้างที่ผิด · ทางแก้: collect สิ่งที่จะ push ไว้ก่อน จบลูปค่อย push (หรือใช้ Vec::append)",
    "source": "พื้นฐาน borrow — modify while iterating"
  },
  {
    "id": "q032",
    "type": "fill",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เติม adapter ที่คัดเฉพาะค่าที่มากกว่า 1",
    "payload": {
      "code": "let v: Vec<i32> = vec![1, 2, 3]\n    .iter()\n    .___(|x| **x > 1)\n    .cloned()\n    .collect();",
      "choices": [
        "filter",
        "map",
        "find",
        "where"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`filter(predicate)` คัดเฉพาะที่ closure คืน true (เหลือ [2, 3] (สังเกต ** — filter ส่ง &&i32 มาให้)) · `find` เหมือนกันแต่เอาแค่ตัวแรกแล้วหยุด (Option), `map` แปลงค่าไม่ใช่คัด, `where` ไม่มีใน Rust",
    "source": "Cookbook · Functional — filter"
  },
  {
    "id": "q033",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (สังเกตการเรียก map)",
    "payload": {
      "code": "fn main() {\n    let v = vec![1, 2];\n    v.iter().map(|x| {\n        println!(\"เห็น {}\", x);\n        x + 1\n    });\n    println!(\"done\");\n}",
      "choices": [
        "done",
        "เห็น 1\nเห็น 2\ndone",
        "เห็น 1\ndone",
        "คอมไพล์ไม่ผ่าน ต้อง collect"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "done"
      }
    },
    "explain": "iterator adapter ทั้งหลาย **ขี้เกียจ (lazy)** — map สร้าง pipeline แต่ยังไม่ทำงานจนกว่าจะมี \"consumer\" อย่าง collect/sum/for มาดึง — โค้ดนี้สร้างแล้วทิ้ง (warning: unused) จึงพิมพ์แค่ done — บั๊กเงียบ ๆ ที่ทำให้โค้ด \"ล่องหน\" ถ้าลืม consume",
    "source": "Cookbook · Functional — lazy iterators"
  },
  {
    "id": "q034",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "อยากนับว่าแต่ละคำในประโยคปรากฏกี่ครั้ง — ใช้โครงสร้างข้อมูลอะไร?",
    "payload": {
      "choices": [
        "HashMap<&str, usize> + entry().or_insert(0)",
        "Vec<(String, u32)> + เขียน for หา key เอง",
        "array ขนาด 26 ช่อง (a-z)",
        "String เก็บคำต่อกันด้วย comma"
      ],
      "answer": 0
    },
    "explain": "นับความถี่ = งานแบบ \"key → counter\" ซึ่งเป็นสิ่งที่ HashMap เกิดมาทำ (ค้นหา O(1)) และ entry API ทำให้โค้ดสั้นและปลอด race ในตัว — Vec+for ก็ทำได้แต่ช้า (O(n) ต่อการหา) และเขียนยาว",
    "source": "Cookbook · Algorithms — Word frequency"
  },
  {
    "id": "q035",
    "type": "order",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เรียงบรรทัดให้โปรแกรมนับคำซ้ำแล้วพิมพ์จำนวนคำที่ไม่ซ้ำ (พิมพ์ 2)",
    "payload": {
      "lines": [
        "println!(\"{}\", m.len());",
        "fn main() {",
        "use std::collections::HashMap;",
        "let mut m: HashMap<&str, i32> = HashMap::new();",
        "for w in [\"x\", \"y\", \"x\"] { *m.entry(w).or_insert(0) += 1; }",
        "}"
      ],
      "answer": [
        1,
        2,
        3,
        4,
        0,
        5
      ],
      "verify": {
        "kind": "orderOutput",
        "expected": "2"
      }
    },
    "explain": "ลำดับ: เปิด main → use HashMap → สร้าง map ว่าง → วนนับความถี่ → พิมพ์จำนวน key (x, y = 2 คำไม่ซ้ำ) → ปิด brace — \"x\" ปรากฏ 2 ครั้งแต่เป็น key เดียว จึง len() = 2",
    "source": "Cookbook · Algorithms — Map & Collect"
  },
  {
    "id": "q036",
    "type": "mcq",
    "cat": "syntax",
    "diff": 1,
    "prompt": "String กับ &str ต่างกันตรงไหน?",
    "payload": {
      "choices": [
        "String = เจ้าของข้อมูลจริง (heap, แก้ไขได้) · &str = มุมมองยืมอ่านของข้อความ",
        "String คือไทย · &str คืออังกฤษ",
        "&str เก็บบน heap เสมอ · String เก็บบน stack",
        "เหมือนกัน ใช้แทนกันได้ทุกที่"
      ],
      "answer": 0
    },
    "explain": "`String` เป็นเจ้าของ buffer (ยืดหยุ่น แก้ไขได้) ส่วน `&str` เป็น \"สไลซ์\" — ชี้+ยาวเท่าไหร่ อ่านอย่างเดียว ไม่ต้องเป็นเจ้าของ — idiom มาตรฐาน: รับพารามิเตอร์เป็น `&str` (ยืดกว้าง) แล้วเก็บ/คืนเป็น `String` เมื่อต้องเป็นเจ้าของ",
    "source": "พื้นฐาน syntax — String vs &str"
  },
  {
    "id": "q037",
    "type": "output",
    "cat": "syntax",
    "diff": 1,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let mut s = String::from(\"ไทย\");\n    s.push_str(\"แลนด์\");\n    println!(\"{}\", s.len());\n}",
      "choices": [
        "24",
        "2",
        "8",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "24"
      }
    },
    "explain": "ไทย = 3 ตัวอักษร × 3 bytes = 9 · แลนด์ = แ,ล,น,ด,์ 5 ตัว (รวมไม้ไต่คู้ที่เป็น combining) × 3 = 15 → รวม 24 bytes (`len()` นับ byte เสมอ) — push_str เติมท้ายโดยยืด buffer ให้เอง",
    "source": "Cookbook · Text Processing — String"
  },
  {
    "id": "q038",
    "type": "output",
    "cat": "syntax",
    "diff": 1,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let name = \"ฟ้า\";\n    let msg = format!(\"สวัสดี {} อายุ {}\", name, 30);\n    println!(\"{}\", msg);\n}",
      "choices": [
        "สวัสดี ฟ้า อายุ 30",
        "สวัสดี {name} อายุ {30}",
        "คอมไพล์ไม่ผ่าน ปนชนิดกันไม่ได้",
        "สวัสดี ฟ้าอายุ 30"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "สวัสดี ฟ้า อายุ 30"
      }
    },
    "explain": "`format!` ประกอบข้อความจากหลายชนิดผ่าน `{}` (Display) แล้วคืน String — เหมือน println! แต่ไม่พิมพ์ เอาไปใช้ต่อ — ไม่ต้องแปลงชนิดเองเลย",
    "source": "พื้นฐาน syntax — format!"
  },
  {
    "id": "q039",
    "type": "fill",
    "cat": "syntax",
    "diff": 1,
    "prompt": "เติมเมธอดสร้าง String จาก string literal",
    "payload": {
      "code": "let v = String::___(\"สวัสดี\");\nprintln!(\"{}\", v);",
      "choices": [
        "from",
        "new",
        "of",
        "str"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`String::from(\"สวัสดี\")` — from คัดลอก bytes ไปบน heap สร้าง String เจ้าของใหม่ · ทางเลือกเทียบเท่า: `\"สวัสดี\".to_string()` และ `.into()` — ทั้งสามได้ผลเหมือนกัน",
    "source": "พื้นฐาน syntax — String::from"
  },
  {
    "id": "q040",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (สไลซ์ข้อความ ASCII)",
    "payload": {
      "code": "fn main() {\n    let s = String::from(\"Rust\");\n    let slice = &s[1..3];\n    println!(\"{}\", slice);\n}",
      "choices": [
        "us",
        "Ru",
        "st",
        "คอมไพล์ไม่ผ่าน เพราะ s ถูกยืม"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "us"
      }
    },
    "explain": "`&s[1..3]` ตัด byte ที่ 1 ถึงก่อน 3 → \"us\" — สไลซ์เป็น **byte index** ใช้กับ ASCII ปลอดภัย แต่กับภาษาไทย/emoji ต้องระวังตำแหน่งตัด (ดูข้อถัดไป!)",
    "source": "Cookbook · Text Processing — slicing"
  },
  {
    "id": "q041",
    "type": "mcq",
    "cat": "syntax",
    "diff": 3,
    "prompt": "`let s = \"สวัสดี\"; println!(\"{}\", &s[0..2]);` จะเกิดอะไรขึ้น?",
    "payload": {
      "choices": [
        "panic ตอนรัน: byte index 2 ไม่ใช่ขอบเขตตัวอักษร (char boundary)",
        "พิมพ์ ส (ตัวอักษรแรก)",
        "พิมพ์ byte แรกเป็นตัวเลข",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0
    },
    "explain": "ส กิน 3 bytes (0–2) — ตัดที่ byte 2 กลางตัวอักษรพอดี → runtime panic \"byte index 2 is not a char boundary\" — **คอมไพล์ผ่าน** แต่พังตอนรัน! · กับข้อความนอก ASCII ใช้ chars()/char_indices() เพื่อหาขอบเขตตัวอักษรจริง",
    "source": "Cookbook · Text Processing — UTF-8 boundaries"
  },
  {
    "id": "q042",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    println!(\"{} {}\", \"ไทย\".len(), \"ไทย\".chars().count());\n}",
      "choices": [
        "9 3",
        "3 3",
        "9 9",
        "3 9"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "9 3"
      }
    },
    "explain": "ไทย = 3 ตัวอักษร แต่ละตัว 3 bytes ใน UTF-8 → `len()` (byte) = 9, `chars().count()` (ตัวอักษร) = 3 — จำคู่นี้ไว้เจอบั๊กไทยได้ทุกภาษาโปรแกรมมิ่งที่ใช้ UTF-8",
    "source": "Cookbook · Text Processing — bytes vs chars"
  },
  {
    "id": "q043",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "`\"hi\".to_string()` กับ `\"hi\".to_owned()` ต่างกันไหม?",
    "payload": {
      "choices": [
        "ได้ผลเหมือนกัน (คืน String จาก &str) — เลือกอันที่ทีมถนัด",
        "to_owned เร็วกว่าเพราะไม่ก๊อป",
        "to_string คืน &str · to_owned คืน String",
        "to_owned ใช้ได้แค่ตอน compile"
      ],
      "answer": 0
    },
    "explain": "สำหรับ &str ทั้งคู่สร้าง String ใหม่ (ก๊อป bytes ไป heap) ผลเหมือนกันจริง — สไตล์ Rust ยุคใหม่นิยม to_owned() สั้นกว่า แต่รู้กันทั้งสองเพราะเจอทั้งสองในโค้ดจริง",
    "source": "พื้นฐาน syntax — to_string vs to_owned"
  },
  {
    "id": "q044",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (match กับ Option)",
    "payload": {
      "code": "fn main() {\n    let x: Option<i32> = Some(5);\n    let r = match x {\n        Some(v) => v * 2,\n        None => 0,\n    };\n    println!(\"{}\", r);\n}",
      "choices": [
        "10",
        "Some(10)",
        "5",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "10"
      }
    },
    "explain": "match บังคับครบทุกกรณี: Some ดึงค่าออกมาคูณสอง (10), None ให้ 0 — ถ้าลืมแขน None จะคอมไพล์ไม่ผ่าน (non-exhaustive) — ความปลอดภัยที่ Rust ออกแบบมาตั้งแต่ต้น",
    "source": "พื้นฐาน syntax — match Option"
  },
  {
    "id": "q045",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let x: Option<i32> = None;\n    println!(\"{}\", x.unwrap_or(99));\n}",
      "choices": [
        "99",
        "None",
        "0",
        "panic เพราะเป็น None"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "99"
      }
    },
    "explain": "`unwrap_or(default)` ดึงค่าถ้ามี ไม่มีใช้ค่าสำรอง — ต่างจาก `unwrap()` ที่ None แล้ว panic — เลือกให้ถูกบริบท: มีค่าเริ่มต้นสมเหตุสมผล → unwrap_or, ค่า default แพง/ต้องคำนวณ → unwrap_or_else(|| ...)",
    "source": "พื้นฐาน syntax — Option combinators"
  },
  {
    "id": "q046",
    "type": "fill",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เติม combinator ที่แปลงค่าข้างใน Some โดยไม่แตะ None",
    "payload": {
      "code": "let x = Some(2);\nlet v = x.___(|n| n * 10).unwrap();\nprintln!(\"{}\", v);",
      "choices": [
        "map",
        "and_then",
        "flatten",
        "apply"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`map(f)` แปลงค่าใน Some: Some(2) → Some(20), None ผ่านไปเฉย ๆ (ยังเป็น None) — เหมือน map ของ iterator แต่ทำงานกับ \"กล่อง 0-1 ใบ\" · and_then ต่างตรงใช้เมื่อ f คืน Option ซ้อน (flat)",
    "source": "พื้นฐาน syntax — Option::map"
  },
  {
    "id": "q047",
    "type": "mcq",
    "cat": "syntax",
    "diff": 1,
    "prompt": "`let x: Option<i32> = None; println!(\"{}\", x.unwrap());` จะเกิดอะไรขึ้น?",
    "payload": {
      "choices": [
        "panic ตอนรัน พร้อมข้อความ called `Option::unwrap()` on a `None` value",
        "พิมพ์ 0",
        "พิมพ์ None",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0
    },
    "explain": "unwrap กับ None = panic ทันที — เหมาะก็ต่อเมื่อมั่นใจ 100% ว่ามีค่า (หรือโปรโตไทป์) · ในโค้ดจริงเลือก unwrap_or/expect(\"เหตุผล\") หรือ match/`?` แทน เพื่อไม่โดน panic ตอนโปรแกรมรับอะไรมาแปลก ๆ",
    "source": "พื้นฐาน syntax — unwrap discipline"
  },
  {
    "id": "q048",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (if let)",
    "payload": {
      "code": "fn main() {\n    if let Some(n) = Some(7) {\n        println!(\"เจอ {}\", n);\n    } else {\n        println!(\"ไม่เจอ\");\n    }\n}",
      "choices": [
        "เจอ 7",
        "ไม่เจอ",
        "Some(7)",
        "คอมไพล์ไม่ผ่าน ต้องเป็น match เท่านั้น"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "เจอ 7"
      }
    },
    "explain": "`if let Some(n) = ...` = match แบบย่อ เอาไว้ตอนสนใจแค่ pattern เดียว — Some ดึง 7 ออกมาทำในบล็อก, None ไป else — สั้นกว่า match เมื่อมีแค่สองทางและสนใจทางเดียว",
    "source": "พื้นฐาน syntax — if let"
  },
  {
    "id": "q049",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "ฟังก์ชันไหนคืน Result แล้วเราอยาก \"ได้ค่าหรือใช้สำรอง\" — idiom ไหนเหมาะที่สุด?",
    "payload": {
      "choices": [
        "parse().unwrap_or(0)",
        "parse().unwrap() ให้จบเร็ว ๆ",
        "match ทุกครั้งเพื่อความชัด แม้ยาว 10 บรรทัด",
        "panic!(\"ไม่ผ่าน\")"
      ],
      "answer": 0
    },
    "explain": "unwrap_or ให้ค่าสำรองเมื่อ Err — กระชับและไม่พังตอนรัน · unwrap เสี่ยง panic · match ละเอียดแต่ฟุ่มเฟือยถ้าแค่อยากได้ค่า — บทเรียน Rust ทั่วไป: เลือก combinator ให้พอดีกับความต้องการ ไม่ใช่ unwrap ทุกที่",
    "source": "พื้นฐาน syntax — Result combinators"
  },
  {
    "id": "q050",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn half_even(n: i32) -> Result<i32, String> {\n    if n % 2 != 0 {\n        return Err(format!(\"odd {}\", n));\n    }\n    Ok(n / 2)\n}\nfn main() {\n    println!(\"{:?} {:?}\", half_even(10), half_even(3));\n}",
      "choices": [
        "Ok(5) Err(\"odd 3\")",
        "5 ความผิดพลาด",
        "Ok(5) Ok(3)",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "Ok(5) Err(\"odd 3\")"
      }
    },
    "explain": "Result มีสองด้าน: Ok(ค่าที่สำเร็จ) / Err(ความผิดพลาดพร้อมข้อมูล) — 10 คู่ → Ok(5), 3 คี่ → Err(\"odd 3\") · พิมพ์ผ่าน {:?} เห็นโครงชัด ๆ — เทียบกับ exception ของภาษาอื่น: ความผิดพลาดเป็น \"ค่า\" ที่ต้องรับมือตรง ๆ ใน type",
    "source": "พื้นฐาน syntax — Result"
  },
  {
    "id": "q051",
    "type": "fill",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เติมเมธอดแปลงข้อความเป็นตัวเลข",
    "payload": {
      "code": "let v: i32 = \"42\".___().unwrap();\nprintln!(\"{}\", v + 1);",
      "choices": [
        "parse",
        "to_i32",
        "int",
        "num"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`\"42\".parse()` คืน Result (อาจพลาดถ้าข้อความไม่ใช่เลข) และชนิดปลายทางบอกจาก annotation ของตัวแปร — `let v: i32` — เทคนิคเดียวใช้แปลง f64/u8 ฯลฯ ได้หมด",
    "source": "Cookbook · Type Conversion — parse"
  },
  {
    "id": "q052",
    "type": "bug",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let n = \"42\".parse().unwrap();\n    println!(\"{}\", n);\n}",
      "choices": [
        "error[E0284]: type annotations needed — parse แปลงเป็นอะไรได้หลายชนิด จึงเดาไม่ออก",
        "error[E0308]: mismatched types",
        "error[E0277]: \"42\" ไม่ใช่ตัวเลข",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0284"
      }
    },
    "explain": "parse เป็น generic: i32? f64? bool? อาจถูกทั้งคู่ — ไม่มีใครบอกปลายทาง (println `{}` ก็ไม่ช่วย) → ต้องเขียน `let n: i32 = ...` หรือ `\"42\".parse::<i32>()` — ตัวอย่าง type annotation ที่ \"จำเป็น\" ไม่ใช่ตกแต่ง",
    "source": "Cookbook · Type Conversion — parse annotation"
  },
  {
    "id": "q053",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (cast ค่าตัดเศษ)",
    "payload": {
      "code": "fn main() {\n    let a: i32 = 300;\n    let b = a as u8;\n    println!(\"{}\", b);\n}",
      "choices": [
        "44",
        "300",
        "255",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "44"
      }
    },
    "explain": "`as` cast ตัดเศษตามขนาดปลายทาง: u8 เก็บได้ 0–255 → 300 - 256 = 44 (wrap แบบเงียบ ไม่มี warning!) — as ใช้ได้เร็วแต่อันตรายเงียบ ๆ กับค่าเกินขอบ — Cookbook แนะนำ try_into() (คืน Result) เมื่อค่าอาจเกิน",
    "source": "Cookbook · Type Conversion — as casting"
  },
  {
    "id": "q054",
    "type": "order",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เรียงบรรทัดให้โปรแกรมตัดช่องว่างหัวท้ายแล้วพิมพ์ HI",
    "payload": {
      "lines": [
        "println!(\"{}\", v.trim().to_uppercase());",
        "fn main() {",
        "let v = String::from(\"  hi  \");",
        "}"
      ],
      "answer": [
        1,
        2,
        0,
        3
      ],
      "verify": {
        "kind": "orderOutput",
        "expected": "HI"
      }
    },
    "explain": "ประกาศข้อความ → ตัดช่องว่างหัวท้าย (trim) → พิมพ์ใหญ่ (to_uppercase) — สองเมธอดนี้ต่อกันได้เพราะต่างคืนใหม่ ไม่แก้ของเดิม (เดิม v ยังเป็น \"  hi  \") — เรียงก่อนหลังสลับก็รันได้ แต่ได้ผลต่างกัน",
    "source": "Cookbook · Text Processing — trim/uppercase"
  },
  {
    "id": "q055",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "`split_whitespace()` ต่างจาก `split(' ')` ตรงไหน?",
    "payload": {
      "choices": [
        "split_whitespace ตัดคำเฉพาะช่องว่างจริง รวมหลายช่อง/tabs เป็นตัวเดียว ไม่มี string ว่างหลุดมา",
        "split_whitespace เร็วกว่า 10 เท่า",
        "split(' ') ตัดได้แค่ภาษาอังกฤษ",
        "เหมือนกันทุกประการ"
      ],
      "answer": 0
    },
    "explain": "\"a  b\".split(' ') ได้ [\"a\", \"\", \"b\"] (ช่องซ้อนทำให้เกิด string ว่าง!) ส่วน split_whitespace ได้ [\"a\", \"b\"] สะอาด — นับคำ/เตรียม input ใช้ split_whitespace เป็นค่าเริ่มต้น",
    "source": "Cookbook · Text Processing — split_whitespace"
  },
  {
    "id": "q056",
    "type": "output",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let words: Vec<&str> = \"a b  c\".split_whitespace().collect();\n    println!(\"{:?} {}\", words, words.len());\n}",
      "choices": [
        "[\"a\", \"b\", \"c\"] 3",
        "[\"a\", \"b\", \"\", \"c\"] 4",
        "[\"a b  c\"] 1",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[\"a\", \"b\", \"c\"] 3"
      }
    },
    "explain": "split_whitespace ข้ามช่องว่างซ้อน → ได้ 3 คำสะอาด [\"a\", \"b\", \"c\"] — รับ &str ที่ยืมจากข้อความเดิม (ไม่ก๊อป — zero cost) จึง collect เป็น Vec<&str> ได้",
    "source": "Cookbook · Text Processing — split_whitespace"
  },
  {
    "id": "q057",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "`let s3 = s1 + &s2;` หลังจบบรรทัดนี้ — เกิดอะไรกับ s1?",
    "payload": {
      "choices": [
        "s1 ถูกย้าย (move) เข้าไปรวมใน s3 แล้ว ใช้ s1 ต่อไม่ได้",
        "s1 ยังใช้ได้ปกติ เพราะ + ก๊อป",
        "s1 กลายเป็นข้อความว่าง",
        "คอมไพล์ไม่ผ่าน เพราะ + ใช้กับ String ไม่ได้"
      ],
      "answer": 0
    },
    "explain": "add ของ String รับ `self` (เจ้าของ) + `&str` — ดังนั้น `s1 + &s2` ยึด buffer ของ s1 ไปต่อท้ายแล้วส่งต่อเป็น s3: ประหยัด (ไม่ก๊อป) แต่ s1 หมดอายุ — อยากคงทั้งคู่ใช้ format! แทน",
    "source": "พื้นฐาน syntax — String concatenation"
  },
  {
    "id": "q058",
    "type": "bug",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let s1 = String::from(\"a\");\n    let s2 = String::from(\"b\");\n    let s3 = s1 + s2;\n    println!(\"{}\", s3);\n}",
      "choices": [
        "error[E0308]: + ของ String ต้องการ &str เป็นตัวที่สอง ไม่ใช่ String — ใช้ s1 + &s2",
        "error[E0382]: s2 ถูกย้ายไปก่อนหน้า",
        "error[E0277]: String บวกกันไม่ได้",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0308"
      }
    },
    "explain": "signature จริง: `String + &str` — ตัวขวาต้องเป็น &str · เขียน `s1 + s2` ส่ง String มาผิดชนิด (E0308) — compiler เสนอแก้ให้เลย: เติม `&` → deref coercion แปลง &String เป็น &str ให้อัตโนมัติ",
    "source": "พื้นฐาน syntax — String + &str"
  },
  {
    "id": "q059",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let s = \"ab\".repeat(3);\n    println!(\"{} {}\", s, s.len());\n}",
      "choices": [
        "ababab 6",
        "ab ab ab 8",
        "ababab 2",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "ababab 6"
      }
    },
    "explain": "`repeat(n)` ทำซ้ำข้อความ n รอบ → \"ababab\" (6 bytes) คืน String ใหม่ — เหมาะสร้าง separator/placeholder เช่น \"-\".repeat(40) แทนเขียนขีดสี่สิบตัวเอง",
    "source": "Cookbook · Text Processing — repeat"
  },
  {
    "id": "q060",
    "type": "mcq",
    "cat": "syntax",
    "diff": 3,
    "prompt": "ทำไม Rust ต้องมี String ทั้งที่มี str อยู่แล้ว?",
    "payload": {
      "choices": [
        "str ขนาดไม่แน่นอน (unsized) เก็บเป็นเจ้าของเองไม่ได้ — String คือหัว (ptr/len/cap) ที่เป็นเจ้าของ heap และโตได้",
        "str เก็บได้แค่ ASCII",
        "String เขียนเร็วกว่าเพราะมีมาโคร",
        "str ใช้ได้แค่ใน trait"
      ],
      "answer": 0
    },
    "explain": "str คือ \"ข้อความดิบ\" ไม่รู้ขนาดตอน compile จึงอยู่หลัง pointer เสมอ (&str) — String ห่อ heap buffer มาพร้อม ptr/len/cap ยืดหยุ่นและเป็นเจ้าของได้ — คู่นี้คือเหตุผลที่ API ไหนก็เจอ String/&str ตลอดเวลา",
    "source": "พื้นฐาน syntax — String internals"
  },
  {
    "id": "q061",
    "type": "mcq",
    "cat": "memory",
    "diff": 1,
    "prompt": "ใน Rust \"move\" หมายถึงอะไร?",
    "payload": {
      "choices": [
        "โอนความเป็นเจ้าของข้อมูลให้ตัวแปรใหม่ — ตัวเดิมหมดสิทธิ์ใช้ทันที",
        "ก๊อปข้อมูลไปอีกที่ ตัวเดิมยังใช้ได้",
        "ย้ายข้อมูลไปไว้บน heap",
        "ลบตัวแปรออกจาก scope"
      ],
      "answer": 0
    },
    "explain": "move = ส่งต่อความเป็นเจ้าของ (เหมือนส่งกุญแจบ้านให้คนอื่น แล้วเราไม่มีกุญแจ) — ตัวแปรเดิมใช้ต่อไม่ได้เพื่อกัน \"สองเจ้าของแก้ของชิ้นเดียวพร้อมกัน\" — เป็นหัวใจของ ownership ที่ไม่มีภาษาไหนทำแบบนี้ตรง ๆ",
    "source": "พื้นฐาน ownership — move"
  },
  {
    "id": "q062",
    "type": "output",
    "cat": "memory",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (integer กับ move)",
    "payload": {
      "code": "fn main() {\n    let a = 5;\n    let b = a;\n    println!(\"{} {}\", a, b);\n}",
      "choices": [
        "5 5",
        "คอมไพล์ไม่ผ่าน เพราะ a ถูกย้าย",
        "5 0",
        "0 5"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "5 5"
      }
    },
    "explain": "integer เป็นชนิด **Copy** — มีขนาดเล็ก ก๊อปค่าตอน assign ได้ถูกมาก compiler จึงก๊อปให้เลย ไม่ move ทั้งที่เป็น assignment เดียวกับ String — ชนิด Copy ได้แก่: integer, float, bool, char, และ tuple ที่ข้างในเป็น Copy ทั้งหมด",
    "source": "พื้นฐาน ownership — Copy types"
  },
  {
    "id": "q063",
    "type": "bug",
    "cat": "memory",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn take(s: String) {\n    println!(\"รับ {}\", s);\n}\nfn main() {\n    let s = String::from(\"hi\");\n    take(s);\n    println!(\"{}\", s);\n}",
      "choices": [
        "error[E0382]: ส่ง s เข้าฟังก์ชัน = ย้ายความเป็นเจ้าของให้ take แล้ว ใช้ s ต่อไม่ได้",
        "error[E0507]: cannot move out of `s`",
        "error[E0106]: missing lifetime",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0382"
      }
    },
    "explain": "พารามิเตอร์ `s: String` (ไม่มี &) = ฟังก์ชันขอเป็นเจ้าของ — พอเรียก take(s) ความเป็นเจ้าของหายไป (และถูกทิ้งท้ายฟังก์ชัน) — ใช้ s อีก = E0382 · แก้ได้สามทาง: ส่ง `&s` (ยืมอ่าน), `&mut s` (ยืมแก้), หรือ `s.clone()` (ก๊อปให้เขา)",
    "source": "พื้นฐาน ownership — move into function"
  },
  {
    "id": "q064",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "อยากเรียก `print_len(s)` โดยที่ s ยังใช้งานต่อได้หลังเรียก — เขียน signature ของ print_len แบบไหน?",
    "payload": {
      "choices": [
        "fn print_len(s: &String) — ยืมอ่าน ไม่ยึดความเป็นเจ้าของ",
        "fn print_len(s: String) — รับค่าตรง ๆ",
        "fn print_len(s: mut String)",
        "fn print_len() -> String"
      ],
      "answer": 0
    },
    "explain": "& หน้าชนิด = ยืม (borrow) — ฟังก์ชันดูได้อย่างเดียว เจ้าของเดิมยังอยู่ — (สไตล์ Rust นิยม `&str` ยิ่งกว่า: รับได้ทั้ง &String และ literal ผ่าน deref coercion) — การเลือก & หรือค่าจริง คือการตัดสินใจเรื่องความเป็นเจ้าของที่ทำทุกครั้งที่เขียน signature",
    "source": "พื้นฐาน ownership — borrow in signatures"
  },
  {
    "id": "q065",
    "type": "fill",
    "cat": "memory",
    "diff": 2,
    "prompt": "เติมเครื่องหมายเพื่อสร้าง \"การยืม\" (reference) ของ n",
    "payload": {
      "code": "let n = 10;\nlet v = ___n;\nprintln!(\"{} {}\", n, *v);",
      "choices": [
        "&",
        "*",
        "&&",
        "#"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`&n` สร้าง reference (การยืม) · `*v` คือ deref — ตามอ่านค่าที่ยืมมา — คู่สัญลักษณ์ &/* คือหัวใจของการยืมใน Rust เหมือน \"ขอยืม\" กับ \"เปิดดูของที่ยืมมา\"",
    "source": "พื้นฐาน ownership — references"
  },
  {
    "id": "q066",
    "type": "bug",
    "cat": "memory",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let mut s = String::from(\"a\");\n    let a = &mut s;\n    let b = &mut s;\n    a.push('x');\n    b.push('y');\n}",
      "choices": [
        "error[E0499]: ยืม mutable ซ้อนกันสองตัวพร้อมกันไม่ได้ — ของชิ้นเดียว แก้ได้ทีละคน",
        "error[E0502]: ยืมอ่านขณะมีการยืมเขียน",
        "error[E0382]: borrow of moved value",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0499"
      }
    },
    "explain": "E0499 — &mut หลายตัวพร้อมกัน = คนแก้ของชิ้นเดียวพร้อมกัน (data race ในที่นั้นเอง) → ห้าม · กฎยืม: **อ่านได้หลายคนพร้อมกัน หรือ เขียนคนเดียว** — ตรงนี้ b ถูกใช้หลัง a จึงถือว่าซ้อน · แก้: ใช้ a ให้จบก่อนสร้าง b (NLL ปล่อยยืมให้อัตโนมัติเมื่อใช้ครั้งสุดท้าย)",
    "source": "พื้นฐาน ownership — borrow rules"
  },
  {
    "id": "q067",
    "type": "bug",
    "cat": "memory",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v = vec![1];\n    let r = &v;\n    r.push(2);\n}",
      "choices": [
        "error[E0596]: r เป็น reference แบบอ่านอย่างเดียว — เรียก push (แก้ข้อมูล) ไม่ได้",
        "error[E0384]: cannot assign twice to immutable variable",
        "error[E0507]: cannot move out of `v`",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0596"
      }
    },
    "explain": "E0596 — `&v` ยืมแบบอ่าน แต่ `push` ต้องการ `&mut self` (แก้ข้อมูล) — อ่านอย่างเดียวแก้ของไม่ได้ · แก้: ยืม `&mut v` แทน (และ v ต้องประกาศ mut ไว้แล้ว — ตัวนี้มี) — compiler บอกตรง ๆ ว่าจุดไหนขอแก้ผ่านตัวที่อ่านได้อย่างเดียว",
    "source": "พื้นฐาน ownership — immutable borrow"
  },
  {
    "id": "q068",
    "type": "output",
    "cat": "memory",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (ยืม mutable แล้วแก้)",
    "payload": {
      "code": "fn main() {\n    let mut s = String::from(\"go\");\n    let r = &mut s;\n    r.push_str(\"!\");\n    println!(\"{}\", r);\n}",
      "choices": [
        "go!",
        "go",
        "คอมไพล์ไม่ผ่าน เพราะ s ถูกยืม",
        "คอมไพล์ไม่ผ่าน ต้องใช้ *r"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "go!"
      }
    },
    "explain": "`&mut s` ยืมแบบแก้ไขได้ → push_str เติม \"!\" → ได้ go! — method call ผ่าน reference มี auto-deref จึงไม่ต้องเขียน (*r).push_str(...) — เจ้าของ (s) ไม่หายไปไหน แค่ยืมสิทธิ์แก้ชั่วคราวให้ r",
    "source": "พื้นฐาน ownership — mutable borrow"
  },
  {
    "id": "q069",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "NLL (Non-Lexical Lifetimes) ช่วยอะไรในโค้ดแบบนี้: `let r = &s; println!(\"{}\", r); s.push('!');`",
    "payload": {
      "choices": [
        "การยืมของ r สิ้นสุดที่การใช้ครั้งสุดท้าย (println) — หลังจากนั้น s แก้ไขได้ ไม่ชนกัน",
        "ทำให้ reference มีอายุตลอด scope เสมอ จึงต้องระวังเป็นพิเศษ",
        "ปิดการตรวจ borrow เพื่อความเร็ว",
        "แปลง &s เป็น &mut s อัตโนมัติ"
      ],
      "answer": 0
    },
    "explain": "NLL ทำให้ compiler ดู \"การใช้งานจริง\" ไม่ใช่วงเล็บ — ยืม r ใช้ครั้งสุดท้ายที่ println การยืมจบเลย push ทีหลังไม่ชน — ถ้าไม่มี NLL โค้ดกลุ่มนี้ (ยืมก่อน-แก้ทีหลัง) จะ error ตลอด และ Rust จะเขียนยากโค้ดหนักมาก",
    "source": "พื้นฐาน ownership — NLL"
  },
  {
    "id": "q070",
    "type": "output",
    "cat": "memory",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (clone)",
    "payload": {
      "code": "fn main() {\n    let a = String::from(\"x\");\n    let b = a.clone();\n    println!(\"{} {}\", a, b);\n}",
      "choices": [
        "x x",
        "คอมไพล์ไม่ผ่าน เพราะ a ถูกย้าย",
        "x",
        "ก๊อปไม่สำเร็จ ได้ None"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "x x"
      }
    },
    "explain": "`clone()` ก๊อปข้อมูลจริง (สร้าง buffer ใหม่บน heap) — ได้สองเจ้าของอิสระต่อกัน ใช้ทั้งคู่ได้ — แลกมาด้วยต้นทุน: จองหน่วยความจำ+ก๊อป bytes — ใช้เมื่อจำเป็นจริง ๆ (เช่น ต้องส่งเข้าฟังก์ชันแต่ยังต้องใช้ต่อ)",
    "source": "พื้นฐาน ownership — clone"
  },
  {
    "id": "q071",
    "type": "fill",
    "cat": "memory",
    "diff": 2,
    "prompt": "เติมเมธอดที่ก๊อป vector ให้เป็นอีกชุด (เจ้าของเดิมยังใช้ได้)",
    "payload": {
      "code": "let v = vec![1, 2];\nlet w = v.___();\nprintln!(\"{:?} {:?}\", v, w);",
      "choices": [
        "clone",
        "copy",
        "dup",
        "ref"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`clone()` — ก๊อปทั้งหัว (ptr/len/cap บน stack) และตัวข้อมูลบน heap เป็นชุดใหม่ · Vec ไม่ใช่ Copy (มี heap ต้องจัดการตอน drop) จึงไม่มีก๊อปฟรีแบบ integer — copy/dup ไม่มีใน Vec",
    "source": "พื้นฐาน ownership — clone vs Copy"
  },
  {
    "id": "q072",
    "type": "bug",
    "cat": "memory",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let x = 1;\n    x = 2;\n}",
      "choices": [
        "error[E0384]: ตัวแปรไม่ได้ประกาศ mut — แก้ค่าใหม่ไม่ได้ (เพิ่ม let mut x)",
        "error[E0382]: x ถูกย้ายไปแล้ว",
        "error[E0308]: ชนิดไม่ตรง",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0384"
      }
    },
    "explain": "E0384 — Rust ตัวแปร immutable เป็นค่าเริ่มต้น: กำหนดครั้งเดียว ห้ามแก้ · อยากแก้ต้องขอตั้งแต่ประกาศ: `let mut x = 1;` — ความไม่เปลี่ยนแปลงเป็นค่าเริ่มต้นช่วยให้อ่านโค้ดรู้ว่าอะไรจะเปลี่ยน/ไม่เปลี่ยนโดยไม่ต้องไล่ทุกบรรทัด",
    "source": "พื้นฐาน syntax — mutability"
  },
  {
    "id": "q073",
    "type": "mcq",
    "cat": "memory",
    "diff": 1,
    "prompt": "`let mut v = vec![1];` — คำว่า mut ทำหน้าที่อะไร?",
    "payload": {
      "choices": [
        "อนุญาตให้เปลี่ยนค่าที่ v ผูกอยู่ (push/แก้ element) ได้",
        "ทำให้ Vec โตได้ (ไม่มี mut ก็จองที่ไม่ได้)",
        "ประกาศตัวแปรใหม่ซ้ำชื่อเดิมได้",
        "ทำให้ข้อมูลปลอดภัยข้าม thread"
      ],
      "answer": 0
    },
    "explain": "mut ที่ตัวแปร = สิทธิ์แก้ไข **ค่าที่ผูกอยู่** — ไม่ใช่คุณสมบัติพิเศษของ Vec เอง (Vec โตได้เพราะโครงสร้างมันออกแบบมา แต่ต้องมี mut ถึงเรียกใช้) · ส่วนการประกาศชื่อซ้ำคือ shadowing — ไม่ต้อง mut ก็ได้",
    "source": "พื้นฐาน syntax — mut"
  },
  {
    "id": "q074",
    "type": "output",
    "cat": "memory",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (shadowing เปลี่ยนชนิด)",
    "payload": {
      "code": "fn main() {\n    let x = \"5\";\n    let x: i32 = x.parse().unwrap();\n    println!(\"{}\", x + 1);\n}",
      "choices": [
        "6",
        "51",
        "คอมไพล์ไม่ผ่าน ชนิดเปลี่ยนไม่ได้",
        "5"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "6"
      }
    },
    "explain": "shadowing: `let x` ซ้ำชื่อ = ประกาศ **ตัวแปรใหม่** ทับชื่อเดิม เปลี่ยนชนิดได้ด้วย (&str → i32) — ต่างจาก `mut` ที่ต้องคงชนิดเดิม — idiom ที่พบบ่อยมาก: รับ input เป็น String แล้ว shadow เป็นชนิดที่ต้องการใช้จริง",
    "source": "พื้นฐาน syntax — shadowing"
  },
  {
    "id": "q075",
    "type": "bug",
    "cat": "memory",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn make<'a>() -> &'a String {\n    let s = String::from(\"hi\");\n    &s\n}\nfn main() {\n    let r = make();\n    println!(\"{}\", r);\n}",
      "choices": [
        "error[E0515]: คืน reference ที่ชี้ไปตัวแปรในฟังก์ชัน — ตัวแปรถูกทิ้งตอนจบฟังก์ชัน ชี้ไปหาอะไรที่ตายแล้ว",
        "error[E0507]: cannot move out of `s`",
        "error[E0106]: missing lifetime specifier",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0515"
      }
    },
    "explain": "E0515 — `&s` ชี้ไป String ที่อยู่ใน stack frame ของ make: จบฟังก์ชัน = frame และ String ถูกทำลาย reference จะชี้่หาความว่างเปล่า (dangling) — Rust จับได้ตอน compile เลย! · แก้: คืน String เจ้าของเอง (move ออกมา) แทนการยืม",
    "source": "พื้นฐาน ownership — dangling reference"
  },
  {
    "id": "q076",
    "type": "output",
    "cat": "memory",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (ส่งต่อความเป็นเจ้าของเข้า-ออกฟังก์ชัน)",
    "payload": {
      "code": "fn grow(mut s: String) -> String {\n    s.push_str(\"!\");\n    s\n}\nfn main() {\n    let s = grow(String::from(\"hey\"));\n    println!(\"{}\", s);\n}",
      "choices": [
        "hey!",
        "hey",
        "คอมไพล์ไม่ผ่าน ต้องใช้ &mut",
        "คอมไพล์ผ่าน แต่พิมพ์ว่างเปล่า"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "hey!"
      }
    },
    "explain": "รับ String (เป็นเจ้าของ) → แก้ได้อิสระไม่ต้องกังวลใครยืมอยู่ → คืน s (ส่งต่อความเป็นเจ้าของออกมา) — แพทเทิร์น consume-then-return ทำให้โค้ดปลอดภัยโดยไม่ต้องเขียน lifetime เลย — เสียแค่เจ้าของเดิม (ตัวเรียก) ต้องรับค่าคืนมาใช้ต่อ",
    "source": "พื้นฐาน ownership — ownership transfer"
  },
  {
    "id": "q077",
    "type": "mcq",
    "cat": "memory",
    "diff": 3,
    "prompt": "เขียนพารามิเตอร์รับข้อความ — แบบไหน \"ยืดหยุ่นที่สุด\" สำหรับผู้เรียก?",
    "payload": {
      "choices": [
        "fn f(s: &str) — รับได้ทั้ง &String (deref coercion) และ \"literal\"",
        "fn f(s: String) — ผู้เรียกต้องเตรียมเจ้าของเสมอ",
        "fn f(s: &String) — เหมือนกันทุกกรณีกับ &str",
        "fn f(s: &mut String) — ยืดที่สุดเพราะแก้ได้ด้วย"
      ],
      "answer": 0
    },
    "explain": "&str คือมาตรฐานสากล (Goose ก็ใช้ &str ใน API เกือบทั้งเล่ม): ผู้เรียงมี String ก็ส่ง &s ได้, มี literal ก็ส่งได้เลย — &String ใช้ได้แต่คนเรียกต้องมี String จริง ๆ · (rule of thumb: &str เข้า, String ออก)",
    "source": "พื้นฐาน ownership — API design"
  },
  {
    "id": "q078",
    "type": "bug",
    "cat": "memory",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "fn main() {\n    let s = String::from(\"hi\");\n    let f = move || println!(\"{}\", s);\n    f();\n    println!(\"{}\", s);\n}",
      "choices": [
        "error[E0382]: closure แบบ move ยึดความเป็นเจ้าของ s ไปแล้ว — ข้างนอกใช้ s ต่อไม่ได้",
        "error[E0502]: closure ยืม s ขณะแก้ไข",
        "error[E0596]: cannot borrow as mutable",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0382"
      }
    },
    "explain": "`move ||` บังคับยึดทุกอย่างที่ใช้เป็นความเป็นเจ้าของ (จำเป็นสำหรับ thread::spawn ที่ต้อง 'static) — s ย้ายเข้า closure เป็นของ closure ไปแล้ว · แก้: ตัด move (closure ยืมแทน) หรือใช้ s.clone() ตอนสร้าง closure",
    "source": "พื้นฐาน ownership — move closures"
  },
  {
    "id": "q079",
    "type": "memory",
    "cat": "memory",
    "diff": 2,
    "prompt": "ดูแผนภาพ: `let t = s;` เมื่อ s เป็น String — หลังบรรทัดนี้ใครใช้งานข้อมูลได้บ้าง?",
    "payload": {
      "svg": "mem2",
      "choices": [
        "มีแต่ t — s หมดสิทธิ์ทันที (ย้ายหัว ptr/len/cap ให้ t คนเดียว)",
        "ทั้ง s และ t — ก๊อปหัวใหม่ให้กัน",
        "มีแต่ s — t เป็นแค่ชื่อชั่วคราว",
        "ไม่มีใคร — ข้อมูลถูกลบทันที"
      ],
      "answer": 0
    },
    "explain": "move ของ String = ก๊อป **หัว** (ptr/len/cap — 24 bytes บน stack) ให้ t แล้ว mark ว่า s ใช้ไม่ได้ — bytes บน heap **ไม่ก๊อป** (ยังก้อนเดิม) — เร็วและชัดเจน: คนเดียวเป็นเจ้าของ เมื่อ t ตายก็คืน heap ก้อนนั้นครั้งเดียว ไม่มี double-free",
    "source": "พื้นฐาน ownership — move บนหน่วยความจำ"
  },
  {
    "id": "q080",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "ชนิดข้อมูลกลุ่มไหนเป็น Copy (assign แล้วตัวเดิมยังใช้ได้)?",
    "payload": {
      "choices": [
        "i32, f64, bool, char, (i32, i32)",
        "String, Vec, i32, bool",
        "ชนิดที่ประกาศ pub ทุกชนิด",
        "ตัวเลขทุกชนิดรวม String ด้วย"
      ],
      "answer": 0
    },
    "explain": "Copy = ก๊อปถูก ๆ ทั้งก้อนได้ (stack ล้วน ไม่มี heap ต้องดูแล): ตัวเลข, bool, char, ตัวชี้แบบ shared ไม่นับ, tuple ที่สมาชิก Copy ครบ · String/Vec มี heap เก็บในการ drop ต้องวางแผน จึงเป็น Clone (ต้องเรียก .clone() เอง) ไม่ใช่ Copy",
    "source": "พื้นฐาน ownership — Copy vs Clone"
  },
  {
    "id": "q081",
    "type": "mcq",
    "cat": "memory",
    "diff": 1,
    "prompt": "Stack ใช้เก็บอะไร และทำงานอย่างไร?",
    "payload": {
      "choices": [
        "ข้อมูลขนาดคงที่ (เลข, หัวของ struct) — เก็บ/เอาออกแบบจานซ้อน (LIFO) เร็วมาก",
        "ข้อมูลทุกชนิด — จอง/คืนตามต้องการช้าหน่อย",
        "ข้อมูลที่จะอยู่ตลอดโปรแกรม",
        "ไฟล์และ socket เท่านั้น"
      ],
      "answer": 0
    },
    "explain": "Stack = กองจาน: ใส่ (push) เอาออก (pop) จากบนเท่านั้น รู้ขนาดล่วงหน้าจึงจัดการเป็นแค่เลื่อนตัวชี้ — เร็วสุดในหน่วยความจำ · ตัวแปรในฟังก์ชัน, พารามิเตอร์, ค่า return ใช้ stack ของแต่ละ call frame",
    "source": "พื้นฐาน memory — stack"
  },
  {
    "id": "q082",
    "type": "mcq",
    "cat": "memory",
    "diff": 1,
    "prompt": "ข้อมูลแบบไหนที่ Rust ต้องเอาไปเก็บบน heap?",
    "payload": {
      "choices": [
        "ข้อมูลที่ขนาดไม่แน่นอนตอน compile หรือโต/หดได้ — เช่น String, Vec",
        "ตัวเลขทุกตัว",
        "ตัวแปรที่ประกาศ let ทั้งหมด",
        "เฉพาะข้อมูลที่ผู้ใช้พิมพ์เข้ามา"
      ],
      "answer": 0
    },
    "explain": "Heap = ห้องเก็บของที่จองเป็นก้อน ๆ ตอนรัน: เหมาะของที่ \"ไม่รู้ขนาดล่วงหน้า\" — String ตัวอักษรเพิ่มได้เรื่อย ๆ, Vec push ได้ไม่จำกัด — แพงกว่า stack (ต้องหาที่ว่าง+จัดการ+ชี้ต่อ) แต่ยืดหยุ่น — หัว (ตัวชี้) อยู่บน stack ชี้เข้า heap",
    "source": "พื้นฐาน memory — heap"
  },
  {
    "id": "q083",
    "type": "memory",
    "cat": "memory",
    "diff": 2,
    "prompt": "ดูแผนภาพหัวใจของ String — ถ้า clone String หนึ่งอัน จะมีอะไรถูกก๊อปบ้าง?",
    "payload": {
      "svg": "mem3",
      "choices": [
        "ก๊อปทั้งหัว (ptr/len/cap) และ bytes ทั้งก้อนบน heap — เป็นก้อนใหม่อิสระ (deep copy)",
        "ก๊อปแค่หัว — ชี้ bytes เดิมร่วมกัน",
        "ก๊อปแค่ len กับ cap",
        "ไม่มีอะไรถูกก๊อป — แค่เปลี่ยนชื่อ"
      ],
      "answer": 0
    },
    "explain": "clone ของ String = deep copy: สร้าง buffer ใหม่บน heap + ก๊อป bytes ทั้งหมด + หัวใหม่ชี้ไป buffer ใหม่ — สองอันแยกกันสนิท แก้อันไหนอีกอันไม่กระเทือน (ต่างจาก Arc::clone ที่แชร์ตัวเดิม — ดูข้อหลัง ๆ)",
    "source": "พื้นฐาน memory — String clone"
  },
  {
    "id": "q084",
    "type": "output",
    "cat": "memory",
    "diff": 1,
    "prompt": "โปรแกรมนี้พิมพ์อะไร?",
    "payload": {
      "code": "fn main() {\n    let mut v = Vec::new();\n    v.push(1);\n    v.push(2);\n    println!(\"{}\", v.len());\n}",
      "choices": [
        "2",
        "0",
        "คอมไพล์ไม่ผ่าน ไม่รู้ชนิด",
        "ขึ้นกับ capacity ที่ได้"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "2"
      }
    },
    "explain": "push สองครั้ง len = 2 — ชนิด infer จาก push(1) ให้เป็น i32 อัตโนมัติ · (สังเกต: Vec::new() ตอนแรก capacity อาจเป็น 0 — ตัวเลข capacity เป็นรายละเอียดการจัดสรร ไม่มีผลกับความถูกต้องของโปรแกรม)",
    "source": "พื้นฐาน memory — Vec growth"
  },
  {
    "id": "q085",
    "type": "mcq",
    "cat": "memory",
    "diff": 3,
    "prompt": "เมื่อ push เข้า Vec จน capacity เต็ม แล้ว push อีกตัว — เกิดอะไรขึ้นกับข้อมูลเดิมบน heap?",
    "payload": {
      "choices": [
        "จองที่ใหม่ใหญ่กว่าเดิม (มัก ×2) แล้ว **ย้าย** ข้อมูลทั้งหมดไป ปล่อยที่เดิม — ที่อยู่ (address) ของข้อมูลเปลี่ยน",
        "ต่อท้ายที่เดิมไปเรื่อย ๆ — address เดิม",
        "ข้อมูลเก่าถูกลบ ต้อง push ใหม่",
        "แจ้ง error ให้ผู้ใช้ขยาย capacity เอง"
      ],
      "answer": 0
    },
    "explain": "Vec โตแบบ amortized: จองใหม่ใหญ่ขึ้น (กฎ ×2 ประมาณ) ย้ายข้อมูลทั้งก้อน แล้วคืนที่เก่า — ที่อยู่ข้อมูลเปลี่ยนได้ นี่คือเหตุผลที่ **ยึด reference ของ element ไว้แล้ว push ต่อไม่ได้** (E0502) เพราะของที่ชี้อยู่อาจย้ายบ้านกลางคัน",
    "source": "พื้นฐาน memory — Vec growth"
  },
  {
    "id": "q086",
    "type": "output",
    "cat": "memory",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (สังเกตลำดับ drop — ตัวแปรประกาศลำดับไหน)",
    "payload": {
      "code": "struct G(&'static str);\nimpl Drop for G {\n    fn drop(&mut self) { print!(\"[{}]\", self.0); }\n}\nfn main() {\n    let a = G(\"A\");\n    let b = G(\"B\");\n    let _ = &a;\n}",
      "choices": [
        "[B][A]",
        "[A][B]",
        "[A]",
        "[B]"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[B][A]"
      }
    },
    "explain": "ตอนจบ scope ตัวแปรถูก drop **ย้อนลำดับการประกาศ** (LIFO เหมือน stack): b ตายก่อน แล้ว a → พิมพ์ [B][A] — กฎเดียวกันกับ frame ของ stack เป๊ะ ๆ — การรู้ลำดับ drop สำคัญเมื่อทรัพยากรพึ่งพากัน (เช่น RAII guard ใน Goose)",
    "source": "พื้นฐาน memory — drop order"
  },
  {
    "id": "q087",
    "type": "output",
    "cat": "memory",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (นับผู้ถือ Arc)",
    "payload": {
      "code": "use std::sync::Arc;\nfn main() {\n    let a = Arc::new(String::from(\"hi\"));\n    let b = Arc::clone(&a);\n    let before = Arc::strong_count(&a);\n    drop(b);\n    let after = Arc::strong_count(&a);\n    println!(\"{} {}\", before, after);\n}",
      "choices": [
        "2 1",
        "1 1",
        "2 2",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "2 1"
      }
    },
    "explain": "Arc = นับจำนวนผู้ถือ: สอง clone = 2 → drop หนึ่ง = 1 → ตัวสุดท้าย (1) ตายเมื่อไหร่ ข้อมูลจึงถูกคืน — เหมือนห้องพักที่เก็บกุญแจใบสุดท้ายไว้ใครคืนกุญแจคนสุดท้ายเป็นคนปิดไฟ",
    "source": "พื้นฐาน memory — Arc refcount"
  },
  {
    "id": "q088",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "Arc::clone(&a) กับ String clone ต่างกันอย่างไร?",
    "payload": {
      "choices": [
        "Arc::clone ก๊อปแค่หัว+เพิ่มตัวนับ — ข้อมูลจริง **ก้อนเดิม** · String clone ก๊อปข้อมูลจริงเป็นก้อนใหม่",
        "เหมือนกัน ทั้งคู่ deep copy",
        "Arc::clone ก๊อปข้อมูลด้วย แต่เร็วกว่า",
        "String clone ไม่ก๊อปอะไรเลย"
      ],
      "answer": 0
    },
    "explain": "Arc::clone ราคาแค่บวกเลขนับ (atomic) — ข้อมูลแชร์กันจริง เหมาะส่งข้าม thread โดยไม่เปลือง · String clone ต้องจอง heap ใหม่+ก๊อปทุก byte — เลือกใช้ตามความหมาย: แชร์อ่าน = Arc, ต้องแยกแก้คนละฉบับ = clone เต็ม",
    "source": "พื้นฐาน memory — Arc vs clone"
  },
  {
    "id": "q089",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "จะแชร์ข้อมูลให้หลาย thread อ่าน/แก้ร่วมกันอย่างปลอดภัย ใช้อะไร?",
    "payload": {
      "choices": [
        "Arc<Mutex<T>> — Arc แชร์ความเป็นเจ้าของ + Mutex กันแก้พร้อมกัน",
        "Rc<T> ธรรมดา — นับผู้ถือเหมือนกัน",
        "Box<T> ส่งต่อกันไปเรื่อย ๆ",
        "static mut — ประกาศครั้งเดียวใช้ได้ทุก thread"
      ],
      "answer": 0
    },
    "explain": "Rc นับด้วยตัวเลขธรรมดา (ไม่ thread-safe — compiler ห้ามส่งข้าม thread) · Arc คือรุ่น atomic ของ Rc ส่งข้าม thread ได้ แต่แก้ข้อมูลต้องผ่าน Mutex/RwLock กันเขียนชนกัน — คู่ Arc<Mutex<T>> คือของมาตรฐาน (เจอใน Goose ทั่ว)",
    "source": "พื้นฐาน memory — Arc vs Rc"
  },
  {
    "id": "q090",
    "type": "output",
    "cat": "memory",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (ข้อมูลใน scope ซ้อน)",
    "payload": {
      "code": "fn main() {\n    let s = String::from(\"outer\");\n    {\n        let t = String::from(\"inner\");\n        println!(\"{} {}\", t.len(), s.len());\n    }\n}",
      "choices": [
        "5 5",
        "5 0",
        "คอมไพล์ไม่ผ่าน s ใช้ใน scope ในไม่ได้",
        "คอมไพล์ผ่าน แต่ t ว่าง"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "5 5"
      }
    },
    "explain": "scope ในเข้าถึงตัวแปรของ scope นอกได้ (s มองเห็น) — t (inner, 5 ตัวอักษร) พิมพ์แล้ว **ถูก drop ทันทีตอนปิด brace** ก่อน s ที่ตายตอนจบ main — scope คือเส้นชีวิตของข้อมูลใน Rust ไม่ต้องรอ GC",
    "source": "พื้นฐาน memory — scope & drop"
  },
  {
    "id": "q091",
    "type": "fill",
    "cat": "memory",
    "diff": 2,
    "prompt": "เติมชื่อฟังก์ชันเพิ่มผู้ถือ Arc อีกหนึ่งคน",
    "payload": {
      "code": "use std::sync::Arc;\nlet v = Arc::new(String::from(\"data\"));\nlet w = Arc::___(&v);\nprintln!(\"{}\", Arc::strong_count(&v));",
      "choices": [
        "clone",
        "copy",
        "share",
        "new"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "Arc::clone(&v) — สไตล์มาตรฐานของ Arc (ชัดเจนกว่า v.clone() ตรง ๆ เพราะรู้ทันทีว่าเป็นการเพิ่มตัวนับ ไม่ใช่ deep copy) — ผลลัพธ์พิมพ์ 2 ผู้ถือ",
    "source": "พื้นฐาน memory — Arc::clone"
  },
  {
    "id": "q092",
    "type": "memory",
    "cat": "memory",
    "diff": 3,
    "prompt": "ดูแผนภาพ Vec โต (capacity เต็มแล้ว push) — บล็อก heap เดิมกลายเป็นอะไร?",
    "payload": {
      "svg": "mem4",
      "choices": [
        "ถูกคืน (freed) — ข้อมูลย้ายไปบล็อกใหม่ที่ใหญ่กว่า หัวของ Vec ชี้ใหม่",
        "ยังอยู่ — ใช้สองบล็อกพร้อมกัน",
        "ถูกลบข้อมูลทิ้ง แต่ที่ยังจองไว้",
        "แปลงเป็น stack อัตโนมัติ"
      ],
      "answer": 0
    },
    "explain": "เมื่อโต: จองบล็อกใหม่ (×2 โดยประมาณ) → ย้ายข้อมูลทั้งหมด → หัวเดิม (ตัวชี้) ถูกแก้ให้ชี้บล็อกใหม่ → บล็อกเก่าคืนให้ระบบ — นี่คือเหตุผลที่ reference เข้า element เก่าจะกลายเป็นชี้หาอะไรที่ไม่มีแล้ว (Rust กันไว้ตอน compile ด้วย borrow checker)",
    "source": "พื้นฐาน memory — Vec growth"
  },
  {
    "id": "q093",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "หัวของ String บน stack มี 24 bytes (ptr 8 + len 8 + cap 8) — ทำไมต้องมีค่า capacity ด้วย?",
    "payload": {
      "choices": [
        "รู้ว่าเติมได้อีกกี่ bytes ก่อนต้องจองใหม่ — push_str ถึงเติมเร็วโดยไม่ย้ายทุกครั้ง",
        "เก็บตำแหน่ง heap สำรอง",
        "จำนวนตัวอักษรภาษาไทย",
        "checksum กันข้อมูลเสียหาย"
      ],
      "answer": 0
    },
    "explain": "capacity = ที่จองไว้จริง, len = ที่ใช้อยู่จริง — ช่องว่าง (cap - len) คือที่ว่างเติมได้ทันทีไม่ต้องย้าย — เหตุผลเดียวกับ Vec growth: จองเผื่อทีละก้อน คุ้มค่ากว่าจองใหม่ทุกตัวอักษร",
    "source": "พื้นฐาน memory — String head"
  },
  {
    "id": "q094",
    "type": "output",
    "cat": "memory",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (Box ย้ายข้อมูลขึ้น heap)",
    "payload": {
      "code": "fn main() {\n    let b = Box::new(7);\n    println!(\"{}\", *b + 1);\n}",
      "choices": [
        "8",
        "7",
        "คอมไพล์ไม่ผ่าน ต้อง deref เองผิดที่",
        "พิมพ์ที่อยู่หน่วยความจำ"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "8"
      }
    },
    "explain": "Box::new(7) เก็บ 7 บน heap แล้ว b ถือตัวชี้บน stack — `*b` deref ดึงค่ามาบวกได้ 8 — Box ใช้เมื่อต้องการ \"ข้อมูลชิ้นนี้อยู่บน heap\" เช่น ค่าใหญ่มาก หรือ type ที่ไม่รู้ขนาดตอน compile (recursive type — ข้อถัดไป)",
    "source": "พื้นฐาน memory — Box"
  },
  {
    "id": "q095",
    "type": "mcq",
    "cat": "memory",
    "diff": 2,
    "prompt": "ใช้ Box<T> เมื่อไหร่? (เลือกเหตุผลหลัก)",
    "payload": {
      "choices": [
        "เมื่อ type มีขนาดไม่แน่นอนตอน compile (recursive type) หรือต้องการย้ายของใหญ่ขึ้น heap",
        "เมื่ออยากให้โค้ดเร็วขึ้นเสมอ",
        "เมื่อต้องการแชร์ข้อมูลหลายเจ้าของ",
        "เมื่อต้องการแก้ข้อมูลจากหลาย thread"
      ],
      "answer": 0
    },
    "explain": "Box = เจ้าของคนเดียวบน heap — งานหลัก: (1) recursive type อย่าง linked list / tree ที่ไม่รู้ขนาด (2) ย้ายข้อมูลก้อนใหญ่ให้ไม่กอง stack · ส่วนแชร์หลายเจ้า = Arc, หลาย thread = Arc+Mutex — เครื่องมือคนละงาน",
    "source": "พื้นฐาน memory — Box"
  },
  {
    "id": "q096",
    "type": "bug",
    "cat": "memory",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "enum List {\n    Cons(i32, List),\n    Nil,\n}\nfn main() {\n    let l = List::Cons(1, List::Nil);\n    let _ = l;\n}",
      "choices": [
        "error[E0072]: enum วนซ้ำตัวเอง (มี List ใน List) ขนาดไม่มีที่สิ้นสุด — ใส่ Box ครอบให้เหลือแค่ตัวชี้",
        "error[E0382]: List ถูกย้าย",
        "error[E0004]: match ไม่ครบ",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0072"
      }
    },
    "explain": "E0072 recursive type has infinite size — จะหาขนาด Cons ต้องรู้ขนาด List ข้างในสืบไปเรื่อย ๆ ไม่จบ — แก้: `Cons(i32, Box<List>)` — Box เป็นตัวชี้ขนาดคงที่ 8 bytes จึงตัดวงจรได้ — นี่คือเหตุผล #1 ที่ linked structure ใน Rust เต็มไปด้วย Box",
    "source": "พื้นฐาน memory — recursive types"
  },
  {
    "id": "q097",
    "type": "output",
    "cat": "memory",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (ขนาดของค่าบน stack)",
    "payload": {
      "code": "use std::mem;\nfn main() {\n    println!(\"{} {} {}\", mem::size_of::<i64>(), mem::size_of::<&i64>(), mem::size_of::<String>());\n}",
      "choices": [
        "8 8 24",
        "8 8 8",
        "8 4 24",
        "ขึ้นกับค่าที่เก็บ"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "8 8 24"
      }
    },
    "explain": "i64 = 8 bytes · reference = ตัวชี้ 8 bytes (ชี้อะไรก็ 8) · String = หัว 3 คำ (ptr/len/cap) = 24 bytes — ขนาดเหล่านี้คงที่ตอน compile ไม่สนขนาดข้อความจริงบน heap — ส่ง String ไปฟังก์ชัน = ก๊อบ 24 bytes สั้น ๆ เท่านั้น (ไม่ใช่ก๊อบทั้งข้อความ)",
    "source": "พื้นฐาน memory — size_of"
  },
  {
    "id": "q098",
    "type": "mcq",
    "cat": "memory",
    "diff": 3,
    "prompt": "ส่ง String เข้าฟังก์ชันแบบ move — ก๊อปข้อมูลเท่าไหร่?",
    "payload": {
      "choices": [
        "ก๊อบแค่หัว 24 bytes (stack) — ข้อความจริงบน heap อยู่ที่เดิม ไม่แตะ",
        "ก๊อบทุก byte ของข้อความ",
        "ไม่ก๊อบอะไรเลย ใช้ตัวเดิมร่วมกัน",
        "ขึ้นกับความยาวข้อความ"
      ],
      "answer": 0
    },
    "explain": "move = ส่งต่อหัว 3 คำ (24 bytes) เท่านั้น — heap ไม่ขยับ (ตัวชี้ยังชี้ก้อนเดิม) — ส่งข้อความยาวล้านตัวอักษรก็แค่ 24 bytes — นี่คือเหตุผลที่ \"ส่งค่าตรง ๆ\" ใน Rustถูกกว่าที่คิด และ clone เต็ม (deep copy) คือคนละเรื่อง",
    "source": "พื้นฐาน memory — move cost"
  },
  {
    "id": "q099",
    "type": "mcq",
    "cat": "goose",
    "diff": 1,
    "prompt": "Goose ใช้ tagged enum (อย่าง MessageContentBlock) เก็บข้อความ/รูป/คำขอเครื่องมือ — ข้อดีเทียบกับ struct คืออะไร?",
    "payload": {
      "choices": [
        "บังคับว่า \"เป็นอย่างใดอย่างหนึ่ง\" + match ต้องครบทุกแบบ — เพิ่ม variant ใหม่ compiler ชี้ทุกจุดที่ต้องอัพเดต",
        "เก็บข้อมูลได้มากกว่า struct",
        "เร็วกว่า struct เสมอเพราะอยู่บน stack",
        "ไม่ต้องกังวลเรื่อง ownership"
      ],
      "answer": 0
    },
    "explain": "enum = \"ป้ายเดียวติดของชิ้นเดียว\" (sum type) — ข้อมูลผิดรูปแบบกันตั้งแต่ type system เช่น ไม่มีทางมี text กับ image พร้อมกันใน block เดียว · match ที่ compiler บังคับให้ครบ = refactor ปลอดภัย เพิ่ม variant แล้วลืมจุดไหน มันบอกหมด (E0004)",
    "source": "บทเรียน Goose · Data Modeling — Tagged Enum"
  },
  {
    "id": "q100",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (match ดึงข้อมูลจาก enum)",
    "payload": {
      "code": "enum Msg {\n    Text(String),\n    Ping(u32),\n}\nfn main() {\n    let m = Msg::Ping(7);\n    match m {\n        Msg::Text(t) => println!(\"ข้อความ {}\", t),\n        Msg::Ping(n) => println!(\"ปิง {}\", n),\n    }\n}",
      "choices": [
        "ปิง 7",
        "Ping(7)",
        "ข้อความ 7",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "ปิง 7"
      }
    },
    "explain": "match + pattern ดึง payload ออกจาก enum ได้ในตัว: `Msg::Ping(n)` ผูก 7 เข้าตัวแปร n — รูปแบบเดียวกับ Goose ตอนแยกแยะ MessageContentBlock::Text/Image/ToolRequest — แต่ละแขนจัดการตามชนิดจริงของข้อมูล ผิดไม่ได้",
    "source": "บทเรียน Goose · Data Modeling — Tagged Enum"
  },
  {
    "id": "q101",
    "type": "bug",
    "cat": "goose",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "enum Mood {\n    Happy,\n    Tired,\n}\nfn main() {\n    let m = Mood::Tired;\n    let s = match m {\n        Mood::Happy => \"ดี\",\n    };\n    let _ = s;\n}",
      "choices": [
        "error[E0004]: match ไม่ครบทุก variant — ลืม Mood::Tired (non-exhaustive)",
        "error[E0308]: แขน match ต้องชนิดเดียวกันเสมอ",
        "error[E0382]: m ถูกย้ายเข้า match",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0004"
      }
    },
    "explain": "E0004 non-exhaustive patterns — match ต้องครบทุกแบบ (หรือมี `_`) — ดูเหมือนเข้มงวดแต่นี่คือเกราะ: เพิ่ม variant ใหม่วันนี้ ทุก match เดิมที่ยังไม่รองรับจะ error ทันที ไม่มี \"ลืมจัดการเงียบ ๆ\" — เหตุผลที่ Goose ปลอดภัยต่อการเติบโตของโค้ด",
    "source": "บทเรียน Goose · Data Modeling — exhaustive match"
  },
  {
    "id": "q102",
    "type": "fill",
    "cat": "goose",
    "diff": 2,
    "prompt": "เติมชื่อ trait ที่ทำให้พิมพ์ผ่าน {} ได้ (เหมือน Display ของ Goose)",
    "payload": {
      "code": "use std::fmt::Display;\nstruct Agent(&'static str);\nimpl ___ for Agent {\n    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {\n        write!(f, \"Agent {}\", self.0)\n    }\n}\nfn main() {\n    println!(\"{}\", Agent(\"goose\"));\n}",
      "choices": [
        "Display",
        "Debug",
        "ToString",
        "Print"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "impl Display = สอน println! ว่าจะแสดงค่านี้กับมนุษย์อย่างไร (เรียก \"Agent goose\") — Goose implement Display ให้ข้อมูลเกือบทุกชนิดที่โดนพิมพ์ เพื่อ log/UI อ่านง่ายโดยไม่ต้องเขียนโค้ด format ซ้ำทุกจุด · Debug (จาก derive) คือฝั่งโปรแกรมเมอร์ {:?}",
    "source": "บทเรียน Goose · Data Modeling — impl Display"
  },
  {
    "id": "q103",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "ทำไม Goose เลือก implement Display ให้ข้อมูล แทนการเขียนเมธอด to_display_string() เองทีละจุด?",
    "payload": {
      "choices": [
        "Display เป็นมาตรฐาน — ใช้ได้กับ {} ทุกที่ (println, format, write!, log) โดยไม่ต้องเรียกเมธอดพิเศษ",
        "เร็วกว่าเพราะ compiler ปรับให้",
        "Display บังคับให้ข้อมูล immutable",
        "to_display_string ชื่อยาวไป"
      ],
      "answer": 0
    },
    "explain": "trait มาตรฐานเข้ากับระบบนิเวศทั้งภาษา: ที่ใดใช้ {} ได้ ข้อมูลเราก็พิมพ์สวยได้ — เขียนครั้งเดียวที่ impl ใช้ได้ทั้ง println!, format!, eprintln!, ไลบรารี log — นี่คือพลังของ \"สัญญามาตรฐาน\" ที่ trait ให้",
    "source": "บทเรียน Goose · Data Modeling — impl Display"
  },
  {
    "id": "q104",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (fluent setter แบบ Goose AgentConfig)",
    "payload": {
      "code": "struct Conf {\n    model: String,\n    temp: f32,\n}\nimpl Conf {\n    fn new(model: &str) -> Self {\n        Conf { model: model.into(), temp: 0.0 }\n    }\n    fn with_temp(mut self, t: f32) -> Self {\n        self.temp = t;\n        self\n    }\n}\nfn main() {\n    let c = Conf::new(\"gpt\").with_temp(0.5);\n    println!(\"{} {}\", c.model, c.temp);\n}",
      "choices": [
        "gpt 0.5",
        "gpt 0",
        "คอมไพล์ไม่ผ่าน",
        "ยังใช้ไม่ได้ เพราะ new ไม่คืน Self"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "gpt 0.5"
      }
    },
    "explain": "สูตร with_* 3 จุด: รับ `mut self` (ยึดทั้งก้อนมาแก้) → ตั้งค่า → คืน `self` — โซ่ต่อกันได้: new().with_temp().with_x()... อ่านเป็นประโยคเดียว — Goose ใช้แทน derive Builder เพราะควบคุม validation และ default ได้ตรงจุด",
    "source": "บทเรียน Goose · Data Modeling — Fluent Setter"
  },
  {
    "id": "q105",
    "type": "bug",
    "cat": "goose",
    "diff": 2,
    "prompt": "fluent setter ตัวนี้พังตรงไหน?",
    "payload": {
      "code": "struct Conf {\n    temp: f32,\n}\nimpl Conf {\n    fn new() -> Self {\n        Conf { temp: 0.0 }\n    }\n    fn with_temp(mut self, t: f32) -> Self {\n        self.temp = t;\n    }\n}\nfn main() {\n    let c = Conf::new().with_temp(0.5);\n    let _ = c;\n}",
      "choices": [
        "error[E0308]: ฟังก์ชันบอกว่าคืน Self แต่บรรทัดสุดท้ายไม่มี self — ลืมคืน self (ผิดประเภท)",
        "error[E0382]: self ถูกย้ายก่อนตั้งค่า",
        "error[E0596]: self ไม่ใช่ mut",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0308"
      }
    },
    "explain": "ปิดวงเล็บฟังก์ชันด้วย `self.temp = t;` ทำให้ Rust ถือว่าคืน **() ไม่ใช่ Self** — E0308 — บั๊กคลาสสิกของ with_* (M1 ของเกมนี้ก็มีข้อ E0609 อีกรูปแบบ) — จำ: บรรทัดสุดท้ายของ with_* ต้องเป็น `self` เปล่า ๆ",
    "source": "บทเรียน Goose · Data Modeling — Fluent Setter"
  },
  {
    "id": "q106",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "trait มี default method (เมธอดที่เขียนเนื้อจริงไว้ให้แล้ว) — Goose ใช้ท่านี้ทำอะไร?",
    "payload": {
      "choices": [
        "เขียน flow หลักไว้ใน trait (Template Method) — implementor แค่ override จุดที่ต่างกัน",
        "บังคับให้ทุกคน implement เหมือนกันหมด",
        "ทำให้ trait รันได้เร็วขึ้น",
        "แทนที่การใช้ struct ได้ทั้งหมด"
      ],
      "answer": 0
    },
    "explain": "default method = \"แม่แบบมีขั้นตอนรออยู่ คนเสียบมาแตะเฉพาะจุดที่เป็นเอกลักษณ์\" — Goose ทำกับ Provider/Extension: flow กลาง (retry, format, timing) อยู่ใน trait ค่าเริ่มต้น ผู้ implement เจาะเฉพาะ call จริง — โค้ดกลางแก้ที่เดียว ทุก implementor ได้ประโยชน์ทันที",
    "source": "บทเรียน Goose · Trait — Default Method (Template Method)"
  },
  {
    "id": "q107",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (default method เรียกเมธอดที่ถูก override)",
    "payload": {
      "code": "trait Greeter {\n    fn name(&self) -> String;\n    fn hello(&self) -> String {\n        format!(\"สวัสดี ฉัน {}\", self.name())\n    }\n}\nstruct Bot;\nimpl Greeter for Bot {\n    fn name(&self) -> String { \"goose\".into() }\n}\nfn main() {\n    println!(\"{}\", Bot.hello());\n}",
      "choices": [
        "สวัสดี ฉัน goose",
        "สวัสดี ฉัน Bot",
        "คอมไพล์ไม่ผ่าน ต้อง implement hello ด้วย",
        "สวัสดี ฉัน "
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "สวัสดี ฉัน goose"
      }
    },
    "explain": "Bot implement แค่ name() — hello() ใช้ของ trait ที่เขียน template ไว้ แล้ว **เรียก name() ผ่าน self ตัวจริง** จึงได้ \"goose\" — นี่คือกลไก Template Method ใน Rust: flow อยู่ที่ trait ข้อมูลอยู่ที่ implementor",
    "source": "บทเรียน Goose · Trait — Default Method"
  },
  {
    "id": "q108",
    "type": "fill",
    "cat": "goose",
    "diff": 3,
    "prompt": "เติมชื่อฟังก์ชันสร้าง Box ของ trait object (แบบ Box<dyn Provider> ใน Goose)",
    "payload": {
      "code": "trait Speak {\n    fn hi(&self) -> String;\n}\nstruct Bot;\nimpl Speak for Bot {\n    fn hi(&self) -> String { \"beep\".into() }\n}\nfn main() {\n    let v: Box<dyn Speak> = Box::___(Bot);\n    println!(\"{}\", v.hi());\n}",
      "choices": [
        "new",
        "from",
        "make",
        "of"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "`Box::new(Bot)` บรรจุ Bot ขึ้น heap แล้วเก็บเป็น trait object `Box<dyn Speak>` — ตอนนี้ v เรียก hi() ได้โดยไม่สน concrete type ข้างใน — รูปแบบเดียวกับ Goose ที่เก็บ provider ทุกยี่ห้อเป็น Arc<dyn Provider>",
    "source": "บทเรียน Goose · Trait — Trait Object Arc<dyn Trait>"
  },
  {
    "id": "q109",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "ทำไมต้องเก็บเป็น `Box<dyn Provider>` / `Arc<dyn Provider>` — ใช้ `Provider` ตรง ๆ ไม่ได้เหรอ?",
    "payload": {
      "choices": [
        "เพราะชนิดจริงของ provider รู้ตอนรัน (OpenAI/Anthropic/...) — dyn คือ \"รู้แค่สัญญา\" จึงเก็บหลายยี่ห้อในตัวแปรชนิดเดียวได้",
        "เพราะ dyn เร็วกว่าเสมอ",
        "เพราะ Provider ขนาดใหญ่เกิน stack",
        "dyn ทำให้ implement ง่ายขึ้น"
      ],
      "answer": 0
    },
    "explain": "`impl Provider` (static dispatch) ต้องรู้ชนิดตอน compile — แต่ระบบ plugin อย่าง Goose โหลด provider ตามคอนฟิกผู้ใช้ รู้ไม่ได้ล่วงหน้า → ต้อง dyn (dynamic dispatch ผ่านตาราง vtable) — จ่ายค่า dispatch นิดหน่อยแลกกับความยืดหยุ่นที่ต้องการจริง",
    "source": "บทเรียน Goose · Trait — Trait Object Arc<dyn Trait>"
  },
  {
    "id": "q110",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "หลักการจัดการ error ของ Goose: thiserror ไว้ที่ boundary ส่วน anyhow ใช้ใน interior — แปลว่าอะไร?",
    "payload": {
      "choices": [
        "ขอบของ crate/โมดูล ส่งออก error ชนิดเจาะจง (แยกแยะได้ ให้ผู้ใช้ match) — ข้างในใช้ error กลาง ๆ พร้อม context สะดวกเขียน",
        "thiserror สำหรับ panic ทั้งโปรแกรม anyhow สำหรับ warning",
        "ใช้ anyhow ทุกที่ จะได้ไม่ต้อง define error",
        "thiserror ดัก error ภายนอก anyhow ดัก bug ภายใน"
      ],
      "answer": 0
    },
    "explain": "สองชั้นตามผู้ใช้ของ error: **ผู้ใช้ API ของเรา** (ต้อง match รู้สาเหตุเจาะจง → thiserror สร้าง enum error พร้อม #[from]) · **โค้ดเราเองข้างใน** (อยากได้ context เร็ว ไม่ต้องแยกชนิด → anyhow โยนต่อ + .context(\"ทำอะไรอยู่\")) — อย่าสลับ: API ที่คืน anyhow ทำให้ผู้ใช้ match ไม่ได้",
    "source": "บทเรียน Goose · Error Handling — thiserror/anyhow"
  },
  {
    "id": "q111",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (error enum มือเปล่าสไตล์ thiserror)",
    "payload": {
      "code": "enum AppError {\n    NotFound(String),\n    Denied,\n}\nfn find(id: u32) -> Result<String, AppError> {\n    if id == 1 { Ok(\"goose\".into()) } else { Err(AppError::NotFound(format!(\"id {}\", id))) }\n}\nfn main() {\n    match find(2) {\n        Ok(s) => println!(\"เจอ {}\", s),\n        Err(AppError::NotFound(m)) => println!(\"ไม่เจอ: {}\", m),\n        Err(AppError::Denied) => println!(\"ห้าม\"),\n    }\n}",
      "choices": [
        "ไม่เจอ: id 2",
        "Err(NotFound(id 2))",
        "ไม่เจอ: id 1",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "ไม่เจอ: id 2"
      }
    },
    "explain": "error เป็น enum เหมือนข้อมูลอื่น: NotFound พกข้อความ มาไหน match ดึงออกใช้ — นี่คือหัวใจของ thiserror (ที่เพิ่มคือ derive ให้ Display/Error อัตโนมัติ) — ผู้เรียกเห็นทางเลือกชัดเจน: เจอ/ไม่เจอพร้อมรายละเอียด/ถูกปฏิเสธ รู้ครบไม่มีหลุด",
    "source": "บทเรียน Goose · Error Handling — error categories"
  },
  {
    "id": "q112",
    "type": "bug",
    "cat": "goose",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร? (โปรดสังเกตชนิด error สองชั้น)",
    "payload": {
      "code": "fn inner() -> Result<i32, String> {\n    Err(\"ล้มเหลว\".into())\n}\nfn outer() -> Result<i32, std::io::Error> {\n    let v = inner()?;\n    Ok(v)\n}\nfn main() {\n    let _ = outer();\n}",
      "choices": [
        "error[E0277]: ใช้ `?` โยน String ต่อในฟังก์ชันที่คืน io::Error ไม่ได้ — ไม่มี From<String> สำหรับ io::Error ให้แปลงอัตโนมัติ",
        "error[E0382]: String ถูกย้ายก่อนส่งคืน",
        "error[E0308]: `?` ใช้กับ Result ไม่ได้",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0277"
      }
    },
    "explain": "`?` ทำงานได้เมื่อ error ของฟังก์ชันข้างใน **แปลงเป็น** error ของฟังก์ชันข้างนอกได้ (ผ่าน From) — io::Error ไม่รู้จัก String จึง E0277 · แก้: ให้ outer คืน error เดิม String, หรือ define AppError ที่ impl From<String> (นี่คือสิ่งที่ thiserror #[from] ทำให้อัตโนมัติ)",
    "source": "บทเรียน Goose · Error Handling — From & ? operator"
  },
  {
    "id": "q113",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "Exponential Backoff + Jitter (แบบ Goose configurable) — jitter สุ่มเติมทุกครั้งทำเพื่ออะไร?",
    "payload": {
      "choices": [
        "กันทุก client retry พร้อมกันเป๊ะ ๆ (thundering herd) — กระจายเวลาให้เฉลี่ยออก",
        "ทำให้การ retry เร็วขึ้นโดยรวม",
        "ลดจำนวนครั้งที่ต้อง retry",
        "ป้องกัน memory leak"
      ],
      "answer": 0
    },
    "explain": "backoff เพิ่มเวลารอทวีคูณ (1s, 2s, 4s...) แต่ถ้าทุกคนคิดเลขเดียวกัน ทุกคนพุ่งเข้า server พร้อมกันทุกรอบ — jitter สุ่มเติมให้แต่ละ client ต่างเวลากัน กระจายโหลด — รายละเอียดเหล่านี้ Goose ทำเป็น config ได้ (backoff configurable)",
    "source": "บทเรียน Goose · Error Handling — Exponential Backoff + Jitter"
  },
  {
    "id": "q114",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (retry loop แบบ backoff)",
    "payload": {
      "code": "fn main() {\n    let mut delay = 1;\n    let mut tries = 0;\n    while tries < 3 {\n        tries += 1;\n        if tries == 3 {\n            break;\n        }\n        delay *= 2;\n    }\n    println!(\"สำเร็จรอบ {} delay {}\", tries, delay);\n}",
      "choices": [
        "สำเร็จรอบ 3 delay 4",
        "สำเร็จรอบ 3 delay 1",
        "สำเร็จรอบ 2 delay 4",
        "ลูปไม่จบ"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "สำเร็จรอบ 3 delay 4"
      }
    },
    "explain": "พลาด 2 รอบแรก (delay 1→2→4 ทวีคูณ) รอบ 3 สำเร็จ break — โครง retry จริงของ Goose ซับซ้อนกว่า (สุ่ม jitter + config) แต่แกนคือ: นับครั้ง, รอทวีคูณ, จบเมื่อสำเร็จ/ครบโควตา",
    "source": "บทเรียน Goose · Error Handling — Backoff"
  },
  {
    "id": "q115",
    "type": "order",
    "cat": "goose",
    "diff": 3,
    "prompt": "เรียงบรรทัดให้เป็น operation pipeline มินิมัล (trait กำหนดสัญญา → struct → impl → เรียกใช้ พิมพ์ 42)",
    "payload": {
      "lines": [
        "trait Op { fn run(&self, i: i32) -> i32; }",
        "struct Double;",
        "impl Op for Double { fn run(&self, i: i32) -> i32 { i * 2 } }",
        "fn main() { println!(\"{}\", Double.run(21)); }"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "verify": {
        "kind": "orderOutput",
        "expected": "42"
      }
    },
    "explain": "ลำดับสถาปัตยกรรมที่ Rust บังคับ: ประกาศ trait (สัญญา) ก่อน → struct ข้อมูล → impl trait ให้ struct → โค้ดใช้งาน — โครงเดียวกับ State Machine Pipeline ของ Goose (Operation trait + default Noop) ที่ต่อขั้นตอนเป็นสายพาน",
    "source": "บทเรียน Goose · Metaprogramming — State Machine Pipeline"
  },
  {
    "id": "q116",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "Null Object default (อย่าง Noop ใน pipeline ของ Goose) คือการทำอะไร?",
    "payload": {
      "choices": [
        "สร้าง object ที่ \"ไม่ทำอะไร\" ใช้แทน None — ผู้เรียกไม่ต้อง if/unwrap ทุกจุด โค้ดเรียบขึ้น",
        "คืน null ให้ผู้เรียกจัดการเอง",
        "panic ทันทีเมื่อขั้นตอนว่าง",
        "ลัดขั้นตอนที่เหลือทั้งหมด"
      ],
      "answer": 0
    },
    "explain": "แทนที่จะมี Option<Op> แล้วทุก caller เช็ค if let ก่อนเรียก ก็สร้าง Noop ที่ implement Op โดย return ค่าเดิมตรง ๆ — \"ทุกขั้นเป็น Op เสมอ\" โค้ด pipeline ไม่มีทางแยก — ลดจุด panic/unwrap และทำให้ compose ง่าย",
    "source": "บทเรียน Goose · Metaprogramming — Null Object"
  },
  {
    "id": "q117",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "Goose ใช้ OnceLock/LazyLock เก็บ global config — ข้อดีเทียบกับ static mut หรือ init ทุกครั้งคือ?",
    "payload": {
      "choices": [
        "สร้างครั้งเดียวครั้งแรกที่ใช้ (lazy) ปลอดภัยข้าม thread โดยไม่ต้องล็อกเอง",
        "เร็วกว่า heap ทุกกรณี",
        "ไม่ต้องประกาศชนิดข้อมูล",
        "ทำให้โค้ดทดสอบง่ายขึ้นเสมอ"
      ],
      "answer": 0
    },
    "explain": "static mut เป็น unsafe (หลาย thread เขียนพร้อมกัน = data race) · init ทุกครั้งเปลือง — OnceLock ให้ทั้งสองอย่าง: ค่าแรกที่เข้าไป set ชนะ คนอื่นได้ค่าเดียวกัน ปลอดภัยอัตโนมัติ — โมเดลสมอง: \"ห้องน้ำสาธารณะที่ประตูล็อกให้คนแรกจนเสร็จ\"",
    "source": "บทเรียน Goose · Metaprogramming — OnceLock lazy singleton"
  },
  {
    "id": "q118",
    "type": "output",
    "cat": "goose",
    "diff": 2,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (OnceLock เรียกสองครั้ง)",
    "payload": {
      "code": "use std::sync::OnceLock;\nstatic CFG: OnceLock<u32> = OnceLock::new();\nfn main() {\n    let a = CFG.get_or_init(|| 42);\n    let b = CFG.get_or_init(|| 99);\n    println!(\"{} {}\", a, b);\n}",
      "choices": [
        "42 42",
        "42 99",
        "99 42",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "42 42"
      }
    },
    "explain": "get_or_init ครั้งแรกรัน closure ได้ 42 และ **ตรึงค่าถาวร** — ครั้งที่สอง closure ไม่ถูกเรียกเลย ได้ 42 เหมือนเดิม — หลักคิดเดียวกับ Config::global() ของ Goose: คอนฟิกถูกสร้างครั้งเดียวตั้งแต่จุดแรกแล้วทุกคนแชร์ค่าเดียวกัน",
    "source": "บทเรียน Goose · Metaprogramming — OnceLock"
  },
  {
    "id": "q119",
    "type": "mcq",
    "cat": "goose",
    "diff": 1,
    "prompt": "macro_rules! ต่างจาก fn ตรงไหน?",
    "payload": {
      "choices": [
        "macro สร้าง/แปลงโค้ดตอน compile (เขียน Rust ที่เขียน Rust) รับจำนวน argument ได้ยืดหยุ่น",
        "macro รันเร็วกว่า fn เพราะ inline",
        "macro ใช้ได้เฉพาะตอน release build",
        "fn ต้องมีชนิดข้อมูล macro ไม่ต้องมีโค้ด"
      ],
      "answer": 0
    },
    "explain": "macro = แม่แบบโค้ด: รับ pattern แล้วแตกออกเป็นโค้ดจริงก่อน compile — เลยยืดหยุ่นกว่า fn (จำนวน/รูปร่าง argument ผันได้ เช่น println!, vec!, format!) — Goose ใช้ declarative macro สร้าง typed config ทั้งชุดจากประโยคเดียว",
    "source": "บทเรียน Goose · Metaprogramming — Declarative Macro"
  },
  {
    "id": "q120",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (macro แบบง่าย)",
    "payload": {
      "code": "macro_rules! twice {\n    ($e:expr) => {\n        $e;\n        $e;\n    };\n}\nfn main() {\n    let mut n = 0;\n    twice!(n += 1);\n    println!(\"{}\", n);\n}",
      "choices": [
        "2",
        "1",
        "0",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "2"
      }
    },
    "explain": "`twice!(n += 1)` ขยายเป็น `n += 1; n += 1;` ก่อน compile — โค้ดถูก \"พิมพ์ซ้ำ\" ให้เอง ได้ 2 — เห็นแก่นของ macro ชัดที่สุด: จับ pattern $e แล้วแทนที่ตามแม่แบบ (จงใจเขียน call แบบ `twice!(...)` ไม่มี semicolon ข้างใน เพราะ $e จับแค่ expression เดียว)",
    "source": "บทเรียน Goose · Metaprogramming — macro_rules!"
  },
  {
    "id": "q121",
    "type": "fill",
    "cat": "goose",
    "diff": 2,
    "prompt": "เติมในแม่แบบ macro ให้ square ยกกำลังสองถูกต้อง (พิมพ์ 36)",
    "payload": {
      "code": "macro_rules! sq {\n    ($e:expr) => { $e * ___ };\n}\nfn main() {\n    let v = sq!(6);\n    println!(\"{}\", v);\n}",
      "choices": [
        "$e",
        "$x",
        "e",
        "$arg"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "ตัวแปร macro ต้องเรียกชื่อเดียวกับที่จับไว้: `$e` ถูกจับ → ใช้ `$e` ทั้งสองจุด = 6 * 6 = 36 — ตัวอื่น ($x, e, $arg) ไม่มีอยู่ จะ compile ไม่ผ่าน — สังเกต $ คือธงของ \"ตัวแปร macro\" ไม่ใช่ตัวแปรปกติ",
    "source": "บทเรียน Goose · Metaprogramming — macro rules"
  },
  {
    "id": "q122",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "สถาปัตยกรรม Event-Driven ของ Goose (AgentEvent + Emitter) — ข้อดีคือ?",
    "payload": {
      "choices": [
        "ผู้ผลิตเหตุการณ์กับผู้บริโภค (UI, log, analytics) แยกกัน — เพิ่ม/ถอดผู้ฟังโดยไม่แก้โค้ดแหล่งเหตุการณ์",
        "โค้ดเร็วขึ้นเพราะใช้ event",
        "ไม่ต้องจัดการ error อีกต่อไป",
        "ทำให้ทุกฟังก์ชัน async อัตโนมัติ"
      ],
      "answer": 0
    },
    "explain": "Agent ระดับแกนกลาง (start, message, tool) ปล่อย event ผ่าน emitter — UI ฟังวาดหน้าจอ, logger ฟังเขียนไฟล์, telemetry ฟังส่งขึ้นเมฆ: ทั้งหมดเสียบ/ถอดได้อิสระ — แหล่งเหตุการณ์ไม่รู้จักผู้ฟังเลย (loose coupling) คือหัวใจของสถาปัตยกรรมนี้",
    "source": "บทเรียน Goose · Async — Event-Driven Core"
  },
  {
    "id": "q123",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "หลัก \"เลือก channel ตามความหมายของข้อมูล\" — UI อยากรู้ \"ค่าปัจจุบันล่าสุด\" ของสถานะ (เก่าไม่สำคัญ) ใช้ channel แบบไหน?",
    "payload": {
      "choices": [
        "watch — เก็บค่าล่าสุดค่าเดียว มาใหม่ทับเก่า ผู้มาช้าก็เห็นค่าปัจจุบันทันที",
        "mpsc — ต่อคิวทีละข้อความ ไม่พลาดสักข้อ",
        "broadcast — ทุกคนต้องได้ทุกข้อความตั้งแต่ต้น",
        "ไม่ต้องใช้ channel เขียนไฟล์แล้วอ่านกลับ"
      ],
      "answer": 0
    },
    "explain": "watch = \"กระดานไฟป้าย\": เห็นแค่ค่าล่าสุด ตัวใหม่ทับเก่า เหมาะสถานะ/ความคืบหน้า · mpsc = \"สายพานส่งของ\" ทีละชิ้นไม่หล่น เหมาะงานที่ข้อความทุกข้อสำคัญ · broadcast = \"วิทยุ\" หลายผู้รับพร้อมกัน — เลือกตาม **ความหมายของข้อมูล** ไม่ใช่ความคุ้นเคย",
    "source": "บทเรียน Goose · Async — เลือก channel ตามความหมาย"
  },
  {
    "id": "q124",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "Goose ใช้ interval + MissedTickBehavior::Skip ตอน batch output — มันแก้ปัญหาอะไร?",
    "payload": {
      "choices": [
        "ตอนโปรแกรมติดขัดแล้วมาต่อ ไม่ต้องไล่ยิง tick ที่ค้างทั้งหมด — ข้ามไป tick ถัดไปเลย (กัน backpressure สะสม)",
        "ทำให้ interval แม่นยำระดับนาโนวินาที",
        "หยุดโปรแกรมเมื่อ output ช้าเกิน",
        "รวมข้อความซ้ำให้เหลืออันเดียว"
      ],
      "answer": 0
    },
    "explain": "interval ปกติ: ถ้า consumer ติด 1 วิ แต่ tick ทุก 10ms เมื่อคลายจะยิง catch-up รัว ๆ (100 ครั้งพร้อมกัน) — Skip = ข้าม tick ที่พลาดไป รอ tick ใหม่ — ระบบ streaming ของ Goose ใช้คู่กับ batching เพื่อ UI ลื่นแม้โหลดหนัก",
    "source": "บทเรียน Goose · Async — Backpressure/Batching"
  },
  {
    "id": "q125",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "Type-erased Handler Registry ของ Goose — โครงสร้างข้อมูลหลักคืออะไร?",
    "payload": {
      "choices": [
        "HashMap<String, Arc<dyn Handler>> — ตารางชื่อ → ตัวจัดการ (ไม่รู้ชนิดจริง รู้แค่สัญญา)",
        "Vec<Handler> — เก็บทุก handler เรียงลำดับ",
        "ตัวแปร static หนึ่งตัวต่อ handler",
        "match ยักษ์กับชื่อ handler ใน main"
      ],
      "answer": 0
    },
    "explain": "registry = สมุดโทรศัพท์: คีย์เป็นชื่อ ค่าเป็น trait object — เพิ่ม handler ใหม่ = ลงทะเบียนหนึ่งบรรทัด ไม่ต้องแก้ match กลาง — เทคนิคเดียวกับ extension system ของ Goose ที่โหลดปลั๊กอินตามชื่อ",
    "source": "บทเรียน Goose · Trait — Type-erased Handler Registry"
  },
  {
    "id": "q126",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "Blanket impl คืออะไร?",
    "payload": {
      "choices": [
        "implement trait ให้ **ทุก type ที่มีเงื่อนไข** เช่น impl<T: Display> MyTrait for T — ไม่ต้อง impl ทีละ type",
        "implement ให้ทุก type โดยไม่มีเงื่อนไขเลย",
        "ลบ impl เดิมทั้งหมดแล้วเขียนใหม่",
        "implement ให้แค่ type ใน crate เดียวกัน"
      ],
      "answer": 0
    },
    "explain": "blanket = \"ผ้าห่มคลุมทุกตัวที่ผ่านเงื่อนไข\": เขียนครั้งเดียวทุก type ที่ implement Display ได้ความสามารถใหม่อัตโนมัติ — Goose ใช้เพิ่มความสามารถให้ implementor ทั้งปวงโดยไม่แตะ trait เดิม — ข้อควรระวัง: ครอบกว้างมากจะชนกับ impl อื่น (coherence)",
    "source": "บทเรียน Goose · Trait — Blanket Impl"
  },
  {
    "id": "q127",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (blanket impl ทำงาน)",
    "payload": {
      "code": "trait Speak {\n    fn speak(&self) -> String;\n}\ntrait Loud {\n    fn loud(&self) -> String;\n}\nimpl<T: Speak> Loud for T {\n    fn loud(&self) -> String {\n        self.speak().to_uppercase()\n    }\n}\nstruct Cat;\nimpl Speak for Cat {\n    fn speak(&self) -> String { \"meow\".into() }\n}\nfn main() {\n    println!(\"{}\", Cat.loud());\n}",
      "choices": [
        "MEOW",
        "meow",
        "คอมไพล์ไม่ผ่าน Cat ไม่ได้ impl Loud",
        "คอมไพล์ผ่าน แต่ loud() คืนค่าว่าง"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "MEOW"
      }
    },
    "explain": "Cat implement แค่ Speak — แต่ blanket impl มอบ Loud ให้ทุก T: Speak อัตโนมัติ → Cat.loud() ได้ MEOW โดยไม่เคยเขียน impl Loud for Cat เลย — พลังของ \"ครอบทีเดียว ครบทุกตัว\"",
    "source": "บทเรียน Goose · Trait — Blanket Impl"
  },
  {
    "id": "q128",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "Associated Constants ใน trait (เช่น const NAME) — Goose ใช้ประโยชน์แบบไหน?",
    "payload": {
      "choices": [
        "ให้ทุก implementor ประกาศค่าคงที่ของตัวเอง (ชื่อ/รุ่น) แล้ว trait เรียกใช้ผ่าน Self::CONST — trait รู้จักตัวเองโดยไม่ต้องมี instance",
        "เก็บค่าที่เปลี่ยนตลอดเวลาได้",
        "ทำให้ประหยัด memory เพราะไม่ต้องสร้าง object",
        "แทนที่ตัวแปร global ทั้งโปรแกรม"
      ],
      "answer": 0
    },
    "explain": "const ใน trait = ช่องกรอกที่ \"ต่อ type\" — เช่น Provider กำหนด const DEFAULT_MODEL แล้วแต่ละราย (OpenAI/Anthropic) ใส่ค่าตัวเอง — โค้ดกลางเรียก Self::DEFAULT_MODEL ได้แม้ยังไม่มี instance — compile-time รู้ค่าทันที ไม่มีค่าใช้จ่ายรันไทม์",
    "source": "บทเรียน Goose · Trait — Associated Constants"
  },
  {
    "id": "q129",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (associated const + default method)",
    "payload": {
      "code": "trait Provider {\n    const NAME: &'static str;\n    fn label(&self) -> String {\n        format!(\"[{}]\", Self::NAME)\n    }\n}\nstruct OpenAI;\nimpl Provider for OpenAI {\n    const NAME: &'static str = \"openai\";\n}\nfn main() {\n    println!(\"{}\", OpenAI.label());\n}",
      "choices": [
        "[openai]",
        "[OpenAI]",
        "[]",
        "คอมไพล์ไม่ผ่าน ต้อง impl label ด้วย"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[openai]"
      }
    },
    "explain": "OpenAI กรอกแค่ NAME — label() ของ trait ใช้ Self::NAME ได้เลย ได้ \"[openai]\" — ผสมกลไกสองตัว: associated const (ค่าต่อ type) + default method (flow กลาง) — โครงเดียวกับ provider ของ Goose ที่ label มาตรฐานแต่ชื่อต่างกันตามราย",
    "source": "บทเรียน Goose · Trait — Associated Constants"
  },
  {
    "id": "q130",
    "type": "bug",
    "cat": "goose",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "struct Agent(&'static str);\nfn main() {\n    let s = format!(\"{}\", Agent(\"goose\"));\n    println!(\"{}\", s);\n}",
      "choices": [
        "error[E0277]: Agent ไม่ได้ implement Display — ใช้กับ {} ไม่ได้ (ต้อง impl เอง หรือใช้ {:?} + derive Debug)",
        "error[E0507]: Agent ถูกย้ายเข้า format!",
        "error[E0382]: borrow of moved value",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0277"
      }
    },
    "explain": "{} เรียก Display, {:?} เรียก Debug — ไม่มีอันไหน ไม่พิมพ์ (E0277) — struct ธรรมดาไม่มี Display อัตโนมัติเพราะ Rust ไม่เดาว่าคุณอยากแสดงอะไร — แก้: derive(Debug) + {:?} สำหรับ dev หรือ impl Display สำหรับผู้ใช้จริง (แนวทาง Goose)",
    "source": "บทเรียน Goose · Data Modeling — Display vs Debug"
  },
  {
    "id": "q131",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "Graceful Degrad ของ Goose (keyring เก็บ secret ไม่ได้ → FallbackToFileStorage) — หัวใจของ pattern นี้คือ?",
    "payload": {
      "choices": [
        "ระบบหลักใช้ไม่ได้แล้ว ตกชั้นไปทางเลือกที่ยังใช้ได้ — พร้อม error type ที่แยกสาเหตุชัดเจน",
        "ลองใหม่จนกว่าจะสำเร็จ",
        "แจ้งผู้ใช้ให้แก้ปัญหาเอง",
        "ปิดโปรแกรมทันทีเพื่อความปลอดภัย"
      ],
      "answer": 0
    },
    "explain": "สิ่งที่ทำให้ \"ตกชั้น\" นี้ดี (ไม่ใช่กลบเกลื่อนปัญหา): 1) ความสามารถลดลงแต่ระบบยังเดินได้ 2) error enum แยกว่าเก็บที่ไหน/ทำไมพลาด — ผู้ใช้ได้ฟีเจอร์ ไม่ใช่ความเงียบ — สังเกตว่ามันตรงข้ามกับ retry (ลองซ้ำ) เป็นคนละสถานการณ์",
    "source": "Goose code review · Pattern Catalog — Graceful degradation"
  },
  {
    "id": "q132",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "RAII guard (อย่าง tempfile::TempDir, KillOnDrop ที่ Goose ใช้) — ทำไมถึงปลอดภัยกว่าเรียก cleanup() เอง?",
    "payload": {
      "choices": [
        "cleanup ผูกกับการ \"ตาย\" ของ object (Drop) — แม้ return เร็ว/เกิด panic ข้างบน ก็ถูกเก็บกวาดเสมอ",
        "เร็วกว่าเพราะ OS ทำให้",
        "กัน memory leak เท่านั้น ไม่เกี่ยวไฟล์",
        "ไม่ต้องระบุชื่อไฟล์ตอนสร้าง"
      ],
      "answer": 0
    },
    "explain": "RAII = ทรัพยากรมีชีวิตผูกกับ object: TempDir ถูก drop เมื่อไหร่ (ออกจาก scope/panic/return) โฟลเดอร์ถูกลบทันที — เขียน cleanup() เองต้องนึกครบทุกทางออก (ทุก early return, ทุก ?) ซึ่งเผอิญลืมง่ายมาก — Rust ทำให้ \"ลืมก็ไม่พัง\"",
    "source": "Goose code review · Pattern Catalog — RAII guard"
  },
  {
    "id": "q133",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (builder แบบ SearchPaths ของ Goose)",
    "payload": {
      "code": "struct Paths {\n    npm: bool,\n    home: bool,\n}\nstruct PathBuilder {\n    npm: bool,\n    home: bool,\n}\nimpl Paths {\n    fn builder() -> PathBuilder {\n        PathBuilder { npm: false, home: false }\n    }\n}\nimpl PathBuilder {\n    fn with_npm(mut self) -> Self { self.npm = true; self }\n    fn with_home(mut self) -> Self { self.home = true; self }\n    fn build(self) -> Paths { Paths { npm: self.npm, home: self.home } }\n}\nfn main() {\n    let p = Paths::builder().with_home().build();\n    println!(\"{} {}\", p.npm, p.home);\n}",
      "choices": [
        "false true",
        "true true",
        "false false",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "false true"
      }
    },
    "explain": "เรียกแค่ with_home() → home = true, npm คง default false — builder แยกเฟส: ประกอบค่า (builder) → ตรวจ/แปลง → build() ออกเป็นชิ้นงานจริง — ผู้ใช้เลือกแค่ที่ต้องการ ส่วนที่ไม่พูดถึงคือ default ที่ออกแบบไว้ดี",
    "source": "Goose code review · Pattern Catalog — Builder"
  },
  {
    "id": "q134",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "ทำไม Goose เขียน fluent setter เอง (with_*) แทนที่จะ derive Builder จาก crate?",
    "payload": {
      "choices": [
        "ควบคุม validation/default/ลำดับได้ตรงจุด ไม่ต้องแบก dependency + พฤติกรรมของ proc-macro ภายนอก",
        "derive Builder ใช้ไม่ได้กับ struct ที่มี String",
        "fluent setter เร็วกว่าถึง 10 เท่า",
        "เพราะ Rust ห้ามใช้ crate ภายนอก"
      ],
      "answer": 0
    },
    "explain": "ทุก dependency = ต้นทุน (อัพเดต, supply-chain, พฤติกรรมที่ควบคุมไม่ได้) — งานของ Goose มี validation และ default พิเศษ จึงเขียน with_* เอง 20 บรรทัดจบ อ่านได้ debug ง่าย — \"เขียนเองเมื่อต้องการความแม่นยำ ใช้ crate เมื่อปัญหา generic จริง ๆ\"",
    "source": "บทเรียน Goose · Data Modeling — Fluent Setter"
  },
  {
    "id": "q135",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "Goose ใช้ #[cfg(windows)] / #[cfg(unix)] หนาแน่นใน shell.rs — สิ่งนี้คือกลไกอะไร?",
    "payload": {
      "choices": [
        "Platform abstraction — compiler เลือกโค้ดตาม OS เป้าหมายตอน build (โค้ดอีกฝั่งไม่ถูกคอมไพล์เลย)",
        "runtime เลือก branch ตามเครื่องที่รัน",
        "ทดสอบโค้ดสองรุ่นพร้อมกันใน CI",
        "ทำให้ binary รันได้ทุก OS ไฟล์เดียว"
      ],
      "answer": 0
    },
    "explain": "cfg = กิ่งของต้นไม้ที่ถูกตัดตอน compile: build บน Windows ได้เฉพาะโค้ดฝั่ง windows — ไม่มีค่าใช้จ่ายรันไทม์ · แลกมาด้วยการดูแลสองทาง (cfg-garden ต้องมี comment ดี ๆ อธิบาย — Goose ทำไว้ครบตาม review)",
    "source": "Goose code review · Pattern Catalog — Platform abstraction"
  },
  {
    "id": "q136",
    "type": "output",
    "cat": "goose",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (ชั้นฆ่าเชื้อข้อมูล telemetry แบบ sanitize ของ Goose)",
    "payload": {
      "code": "fn sanitize(v: &str) -> String {\n    if v.starts_with(\"sk-\") {\n        \"***\".into()\n    } else {\n        v.to_string()\n    }\n}\nfn main() {\n    let keys = vec![\"sk-abc\", \"plain\"];\n    let out: Vec<String> = keys.iter().map(|k| sanitize(k)).collect();\n    println!(\"{:?}\", out);\n}",
      "choices": [
        "[\"***\", \"plain\"]",
        "[\"sk-abc\", \"plain\"]",
        "[\"***\", \"***\"]",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "[\"***\", \"plain\"]"
      }
    },
    "explain": "ค่าที่เข้าลวดลาย secret (ขึ้นต้น sk-) ถูกแปลงเป็น *** ก่อนออกจากระบบ — Goose ทำแบบ recursive ทั้ง JSON tree ก่อนส่ง telemetry — หลักคิด: ตรวจที่ **ชั้นเดียวทุกทางออก** ดีกว่านึกถึงทุกจุดที่ข้อมูลไหลผ่าน",
    "source": "Goose code review · Pattern Catalog — Telemetry sanitization"
  },
  {
    "id": "q137",
    "type": "mcq",
    "cat": "syntax",
    "diff": 1,
    "prompt": "thread::spawn รับอะไรเป็น argument?",
    "payload": {
      "choices": [
        "closure — โค้ดที่จะรันใน thread ใหม่",
        "ชื่อไฟล์โค้ด",
        "ฟังก์ชันชื่อเดียวกับ thread",
        "ไม่ต้องมี argument"
      ],
      "answer": 0
    },
    "explain": "`thread::spawn(|| { ... })` รับ closure แล้วเปิด thread ใหม่รันทันที (ไม่รอ) — คืน JoinHandle ไว้รอผล (join) — closure คือ \"ส่งโค้ดเป็นค่า\" ใน Rust ใช้ทั่ว: iterator, thread, callback",
    "source": "Cookbook · Concurrency — spawn"
  },
  {
    "id": "q138",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (spawn คืนค่าผ่าน join)",
    "payload": {
      "code": "use std::thread;\nfn main() {\n    let h = thread::spawn(|| 40 + 2);\n    let v = h.join().unwrap();\n    println!(\"{}\", v);\n}",
      "choices": [
        "42",
        "40",
        "คอมไพล์ไม่ผ่าน closure คืนค่าไม่ได้",
        "พิมพ์ก็ได้ไม่พิมพ์ก็ได้ ไม่แน่นอน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "42"
      }
    },
    "explain": "closure คืน 42 จาก thread ลูก → join() รอจน thread จบแล้วส่งผลกลับมาเป็น Result (Err ถ้าลูก panic) — การรอ join ก่อนพิมพ์ทำให้ลำดับ deterministic — ถ้าไม่ join แล้ว main จบก่อน ลูกจะถูกตัดตาย (ไม่ได้พิมพ์อะไรเลย)",
    "source": "Cookbook · Concurrency — join"
  },
  {
    "id": "q139",
    "type": "bug",
    "cat": "syntax",
    "diff": 2,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร? (ส่งข้อมูลเข้า thread)",
    "payload": {
      "code": "use std::thread;\nfn main() {\n    let msg = String::from(\"hi\");\n    let h = thread::spawn(|| println!(\"{}\", msg));\n    h.join();\n}",
      "choices": [
        "error[E0373]: closure ของ thread อยู่ได้นานกว่าฟังก์ชันแต่ยืม msg — ต้องเติม move ให้ยึดเป็นของตัวเอง",
        "error[E0507]: cannot move out of `msg`",
        "error[E0277]: String ไม่ใช่ Send",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0373"
      }
    },
    "explain": "spawn ต้องการ closure ที่อยู่ได้เกินกว่าฟังก์ชันปัจจุบัน ('static) — แต่ closure นี้ยืม msg ของ main ซึ่งอาจตายก่อน — แก้: `move ||` ยึด msg เข้า thread — นี่คือเหตุผลที่เห็นคำว่า move อยู่หน้า closure ของ spawn เกือบทุกตัวในโค้ดจริง (เช่น Goose)",
    "source": "Cookbook · Concurrency — move closures"
  },
  {
    "id": "q140",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (mpsc channel)",
    "payload": {
      "code": "use std::sync::mpsc;\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    tx.send(1);\n    tx.send(2);\n    let mut sum = 0;\n    while let Ok(n) = rx.try_recv() {\n        sum += n;\n    }\n    println!(\"{}\", sum);\n}",
      "choices": [
        "3",
        "1",
        "0",
        "คอมไพล์ไม่ผ่าน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "3"
      }
    },
    "explain": "mpsc = multi-producer single-consumer: ส่ง (tx.send) สองค่าเข้าคิว รับฝั่งเดียว (rx) ได้ครบ 1+2 = 3 — send/try_recv คืน Result (คิวอาจปิดไปแล้ว) — ในโค้ดจริงมักใช้ `for n in rx` วนรับจน channel ปิด",
    "source": "Cookbook · Concurrency — mpsc channel"
  },
  {
    "id": "q141",
    "type": "fill",
    "cat": "syntax",
    "diff": 2,
    "prompt": "เติมเมธอดส่งค่าเข้า channel",
    "payload": {
      "code": "use std::sync::mpsc;\nfn main() {\n    let (v, rx) = mpsc::channel();\n    v.___(\"ping\");\n    drop(v);\n    println!(\"{:?}\", rx.recv());\n}",
      "choices": [
        "send",
        "push",
        "emit",
        "write"
      ],
      "answer": 0,
      "verify": {
        "kind": "fillCompiles"
      }
    },
    "explain": "tx.send(value) ส่งค่าเข้าคิว (คืน Result) — โค้ดนี้ส่งแล้ว drop ผู้ส่ง จึง recv() ได้ Some(\"ping\") ค่าเดียวแล้ว channel ปิด — ชื่อเมธอดคือ send ตรง ๆ (ผู้ส่ง) / recv (ผู้รับ) ไม่มี push/emit",
    "source": "Cookbook · Concurrency — channel"
  },
  {
    "id": "q142",
    "type": "mcq",
    "cat": "syntax",
    "diff": 2,
    "prompt": "\"mpsc\" ย่อจาก multi-producer, single-consumer — แปลว่าอะไร?",
    "payload": {
      "choices": [
        "ผู้ส่งได้หลายคน ผู้รับหนึ่งเดียว — ของเข้าคิวเดียวกัน ทีละชิ้น",
        "ผู้ส่งหนึ่ง ผู้รับหลายคน แยกสำเนากันหมด",
        "ส่ง-รับแบบ sync เท่านั้น ใช้ async ไม่ได้",
        "คิวไม่มีวันเต็ม"
      ],
      "answer": 0
    },
    "explain": "หลายปากส่ง ปากเดียวรับ: เหมือนกล่องรับเอกสารหน้าห้อง — ใครกีดหย่อนได้ เจ้าหน้าที่คนเดียวเปิดทีละฉบับ (ลำดับรับประกัน) — เหมาะงาน \"รวมงานจากหลายแหล่งเข้าที่เดียว\" เช่น log collector — ต้องการหลายผู้รับ? นั่นคือ broadcast (คนละแชนแนล)",
    "source": "Cookbook · Concurrency — mpsc"
  },
  {
    "id": "q143",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "select! ของ tokio (ที่ Goose ใช้รวม stream) — ทำหน้าที่อะไร?",
    "payload": {
      "choices": [
        "รอหลาย async งานพร้อมกัน ตัวไหนเสร็จก่อนทำอันนั้นก่อน (แข่งกัน ตัวที่ช้าถูกยกเลิกรอบนั้น)",
        "รันทุกงานจนครบทุกตัวแบบขนาน",
        "เลือก thread ที่ว่างที่สุดให้งาน",
        "จัดลำดับงานตามความสำคัญ"
      ],
      "answer": 0
    },
    "explain": "select! = แข่งขัน: รอ event หลายทางพร้อมกัน เสร็จทางไหนก่อน วนรอบนั้นทำทางนั้น — Goose ใช้รวม stream ของข้อมูล+สัญญาณยกเลิกเป็น loop เดียว: มีข้อมวนถึงช่องข้อมูล มี cancel ถึงช่องออก — เขียนด้วย for สองอันทำไม่ได้ เพราะต้องรอ \"พร้อมกัน\"",
    "source": "บทเรียน Goose · Async — select!"
  },
  {
    "id": "q144",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "CancellationToken (ที่ Goose ใช้ 354 จุด) — วิธียกเลิกงานแบบ \"ร่วมมือ\" หมายความว่าไง?",
    "payload": {
      "choices": [
        "ส่งสัญญาณขอให้งานหยุด แล้วงานเช็ค token ตามจุดที่เหมาะสมแล้วเลือกเก็บกวาด/ออกเอง — ไม่ใช่ยิงฆ่ากลางคัน",
        "บังคับหยุด thread ทันทีที่สั่ง",
        "หยุดทั้งโปรแกรมด้วย panic",
        "ระงับ OS process ทั้งหมด"
      ],
      "answer": 0
    },
    "explain": "cooperative cancel = \"เคาะประตูขอให้ออก\" ไม่ใช่ \"ถอดประตูออก\": ยิง thread กลางคันทิ้ง resource ค้าง (ไฟล์ครึ่งเดียว, lock ค้าง) — token ให้งานเลือกจุดปลอดภัยที่จะออกเอง — 354 จุดหมายความว่า Goose ระวังแทบทุก await ที่ยาวนาน — สิ่งนี้ทำให้ปิดโปรแกรมได้ \"สวย ๆ\" เสมอ",
    "source": "บทเรียน Goose · Async — CancellationToken"
  },
  {
    "id": "q145",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (Arc + Mutex นับข้าม 4 threads)",
    "payload": {
      "code": "use std::sync::{Arc, Mutex};\nuse std::thread;\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut hs = vec![];\n    for _ in 0..4 {\n        let c = Arc::clone(&counter);\n        hs.push(thread::spawn(move || {\n            *c.lock().unwrap() += 1;\n        }));\n    }\n    for h in hs {\n        h.join();\n    }\n    println!(\"{}\", *counter.lock().unwrap());\n}",
      "choices": [
        "4",
        "1",
        "0",
        "อาจเป็นเลขไหนก็ได้ 0-4 (race)"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "4"
      }
    },
    "explain": "Arc แชร์ความเป็นเจ้าของ counter ให้ 4 threads + Mutex ทำให้บวกทีละคน (ไม่ตีกัน) → join ทุกตัวก่อนพิมพ์ = ได้ 4 แน่นอน — ถ้าไม่มี Mutex เป็น race ผลลัพธ์ไม่แน่นอน — คู่นี้คือ \"แชร์+แก้\" มาตรฐานของ Rust (และถ้าแค่อ่าน ไม่ต้อง Mutex)",
    "source": "Cookbook · Concurrency — Arc<Mutex<T>>"
  },
  {
    "id": "q146",
    "type": "bug",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โค้ดนี้คอมไพล์ไม่ผ่าน — เพราะอะไร?",
    "payload": {
      "code": "use std::rc::Rc;\nuse std::thread;\nfn main() {\n    let s = Rc::new(String::from(\"hi\"));\n    let h = thread::spawn(move || println!(\"{}\", s));\n    h.join();\n}",
      "choices": [
        "error[E0277]: Rc<String> ไม่ปลอดภัยข้าม thread (ไม่ใช่ Send) — ต้องใช้ Arc แทน",
        "error[E0382]: s ถูกย้ายสองครั้ง",
        "error[E0507]: cannot move out of `s`",
        "คอมไพล์ผ่านปกติ"
      ],
      "answer": 0,
      "verify": {
        "kind": "fails",
        "errorCode": "E0277"
      }
    },
    "explain": "Rc นับผู้ถือด้วยตัวเลขธรรมดา — สอง thread บวกพร้อมกันได้ = นับผิด = ข้อมูลรั่ว/double free — Rust จึง mark Rc ว่า \"ไม่ Send\" (ส่งข้าม thread ไม่ได้) ตรวจตอน compile เลย — แก้เป็น Arc (atomic) — เปลี่ยนตัวอักษรเดียว ปลอดภัยขึ้นทั้งระบบ",
    "source": "Cookbook · Concurrency — Rc vs Arc"
  },
  {
    "id": "q147",
    "type": "mcq",
    "cat": "goose",
    "diff": 2,
    "prompt": "async fn ใน Rust — ตัวฟังก์ชันเองทำอะไรตอนถูกเรียก?",
    "payload": {
      "choices": [
        "สร้าง Future (สัญญาว่าจะมีค่ามา) แต่ยังไม่ทำงาน — ต้องมี executor (.await) ถึงเริ่มทำจริง",
        "รันโค้ดทันทีใน thread ใหม่",
        "รันโค้ดทันทีใน background แล้วคืนค่าตอนหลัง",
        "คอมไพล์เป็นโค้ดธรรมดาเหมือน fn ปกติ"
      ],
      "answer": 0
    },
    "explain": "async fn = \"ระงับคำสั่งไว้\": เรียกแล้วได้ Future ที่ยังเฉย ๆ (lazy) — จนถูก await ถึงเริ่ม และพอเจอจุดรอ (I/O) ก็คืน thread ให้ runtime ไปทำงานอื่น — ต่างจากหลายภาษาที่ async เริ่มทำงานทันที — เขียน async ของ Rust แล้วลืม await = ไม่มีอะไรเกิดขึ้นเลย (warning: unused)",
    "source": "บทเรียน Goose · Async — async fn"
  },
  {
    "id": "q148",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "ทำไม Goose มี \"dedicated thread\" สำหรับบางงาน ทั้งที่ใช้ tokio runtime อยู่?",
    "payload": {
      "choices": [
        "งานบางประเภท (blocking syscall, signal, spawn โปรแกรมภายนอก) ไปขวาง async worker ไม่ได้ — แยกเป็น thread เฉพาะแล้วส่งผลกลับทาง channel",
        "thread ธรรมดาเร็วกว่า async เสมอ",
        "tokio ใช้ได้แค่ครั้งละงาน",
        "เพราะอยากได้ core CPU เฉพาะตัว"
      ],
      "answer": 0
    },
    "explain": "async runtime มี worker จำกัด — งานที่กินเวลาแบบ blocking (รอ process ลูก, จับ signal) ถ้ารันใน worker จะอุดตันงานอื่นทั้ง runtime — ทางแก้มาตรฐาน: งานพิเศษให้ thread เฉพาะ แล้วคุยกลับด้วย channel — \"เลือกเครื่องมือตามธรรมชาติของงาน\" ไม่ใช่ async ทุกอย่าง",
    "source": "บทเรียน Goose · Async — Dedicated Thread"
  },
  {
    "id": "q149",
    "type": "output",
    "cat": "syntax",
    "diff": 3,
    "prompt": "โปรแกรมนี้พิมพ์อะไร? (thread::scope ยืมข้อมูลโดยไม่ต้อง move)",
    "payload": {
      "code": "use std::thread;\nfn main() {\n    let data = vec![1, 2, 3];\n    let n = thread::scope(|s| {\n        let h = s.spawn(|| data.len());\n        h.join().unwrap()\n    });\n    println!(\"{}\", n);\n}",
      "choices": [
        "3",
        "คอมไพล์ไม่ผ่าน ต้อง move หรือ Arc",
        "0",
        "พิมพ์เมื่อไหร่ก็ได้ ไม่แน่นอน"
      ],
      "answer": 0,
      "verify": {
        "kind": "output",
        "expected": "3"
      }
    },
    "explain": "thread::scope รับประกันว่าทุก thread ใน scope จบก่อนออกจาก scope — ข้อมูลของ main จึงยังมีชีวิตแน่นอน closure ยืมได้เลย ไม่ต้อง move/Arc — ทางเลือกใหม่กว่า (Rust 1.63+) สำหรับ parallel แบบ \"แชร์อ่านแล้วรอจบ\" — ผล: len ของ [1,2,3] = 3",
    "source": "Cookbook · Concurrency — scoped threads"
  },
  {
    "id": "q150",
    "type": "mcq",
    "cat": "goose",
    "diff": 3,
    "prompt": "Graceful Shutdown ของ Goose — รอหลายสัญญาณพร้อมกัน แล้วค่อยเก็บกวาด — ลำดับที่ถูกต้องคือ?",
    "payload": {
      "choices": [
        "รับสัญญาณยกเลิก (Ctrl-C/timeout) → หยุดรับงานใหม่ → แจ้งทุกส่วนผ่าน CancellationToken → รอ/เก็บกวาด state → ปิดท้ายสวย ๆ",
        "ปิดโปรแกรมทันทีที่กด Ctrl-C เพื่อปลอดภัย",
        "เก็บกวาดก่อนแล้วค่อยรอสัญญาณ",
        "ส่ง kill -9 ให้ทุก thread"
      ],
      "answer": 0
    },
    "explain": "shutdown แบบสุภาพ: ได้สัญญาณแล้วไม่ดึงปลั๊กทันที แต่ (1) หยุดงานใหม่ (2) บอกทุกงานที่กำลังรันผ่าน cancellation token ให้เก็บกวาดตัวเอง (3) รอให้เสร็จ (timeout กำกับ) (4) flush log/save state แล้วจบ — สิ่งที่ควรมีในโปรแกรมรันยาวทุกตัว และ Goose ทำครบทั้งเส้นทาง",
    "source": "บทเรียน Goose · Async — Graceful Shutdown"
  }
];

// Campaign level definitions
window.RQ_LEVELS = [
  {
    "id": "lvl1",
    "title": "ด่าน 1 · อุ่นเครื่อง",
    "desc": "พื้นฐาน syntax + memory ง่าย + goose patterns เบา ๆ",
    "questions": [
      "q001",
      "q002",
      "q005",
      "q007",
      "q008",
      "q003",
      "q009",
      "q006",
      "q004",
      "q010"
    ],
    "unlock": null
  },
  {
    "id": "lvl2",
    "title": "ด่าน 2 · คลังข้อมูล (Vec/HashMap)",
    "desc": "Cookbook: Data Structures + Algorithms — เก็บ เรียง ค้น นับ",
    "questions": [
      "q011",
      "q012",
      "q013",
      "q014",
      "q022",
      "q029",
      "q015",
      "q016",
      "q017",
      "q018",
      "q019",
      "q020",
      "q021",
      "q023",
      "q024",
      "q025",
      "q026",
      "q028",
      "q030",
      "q031",
      "q032",
      "q034",
      "q035",
      "q027",
      "q033"
    ],
    "unlock": "lvl1"
  },
  {
    "id": "lvl3",
    "title": "ด่าน 3 · ข้อความและการแปลง",
    "desc": "String/&str, ภาษาไทย UTF-8, Option/Result, parse",
    "questions": [
      "q036",
      "q037",
      "q038",
      "q039",
      "q047",
      "q040",
      "q042",
      "q043",
      "q044",
      "q045",
      "q046",
      "q048",
      "q049",
      "q051",
      "q052",
      "q054",
      "q055",
      "q056",
      "q057",
      "q041",
      "q050",
      "q053",
      "q058",
      "q059",
      "q060"
    ],
    "unlock": "lvl2"
  },
  {
    "id": "lvl4",
    "title": "ด่าน 4 · เจ้าของและผู้ยืม",
    "desc": "Ownership, move, borrow &, &mut, clone เต็มรูปแบบ",
    "questions": [
      "q061",
      "q073",
      "q062",
      "q063",
      "q064",
      "q065",
      "q066",
      "q067",
      "q068",
      "q069",
      "q070",
      "q071",
      "q072",
      "q079",
      "q080",
      "q074",
      "q075",
      "q076",
      "q077",
      "q078"
    ],
    "unlock": "lvl3"
  },
  {
    "id": "lvl5",
    "title": "ด่าน 5 · หน่วยความจำเบื้องลึก",
    "desc": "Stack/Heap, String head, Vec growth, Arc, Box, drop order",
    "questions": [
      "q081",
      "q082",
      "q084",
      "q083",
      "q088",
      "q089",
      "q090",
      "q091",
      "q093",
      "q094",
      "q095",
      "q085",
      "q086",
      "q087",
      "q092",
      "q096",
      "q097",
      "q098"
    ],
    "unlock": "lvl4"
  },
  {
    "id": "lvl6",
    "title": "ด่าน 6 · Goose Workshop I",
    "desc": "Tagged enum, Display, fluent setter, trait, error categories",
    "questions": [
      "q099",
      "q101",
      "q102",
      "q103",
      "q105",
      "q106",
      "q109",
      "q113",
      "q117",
      "q118",
      "q100",
      "q104",
      "q107",
      "q108",
      "q110",
      "q111",
      "q112",
      "q114",
      "q115",
      "q116"
    ],
    "unlock": "lvl5"
  },
  {
    "id": "lvl7",
    "title": "ด่าน 7 · Goose Workshop II",
    "desc": "Macro, event-driven, channel semantics, registry, RAII",
    "questions": [
      "q119",
      "q121",
      "q122",
      "q125",
      "q126",
      "q128",
      "q131",
      "q120",
      "q123",
      "q124",
      "q127",
      "q129",
      "q130",
      "q132",
      "q133",
      "q134",
      "q135",
      "q136"
    ],
    "unlock": "lvl6"
  },
  {
    "id": "lvl8",
    "title": "ด่าน 8 · โลกคู่ขนาน (Concurrency/Async)",
    "desc": "thread, mpsc, Arc+Mutex, select!, cancellation",
    "questions": [
      "q137",
      "q139",
      "q141",
      "q142",
      "q147",
      "q138",
      "q140",
      "q143",
      "q144",
      "q145",
      "q146",
      "q148",
      "q149",
      "q150"
    ],
    "unlock": "lvl7"
  }
];
