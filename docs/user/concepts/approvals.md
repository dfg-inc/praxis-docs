# Approval

Praxis asks because Jira and Git writes are easy to duplicate and hard to undo. The flow is always:

```
Action -> Preview -> you Approve or Reject -> Execute -> Result
```

Nothing needs installing for this: no service, no system account, no administrator rights.

## Read vs preview vs write

| Kind | Examples | Confirmation |
|------|----------|----------------|
| READ | `praxis_doctor`, `praxis_*_status`, `praxis_jira_epic` | none |
| PREVIEW | `praxis_ba_preview`, `praxis_architect_preview`, recovery preview | none — must not write |
| APPLY | `praxis_ba_apply`, `praxis_architect_apply`, `praxis_developer_claim`, `praxis_developer_complete`, `praxis_quality_apply` | `confirmation=YES` and, where required, `previewFingerprint` |

The Skill calls the apply tool with `confirmation=YES` and the fingerprint from **that** preview. That is the agent saying it wants to apply what you were shown; it is not your decision.

## How you are asked

Praxis then asks **you** in the MCP client's own approval dialog, which shows the same preview:

- **Approve** runs exactly the previewed action.
- **Reject** (or closing the dialog) runs nothing; the tool answers `APPROVAL_REJECTED`.
- Your answer reaches Praxis as the client's reply, not as something the agent types, so the agent cannot answer for you.

The result says how the approval was obtained. If your client cannot show the dialog, `praxis_doctor` says so (`approval.mode: unverified-fallback`): the agent must ask you in chat and apply only after you say yes, and Praxis records that approval as **unverified** and warns about it. Set *Require approval in the client dialog* in the extension settings (`PRAXIS_APPROVAL_STRICT=1`) to refuse anything that was not approved in the dialog. Every decision is also logged in `.praxis/approvals/decisions.jsonl`.

Confirming a Story, confirming an architecture decision and marking a service approved are also yours: the agent cannot do them without your approval.

See `docs/user-approval.md` in praxis-core for what this is and is not.

## What YES means

You accept **exactly** the previewed Jira creates/updates/transitions. Reject in the dialog (or tell the agent no, and it applies with `confirmation=NO`, which records the rejection and runs nothing). If Jira changed **before** this Apply, generate a new preview. If Apply was partial, retry the **same** fingerprint — do not generate a new preview just to “try again”.

## Examples

**BA apply:** “I confirm BA apply only for the shown preview and the matching fingerprint.”

**Architect apply:** “I confirm Architect apply only for the shown WP and fingerprint.”

**Developer claim:** “I confirm claim only for WP-20260914-002 and the shown START_DEVELOPMENT.”

**Developer complete:** “I confirm complete and the Quality handoff. Do not start Quality and do not move Jira to Done.”

**Quality apply:** “I confirm only the shown Quality apply.” That approval is the listed issue, properties (including bookkeeping keys), managed comment, the numeric transition id, local manifest, and Quality SQLite update — not “any Done transition”.

Each role transition is a **separate** approval. Completing Developer does not authorize Quality review.

How to inspect proposed writes: read the preview JSON (issue types, summaries, transition names/ids). How to avoid duplicates: trust idempotent apply; do not re-run apply with a different fingerprint “just in case”.
