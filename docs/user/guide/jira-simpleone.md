# Jira and SimpleOne

Jira is supported and optional. SimpleOne is not available to you in this release.

## Jira (supported, optional)

Configure it only if you want to sync with a Jira project. Settings (Claude Desktop extension settings, or environment variables): `PRAXIS_JIRA_BASE_URL`, `PRAXIS_JIRA_EMAIL`, `PRAXIS_JIRA_PROJECT_KEY`, `PRAXIS_JIRA_TOKEN`. Never paste the token into chat. `praxis_doctor` shows which are present, not their values.

Read-only tools: `praxis_jira_smoke` (connection check), `praxis_jira_discover` (issue types, numeric `bugTypeId`), `praxis_jira_epic`, `praxis_jira_status`, `praxis_ba_status`, `praxis_architect_status`.

Write path, each a preview then an approved apply (preview fingerprint required):

| Role | Preview | Apply |
| --- | --- | --- |
| BA | `praxis_ba_preview` (CREATE, UPDATE, UNCHANGED, SUPERSEDED plan for an Epic) | `praxis_ba_apply` |
| Architect | `praxis_architect_preview` (one Work Package per canonical local WP; `workPackageId` scopes it) | `praxis_architect_apply` |
| Developer | | `praxis_developer_claim`, `praxis_developer_release`, `praxis_developer_complete` (+ recovery preview and apply) |
| Quality | `praxis_quality_apply_preview` | `praxis_quality_apply` (Done or Bugs, only from the approved plan) |
| Developer Git | `praxis_developer_git_link_jira_preview` | `praxis_developer_git_link_jira_apply` (PR/MR comment) |

Skills for the Epic path: `praxis-ba:jira-epic-analysis`, `praxis-ba:resume-ba-work`, `praxis-architect:plan-jira-epic`, `praxis-architect:materialize-work-package`, `praxis-developer:implement-work-package`, `praxis-quality:review-work-package`. Example: "Inspect Epic PRX-1 and show BA status. Do not create anything in Jira automatically."

If Jira changed between preview and apply, generate a new preview. If an apply was partial, retry the same fingerprint.

A local work item can carry an optional `jiraIssueKey`. The Praxis work item id stays its identity.

## SimpleOne (state today)

What the repository contains: `praxis-simpleone-runtime` is a foundation with a fixture provider (an in-memory test transport) and read-only contracts. Its own description says real writes remain disabled. It reads `PRAXIS_SIMPLEONE_BASE_URL`, `PRAXIS_SIMPLEONE_TOKEN` and `PRAXIS_SIMPLEONE_INSTANCE_ID` in its code, but nothing in the Praxis Runtime calls it. Its readiness note says SimpleOne must not be advertised in the marketplace until packaging and acceptance tests exist.

What that means for you:

- There is no SimpleOne tool in the Runtime catalog (no `praxis_simpleone_*`), no SimpleOne setting in the extension, and no SimpleOne plugin in the marketplace.
- The shared contracts already allow a work item `source` and `provider` of `simpleone`, and apply tools accept an `instanceId`. That is groundwork, not a working integration.
- Planned, not delivered: SimpleOne writes will go through the same preview and approval as Jira and Git, bound to one action on one instance, so a Jira approval can never run a SimpleOne write.
- Not verified: any live SimpleOne connection. Its table API details are described in the code as not live-verified.

Use the local workflow ([Work without Jira](/guide/without-jira)) for SimpleOne projects for now.

## If something goes wrong

- `JIRA_CONFIG_UNAVAILABLE`: a Jira setting is missing; `praxis_doctor` lists which.
- `EXTERNAL_SERVICE_ERROR`, `JIRA_READ_TIMEOUT`: Jira did not answer; retry.
- `JIRA_TRANSITION_NOT_AVAILABLE`, `JIRA_TRANSITION_ID_INVALID`: the workflow does not offer that transition; preview again to see live transitions.
- `WORK_PACKAGE_SCOPE_AMBIGUOUS`: pass `workPackageId` to the Architect preview.
- `WORK_PACKAGE_ALREADY_CLAIMED`, `PREMATURE_JIRA_DONE`: see [Developer](/guide/developer).
- `FINGERPRINT_MISMATCH` / `APPROVAL_FINGERPRINT_MISMATCH`: Jira or local state changed; preview again.
- `QUALITY_APPLY_INCOMPLETE`, `QUALITY_RECONCILIATION_REQUIRED`: run `praxis_quality_apply_status` and retry the same plan.
