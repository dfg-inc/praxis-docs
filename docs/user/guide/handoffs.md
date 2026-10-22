# Handoffs and returning to an earlier stage

Work moves BA, Architect, Developer, Quality. Each move is a `handoff` record. Going back is also a handoff, in the other direction.

## What a handoff holds

A `handoff` command (via `praxis_workflow_preview` then `praxis_workflow_apply`) has:

- `sourceRole` and `targetRole`: one of `user`, `ba`, `architect`, `developer`, `quality`.
- `requirementIds` (at least one; ids stay stable) and `serviceIds`.
- `readiness`: `ready`, `partial` or `blocked`.
- `nextActions`, `openQuestions`, `assumptions`, `blockers`, `risks`, `notes`, `resolved`.

Story ids travel with the BA handoff. Handoffs are agent-authored records and need no dialog; the history is kept per work item.

## Forward

> BA: "Hand off to Architect."
> Architect: "Hand off to Developer."
> Developer: "Hand off to Quality."

Start the next role in the same repository: it calls `praxis_workflow_status` and `praxis_workflow_inspect` (`view: handoffs` or `open-items`) and picks up the open questions, risks and blockers. You do not restate anything.

## Back

- Architect to BA (`sourceRole=architect`, `targetRole=ba`) when a business decision is missing. The question goes in `openQuestions`; nobody guesses policy.
- Developer to Architect or BA when architecture or business rules conflict.
- Quality to the owner of a finding via `quality-check` (preview, show, apply), then the owner fixes and hands back.
- BA changes a requirement with `revise-requirement`. That makes older Quality verdicts and implementation records for it stale, so Developer and Quality repeat their part.

`resolved` on the next handoff closes items from the previous one.

## Where am I

- "Where does this work item stand?": `praxis_workflow_status` (stage, requirement ids, next role, every work item with the current one marked).
- "Show handoffs and open items": `praxis_workflow_inspect` with `view: handoffs` or `open-items`; `id` narrows to one record.
- `praxis_capabilities` suggests which guidance fits the request. It runs nothing, and a suggested skill is not started for you.

Work item stages follow fixed transitions (draft, clarification_required, ready, in_progress, review_required, changes_requested, blocked, approved, completed); an impossible move is refused with `INVALID_TRANSITION`.

## If something goes wrong

- `HANDOFF_SCHEMA_INVALID`, `HANDOFF_FAILED`: the handoff is incomplete; read `errors`.
- `MISSING_REQUIREMENT`: a requirement id does not exist.
- `INVALID_TRANSITION`: the stage cannot move that way.
- `WORKFLOW_CONFLICT` / `WORKFLOW_LOCKED`: another write was in flight; retry the preview.
- `FINGERPRINT_MISMATCH`: state changed since the preview; preview again.
- `WORK_ITEM_SELECTION_REQUIRED`: name the work item.
