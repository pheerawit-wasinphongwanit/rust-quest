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
    id, style: {}, children: [], textContent: "", _html: "", value: "",
    disabled: false, className: "", onclick: null,
    classList: { add() {}, remove() {}, contains() { return false; } },
    appendChild(c) { this.children.push(c); return c; },
    querySelectorAll() { return []; },
    addEventListener() {}, focus() {}, click() { if (this.onclick) this.onclick(); },
    setAttribute() {}
  };
  // mimic real DOM: assigning innerHTML discards existing children
  Object.defineProperty(el, "innerHTML", {
    get() { return this._html; },
    set(v) { this._html = v; this.children = []; }
  });
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
// stub-DOM limitation: innerHTML can't build element hierarchy, so some
// interactive hosts (order-pool, lab quiz) live only in the id registry.
function answerCurrent() {
  const card = documentStub.getElementById("q-card");
  for (const c of clickables(card, [])) {
    if (fbShown()) return true;
    c.click();
  }
  for (const hostId of ["ord-pool"]) {
    const host = registry.get(hostId);
    if (host) for (const c of clickables(host, [])) {
      if (fbShown()) return true;
      c.click();
    }
  }
  return fbShown();
}
for (const lvl of LEVELS) {
  api.startLevel(lvl);
  for (let i = 0; i < lvl.questions.length; i++) {
    if (!answerCurrent()) { console.error(`FAIL: question did not produce feedback: level ${lvl.id} #${i + 1}`); process.exit(1); }
    answered++;
    documentStub.getElementById("btn-next").click();
  }
}
if (answered !== QS.length) { console.error(`FAIL: answered ${answered} !== ${QS.length}`); process.exit(1); }

// ---------- run Boss Rush ----------
api.startBoss();
for (let i = 0; i < 20; i++) {
  answerCurrent();
  documentStub.getElementById("btn-next").click();
}

// ---------- Memory Lab: walk every scene, answer every quiz ----------
const labSrc = readFileSync(resolve(root, "src/memorylab.js"), "utf8");
new Function("document", "window", labSrc)(documentStub, globalThis.window);
const LAB = globalThis.window.RQ_LAB;
if (!LAB || LAB.scenes.length !== 7) { console.error("FAIL: lab not loaded or wrong scene count"); process.exit(1); }
LAB.open();
for (const sc of LAB.scenes) {
  LAB._startScene(sc);
  const steps = sc.steps.length;
  for (let i = 0; i < steps - 1; i++) documentStub.getElementById("lab-next").click();
  // at last step the quiz renders; find correct choice via RQ_QUESTIONS
  const q = QS.find(x => x.id === sc.quiz);
  const btns = documentStub.getElementById("lab-quiz-choices").children;
  if (btns.length !== 4) { console.error(`FAIL: scene ${sc.id} quiz choices missing`); process.exit(1); }
  btns[q.payload.answer].click();
  const c = LAB._getCur();
  if (!c || !c.quizDone) { console.error(`FAIL: scene ${sc.id} quiz not completed`); process.exit(1); }
  // click "กลับหน้าฉาก" (last child of fb)
  const fbKids = documentStub.getElementById("lab-quiz-fb").children;
  fbKids[fbKids.length - 1].click();
  const sv = api.getSave();
  if (!sv.lab || !sv.lab[sc.id]) { console.error(`FAIL: scene ${sc.id} not marked done`); process.exit(1); }
}
const labDoneCount = Object.keys(api.getSave().lab).length;

// ---------- Review queue + stats (M4) ----------
api.renderStats();
const statsHtml = documentStub.getElementById("stats-body").innerHTML;
if (!statsHtml.includes("stat-box")) { console.error("FAIL: stats screen empty"); process.exit(1); }
api.startReview(); // hotlist exists (wrong answers accumulated from choice-0 clicking)
const hotLen = (() => {
  const c = LAB ? 0 : 0; return 0;
})();
let reviewQ = 0;
for (let i = 0; i < 12; i++) { // review queue is capped at 12
  if (!answerCurrent()) break;
  reviewQ++;
  documentStub.getElementById("btn-next").click();
}
const persistedBefore = JSON.parse(store["rustquest.save.v1"]);
if (reviewQ === 0) { console.error("FAIL: review queue did not run"); process.exit(1); }

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
ok(labDoneCount === 7, `lab scenes done 7, got ${labDoneCount}`);
ok(reviewQ > 0 && reviewQ <= 12, `review queue ran ${reviewQ} questions (1-12)`);
ok(statsHtml.includes("ดาวรวม"), "stats boxes rendered");
console.log(`\nSMOKE ${fails === 0 ? "PASS" : "FAIL"} — levels=${LEVELS.length}, questions=${QS.length}, answered=${answered}, boss=ran, lab=${labDoneCount}/7, review=${reviewQ}, xp=${persisted.xp}, best=${persisted.boss.best}`);
process.exit(fails === 0 ? 0 : 1);
