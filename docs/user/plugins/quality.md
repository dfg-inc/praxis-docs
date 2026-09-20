# Praxis Quality

**Install:** Runtime + `praxis-quality.zip`. Developer ZIP is not required if evidence and `developer.quality.handoff` already exist.

**Does:** Ensure Quality runtime, inspect Developer evidence/handoff/AC, run project tests, pass/fail/block, optional bugs, **Done** on approval.

**When to start Quality runtime:** only in the Quality role via `praxis_quality_ensure`. Unhealthy Quality is **not** a reason BA/Architect/Developer cannot run.

**Jira writes:** After preview of findings. `praxis_quality_review` with `confirmation=YES`. Passing review is what may transition Jira to **Готово / Done**.

Readiness is **not** “Jira is Done”. Look at:

- `design/<WP>/dev/completion-evidence.json`
- `design/<WP>/dev/quality-handoff.json`
- acceptance checks from the Architect change-spec

## Prompts

Readiness (READ ONLY):

```
Проверь готовность WP-20260914-002 к QA.
Найди Developer evidence, handoff и acceptance checks.
Не создавай bugs и не меняй Jira.
```

Review (PREVIEW then WRITE):

```
Выполни Quality review только для WP-20260914-002.
Проверь все acceptance criteria и существующие тесты.
Покажи evidence и proposed Jira actions до apply.
```

Approval (WRITE):

```
Подтверждаю только показанный Quality apply.
Не выполняй дополнительных Jira transitions
или bug creation вне утверждённого плана.
```
