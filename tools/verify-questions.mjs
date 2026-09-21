// Question-bank invariant checker — the release gate (AGENTS.md rule 2).
// Structural checks for ALL questions + rustc verification for code-bearing ones.
// Usage: node tools/verify-questions.mjs   (requires rustc on PATH)
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// load questions.js with a window shim
const src = readFileSync(resolve(root, "src/questions.js"), "utf8");
const sandbox = { window: {} };
new Function("window", src)(sandbox.window);
const QS = sandbox.window.RQ_QUESTIONS;
const LEVELS = sandbox.window.RQ_LEVELS;

const TYPES = ["mcq", "output", "bug", "fill", "order", "memory"];
const CATS = ["syntax", "goose", "memory"];
let fails = 0, checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) { fails++; console.error("  ✗ " + msg); }
}

// ---------- structural ----------
console.log("— structural invariants —");
const ids = new Set();
for (const q of QS) {
  const tag = q.id || "(no id)";
  ok(q.id && !ids.has(q.id), `${tag}: unique id`); ids.add(q.id);
  ok(TYPES.includes(q.type), `${tag}: type ${q.type} valid`);
  ok(CATS.includes(q.cat), `${tag}: cat ${q.cat} valid`);
  ok(q.diff >= 1 && q.diff <= 3, `${tag}: diff 1..3`);
  ok(typeof q.prompt === "string" && q.prompt.length > 5, `${tag}: prompt present`);
  ok(typeof q.explain === "string" && q.explain.length > 20, `${tag}: explain present`);
  ok(typeof q.source === "string" && q.source.length > 3, `${tag}: source present`);
  if (q.type === "mcq" || q.type === "output" || q.type === "bug" || q.type === "memory" || q.type === "fill") {
    ok(Array.isArray(q.payload.choices) && q.payload.choices.length === 4, `${tag}: 4 choices`);
    ok(Number.isInteger(q.payload.answer) && q.payload.answer >= 0 && q.payload.answer < 4, `${tag}: answer index valid`);
    if (q.type !== "mcq" && q.type !== "memory") ok(typeof q.payload.code === "string" && q.payload.code.length > 10, `${tag}: code present`);
    if (q.type === "memory") ok(!!q.payload.svg, `${tag}: svg ref present`);
  }
  if (q.type === "order") {
    ok(Array.isArray(q.payload.lines) && q.payload.lines.length >= 3, `${tag}: >=3 lines`);
    const sorted = q.payload.answer.slice().sort((a, b) => a - b);
    ok(sorted.every((v, i) => v === i) && sorted.length === q.payload.lines.length, `${tag}: answer is a permutation`);
  }
}
const qmap = new Map(QS.map(q => [q.id, q]));
for (const lvl of LEVELS) {
  for (const qid of lvl.questions) ok(qmap.has(qid), `level ${lvl.id}: question ${qid} exists`);
}
// difficulty slope within playable levels (non-decreasing is too strict; assert first 3 easier than last 3 avg)
const playable = LEVELS.filter(l => l.questions.length > 0);
for (const lvl of playable) {
  const ds = lvl.questions.map(id => qmap.get(id).diff);
  const head = ds.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, ds.length);
  const tail = ds.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, ds.length);
  ok(head <= tail + 0.01, `level ${lvl.id}: difficulty slope easy→hard (head ${head.toFixed(2)} ≤ tail ${tail.toFixed(2)})`);
}
console.log(`  structural: ${QS.length} questions, ${LEVELS.length} levels`);

// ---------- rustc verification ----------
console.log("— rustc verification —");
const tmp = mkdtempSync(resolve(tmpdir(), "rq-verify-"));
function rustcCheck(code, { run = false } = {}) {
  const f = resolve(tmp, "q.rs");
  const bin = resolve(tmp, "q.bin");
  writeFileSync(f, code);
  try {
    execSync(`rustc --edition 2021 ${JSON.stringify(f)} -o ${JSON.stringify(bin)}`, { stdio: "pipe", encoding: "utf8" });
    if (!run) return { compiled: true };
    const out = execSync(JSON.stringify(bin), { stdio: "pipe", encoding: "utf8" });
    return { compiled: true, stdout: out.trimEnd() };
  } catch (e) {
    return { compiled: false, stderr: String(e.stderr || "") };
  }
}

let verified = 0;
for (const q of QS) {
  const v = q.payload && q.payload.verify;
  if (!v) continue;
  verified++;
  if (v.kind === "output") {
    const r = rustcCheck(q.payload.code, { run: true });
    ok(r.compiled, `${q.id}: compiles`);
    if (r.compiled) {
      ok(r.stdout === v.expected, `${q.id}: output "${r.stdout}" === expected "${v.expected}"`);
      ok(q.payload.choices[q.payload.answer].includes(v.expected), `${q.id}: correct choice contains verified output`);
    }
  } else if (v.kind === "fails") {
    const r = rustcCheck(q.payload.code);
    ok(!r.compiled, `${q.id}: code must FAIL to compile`);
    if (!r.compiled) {
      ok(r.stderr.includes(v.errorCode), `${q.id}: stderr contains ${v.errorCode}`);
      ok(q.payload.choices[q.payload.answer].includes(v.errorCode), `${q.id}: correct choice names ${v.errorCode}`);
    }
  } else if (v.kind === "fillCompiles") {
    const filled = q.payload.code.replace("___", q.payload.choices[q.payload.answer]);
    const prog = /\bfn main\(/.test(filled) ? filled : "fn main() {\n" + filled + "\nlet _ = &v;\n}";
    const r = rustcCheck(prog);
    ok(r.compiled, `${q.id}: filled code compiles`);
  } else if (v.kind === "orderOutput") {
    const code = q.payload.answer.map(i => q.payload.lines[i]).join("\n");
    const r = rustcCheck(code, { run: true });
    ok(r.compiled, `${q.id}: ordered code compiles`);
    if (r.compiled) ok(r.stdout === v.expected, `${q.id}: ordered output "${r.stdout}" === "${v.expected}"`);
  } else {
    ok(false, `${q.id}: unknown verify kind ${v.kind}`);
  }
}
rmSync(tmp, { recursive: true, force: true });
console.log(`  rustc: ${verified} code-bearing questions verified`);

console.log(fails === 0 ? `\nPASS — ${checks} checks green` : `\nFAIL — ${fails}/${checks} checks failed`);
process.exit(fails === 0 ? 0 : 1);
