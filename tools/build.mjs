// Build dist/rust-quest.html — inline src/questions.js into index.html (single-file deliverable).
// Usage: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const index = readFileSync(resolve(root, "index.html"), "utf8");
const questions = readFileSync(resolve(root, "src/questions.js"), "utf8");

const TAG = '<script src="src/questions.js"></script>';
if (!index.includes(TAG)) {
  console.error("BUILD FAIL: questions script tag not found in index.html");
  process.exit(1);
}
const out = index.replace(TAG, "<script>\n" + questions + "\n</script>");
mkdirSync(resolve(root, "dist"), { recursive: true });
const dest = resolve(root, "dist/rust-quest.html");
writeFileSync(dest, out);
const kb = (out.length / 1024).toFixed(1);
console.log(`BUILD OK → dist/rust-quest.html (${kb} KB)`);
if (out.length > 250 * 1024) console.warn("WARN: dist exceeds 250KB — check size budget");
