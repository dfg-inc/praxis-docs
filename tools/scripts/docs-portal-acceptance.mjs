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
  "guide/create-project.md",
  "guide/without-jira.md",
  "guide/ba.md",
  "guide/architect.md",
  "guide/developer.md",
  "guide/quality.md",
  "guide/handoffs.md",
  "guide/multi-repo.md",
  "guide/git-delivery.md",
  "guide/jira-simpleone.md",
  "guide/approval-modes.md",
  "technical/architecture.md",
  "technical/compatibility.md",
  "technical/tools-catalog.md",
  "technical/plugin-manifests.md",
  "technical/marketplace-distribution.md",
  "technical/configuration.md",
  "technical/security-model.md",
  "technical/diagnostics.md",
  "technical/troubleshooting.md",
  "technical/release-process.md",
];

for (const rel of requiredPages) {
  if (!existsSync(join(canonical, rel))) fail(`missing canonical page ${rel}`);
}

const install = readFileSync(join(canonical, "getting-started/installation.md"), "utf8");
for (const needle of [
  "Customize → Plugins",
  "Add marketplace",
  "https://github.com/dfg-inc/praxis-marketplace",
  "dfg-inc/praxis-marketplace",
  "praxis-runtime.mcpb",
  "Claude Desktop Chat",
  "Install one role only",
  "not yet verified",
]) {
  if (!install.includes(needle)) fail(`installation guide missing ${needle}`);
}

// The install flow must not point at removed components or placeholders.
const OBSOLETE = [/native approval service/i, /\bbroker\b/i, /webauthn/i, /\.pkg\b/i, /launchd/i, /OWNER\/REPO/, /<your-org>/i];
const obsoleteHits = [];
for (const file of walk(canonical)) {
  if (extname(file) !== ".md") continue;
  const text = readFileSync(file, "utf8");
  // Pages may say these components do NOT exist; a mention must sit next to a negation.
  for (const line of text.split("\n")) {
    if (OBSOLETE.some((re) => re.test(line)) && !/\b(no|not|never|without|removed|nothing|none|neither|nor|earlier|old|unreleased)\b/i.test(line)) {
      obsoleteHits.push(`${relative(root, file)}: ${line.trim().slice(0, 90)}`);
    }
  }
}
if (obsoleteHits.length) fail(`obsolete approval/install components mentioned as current:\n${obsoleteHits.slice(0, 10).join("\n")}`);

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
  const catalogPage = readFileSync(join(canonical, "technical/tools-catalog.md"), "utf8");
  for (const name of toolNames) {
    if (!catalogPage.includes(name)) fail(`technical/tools-catalog.md missing catalog tool ${name}`);
  }
}

const docsBuild = spawnSync("npm", ["run", "docs:build"], { cwd: root, encoding: "utf8" });
if ((docsBuild.status ?? 1) !== 0) fail(`docs-site build failed\n${docsBuild.stderr || docsBuild.stdout}`);
if (!existsSync(join(root, "apps/docs-site/.vitepress/dist/index.html"))) {
  fail("docs-site dist missing index.html");
}
console.log(JSON.stringify({ ok: true, canonicalPages: requiredPages.length }, null, 2));
