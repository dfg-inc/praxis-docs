# Praxis Quality

**Install:** Runtime + `praxis-quality.zip`. Developer ZIP is not required if evidence and `developer.quality.handoff` already exist.

**Does:** Ensure the Quality HTTP service, run Quality Review (acceptance checks + own tests + persisted evidence), then a separate human-gated Quality Apply for Jira.

## Quality service (alpha.38–alpha.39)

The Quality HTTP service is **bundled inside Praxis Runtime** (`server/praxis-quality.cjs` plus `server/sql-wasm.wasm` in the MCPB). Ordinary users do **not** install Node.js, SQLite, npm packages, or start a background process.

Claude Desktop already runs Praxis Runtime as JavaScript. `praxis_quality_ensure` starts Quality **inside that Runtime** (a worker thread) when the Desktop executable is not an ordinary Node CLI. You do not install Node 22/24 and you do not start a service in Terminal.

If built-in `node:sqlite` is unavailable, Quality uses packaged **sql.js** WASM. No separate SQLite install.

On machines where Praxis runs under a normal `node` binary (CLI, CI), Quality is still a detached child process.

| Tool | What it does |
|------|----------------|
| `praxis_quality_status` | Read-only. Runtime health plus Quality lifecycle when `workPackage` is given. Does **not** start the service. |
| `praxis_quality_ensure` | Starts the service if needed, waits for `/health`, reuses a healthy instance. Does **not** run review, create bugs, or mark Done. |
| `praxis_quality_review` | Executes Quality Review through the Quality HTTP Service. Runs change-spec acceptance checks and the project's tests, persists QA evidence and Quality SQLite. Does **not** write Jira. No confirmation. |
| `praxis_quality_report` | Safe alias of `praxis_quality_review`. Not a Jira write. |
| `praxis_quality_review_show` | Read-only GET of a Quality Review by id from Quality storage. Does **not** start Quality and does **not** write Jira. |
| `praxis_quality_apply_preview` | Read-only proposed Jira writes for the persisted review. Returns `previewFingerprint`. |
| `praxis_quality_apply_status` | Read-only postconditions: Jira properties, managed comment, local manifest, apply journal, consistency. No writes. |
| `praxis_quality_apply` | Writes the approved plan. Requires `confirmation=YES` and the current fingerprint. |

**When it starts:** only when you (or the Quality Skill) call `praxis_quality_ensure`. Praxis Runtime startup does **not** start Quality. BA, Architect, and Developer do not need it.

**Healthy** means the service answered `/health` for **this** repository. **not_started** means it has not been ensured yet. **stopped** means a previously known worker/process is gone (`lastKnownPid` is not running). **unknown** means `/health` failed and the supervisor did not record an exit. Call ensure to recover. That is not a reason to stop BA/Architect/Developer.

## Canonical qualityState

Public status tools (`praxis_developer_status`, `praxis_quality_status`, `praxis_quality_apply_status`) share one Quality lifecycle:

| Field | Meaning | Canonical source |
|------|---------|------------------|
| `implementationState` | Developer complete | local manifest / `praxis.state` |
| `readyForQuality` | Handoff exists | local manifest / `praxis.state` |
| `claim.state` | Developer ownership | `praxis.claim` |
| `qualityState` | QA approval | `praxis.state.qualityState`, then local `manifest.qualityState` |
| `appliedReviewId` | Which review was applied | `praxis.qualityAppliedReviewId` / `praxis.state.reviewId` |

`status=ready-for-qa` is **not** `qualityState`. After Quality Apply, `qualityState=approved` even if the local WP `status` remains `ready-for-qa`.

`praxis.workPackageManifest` is a Jira snapshot of WP membership, claim, and the last Architect/Developer write. It is **not** the source of current `qualityState`. Status tools ignore it for Quality approval and do not rewrite Developer claim.

Read-only status never reconciles Jira. If sources diverge, tools report `qualityConsistency=divergent` with `source` / `actualValue` / `expectedValue` / `diagnosticCode`. That is not an Apply.

On Desktop, Quality in **worker** mode lives inside the Praxis Runtime MCP process. If Claude Desktop starts a new Runtime process, the previous worker exits with it. `praxis_quality_status` then shows `stopped` or `unknown` with `lastKnownPid` and `logPath`. Call `praxis_quality_ensure` again (idempotent; same repo database). This live Desktop lifetime is still **pending validation** after install; Docker/MCPB tests are not a LIVE Desktop pass.

