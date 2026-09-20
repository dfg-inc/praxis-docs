# Full end-to-end tutorial

A person who never opened Praxis should be able to follow this without reading source.

## Scenario

A small **counter** library.

Already exists: `increment()`, `decrement()`.

Requested: `reset()` returns `0`. Existing functions stay unchanged.

This matches the Praxis acceptance product. Issue keys `PRX-1` / `PRX-3` / `PRX-4` and `WP-20260914-002` appear as **examples**. Your Jira keys will differ.

For **each** step: plugin, Skill, prompt, what is read, what is written, expected output, approval, what to verify.

---

### STEP 1 — Create or select Epic

- **Plugin:** none yet (Jira UI) or BA later
- **Skill:** —
- **Prompt:** —
- **Reads:** Jira project
- **Writes:** Epic (if you create one), e.g. `PRX-1`
- **Expected:** Epic exists and is readable
- **Approval:** Jira’s own create
- **Verify:** you know the Epic key

### STEP 2 — Launch Praxis BA

- **Plugin:** Praxis BA (+ Runtime)
- **Skill:** Jira Epic Analysis
- **Prompt:** see step 3
- **Reads:** Runtime, folder, Epic
- **Writes:** nothing yet
- **Expected:** doctor OK
- **Approval:** none
- **Verify:** no `PRAXIS_RUNTIME_UNAVAILABLE`

### STEP 3 — BA proposal

- **Plugin:** BA
- **Skill:** Jira Epic Analysis
- **Prompt (READ / PREVIEW):**

```
Проверь Epic PRX-1 и подготовь BA proposal.
Сначала изучи требования и существующие Story.
Не создавай ничего в Jira автоматически.
Покажи preview и дождись подтверждения.
```

- **Reads:** Epic, children, existing Stories
- **Writes:** local proposal only (not Jira)
- **Expected:** Stories/AC for `reset()`, requirement `E2-FR1` (or your ids)
- **Approval:** wait
- **Verify:** preview lists creates/updates, fingerprint present

### STEP 4 — BA preview

- **Plugin:** BA
- **Skill:** same
- **Prompt:** “Show `praxis_ba_preview` result only.”
- **Reads:** Jira
- **Writes:** none
- **Expected:** `praxis_ba_preview` kind=preview
- **Approval:** none
- **Verify:** fingerprint copied

### STEP 5 — BA apply

- **Plugin:** BA
- **Skill:** same
- **Prompt (WRITE):**

```
Подтверждаю BA apply только для показанного preview
и соответствующего fingerprint.
```

- **Reads:** fingerprint
- **Writes:** canonical Story (example `PRX-3`); may mark duplicates superseded (example `PRX-2`)
- **Expected:** `praxis_ba_apply` ok
- **Approval:** `confirmation=YES` + fingerprint
- **Verify:** status shows canonical Stories, Architect-ready

### STEP 6 — Launch Praxis Architect

- **Plugin:** Praxis Architect (+ Runtime). BA ZIP optional now.
- **Skill:** Plan Jira Epic
- **Prompt:** step 7
- **Reads:** BA handoff, Stories
- **Writes:** none yet
- **Approval:** none
- **Verify:** Architect Skills available without BA plugin if files exist

### STEP 7 — Architecture design

- **Plugin:** Architect
- **Skill:** Plan Jira Epic
- **Prompt:**

```
Продолжи PRX-1 как архитектор. Нужен reset() → 0.
Подготовь design package и Work Package.
Не создавай Jira WP без preview.
```

- **Reads:** repo, Stories, canon
- **Writes:** local `design/<WP>/` drafts
- **Expected:** features such as `FEAT-RESET-IMPL`, `FEAT-RESET-TESTS`
- **Approval:** wait for preview
- **Verify:** change-spec mentions `reset()` / tests, not extra invented AC

### STEP 8 — Work Package preview

- **Plugin:** Architect
- **Skill:** Materialize Work Package / Plan Jira Epic
- **Prompt:**

```
Preview Jira materialization for WP-20260914-002 only.
Do not create sibling work packages.
```

- **Reads:** local WP
- **Writes:** none
- **Expected:** one WP, valid title (not `---`)
- **Approval:** none
- **Verify:** fingerprint; scope = that WP id

### STEP 9 — Architect apply

