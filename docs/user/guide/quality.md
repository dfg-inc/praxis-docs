# Quality: checks, verdicts and fixes

Quality verifies independently. A Developer note or green unit tests are not proof. Skill: `praxis-quality:local-workflow` (no Jira).

## What you say

> Act as Quality. Verify the Stories for this work item and give me a verdict per service and for the feature.

## What Claude does

1. `praxis_doctor`, `praxis_workflow_status`; reads the requirement statements itself.
2. `locate-repositories`: lists where each service's code is. Claude asks you only for services that have neither `localPath` nor `remoteUrl`.
3. Executable checks belong to the project: `.praxis/quality/checks.json` (or `.praxis/quality/<work item id>/checks.json`). Each check names a `requirementId`, a `storyId`, an `acceptanceCriterionId` and what to call. A project may also supply `.praxis/quality/adapter.mjs`. Praxis does not embed a product-specific fix.
4. `verify-stories` (optionally `independentRerun: true`): Quality executes the implementation. You get `serviceVerdicts` and the feature `verdict`. Scenario statuses are `PASS`, `FAIL`, `PASS_WITH_RISKS`, `BLOCKED`, `NOT_VERIFIED`. The final verdict is `PASS`, `PASS_WITH_RISKS` or `FAIL`. Steps that cannot be executed stay `NOT_VERIFIED` or `BLOCKED`, and the feature verdict is then `FAIL`.
5. `deployedEndToEnd` stays `false` unless a real deployed environment was exercised; a module import is not deployed coverage.
6. `quality-check` for one requirement (pass `implementationPath`; do not pass `observedBehavior` as proof). `feature-verdict` fails if any requirement lacks a current PASS or any service lacks a current implementation and approval. Revising a requirement makes older verdicts stale.
7. Findings go back to the owner by `handoff` (see [Handoffs](/guide/handoffs)).

All of this goes through `praxis_workflow_preview` then `praxis_workflow_apply` (`confirmation=YES`, matching fingerprint). Verdicts are agent-authored records and need no dialog.

## Approving a service is your act

Setting a service to `approved` or `completed` (`set-service`) is the human act `approve-service`. You are shown the service, its requirements, the implementation it rests on and the verdicts on record. It does not confirm Stories or decisions and does not commit or push.

## Fixes: prepare-fix and apply

When you authorize a fix:

1. The coding agent writes its patch to `.praxis/quality/proposals/<serviceId>.json` (`files[].after` or `files[].diff`). With no patch you get `HOST_EDIT_UNAVAILABLE` and nothing changes.
2. `prepare-fix` with `serviceId`, `authorized: true`, optional `existingBranch`. Preview shows the plan. Apply puts the patch on a working branch (default `quality/<serviceId>-story-fix`) or the existing feature branch, and commits it.
3. Approvals: the commit is one approval and, when the service has a `remoteUrl`, the push of that branch is a second, separate approval. A commit approval is not a push approval. A Reject stops everything after it. Both are asked before anything runs.
4. Never merge, never push to `main` or `master` (`PROTECTED_BRANCH`), never force-push.
5. Then run `verify-stories` again with `independentRerun: true`. A patch is not a passing verdict.

## Quality Service path (Work Packages, optional Jira)

For a Work Package: `praxis_quality_ensure` (start or reuse the bundled local Quality service), `praxis_quality_review` (alias `praxis_quality_report`; runs checks, persists evidence, never writes Jira), `praxis_quality_review_show`, `praxis_quality_status`. To write the result to Jira: `praxis_quality_apply_preview` (shows the Jira writes and a fingerprint), then `praxis_quality_apply` with your approval, then `praxis_quality_apply_status` to read back postconditions. The review's file snapshot is what [Git delivery](/guide/git-delivery) is bound to.

## Approvals

| Action | Approval |
| --- | --- |
| verify-stories, quality-check, record-verification, feature-verdict | none |
| `set-service` approved/completed | you |
| `prepare-fix` apply (commit, then push) | you, two separate approvals |
| `praxis_quality_apply` (Jira Done / Bugs) | you |

## If something goes wrong

- `STORY_MISSING`: no Stories or requirements to verify.
- `CHECKS_INVALID`: `checks.json` is malformed.
- `REPOSITORY_LOCATION_MISSING`: a service has no `localPath`.
- `HOST_EDIT_UNAVAILABLE`: no patch at `.praxis/quality/proposals/<serviceId>.json`.
- `PROPOSAL_INVALID`, `UNSAFE_PATH`: the patch is empty or touches a path outside the service.
- `AUTHORIZATION_REQUIRED`: `prepare-fix` needs `authorized: true`.
- `PROTECTED_BRANCH`, `HISTORY_REWRITTEN`: refused branch or rewritten history.
- `SERVICE_APPROVAL_REQUIRED`: a service needs your approval before the feature can pass.
- `QUALITY_RUNTIME_UNREACHABLE`, `QUALITY_STARTUP_FAILED`, `QUALITY_PORT_UNAVAILABLE`: the Quality Service did not start; run `praxis_quality_ensure` and read its log path.
- `QUALITY_PREVIEW_STALE`, `QUALITY_FINGERPRINT_MISMATCH`, `QUALITY_REVIEW_STALE`: preview again.
- `APPROVAL_REJECTED`, `APPROVAL_CLIENT_UI_REQUIRED`: see [Approval modes](/guide/approval-modes).
