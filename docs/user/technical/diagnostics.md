# Diagnostics

## praxis_doctor

`praxis_doctor` is read-only. Pass `repo` for the repository to inspect. Main fields of `data`:

| Field | Meaning |
| --- | --- |
| `version`, `repo`, `gitRoot` | Runtime version; resolved repository and Git root (or `null`) |
| `project` | `status` (`loaded`, `missing`, `invalid`), `path`, `suggestedPath` |
| `jira`, `github`, `gitlab` | Which settings are configured (booleans and a `missing` list), never values |
| `providers` | Per provider `state` (`unconfigured`, `partial`, `configured`, `invalid`), `missing` and `invalid` settings |
| `quality` | Local Quality service: `status`, `healthy`, `url`, `pid`, `db` |
| `capabilities` | `praxisRuntime`, `repository`, `localRuntime`, `jiraConfig` (`ok` or `unavailable`) |
| `hostPlaceholdersIgnored` | Settings left blank in the extension (received as `${user_config...}`), treated as unset |
| `dotenvRejected` | Names of trust keys a repository `.env` tried to set (ignored) |
| `approval` | See below |
| `nextSteps` | Concrete actions derived from the above |
| `codes` | Machine codes for unavailable repository, Jira or GitHub API URL |
| `runtime` | `node`, `platform`, `localExecution` |
| `build` | Identity of the running Runtime, see below |

### approval

| Field | Meaning |
| --- | --- |
| `mode` | `client-ui`, `no-dialog`, `trusted-client` or `host-permission` |
| `note` | Plain-language consequence of the mode |
| `decisionLog` | Path of the decision journal for this repository |
| `diagnosticsLog` | Path of `mcp.jsonl` |
| `client` | What the connected client declared: `name`, `version`, `protocolVersion`, `capabilities` (keys), `elicitation` (`declared`, `form`, `url`), `dialog` (can Praxis show a dialog), `flow` (`server-initiated-request` for legacy, `input-required-round-trip` for 2026-07-28), `reason` (why not, when `dialog` is false) |
| `hostGate` | Present when there is no dialog: some hosts hold an apply call at their own tool-permission prompt before it reaches Praxis |

### build

| Field | Meaning |
| --- | --- |
| `version` | Runtime version string (not proof of which build runs) |
| `origin` | `bundle` (shipped file) or `source` |
| `kind` | `production` for shipped bundles; anything else is a test build that must not be installed |
| `sourceDigest` | Digest of the inputs the bundle was built from |
| `coreBaseline` | praxis-core commit the vendored Core was packed from |
| `bundleSha256`, `bundlePath` | Hash and path of the running `praxis-mcp.cjs` |
| `tools` | `count` and `digest` of the sorted tool names (and `names`); expected count 52 |

Compare `bundleSha256` with the file you installed to know which build the client actually loaded.

## Diagnostics log

`~/.praxis/diagnostics/mcp.jsonl` (under `PRAXIS_STATE_HOME` if set). One JSON object per line, with `at` and `pid`. Rotated to `mcp.jsonl.1` above 1 MB. It records names, ids, durations, codes and declared capability keys. It never records arguments, plan text, tokens or file contents. Writes are best effort and never break a call.

| Event | Fields | Meaning |
| --- | --- | --- |
| `server_start` | `version`, `role` | The Runtime process started |
| `tool_enter` | `callId`, `tool`, `client`, `protocol`, `flow`, `capabilities`, `elicitationDeclared`, `dialog`, `reason` | A call reached the Praxis tool handler |
| `input_required` | `callId`, `tool`, `ms` | Modern protocol: Praxis returned `input_required` to ask the dialog; the client retries with the answer |
| `tool_finished` | `callId`, `tool`, `ms`, `ok`, `code` | The call completed, with the result code (or `null`) |
| `tool_failed` | `callId`, `tool`, `ms`, `error` | The handler threw |

## Did a call reach Praxis?

1. Find the call in `mcp.jsonl` by tool name and time.
2. `tool_enter` then `tool_finished` with a small `ms`: Praxis answered; read `code`. For a protected call in a client without a dialog the code is `APPROVAL_CLIENT_UI_REQUIRED` and the time is short.
3. `tool_enter` without `tool_finished` (or with `input_required` and no retry): Praxis is waiting for or lost the dialog answer.
4. No `tool_enter` at all: the call never reached Praxis. Look at the host, which may be holding it at its own tool-permission prompt (Claude Desktop writes `tool_approval_gate ... approvalRequired:true` to its own log in that case).
5. No `server_start` for the expected time: the server did not start in that session; check `PRAXIS_RUNTIME_UNAVAILABLE` cases in [Troubleshooting](./troubleshooting.md).

The server also writes startup lines to stderr (`[praxis-mcp] version=...`, `role=...`, `transport=stdio`, `protocol=modern+legacy`, `ready`), and `PRAXIS_MCP_ROLE_INVALID` or `PRAXIS_MCP_START_FAILED` when it cannot start.

## Report tools

| Tool | Where | Purpose |
| --- | --- | --- |
| `npm run report:tool-origins` | praxis-runtime | Starts each known Runtime build as a stdio server and prints bundle sha256, build kind, tool count and tool-name digest per origin. A host whose tool list differs from the row of the build it claims to run holds a stale tool registry and needs a new session, not a new version number. Read-only; it only starts servers in a temporary directory |
| `node tools/scripts/verify-release-candidate.mjs --installed-extension=... --installed-plugins=...` | praxis-marketplace | Compares an installed extension and installed role plugins with the source |
| `praxis_quality_report` | Runtime tool | Not a diagnostics report: an alias of `praxis_quality_review` |
