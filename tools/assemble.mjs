// Assemble tools/bank/b*.json + levels.json → src/questions.js (engine-facing artifact).
// Batches are plain JSON arrays; output is validated JS (JSON strings are valid JS strings).
// Usage: node tools/assemble.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bankDir = resolve(root, "tools/bank");

const batches = readdirSync(bankDir)
  .filter(f => /^b\d+.*\.json$/.test(f))
  .sort();
let questions = [];
for (const f of batches) {
  const arr = JSON.parse(readFileSync(resolve(bankDir, f), "utf8"));
  if (!Array.isArray(arr)) { console.error(`FAIL: ${f} is not an array`); process.exit(1); }
  questions = questions.concat(arr);
}
const levels = JSON.parse(readFileSync(resolve(bankDir, "levels.json"), "utf8"));

// invariant: unique ids across batches
const ids = new Set();
for (const q of questions) {
  if (ids.has(q.id)) { console.error(`FAIL: duplicate id ${q.id}`); process.exit(1); }
  ids.add(q.id);
}
// invariant: every level question exists; report orphans (boss-pool-only is allowed but reported)
const orphan = [];
for (const lvl of levels) for (const qid of lvl.questions) {
  if (!ids.has(qid)) { console.error(`FAIL: level ${lvl.id} references missing ${qid}`); process.exit(1); }
}
const inLevels = new Set(levels.flatMap(l => l.questions));
for (const q of questions) if (!inLevels.has(q.id)) orphan.push(q.id);

const out = [
  "// RustQuest question bank — ASSEMBLED from tools/bank/*.json by tools/assemble.mjs.",
  "// Do not edit by hand; edit the JSON batches and re-run assemble.",
  "// Invariants (enforced by tools/verify-questions.mjs):",
  "//  - every output/bug question's code claims were rustc-verified",
  "//  - fields: id, type, cat, diff, prompt, payload, explain, source",
  "window.RQ_QUESTIONS = " + JSON.stringify(questions, null, 2) + ";",
  "",
  "// Campaign level definitions",
  "window.RQ_LEVELS = " + JSON.stringify(levels, null, 2) + ";",
  ""
].join("\n");
writeFileSync(resolve(root, "src/questions.js"), out);
console.log(`ASSEMBLE OK — ${questions.length} questions from ${batches.length} batches; levels: ${levels.map(l => l.id + ":" + l.questions.length).join(", ")}` +
  (orphan.length ? `; orphans (boss pool only): ${orphan.join(",")}` : ""));
