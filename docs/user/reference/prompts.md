# Prompt library

Copy into Claude. Every prompt is tagged **READ ONLY**, **PREVIEW**, or **WRITE/APPLY**. Do not treat WRITE prompts as inspection.

Replace keys with yours. `WP-20260914-002` / `PRX-1` / `PRX-3` / `PRX-4` are the Praxis counter **example**, not a universal requirement.

## BA

**READ ONLY — inspect Epic**

```
Inspect Epic PRX-1. Show existing Stories, canonical vs superseded.
Do not create or update anything in Jira.
```

**PREVIEW — proposal**

```
Inspect Epic PRX-1 and prepare a BA proposal.
Study the requirements and existing Stories first.
Do not create anything in Jira automatically.
Show the preview and wait for confirmation.
```

**WRITE — approved apply**

```
I confirm BA apply only for the shown preview
and the matching fingerprint.
```

**READ ONLY — resume / canonical Story**

```
Show BA status for PRX-1: canonical Stories,
superseded issues, and Architect readiness.
Do not change anything.
```

## Architect

**READ ONLY — intake**

```
Show Architect status for Epic PRX-1. Do not change anything.
```

**PREVIEW — analyze / design / one WP**

```
Analyze the repository and prepare a design for reset().
Preview materialization only for WP-20260914-002.
Do not create sibling work packages. Wait for approval.
```

**WRITE — approved apply**

```
I confirm Architect apply only for the shown WP and fingerprint.
```

**READ ONLY — verify Jira**

```
Show the mapping WP-20260914-002 → Jira key and title. Do not change anything.
```

**READ ONLY — resume**

```
Resume architecture for PRX-1 from existing design/. Read-only first.
```

## Developer

**READ ONLY — WP status**

```
Check Developer status for WP-20260914-002.
Show Jira mapping, active claim, and readiness.
Do not change anything.
```

**PREVIEW — claim**

```
Prepare a Developer claim for WP-20260914-002.
First show the current Jira status and the available
START_DEVELOPMENT transition.
Do not call claim without confirmation.
```

**WRITE — approved claim**

```
I confirm claim only for WP-20260914-002 and the shown START_DEVELOPMENT.
confirmation=YES.
```

**PREVIEW — implementation plan**

```
Show the plan from the change-spec. Do not change files.
```

**WRITE — implement**

```
Implement only the approved change-spec.
Keep existing changes.
Run the project's configured tests.
Show the diff and verification results.
```

**READ ONLY — verify**

```
Show the last test command, exit code, passed/failed. Do not complete.
```

**PREVIEW — complete**

```
Prepare Developer completion and the Quality handoff.
Show evidence and expected Jira writes.
Do not start Quality automatically.
Do not move Jira to Done.
```

**WRITE — approved complete**

```
I confirm praxis_developer_complete for WP-20260914-002.
confirmation=YES. Do not start Quality.
```

**READ ONLY — resume**

```
Resume Developer work on WP-20260914-002. Status first. No writes.
```

**READ ONLY — Git Status**

```
Check Git Delivery status for WP-20260914-002.
If there is no remote, say so. Do not guess a GitHub URL.
Do not change anything.
```

**PREVIEW — Connect GitHub**

```
Prepare connecting this repo to
https://github.com/hisagedru/praxis-acceptance-test
Show the preview. Do not add the remote yet.
```

**PREVIEW — Git Delivery**

```
Prepare Git Delivery for WP-20260914-002.
Recompute hashes against Quality Review 1.
Do not create a branch or commit.
```

**WRITE — commit / publish / PR (separate approvals)**

```
I confirm only the shown Git commit fingerprint.
Do not push until I approve publish.
Do not open a pull request until I approve that step.
Do not merge. Do not write Jira.
```

## Quality

**READ ONLY — status**

```
Run praxis_quality_status. If Quality is not_started or unavailable,
say so. Do not start it. Unhealthy Quality must not block other roles.
```

**PREVIEW — ensure (starts the service, no review)**

```
Run praxis_quality_ensure for this repository.
Start the Quality service if needed, wait until it is healthy,
then show health. Do not run Quality Review and do not write Jira.
```

**READ ONLY — inspect evidence**

```
Check whether WP-20260914-002 is ready for QA.
Find Developer evidence, the Quality handoff, and acceptance checks.
Do not create bugs and do not change Jira.
```

**PREVIEW — review**

```
Review WP-20260914-002.
Run praxis_quality_review.
Check all acceptance criteria and Quality's own tests.
Show evidence. Do not write Jira.
```

**PREVIEW — apply**

```
Show the Quality apply preview for WP-20260914-002.
Do not apply.
```

**PREVIEW — failed review / bugs**

```
Show proposed bugs (numeric type id, not the display name Bug). Do not create them.
```

**WRITE — approved bugs / apply**

```
I confirm only the shown Quality apply.
confirmation=YES and the shown previewFingerprint.
Do not perform extra Jira transitions
or bug creation outside the approved plan.
```

## Troubleshooting

**READ ONLY — Runtime unavailable**

```
praxis_doctor is missing? Explain PRAXIS_RUNTIME_UNAVAILABLE.
Do not suggest CLI or launchctl. How do I enable the Praxis Runtime MCPB?
```

**READ ONLY — Jira config missing**

```
JIRA_CONFIG_UNAVAILABLE. Where to open Settings → Extensions → Praxis Runtime.
Do not ask for the token in chat.
```

**READ ONLY — invalid .project**

```
Show praxis_project_init_preview. Do not write .project without confirmation=YES.
```

**READ ONLY — transition unavailable**

```
Show availableTransitions (id, name, toStatus) for the WP.
Do not invent transition ids.
```

**READ ONLY — stale fingerprint**

```
Fingerprint mismatch. Make a new preview. Do not apply an older hash.
Do not reuse a previous Runtime's Quality Apply fingerprint.
```

**READ ONLY — Quality Apply stale Jira**

```
QUALITY_PREVIEW_STALE. Show current Jira status and available transitions.
Generate a new Quality apply preview. Do not apply the old fingerprint.
```

**READ ONLY — Quality Apply partial**

```
Quality Apply did not complete. Show completed, pending, jiraTransitioned,
localStateReconciled, qualityStoreReconciled. Retry the same fingerprint.
Do not create a new review.
```

**READ ONLY — claim conflict**

```
Show who holds the claim. Do not force-release without a separate YES.
```

**READ ONLY — missing Quality handoff**

```
Does design/WP-…/dev/quality-handoff.json and completion-evidence.json exist?
Do not treat Jira Done as QA readiness.
```

**READ ONLY — Quality ensure failed**

```
praxis_quality_ensure failed. Show code, stage, durationMs, healthUrl, logPath.
Do not tell me to run make quality-up or npm start.
```

**READ ONLY — interrupted**

```
Status first for this role. List artifacts. Propose resume. No writes.
```

**READ ONLY — inconsistent Jira/local**

```
Compare Jira statusCategory, local claim.state, evidence, and handoff.
If Done without evidence — recovery PREVIEW only.
```

## Recovery

**PREVIEW**

```
Generate praxis_developer_complete_recovery_preview for WP-20260914-002.
Show proposed changes. Apply nothing.
```

**WRITE** (separate human approval)

```
I confirm recovery apply only for the shown previewFingerprint.
Restore development status and evidence/handoff.
Do not start Quality.
```

## Status / inspection

Use the READ ONLY status prompts above. Never bundle them with apply.