- **Plugin:** Architect
- **Skill:** same
- **Prompt (WRITE):** “Подтверждаю Architect apply только для показанного WP и fingerprint.”
- **Writes:** Jira Task (example `PRX-4`), links, `architect-developer.handoff.json`
- **Expected:** `readyForDevelopment`
- **Approval:** YES + fingerprint
- **Verify:** `praxis_work_package_show` maps local id ↔ Jira key

### STEP 10 — Launch Praxis Developer

- **Plugin:** Praxis Developer (+ Runtime)
- **Skill:** Developer Status then Implement Work Package
- **Approval:** none to open
- **Verify:** Architect ZIP not required

### STEP 11 — Developer claim

- **Plugin:** Developer
- **Skill:** Claim / Implement
- **Prompt:**

```
Подготовь Developer claim для WP-20260914-002.
Сначала покажи Jira status и transition START_DEVELOPMENT.
Не вызывай claim без подтверждения.
```

Then YES.

- **Writes:** assignee/claim, Jira → **В работе**
- **Expected:** `claim.state=active`
- **Verify:** not Done

### STEP 12 — Implementation plan

- **Plugin:** Developer
- **Skill:** Implement Work Package
- **Prompt:** “Show the change-spec plan only. Do not edit files yet.”
- **Writes:** none
- **Approval:** you accept the plan
- **Verify:** files listed match `reset()` + tests

### STEP 13 — Implement `reset()`

- **Plugin:** Developer
- **Skill:** Implement
- **Prompt:**

```
Реализуй только утверждённый change-spec.
Сохрани существующие increment/decrement.
```

- **Writes:** product files (e.g. `src/counter.js`)
- **Expected:** `reset()` exists and returns `0`
- **Approval:** already given for the plan
- **Verify:** diff is in-scope

### STEP 14 — Run tests

- **Plugin:** Developer
- **Skill:** Implement
- **Prompt:** “Run `.project` quality.test / `npm test`. Do not fabricate results.”
- **Writes:** none (or test output)
- **Expected:** example `5 passed`, `0 failed` on the counter fixture
- **Approval:** none
- **Verify:** exit code 0

### STEP 15 — Developer complete

- **Plugin:** Developer
- **Skill:** Implement
- **Prompt (WRITE):**

```
Подготовь Developer completion и Quality handoff.
Покажи evidence и ожидаемые Jira writes.
Не запускай Quality автоматически.
Не переводи Jira в Готово.
```

- **Writes:** evidence JSON, Praxis properties, comment
- **Expected:** `completed=true`, `readyForQuality=true`, Jira still In Progress
- **Approval:** `confirmation=YES`
- **Verify:** Jira is **not** Done

### STEP 16 — Quality handoff

- **Plugin:** Developer (same complete call)
- **Skill:** —
- **Writes:** `design/<WP>/dev/quality-handoff.json`
- **Expected:** WP, Jira key, Story keys, `E2-FR1`, features, AC (`reset` exists / returns 0 / test / npm test / non-regression)
- **Approval:** included in complete YES
- **Verify:** file exists; Quality can discover it without Jira Done

### STEP 17 — Launch Praxis Quality

- **Plugin:** Praxis Quality (+ Runtime)
- **Skill:** Quality Status / Ensure
- **Prompt:** “Ensure Quality. Do not review yet.”
- **Writes:** may start local Quality service
- **Verify:** BA/Architect/Developer still work if Quality is down

### STEP 18 — Quality review

- **Plugin:** Quality
- **Skill:** Review Work Package
- **Prompt:**

```
Выполни Quality review только для WP-20260914-002.
Проверь evidence, handoff и тесты.
Покажи proposed Jira actions до apply.
```

- **Reads:** evidence, handoff, tests
- **Writes:** none until YES
- **Approval:** wait
- **Verify:** proposed Done transition only on pass

### STEP 19 — Quality approval or bug/revision

- **Plugin:** Quality
- **Prompt (WRITE):** “Подтверждаю только показанный Quality apply.”
- **Writes:** pass → Jira **Готово**; fail → bugs / blocked, not silent Done
- **Approval:** YES
- **Verify:** bugs use numeric type id, not the word «Баг»

### STEP 20 — Final verification

- **Plugin:** Quality or any status Skill
- **Prompt:** “Show final Jira state and evidence paths. Read-only.”
- **Expected:** Done only after Quality; evidence + handoff still on disk
- **Approval:** none
- **Verify:** Story `PRX-3` (example) still canonical; WP `PRX-4` Done
