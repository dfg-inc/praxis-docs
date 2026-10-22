# BA: requirements and User Stories

The BA turns a business request into stable requirements and confirmed User Stories, then hands off to the Architect. Skill: `praxis-ba:local-workflow` (no Jira). With a Jira Epic, see [Jira and SimpleOne](/guide/jira-simpleone).

## What you say

> Act as BA. Here is the request: customers must be able to export their order list as CSV. Check what exists first, ask me only what blocks you, then write requirements and Stories.

Or paste a markdown file, or point Claude at the repository.

## What Claude does

1. `praxis_doctor`, `praxis_workflow_status`. If a work item exists, Claude builds on it.
2. Asks at most three blocking questions. Non-blocking gaps become recorded assumptions. It does not invent business policy.
3. Records work through `praxis_workflow_preview` then `praxis_workflow_apply` (`confirmation=YES` and the preview's fingerprint). The JSON commands BA uses:
   - `open`: a new local work item.
   - `clarify`: missing information; facts already known go in `known` and are not asked again.
   - `record-decision`: a business decision you confirmed in chat (recording does not confirm it).
   - `add-requirement`: stable id such as `REQ-BUI-001`, a statement, at least one acceptance criterion.
   - `revise-requirement`: change a statement; this makes older verdicts and implementation records stale.
   - `add-story`: id `US-...`, linked requirement ids, actor, narrative "As a [role], I want [capability], so that [business value]", preconditions, happy path, alternatives, negative and edge cases, business rules, Given/When/Then acceptance criteria, expected results, dependencies, assumptions, unresolved decisions, and `confirmedBehavior`.
   - `handoff` with `sourceRole=ba`, `targetRole=architect`, the requirement ids, `readiness` (`ready`, `partial` or `blocked`), open questions, assumptions, blockers.

Requirement ids never change on handoff.

## Confirming a Story is your act

`add-story` records the Story as written; it stays unconfirmed. Confirming it is the `confirm-story` command, a human act:

- Claude previews it and shows you the whole Story (revision, narrative, happy path, rules, acceptance criteria, content fingerprint).
- In Approval Required mode your client's dialog asks you; Approve confirms exactly that revision, Reject confirms nothing.
- If the Story changes after the preview, the old preview is refused before you are asked.
- Approving a decision does not confirm a Story, and confirming a Story does not authorize implementation, commits or pushes.
- In Trusted Client mode the agent can run it on its own `confirmation=YES`. Read [Approval modes](/guide/approval-modes) before you choose that if Story confirmation matters to you.

Say it explicitly: "Confirm Story US-ORD-001" or "I have not confirmed any Story yet".

## Seeing the result

"Show requirements and Stories" runs `praxis_workflow_inspect` (`view: requirements`, `stories`, `open-items`). Unconfirmed Stories are reported as unconfirmed.

## Approvals

| Action | Approval |
| --- | --- |
| open, clarify, add-requirement, add-story, record-decision, revise-requirement, handoff | none (agent-authored records) |
| `confirm-story` | you |

## If something goes wrong

- `WORKFLOW_MISSING`: open a work item first.
- `DUPLICATE_REQUIREMENT` / `DUPLICATE_STORY`: the id exists. Use `revise-requirement`, or a new id.
- `MISSING_REQUIREMENT`: a Story or revision names an unknown requirement id.
- `STORY_CONFIRMATION_REQUIRED`: the Story has no acceptance criteria; add them before confirming.
- `STORY_REVISION` / `STORY_FINGERPRINT`: the Story changed since the preview; preview again.
- `APPROVAL_REQUIRED`: confirming outside an approved action; run the preview, then apply.
- `APPROVAL_CLIENT_UI_REQUIRED`: no approval dialog in this client. See [Approval modes](/guide/approval-modes).
- `FINGERPRINT_MISMATCH`: state changed between preview and apply; preview again.
