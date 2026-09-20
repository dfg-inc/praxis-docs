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
- `implementation.state`: `complete`
- `quality.state`: `pending`
- `readyForQuality`: `true`
- Jira: **В работе / In Progress**

If verification fails, complete is refused (no readyForQuality, no Done).

## Prompts

Status (READ ONLY):

```
Проверь Developer status для WP-20260914-002.
Покажи Jira mapping, active claim и readiness.
Ничего не изменяй.
```

Claim (PREVIEW then WRITE):

```
Подготовь Developer claim для WP-20260914-002.
Сначала покажи текущий Jira status и доступный
transition для START_DEVELOPMENT.
Не вызывай claim без подтверждения.
```

Implement:

```
Реализуй только утверждённый change-spec.
Сохрани существующие изменения.
Запусти предусмотренные проектом тесты.
Покажи diff и verification results.
```

Complete (WRITE, not Done):

```
Подготовь Developer completion и Quality handoff.
Покажи evidence и ожидаемые Jira writes.
Не запускай Quality автоматически.
Не переводи Jira в Готово.
```

Premature Done recovery is a **separate** preview/apply (`praxis_developer_complete_recovery_*`). Never auto-repair live Jira during install or tests.
