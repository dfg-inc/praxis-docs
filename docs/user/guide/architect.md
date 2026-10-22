# Architect: architecture and decisions

The Architect maps requirements to services, records decisions, and hands off to Developer, or back to BA when a business decision is missing. Skill: `praxis-architect:local-workflow` (no Jira).

## What you say

> Act as Architect. Read the BA requirements for this work item and propose services and boundaries. Record the decisions we agree on.

Claude calls `praxis_workflow_status` first and does not ask you to restate requirements. `praxis_workflow_inspect` (`view: requirements` or `handoffs`) shows what BA passed on, including open questions.

## What Claude does

Through `praxis_workflow_preview` then `praxis_workflow_apply`:

- `set-service`: defines a service (`id`, `name`, `kind` one of `application`, `module`, `api`, `worker`, `frontend`, `persistence`, `external`; optional `repository`, `localPath`, `remoteUrl`, `branch`; `responsibilities`, `requirementIds`, `dependsOn`, `status`). A monolith stays one service. Several repositories stay explicit (see [Multi-repo](/guide/multi-repo)).
- `record-decision`: a decision with a statement and rationale. Recording does not confirm it.
- `confirm-decision`: your act (below).
- `record-context`: open questions, risks, blockers, notes.
- `link-work-item`: depends-on / blocks / relates-to / derived-from a work item in another repository.
- `handoff` with `targetRole=developer` and the same requirement ids; `targetRole=ba` with the open question when a business decision is missing. The Architect does not guess policy or reinterpret a requirement because another design is easier.

Other Architect skills (context map, grill, council, record-decision, context-slice, and others) are available in the plugin for deeper design work; they feed the same commands. The local skill is the entry point.

## Confirming a decision is your act

`confirm-decision` shows you the decision (id, revision, statement, rationale, content fingerprint). Approve confirms that revision; Reject confirms nothing. It does not confirm Stories, authorize implementation or approve a service. In Trusted Client mode the agent can run it on its own `confirmation=YES`; see [Approval modes](/guide/approval-modes).

Marking a service `approved` or `completed` with `set-service` is the Quality-side human act `approve-service`; see [Quality](/guide/quality).

## Jira Work Packages (optional)

With Jira, `praxis_architect_status`, `praxis_architect_preview` (pass `workPackageId` when several local Work Packages exist) and `praxis_architect_apply` materialize a Work Package. These are Jira writes and need your approval. Local work does not need them.

## Approvals

| Action | Approval |
| --- | --- |
| set-service (not approved/completed), record-decision, record-context, link-work-item, handoff | none |
| `confirm-decision` | you |
| `set-service` with status approved/completed | you |
| `praxis_architect_apply` (Jira) | you |

## If something goes wrong

- `DECISION_NOT_FOUND`, `DECISION_REVISION`, `DECISION_FINGERPRINT`: the decision is missing or changed since the preview; preview again.
- `DECISION_CONFIRMATION_REQUIRED` / `APPROVAL_REQUIRED`: confirm only through preview, approval, apply.
- `WORKFLOW_MISSING`: open a work item first (BA).
- `WORK_PACKAGE_SCOPE_AMBIGUOUS`: Jira preview with several materializable Work Packages; pass `workPackageId`.
- `JIRA_CONFIG_UNAVAILABLE`: only for Jira actions; continue locally.
- `APPROVAL_CLIENT_UI_REQUIRED`: no approval dialog. See [Approval modes](/guide/approval-modes).
