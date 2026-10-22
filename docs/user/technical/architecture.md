# Architecture

Praxis 0.1.0-alpha.48 is a local-first workflow. Everything runs on the user's machine as a stdio MCP server started by the client. There is no hosted Praxis service, no Broker and no system service to install.

## Components

| Component | Repository | What it is | Shipped as |
| --- | --- | --- | --- |
| Core | `dfg-inc/praxis-core` | Library packages: contracts (workflow, approval, authority), project config, knowledge rules, Jira and VCS libraries, the `praxis` CLI operations, plugin SDK. Not installed by users. | Vendored tarballs (`vendor/*.tgz`) inside Runtime and the role repositories |
| Runtime | `dfg-inc/praxis-runtime` | The single MCP server (`praxis_*` tools) and the bundled local Quality HTTP service. Bundles Core. | `server/praxis-mcp.cjs` inside the `praxis-runtime` plugin and inside `praxis-runtime.mcpb` |
| Role plugins | `praxis-ba`, `praxis-architect`, `praxis-developer`, `praxis-quality` | Skills, prompts and hooks for one role. They contain no MCP server. | Plugin directories in the marketplace; `praxis-<role>.zip` |
| Bundle plugin | `praxis-marketplace` (`plugins/praxis`) | One getting-started skill and `dependencies` on the five plugins below it | Marketplace entry `praxis` |
| Marketplace | `dfg-inc/praxis-marketplace` | `.claude-plugin/marketplace.json` plus staged copies of the plugins | Git repository added by `dfg-inc/praxis-marketplace` |
| Desktop MCPB | `praxis-runtime` (`claude-extensions`) | The same Runtime packaged as a Claude Desktop extension, with a settings form | `praxis-runtime.mcpb` |

Core is a library: the user never installs it, and it has no tools of its own. A Runtime build records which Core commit it was packed from (`build.coreBaseline` in `praxis_doctor`).

## One Runtime per client

The Runtime is launched as `node server/praxis-mcp.cjs --role runtime` and exposes all 52 tools. Role plugins do not start their own server. Roles differ only in skills; the role filter in the tool catalog exists but the shipped plugin and MCPB both use `--role runtime`.

Where the Runtime comes from depends on the client:

| Client | Runtime source |
| --- | --- |
| Claude Code CLI, Desktop Code, Cowork | The `praxis-runtime` plugin (`.mcp.json` with `${CLAUDE_PLUGIN_ROOT}/server/praxis-mcp.cjs`), installed as a dependency of any role plugin |
| Claude Desktop Chat | `praxis-runtime.mcpb` installed in Settings, Extensions |
| Claude Web Chat | None. Skills only; no remote Praxis service exists |

Installing both the plugin and the MCPB in the same client gives two servers with the same tool names. See [Troubleshooting](./troubleshooting.md), duplicate Runtime.

## Data flow

```
Action -> Preview -> Approval -> Execute -> Result
```

1. **Action.** The agent (guided by a role skill) selects a tool.
2. **Preview.** For anything that changes state outside the agent's own notes, a read-only `*_preview` tool returns the exact plan and a `previewFingerprint`. Nothing is written.
3. **Approval.** The agent calls the matching `*_apply` tool with `confirmation=YES` and the fingerprint. For the 15 protected apply tools Praxis then obtains approval: the client's own dialog (Approval Required, default), or, if the owner opted in, Trusted Client or host-permission. See [Security model](./security-model.md).
4. **Execute.** The write runs inside a mutation lease issued by that approval. A stale preview is refused before anyone is asked.
5. **Result.** The tool returns an envelope (`ok`, `code`, `data`, `errors`). A protected result carries `approval[]` with channel and assurance. The decision is appended to the decision journal.

Agent-authored workflow records (a requirement, a handoff, a verdict) do not need approval. Human acts (confirming a Story, confirming a decision, approving a service) do.

## Where state lives

| Location | Content | Notes |
| --- | --- | --- |
| `.project` (repository root) | Project file created by `praxis_project_init_preview` and `praxis_project_init_apply` | Written only after approval |
| `.praxis/workflow/items/WORK_ITEM_ID.json` | Requirements, Stories, decisions, handoffs, verdicts, implementation records for one work item | Team record; see `PRAXIS-STATE-POLICY.md` in praxis-runtime for what to commit |
| `.praxis/workflow/index.json` | Current selection cache | Not tracked; rebuilt from `items/` |
| `.praxis/quality/` | Quality checks, adapter, proposals | Tracked per the state policy |
| `.praxis-quality/` | Local Quality service state (SQLite database `quality.sqlite`, log) | Local to the machine |
| `~/.praxis/decisions/HASH.jsonl` | Decision journal, one file per repository (sha256 of the repository path, first 16 hex characters) | Outside the repository; `PRAXIS_STATE_HOME` relocates `~/.praxis` |
| `~/.praxis/diagnostics/mcp.jsonl` | Call events (no arguments), rotated at 1 MB | See [Diagnostics](./diagnostics.md) |
| Extension settings (Desktop) | Jira, GitHub, GitLab settings and approval mode | Tokens in the OS secret vault |

The decision journal is deliberately not in the repository: it cannot be committed with the project or edited as part of it, and it is never read back as an authorization.

## Local-first

Jira, SimpleOne, GitHub and GitLab are optional. The local scenarios (`praxis_project_init_*`, `praxis_workflow_*`, the BA, Architect, Developer and Quality local workflows) need none of them. A missing integration returns an explicit code such as `JIRA_CONFIG_UNAVAILABLE` for the tools that need it; local features are unaffected.
