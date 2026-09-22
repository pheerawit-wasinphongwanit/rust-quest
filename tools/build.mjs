// Build dist/rust-quest.html — inline src/questions.js into index.html (single-file deliverable).
// Usage: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const index = readFileSync(resolve(root, "index.html"), "utf8");
let out = index;

// inline every <script src="src/..."></script> into the single-file deliverable
const tags = [...index.matchAll(/<script src="(src\/[^"]+)"><\/script>/g)];
if (!tags.length) {
  console.error("BUILD FAIL: no src script tags found in index.html");
  process.exit(1);
}
for (const t of tags) {
  const path = resolve(root, t[1]);
  out = out.replace(t[0], "<script>\n" + readFileSync(path, "utf8") + "\n</script>");
}
mkdirSync(resolve(root, "dist"), { recursive: true });
const dest = resolve(root, "dist/rust-quest.html");
writeFileSync(dest, out);
const kb = (out.length / 1024).toFixed(1);
console.log(`BUILD OK → dist/rust-quest.html (${kb} KB) — inlined ${tags.map(t => t[1]).join(", ")}`);
if (out.length > 250 * 1024) console.warn("WARN: dist exceeds 250KB — check size budget");
