# Work without Jira or SimpleOne

Everything in this guide except the Jira-specific tools works with no tracker at all. You do not need an account, a token or a project key. Settings in the Runtime extension are all optional.

## What works locally

- Project setup: `praxis_project_init_preview` / `praxis_project_init_apply`.
- The whole role workflow through `praxis_workflow_status`, `praxis_workflow_inspect`, `praxis_workflow_preview` and `praxis_workflow_apply`: requirements, User Stories, architecture decisions, services, handoffs, implementation records, Quality verdicts.
- Local Git: status, identity, commit, publish and PR/MR (see [Git delivery](/guide/git-delivery)). A GitHub or GitLab token is needed only for the PR/MR itself and for talking to the provider API.

State lives in `.praxis/workflow/` inside the repository. One repository can hold several work items (ids such as `WI-ALPHA-FEATURE-001`).

## What you say

> Start a local work item: we need a CSV export for the orders list. No Jira.

Claude runs the role's `local-workflow` skill (for BA: `praxis-ba:local-workflow`). It calls `praxis_doctor` and `praxis_workflow_status`, then previews an `open` command with `praxis_workflow_preview` and applies it after you agree. Agent-authored records (opening a work item, adding requirements, handoffs) need no dialog; only human acts do (confirming a Story or decision, marking a service approved, Git, writing `.project`).

To see everything stored: "Show requirements, Stories, decisions, work and Quality results" (`praxis_workflow_inspect`, views `overview`, `requirements`, `stories`, `decisions`, `work`, `handoffs`, `open-items`, `quality`, `links`, `all`).

## What happens when credentials are missing

- `praxis_doctor` shows which Jira settings are present or missing (never the values) and `capabilities.jiraConfig: unavailable`. That is information, not a failure.
- Local tools keep working.
- A Jira tool you call explicitly (`praxis_jira_smoke`, `praxis_jira_epic`, `praxis_ba_preview` and so on) answers `JIRA_CONFIG_UNAVAILABLE` with what is missing. Role skills report that code only when you asked for a Jira write.
- Git skills: the Developer Git skills (for example `commit-approved-changes`) are written to stop with `JIRA_CONFIG_UNAVAILABLE` when Jira is not configured. The Git tools themselves are keyed on a Work Package id and a Quality snapshot, not on Jira. Not verified: whether a fully Jira-free Git delivery runs end to end through the skills in this release. See [Git delivery](/guide/git-delivery).
- Never paste a token into chat. Tokens go in the extension settings (Claude Desktop) or the environment (`PRAXIS_JIRA_BASE_URL`, `PRAXIS_JIRA_EMAIL`, `PRAXIS_JIRA_PROJECT_KEY`, `PRAXIS_JIRA_TOKEN`).

SimpleOne: there is no SimpleOne tool in the Runtime today. See [Jira and SimpleOne](/guide/jira-simpleone).

## Linking later

A work item can carry an optional `jiraIssueKey` (set in the `open` command). The Praxis id stays the identity; the key is only a reference.

## If something goes wrong

- `PRAXIS_RUNTIME_UNAVAILABLE`: Runtime tools are missing in this client.
- `JIRA_CONFIG_UNAVAILABLE`: you asked for a Jira action and the settings are incomplete. Either configure Jira or continue locally.
- `WORKFLOW_MISSING`: no work item opened yet. Ask Claude to open one.
- `WORK_ITEM_SELECTION_REQUIRED`: several work items and none selected. Name one (`workItemId`) or run `select-work-item`.
- `WORK_ITEM_NOT_FOUND`: the id is not in this repository's index. Run `praxis_workflow_status` to list them.
- `APPROVAL_CLIENT_UI_REQUIRED`: a human act (for example confirming a Story) was attempted in a client without an approval dialog. See [Approval modes](/guide/approval-modes).