On failure, Praxis returns a structured code (`QUALITY_PACKAGE_MISSING`, `QUALITY_STARTUP_FAILED`, `QUALITY_SPAWN_FAILED`, `QUALITY_EXECUTABLE_NOT_FOUND`, `QUALITY_PROCESS_EXITED`, `QUALITY_PORT_UNAVAILABLE`, `QUALITY_DB_INIT_FAILED`, `QUALITY_HEALTH_TIMEOUT`, `QUALITY_SQLITE_UNAVAILABLE`, `QUALITY_SQLITE_MODULE_LOAD_FAILED`, `QUALITY_CHILD_RUNTIME_MISMATCH`, `QUALITY_NODE_UNSUPPORTED`) with `stage`, `nodeVersion`, `nodeExecutable`, `parentNodeExecutable`, `spawnErrorCode`, `exitCode`, `durationMs`, and `logPath` when available. A missing pid is **not** treated as a complete diagnosis. Do not edit Praxis source to work around a startup defect.

SQLite is created at `.praxis-quality/quality.sqlite` **only after** a successful start. The service listens on port **8792** (`http://127.0.0.1:8792/health`) unless `PRAXIS_QUALITY_PORT` is set for debugging.

A second `praxis_quality_ensure` on a healthy service returns `reused=true` and keeps the same process.

## Review vs apply

Quality Review uses the real Quality Service (`POST /reviews/work-package`). It reads Developer evidence and the change-spec, executes every acceptance check, runs Quality's own `.project` `quality.test` command, and stores:

- Quality SQLite `reviews` / `audits`
- `design/<WP>/qa/quality-review.json`

It does **not** transition Jira, post comments, set properties, or create Bugs.

Jira approval is a separate lifecycle:

1. `praxis_quality_apply_preview` — exact actions, discovered transition id, fingerprint
2. Human approval
3. `praxis_quality_apply` with `confirmation=YES` and that fingerprint

A PASSED review may then set the QA report, bookkeeping properties (`praxis.qualityAppliedReviewId`, `praxis.qualityCommentId`), managed comment, the **approved numeric transition** (not a silently chosen alternative Done transition), then `qualityState=approved`, and the local WP manifest. Quality SQLite is marked applied last.

Apply rejects a stale preview (`QUALITY_PREVIEW_STALE`) if Jira status, the approved transition id, or its target changed **before the first write**. Retry the **same** fingerprint after a partial Apply: completed journal operations are skipped; a Done status is accepted only when this Apply recorded the transition. If Jira is already Done and the journal cannot prove this Apply did it, Praxis returns `QUALITY_RECONCILIATION_REQUIRED` instead of inventing success.

The MCP envelope for `praxis_quality_apply` is `ok=false` when `data.ok` is false (partial or postcondition failure). Check `data.pending`, `data.jiraTransitioned`, `data.localStateReconciled`, and `data.qualityStoreReconciled`.

Do not reuse an older preview fingerprint after generating a new preview (including after upgrading Runtime). Alpha.39 fingerprints are not valid for alpha.40.

If product source changes after review, the snapshot is stale: run a new review, then a new preview. Do not apply an old PASSED fingerprint.

Readiness is **not** “Jira is Done”. Look at:

- `design/<WP>/dev/completion-evidence.json`
- `design/<WP>/dev/quality-handoff.json`
- acceptance checks from the Architect change-spec

Quality re-runs the project's tests. It must not merely trust Developer's previous `exitCode=0`.

## Prompts

Status (READ ONLY):

```
Run praxis_quality_status. If Quality is not_started, say so.
Do not start it. Do not create bugs and do not change Jira.
```

Ensure (starts service only):

```
Run praxis_quality_ensure. Wait until Quality is healthy.
Do not run Quality Review and do not write Jira.
```

Readiness (READ ONLY):

```
Check whether WP-20260914-002 is ready for QA.
Find Developer evidence, the Quality handoff, and acceptance checks.
Do not create bugs and do not change Jira.
```

Review (not Jira approval):

```
Review WP-20260914-002.
Run praxis_quality_review. Show the acceptance matrix, test counts, findings, and evidence.
Do not write Jira.
```

Apply preview:

```
Show the Quality apply preview for WP-20260914-002.
Do not apply and do not write Jira.
```

Apply (WRITE):

```
I confirm only the shown Quality apply.
Use confirmation=YES and the shown previewFingerprint.
Do not perform extra Jira transitions
or bug creation outside the approved plan.
```
