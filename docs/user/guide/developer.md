# Developer: implementation and services

The Developer implements approved requirements service by service and records what was built. Skill: `praxis-developer:local-workflow` (no Jira). Other Developer skills (research, plan, TDD, repair loop, final arbiter) support the work and feed the same records.

## What you say

> Act as Developer. Implement the approved requirements for the orders service. Read the requirement ids first and do not change business behavior.

## What Claude does

1. `praxis_doctor`, `praxis_workflow_status`; reads the requirement ids before editing. Missing Jira configuration does not block local work.
2. Edits code in the repository (or in each service's repository, see [Multi-repo](/guide/multi-repo)). Praxis does not run your editor or tests for you; Claude does that with its normal tools.
3. For each service records the result with `record-implementation` (via `praxis_workflow_preview` then `praxis_workflow_apply`): `id`, `serviceId`, `requirementIds`, `path` (the source path), `summary`, optional `contractRef`. One finished service does not complete the feature.
4. If architecture or business rules conflict, hands back with `handoff` to `architect` or `ba` and waits for your approval before applying. It does not silently change approved behavior.
5. Hands off to Quality with `handoff` (`sourceRole=developer`, `targetRole=quality`).

`praxis_developer_status` with `workItemId` shows stage, services and implementation for a local work item (no Jira needed). With `workPackage` it shows the Work Package or Jira status; the two identities are never converted.

`praxis_capabilities` gives guidance (for example retry/idempotency); it executes nothing.

## Work Package tools (Jira path)

`praxis_developer_claim`, `praxis_developer_release`, `praxis_developer_complete` (runs the required verification, persists evidence, emits the Developer-to-Quality handoff, keeps Jira In Progress, does not mark Done), and the `complete_recovery` preview/apply pair are protected: you approve each. They belong to the Work Package and Jira path; the local flow does not require them.

## Approvals

| Action | Approval |
| --- | --- |
| `record-implementation`, handoffs | none (agent-authored records) |
| claim, release, complete, recovery apply | you |
| Git commit, push, PR/MR | you, separately each time ([Git delivery](/guide/git-delivery)) |

## If something goes wrong

- `PRAXIS_RUNTIME_UNAVAILABLE`: Runtime tools missing.
- `WORKFLOW_MISSING`, `WORK_ITEM_SELECTION_REQUIRED`: no or ambiguous work item.
- `MISSING_REQUIREMENT`: a record names an unknown requirement id.
- `WORK_PACKAGE_ALREADY_CLAIMED`: another actor holds the claim.
- `WORK_PACKAGE_NOT_FOUND`: the Work Package id or key is unknown.
- `PREMATURE_JIRA_DONE`: Jira was moved to Done before Developer evidence; use the recovery preview and apply.
- `HANDOFF_FAILED`: the handoff could not be written; read `errors` in the result.
- `JIRA_CONFIG_UNAVAILABLE`: only when you asked for a Jira update.
