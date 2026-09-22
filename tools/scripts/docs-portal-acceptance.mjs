#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const canonical = join(root, "docs/user");
const runtimeRoot = process.env.PRAXIS_RUNTIME_ROOT || "";

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".vitepress" || name === "node_modules") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const requiredPages = [
  "index.md",
  "getting-started/overview.md",
  "getting-started/requirements.md",
  "getting-started/installation.md",
  "getting-started/credentials.md",
  "getting-started/first-run.md",
  "getting-started/update.md",
  "getting-started/uninstall.md",
  "concepts/runtime.md",
  "concepts/plugins.md",
  "concepts/skills.md",
  "concepts/work-packages.md",
  "concepts/jira-workflow.md",
  "concepts/approvals.md",
  "plugins/overview.md",
  "plugins/ba.md",
  "plugins/architect.md",
  "plugins/developer.md",
  "plugins/quality.md",
  "workflows/full-e2e.md",
  "workflows/existing-epic.md",
  "workflows/ba-only.md",
  "workflows/architect-only.md",
  "workflows/developer-only.md",
  "workflows/github-delivery.md",
  "workflows/quality-only.md",
  "workflows/resume.md",
  "reference/configuration.md",
  "reference/tools.md",
  "reference/artifacts.md",
  "reference/prompts.md",
  "reference/permissions.md",
  "reference/secrets.md",
  "reference/troubleshooting.md",
  "reference/faq.md",
  "reference/changelog.md",
];

for (const rel of requiredPages) {
  if (!existsSync(join(canonical, rel))) fail(`missing canonical page ${rel}`);
}

const install = readFileSync(join(canonical, "getting-started/installation.md"), "utf8");
for (const needle of [
  "praxis-runtime.mcpb",
  "praxis-ba.zip",
  "praxis-architect.zip",
  "praxis-developer.zip",
  "praxis-quality.zip",
  "PRAXIS_RUNTIME_UNAVAILABLE",
  "jira_token",
]) {
  if (!install.includes(needle)) fail(`installation guide missing ${needle}`);
}

const secretHits = [];
for (const file of walk(canonical)) {
  if (extname(file) !== ".md") continue;
  const text = readFileSync(file, "utf8");
  if (/ATATT3xFfGF0|praxis-integration-test\.atlassian\.net/.test(text)) {
    secretHits.push(relative(root, file));
  }
}
if (secretHits.length) fail(`possible live secrets in docs: ${secretHits.join(", ")}`);

const e2e = readFileSync(join(canonical, "workflows/full-e2e.md"), "utf8");
for (let i = 1; i <= 20; i += 1) {
  if (!e2e.includes(`STEP ${i}`)) fail(`e2e tutorial missing STEP ${i}`);
}

if (runtimeRoot) {
  const catalogSrc = readFileSync(join(runtimeRoot, "packages/mcp/src/catalog.ts"), "utf8");
  const toolNames = [...catalogSrc.matchAll(/name: "(praxis_[a-z0-9_]+)"/g)].map((m) => m[1]);
  const toolsPage = readFileSync(join(canonical, "reference/tools.md"), "utf8");
  for (const name of toolNames) {
    if (!toolsPage.includes(name)) fail(`tools.md missing catalog tool ${name}`);
  }
}

const docsBuild = spawnSync("npm", ["run", "docs:build"], { cwd: root, encoding: "utf8" });
if ((docsBuild.status ?? 1) !== 0) fail(`docs-site build failed\n${docsBuild.stderr || docsBuild.stdout}`);
if (!existsSync(join(root, "apps/docs-site/.vitepress/dist/index.html"))) {
  fail("docs-site dist missing index.html");
}
console.log(JSON.stringify({ ok: true, canonicalPages: requiredPages.length }, null, 2));
