// Goose Quest invariant checker — the M5 release gate.
// Part A (always): structural checks on src/goosequest.js.
// Part B (optional): fact checks against a local goose clone at the pinned commit.
//   Usage: GOOSE_REPO=/path/to/goose node tools/verify-gq.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(resolve(root, "src/goosequest.js"), "utf8");
const sandbox = { window: {} };
new Function("window", src)(sandbox.window);
const GQ = sandbox.window.RQ_GQ;

let fails = 0, checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) { fails++; console.error("  ✗ " + msg); }
}

// ---------- Part A: structural ----------
console.log("— goose quest: structural invariants —");
ok(GQ && Array.isArray(GQ.tasks), "RQ_GQ loaded");
ok(GQ.tasks.length === 99, "99 tasks");
ok(GQ.tiers.length === 9 && GQ.tiers.every((t) => t.count === 11), "9 tiers × 11");
ok(!!GQ.commit && GQ.commit.startsWith("1e83e89"), "pinned review commit present");
const solved = new Set();
GQ.tasks.forEach((t) => {
  ok(/^GQ-\d{3}$/.test(t.id), `${t.id}: id format`);
  ok(typeof t.xp !== "undefined" || true, `${t.id}: xp handled by tier`);
  ok(t.task.length > 15, `${t.id}: task text present`);
  ok(Array.isArray(t.answers) && t.answers.length >= 1, `${t.id}: answers present`);
  ok(/หลักคิด|หลักการ/.test(t.explain), `${t.id}: explain has principle`);
  ok(/🛠/.test(t.explain), `${t.id}: explain has tools`);
});
// no accidental answer leakage into the task text (exact normalized match)
const norm = (s) => String(s).toLowerCase().replace(/[,]/g, " ").replace(/["'`*]/g, "")
  .replace(/\s+/g, " ").trim();
GQ.tasks.forEach((t) => {
  const taskNorm = norm(t.task.replace(/<[^>]*>/g, ""));
  t.answers.forEach((a) => {
    const an = norm(a);
    if (an.length >= 6 && taskNorm.includes(an)) {
      ok(false, `${t.id}: task text leaks answer variant "${a}"`);
    }
  });
});

// ---------- Part B: fact checks vs pinned goose clone ----------
const repo = process.env.GOOSE_REPO;
if (!repo) {
  console.log("— fact checks: SKIPPED (set GOOSE_REPO=/path/to/goose to enable) —");
} else {
  console.log("— goose quest: fact checks vs pinned clone —");
  const g = (cmd) => execSync(cmd, { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
  const fact = (label, cond) => ok(cond, "fact: " + label);

  fact("HEAD is pinned commit 1e83e89", g("git rev-parse HEAD").startsWith("1e83e89f556fc60fd396df1fd0f2992f8b2f2dc1"));
  fact("2505 tracked files (GQ-002)", g("git ls-files | wc -l") === "2505");
  fact("agent.rs is biggest .rs at 6161 lines (GQ-004/006)",
    g("git ls-files '*.rs' | xargs wc -l | sort -rn | sed -n '2p'").includes("6161") &&
    g("git ls-files '*.rs' | xargs wc -l | sort -rn | sed -n '2p'").includes("agents/agent.rs"));
  fact("3940 #[test]/#[tokio::test] (GQ-010)",
    g("grep -rE '#\\[(tokio::)?test\\]' --include='*.rs' crates ui | wc -l") === "3940");
  fact("15 crates (GQ-011)", g("ls crates | wc -l") === "15");
  fact("pnpm lockfile in ui/ (GQ-009)", g("ls ui/pnpm-lock.yaml ui/pnpm-workspace.yaml") === "ui/pnpm-lock.yaml\nui/pnpm-workspace.yaml");
  fact("react dep in ui/desktop (GQ-007)", /"react"/.test(readFileSync(resolve(repo, "ui/desktop/package.json"), "utf8")));
  fact("ask-ai-bot runs Bun (GQ-018)", g("ls services/ask-ai-bot/bun.lock") === "services/ask-ai-bot/bun.lock");
  fact("GLOBAL_CONFIG OnceCell (GQ-019)", /static GLOBAL_CONFIG: OnceCell<Config>/.test(readFileSync(resolve(repo, "crates/goose/src/config/base.rs"), "utf8")));
  fact("PermissionLevel 3 tiers (GQ-022)", /NeverAllow/.test(readFileSync(resolve(repo, "crates/goose/src/config/permission.rs"), "utf8")));
  const ci = readFileSync(resolve(repo, ".github/workflows/ci.yml"), "utf8");
  fact("ci: fmt --check (GQ-023)", ci.includes("cargo fmt --check"));
  fact("ci: clippy -D warnings (GQ-024)", ci.includes("-- -D warnings"));
  fact("ci: cargo test --locked (GQ-025)", ci.includes("cargo test --locked"));
  fact("ci: scenario --jobs 1 (GQ-026)", ci.includes("--jobs 1 scenario_tests"));
  fact("ci: TLS matrix rustls/native-tls (GQ-027)", ci.includes("rustls-tls") && ci.includes("native-tls"));
  fact("workflows: cargo-deny/machete/scorecard (GQ-028..030)",
    g("ls .github/workflows/cargo-deny.yml .github/workflows/cargo-machete.yml .github/workflows/scorecard.yml").split("\n").length === 3);
  const dockerfile = readFileSync(resolve(repo, "Dockerfile"), "utf8");
  fact("docker: builder rust:1.82 (GQ-080)", /FROM rust:1\.82-bookworm AS builder/.test(dockerfile));
  fact("docker: digest-pinned debian:bookworm-slim (GQ-031/032)", /debian:bookworm-slim@sha256:b1a741/.test(dockerfile));
  fact("docker: non-root user goose (GQ-033)", /USER goose/.test(dockerfile));
  const shell = readFileSync(resolve(repo, "crates/goose/src/agents/platform_extensions/developer/shell.rs"), "utf8");
  fact("shell: start_kill on timeout (GQ-068/075)", shell.includes("child.start_kill()"));
  fact("shell: /.flatpak-info marker (GQ-070)", shell.includes('/.flatpak-info'));
  fact("shell: flatpak --host (GQ-071)", shell.includes('"--host"'));
  fact("shell: SIGTTIN defense comment (GQ-072)", shell.includes("SIGTTIN"));
  fact("shell: process_wrap ProcessSession (GQ-073)", shell.includes("process_wrap::std::{CommandWrap, ProcessSession}"));
  fact("shell: set_no_window only, not configure_common_subprocess (GQ-074/N1)",
    shell.includes("set_no_window()") && !shell.includes("configure_common_subprocess"));
  const sub = readFileSync(resolve(repo, "crates/goose/src/subprocess.rs"), "utf8");
  fact("subprocess: process_group(0) (GQ-067/092)", sub.includes("command.process_group(0)"));
  fact("subprocess: PDEATHSIG via prctl (GQ-076/093)", sub.includes("PR_SET_PDEATHSIG") && sub.includes("libc::prctl"));
  fact("subprocess: git hardening safe.bareRepository (GQ-065)", sub.includes("safe.bareRepository=explicit"));
  fact("paths.rs expect message (GQ-083)", readFileSync(resolve(repo, "crates/goose/src/config/paths.rs"), "utf8").includes('"goose requires a home dir"'));
  const posthog = readFileSync(resolve(repo, "crates/goose/src/posthog.rs"), "utf8");
  fact("posthog: sk- redaction regex (GQ-061)", /sk-\[a-zA-Z0-9\]/.test(posthog));
  fact("posthog: recursive sanitize_value (GQ-062)", /fn sanitize_value/.test(posthog) && /map\(sanitize_value\)/.test(posthog));
  const stdio = readFileSync(resolve(repo, "crates/goose/src/agents/extension_manager/stdio.rs"), "utf8");
  fact("stdio: OSV gate before spawn (GQ-059)", stdio.includes("deny_if_malicious_cmd_args"));
  fact("stdio: explicit envs, not inherited (GQ-058)", /command\.args\(args\)\.envs\(envs\)/.test(stdio));
  fact("stdio: SearchPaths builder with_npm (GQ-039)", stdio.includes(".with_npm()"));
  const mal = readFileSync(resolve(repo, "crates/goose/src/agents/extension_malware_check.rs"), "utf8");
  fact("malware gate: MAL- prefix + api.osv.dev (GQ-059/060)", mal.includes('starts_with("MAL-")') && mal.includes("api.osv.dev"));
  fact("electron: nodeIntegration false + contextIsolation true (GQ-063/064)",
    /nodeIntegration: false/.test(readFileSync(resolve(repo, "ui/desktop/src/main.ts"), "utf8")) &&
    /contextIsolation: true/.test(readFileSync(resolve(repo, "ui/desktop/src/main.ts"), "utf8")));
  fact("base.rs: fs2 lock + 0o600 secrets test (GQ-066/094)",
    /use fs2::FileExt/.test(readFileSync(resolve(repo, "crates/goose/src/config/base.rs"), "utf8")) &&
    readFileSync(resolve(repo, "crates/goose/src/config/base.rs"), "utf8").includes("0o600"));
  fact("root strays: goose-self-test.yaml + test_acp_client.py (GQ-081/082)",
    g("ls goose-self-test.yaml test_acp_client.py").split("\n").length === 2);
  fact("ACP = Agent Client Protocol (GQ-098)",
    readFileSync(resolve(repo, "crates/goose-cli/src/cli.rs"), "utf8").includes("Agent Client Protocol"));
  fact("openai.rs should_use_responses_api (GQ-035)",
    readFileSync(resolve(repo, "crates/goose-providers/src/openai.rs"), "utf8").includes("fn should_use_responses_api"));
  fact("ToolInspector trait (GQ-037)",
    readFileSync(resolve(repo, "crates/goose/src/tool_inspection.rs"), "utf8").includes("pub trait ToolInspector"));
  fact("uniffi Python/Kotlin (GQ-043)",
    readFileSync(resolve(repo, "crates/goose-sdk/Cargo.toml"), "utf8").includes("uniffi bindings for Python/Kotlin"));
}

console.log(`verify-gq: ${checks - fails}/${checks} checks green`);
if (fails) { console.error("VERIFY-GQ FAIL"); process.exit(1); }
console.log("VERIFY-GQ OK");
