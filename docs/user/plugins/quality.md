# Praxis Quality

**Install:** Runtime + `praxis-quality.zip`. Developer ZIP is not required if evidence and `developer.quality.handoff` already exist.

**Does:** Ensure the Quality HTTP service, inspect Developer evidence/handoff/AC, run project tests, pass/fail/block, optional bugs, **Done** on approval.

## Quality service (alpha.36)

The Quality HTTP service is **bundled inside Praxis Runtime** (`server/praxis-quality.cjs` in the MCPB). Ordinary users do not install npm packages, run `make quality-up`, or start a Node server.

| Tool | What it does |
|------|----------------|
| `praxis_quality_status` | Read-only. `not_started` / `healthy` / `unavailable` / `failed`. Does **not** start the service. |
| `praxis_quality_ensure` | Starts the service if needed, waits for `/health`, reuses a healthy instance. Does **not** run review, create bugs, or mark Done. |
| `praxis_quality_review` | Separate human-approved QA write. |

**When it starts:** only when you (or the Quality Skill) call `praxis_quality_ensure`. Praxis Runtime startup does **not** start Quality. BA, Architect, and Developer do not need it.

**Healthy** means the service answered `/health` for **this** repository. **Unavailable / not_started** means it is not running yet — call ensure. That is not a reason to stop BA/Architect/Developer.

On failure, Praxis returns a structured code (`QUALITY_PACKAGE_MISSING`, `QUALITY_STARTUP_FAILED`, `QUALITY_PROCESS_EXITED`, `QUALITY_PORT_UNAVAILABLE`, `QUALITY_DB_INIT_FAILED`, `QUALITY_HEALTH_TIMEOUT`) with `stage`, `durationMs`, `healthUrl`, and `logPath` when available. Do not edit Praxis source to work around a startup defect.

SQLite is created at `.praxis-quality/quality.sqlite` **only after** a successful start.

**Jira writes:** After preview of findings. `praxis_quality_review` with `confirmation=YES`. Passing review is what may transition Jira to **Done** (localized name **Готово** on some sites).

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

Review (PREVIEW then WRITE):

```
Run Quality review only for WP-20260914-002.
Check all acceptance criteria and the existing tests.
Show evidence and proposed Jira actions before apply.
```

Approval (WRITE):

```
I confirm only the shown Quality apply.
Do not perform extra Jira transitions
or bug creation outside the approved plan.
```
