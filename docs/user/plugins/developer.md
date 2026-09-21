# Praxis Developer

**Install:** Runtime + `praxis-developer.zip`. Architect ZIP is not required if `design/<WP>/` already exists.

**Does:** Status, claim, implementation of the approved change-spec, tests, **Developer complete**, Quality handoff.

**Inputs:** Work Package id or Jira key, Architect handoff, change-spec.

**Creates:** Product code changes, `design/<WP>/dev/completion-evidence.json`, `design/<WP>/dev/quality-handoff.json`.

**Jira writes:** Claim transitions to In Progress. Complete updates Praxis properties and comments. **Complete does not move Jira to Done** and does not start Quality.

## Alpha.35 lifecycle

```
implementation finished
  → required verification (e.g. npm test)
  → completion evidence (real results, not fabricated)
  → Developer → Quality handoff
  → readyForQuality=true
  → Quality review (separate plugin/session)
  → Quality approved
  → Jira Done
```

Preferred persisted states after complete:

- `claim.state`: `active`
- `implementationState`: `complete`
- `qualityState`: `pending` until Quality Apply; then `approved`
- `readyForQuality`: `true`
- Jira: **В работе / In Progress** until Quality Apply moves it to Done

`praxis_developer_status.qualityState` follows `praxis.state` and the local WP manifest. It does **not** stay `pending` merely because `status` is still `ready-for-qa`.

If verification fails, complete is refused (no readyForQuality, no Done).

## Prompts

Status (READ ONLY):

```
Check Developer status for WP-20260914-002.
Show Jira mapping, active claim, and readiness.
Do not change anything.
```

Claim (PREVIEW then WRITE):

```
Prepare a Developer claim for WP-20260914-002.
First show the current Jira status and the available
START_DEVELOPMENT transition.
Do not call claim without confirmation.
```

Implement:

```
Implement only the approved change-spec.
Keep existing changes.
Run the project's configured tests.
Show the diff and verification results.
```

Complete (WRITE, not Done):

```
Prepare Developer completion and the Quality handoff.
Show evidence and expected Jira writes.
Do not start Quality automatically.
Do not move Jira to Done.
```

Premature Done recovery is a **separate** preview/apply (`praxis_developer_complete_recovery_*`). Never auto-repair live Jira during install or tests.
