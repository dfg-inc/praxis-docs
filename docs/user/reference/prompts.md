# Prompt library

Copy into Claude. Every prompt is tagged **READ ONLY**, **PREVIEW**, or **WRITE/APPLY**. Do not treat WRITE prompts as inspection.

Replace keys with yours. `WP-20260914-002` / `PRX-1` / `PRX-3` / `PRX-4` are the Praxis counter **example**, not a universal requirement.

## BA

**READ ONLY — inspect Epic**

```
Проверь Epic PRX-1. Покажи существующие Story, canonical и superseded.
Ничего не создавай и не обновляй в Jira.
```

**PREVIEW — proposal**

```
Проверь Epic PRX-1 и подготовь BA proposal.
Сначала изучи требования и существующие Story.
Не создавай ничего в Jira автоматически.
Покажи preview и дождись подтверждения.
```

**WRITE — approved apply**

```
Подтверждаю BA apply только для показанного preview
и соответствующего fingerprint.
```

**READ ONLY — resume / canonical Story**

```
Покажи BA status PRX-1, canonical Stories,
superseded issues и готовность к Architect.
Ничего не изменяй.
```

## Architect

**READ ONLY — intake**

```
Покажи Architect status для Epic PRX-1. Ничего не изменяй.
```

**PREVIEW — analyze / design / one WP**

```
Проанализируй репозиторий и подготовь design для reset().
Preview materialization only for WP-20260914-002.
Do not create sibling work packages. Wait for approval.
```

**WRITE — approved apply**

```
Подтверждаю Architect apply только для показанного WP и fingerprint.
```

**READ ONLY — verify Jira**

```
Покажи mapping WP-20260914-002 → Jira key и title. Ничего не изменяй.
```

**READ ONLY — resume**

```
Resume architecture for PRX-1 from existing design/. Read-only first.
```

## Developer

**READ ONLY — WP status**

```
Проверь Developer status для WP-20260914-002.
Покажи Jira mapping, active claim и readiness.
Ничего не изменяй.
```

**PREVIEW — claim**

```
Подготовь Developer claim для WP-20260914-002.
Сначала покажи текущий Jira status и доступный
transition для START_DEVELOPMENT.
Не вызывай claim без подтверждения.
```

**WRITE — approved claim**

```
Подтверждаю claim только для WP-20260914-002 и показанного START_DEVELOPMENT.
confirmation=YES.
```

**PREVIEW — implementation plan**

```
Покажи plan по change-spec. Файлы не меняй.
```

**WRITE — implement**

```
Реализуй только утверждённый change-spec.
Сохрани существующие изменения.
Запусти предусмотренные проектом тесты.
Покажи diff и verification results.
```

**READ ONLY — verify**

```
Покажи последний test command, exit code, passed/failed. Не complete.
```

**PREVIEW — complete**

```
Подготовь Developer completion и Quality handoff.
Покажи evidence и ожидаемые Jira writes.
Не запускай Quality автоматически.
Не переводи Jira в Готово.
```

**WRITE — approved complete**

```
Подтверждаю praxis_developer_complete для WP-20260914-002.
confirmation=YES. Не стартуй Quality.
```

**READ ONLY — resume**

```
Resume Developer work on WP-20260914-002. Status first. No writes.
```

## Quality

**READ ONLY — ensure / inspect**

```
praxis_quality_status. Если unhealthy — покажи, но не блокируй другие роли.
```

```
Проверь готовность WP-20260914-002 к QA.
Найди Developer evidence, handoff и acceptance checks.
Не создавай bugs и не меняй Jira.
```

**PREVIEW — review**

```
Выполни Quality review только для WP-20260914-002.
Проверь все acceptance criteria и существующие тесты.
Покажи evidence и proposed Jira actions до apply.
```

**PREVIEW — failed review / bugs**

```
Покажи proposed bugs (numeric type id, not «Баг»). Не создавай их.
```

**WRITE — approved bugs**

```
Подтверждаю только показанное создание bugs и fingerprint/plan.
```

**WRITE — successful review / final approval**

```
Подтверждаю только показанный Quality apply.
Не выполняй дополнительных Jira transitions
или bug creation вне утверждённого плана.
```

## Troubleshooting

**READ ONLY — Runtime unavailable**

```
praxis_doctor отсутствует? Объясни PRAXIS_RUNTIME_UNAVAILABLE.
Не предлагай CLI или launchctl. Как включить Praxis Runtime MCPB?
```

**READ ONLY — Jira config missing**

```
JIRA_CONFIG_UNAVAILABLE. Куда открыть Settings → Extensions → Praxis Runtime.
Не проси токен в чат.
```

**READ ONLY — invalid .project**

```
Покажи praxis_project_init_preview. Не пиши .project без confirmation=YES.
```

**READ ONLY — transition unavailable**

```
Покажи availableTransitions (id, name, toStatus) для WP.
Не подставляй id вручную.
```

**READ ONLY — stale fingerprint**

```
Fingerprint не совпал. Сделай новый preview. Не apply.
```

**READ ONLY — claim conflict**

```
Покажи кто держит claim. Не force-release без отдельного YES.
```

**READ ONLY — missing Quality handoff**

```
Есть ли design/WP-…/dev/quality-handoff.json и completion-evidence.json?
Не считай Jira Done готовностью QA.
```

**READ ONLY — interrupted**

```
Status first for this role. List artifacts. Propose resume. No writes.
```

**READ ONLY — inconsistent Jira/local**

```
Сравни Jira statusCategory, local claim.state, evidence, handoff.
Если Done без evidence — только recovery PREVIEW.
```

## Recovery

**PREVIEW**

```
Сгенерируй praxis_developer_complete_recovery_preview для WP-20260914-002.
Покажи proposed changes. Ничего не применяй.
```

**WRITE** (separate human approval)

```
Подтверждаю recovery apply только для показанного previewFingerprint.
Восстанови development status и evidence/handoff.
Не запускай Quality.
```

## Status / inspection

Use the READ ONLY status prompts above. Never bundle them with apply.
