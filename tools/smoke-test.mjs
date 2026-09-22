// Headless engine smoke test: stub the DOM, run every level + Boss Rush end-to-end,
// answer every question, and assert the engine completes without throwing and
// persists the expected save shape. Usage: node tools/smoke-test.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ---------- DOM stub ----------
function makeEl(id) {
  const el = {
    id, style: {}, children: [], textContent: "", innerHTML: "", value: "",
    disabled: false, className: "", onclick: null,
    classList: { add() {}, remove() {}, contains() { return false; } },
    appendChild(c) { this.children.push(c); return c; },
    querySelectorAll() { return []; },
    addEventListener() {}, focus() {}, click() { if (this.onclick) this.onclick(); },
    setAttribute() {}
  };
  return el;
}
const registry = new Map();
const documentStub = {
  getElementById(id) {
    if (!registry.has(id)) registry.set(id, makeEl(id));
    return registry.get(id);
  },
  querySelectorAll() { return []; },
  createElement(tag) { return makeEl("<" + tag + ">"); },
  addEventListener() {},
  querySelector() { return null; }
};
const store = {};
globalThis.document = documentStub;
globalThis.window = { scrollTo() {} };
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); }
};

// ---------- load engine ----------
const questionsSrc = readFileSync(resolve(root, "src/questions.js"), "utf8");
new Function("window", questionsSrc)(globalThis.window);
const QS = globalThis.window.RQ_QUESTIONS;
const LEVELS = globalThis.window.RQ_LEVELS;

const engineSrc = readFileSync(resolve(root, "index.html"), "utf8")
  .match(/<script>\n([\s\S]*?)<\/script>/)[1];
new Function("document", "window", "localStorage", engineSrc)(documentStub, globalThis.window, globalThis.localStorage);
const api = globalThis.window.RQ_ENGINE;
if (!api || !api.startBoss) { console.error("FAIL: engine hook not exposed"); process.exit(1); }

// ---------- run all levels ----------
let answered = 0;
function fbShown() { return (registry.get("fb")?.className || "").includes("show"); }
function clickables(el, out) {
  for (const c of el.children || []) {
    if (c.onclick) out.push(c);
    clickables(c, out);
  }
  return out;
}
for (const lvl of LEVELS) {
  api.startLevel(lvl);
  for (let i = 0; i < lvl.questions.length; i++) {
    const card = documentStub.getElementById("q-card");
    for (const c of clickables(card, [])) {
      if (fbShown()) break;
      c.click();
    }
    if (!fbShown()) { console.error(`FAIL: question did not produce feedback: level ${lvl.id} #${i + 1}`); process.exit(1); }
    answered++;
    documentStub.getElementById("btn-next").click();
  }
}
if (answered !== QS.length) { console.error(`FAIL: answered ${answered} !== ${QS.length}`); process.exit(1); }

// ---------- run Boss Rush ----------
api.startBoss();
for (let i = 0; i < 20; i++) {
  const card = documentStub.getElementById("q-card");
  for (const c of clickables(card, [])) {
    if (fbShown()) break;
    c.click();
  }
  documentStub.getElementById("btn-next").click();
}

// ---------- assertions ----------
const save = api.getSave();
const saveKeys = Object.keys(save);
const persisted = JSON.parse(store["rustquest.save.v1"]);
const levelsWithStars = Object.keys(persisted.levels).filter(k => persisted.levels[k].stars !== undefined);
let fails = 0;
function ok(cond, msg) { if (!cond) { fails++; console.error("  ✗ " + msg); } }
ok(saveKeys.includes("boss"), "save has boss record");
ok(persisted.boss.plays === 1, "boss plays counted (1), got " + persisted.boss.plays);
ok(persisted.boss.best >= 0 && persisted.boss.best <= 20, "boss best in range");
ok(levelsWithStars.length === LEVELS.length, `all ${LEVELS.length} campaign levels recorded, got ${levelsWithStars.length}`);
const seenTotal = Object.values(persisted.qstats).reduce((a, s) => a + s.seen, 0);
ok(seenTotal >= QS.length, `qstats seen total ${seenTotal} >= ${QS.length}`);
ok(persisted.xp > 0, "xp accumulated: " + persisted.xp);
console.log(`\nSMOKE ${fails === 0 ? "PASS" : "FAIL"} — levels=${LEVELS.length}, questions=${QS.length}, answered=${answered}, boss=ran, xp=${persisted.xp}, best=${persisted.boss.best}`);
process.exit(fails === 0 ? 0 : 1);
