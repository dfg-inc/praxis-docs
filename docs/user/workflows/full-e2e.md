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
Inspect Epic PRX-1 and prepare a BA proposal.
Study the requirements and existing Stories first.
Do not create anything in Jira automatically.
Show the preview and wait for confirmation.
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
I confirm BA apply only for the shown preview
and the matching fingerprint.
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
Continue PRX-1 as Architect. Need reset() → 0.
Prepare the design package and Work Package.
Do not create a Jira WP without preview.
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
- **Prompt (WRITE):** “I confirm Architect apply only for the shown WP and fingerprint.”
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
Prepare a Developer claim for WP-20260914-002.
First show the Jira status and the START_DEVELOPMENT transition.
Do not call claim without confirmation.
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
Implement only the approved change-spec.
Keep existing increment/decrement.
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
Prepare Developer completion and the Quality handoff.
Show evidence and expected Jira writes.
Do not start Quality automatically.
Do not move Jira to Done.
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
- **Skill:** Quality Status then Ensure
- **Prompt:** “Run praxis_quality_ensure. Do not review yet.”
- **Writes:** starts the bundled Quality service; creates `.praxis-quality/` only after a successful start
- **Verify:** BA/Architect/Developer still work if Quality is down

### STEP 18 — Quality review

- **Plugin:** Quality
- **Skill:** Review Work Package
- **Prompt:**

```
Review WP-20260914-002.
Run praxis_quality_review.
Show the four acceptance checks, Quality's own npm test, evidence, and SQLite review.
Do not write Jira.
```

- **Reads:** evidence, handoff, change-spec, tests via Quality Service
- **Writes:** local QA evidence and Quality SQLite only
- **Approval:** none (review is not Jira approval)
- **Verify:** PRX-4 remains In Progress; `jiraMutated=false`

### STEP 19 — Quality apply preview and approval

- **Plugin:** Quality
- **Prompt:** “Show the Quality apply preview.” Compare the exact Jira writes (issue, properties, managed comment, numeric transition, local manifest, Quality SQLite). Then, after you accept: “I confirm only the shown Quality apply.”
- **Writes:** none on preview. Apply executes **that** plan: QA report, bookkeeping properties, managed comment, the **approved numeric** Done transition (**Готово**), then `qualityState=approved`; fail → previewed bugs, not silent Done
- **Approval:** YES + the **current** `previewFingerprint` on `praxis_quality_apply` only. After a Runtime upgrade, generate a **new** preview. Do not reuse an older fingerprint.
- **Verify:** bugs use numeric type id, not the display name Bug; local `qualityState` matches Jira; Apply MCP `ok` is false if any postcondition is pending
- **Stop:** wait for human approval. Do not auto-apply.

### STEP 20 — Final verification

- **Plugin:** Quality or any status Skill
- **Prompt:** “Show final Jira state and evidence paths. Read-only.”
- **Expected:** Done only after Quality; evidence + handoff still on disk
- **Approval:** none
- **Verify:** Story `PRX-3` (example) still canonical; WP `PRX-4` Done

### STEP 21 — Git Status

- **Plugin:** Developer
- **Skill:** Git Status
- **Prompt:** “Check Git Delivery for WP-20260914-002. Read-only.”
- **Expected:** `remoteConfigured=false` until the user names a GitHub URL. No Jira writes.

### STEP 22 — Connect GitHub

- **Skill:** Connect Git
- **Approval:** YES + connect fingerprint
- **Writes:** `git remote add` or `git remote set-url` (HTTPS ↔ SSH on the same origin). Never a second `origin`. Never push. Re-read the actual URL after apply.

### STEP 23 — Commit approved files

- **Skill:** Prepare Git Delivery then Commit Approved Changes
- **Expected:** hashes match Quality Review snapshot; only allowlist files committed

### STEP 24 — Publish and Pull Request

- **Skill:** Publish Branch then Create Merge Request
- **Empty GitHub repo:** preview shows `sourceBranch=master`, `targetRemoteBranch=main`, exact refspec `<SHA>:refs/heads/main`, then approved baseline, then feature branch, then PR onto **main**
- **Never:** force-push, merge, fabricate CI PASS, transition PRX-4, rename local master, create remote master
- **Walkthrough:** [GitHub Delivery](/workflows/github-delivery)

