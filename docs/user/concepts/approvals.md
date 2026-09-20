# Human approval

Praxis asks because Jira writes are easy to duplicate and hard to undo.

## Read vs preview vs write

| Kind | Examples | Confirmation |
|------|----------|----------------|
| READ | `praxis_doctor`, `praxis_*_status`, `praxis_jira_epic` | none |
| PREVIEW | `praxis_ba_preview`, `praxis_architect_preview`, recovery preview | none — must not write |
| APPLY | `praxis_ba_apply`, `praxis_architect_apply`, `praxis_developer_claim`, `praxis_developer_complete`, `praxis_quality_review` | `confirmation=YES` and, where required, `previewFingerprint` |

Saying “да, делай” in chat does **not** satisfy the Runtime contract. The Skill must call the apply tool with `confirmation=YES` and the fingerprint from **that** preview.

## What YES means

You accept **exactly** the previewed Jira creates/updates/transitions. Reject by not calling apply. Resume later with a fresh preview if the fingerprint is stale.

## Examples

**BA apply:** “Подтверждаю BA apply только для показанного preview и соответствующего fingerprint.”

**Architect apply:** “Подтверждаю Architect apply только для показанного WP и fingerprint.”

**Developer claim:** “Подтверждаю claim только для WP-20260914-002 и показанного START_DEVELOPMENT.”

**Developer complete:** “Подтверждаю complete и Quality handoff. Не запускай Quality и не переводи Jira в Готово.”

**Quality apply:** “Подтверждаю только показанный Quality apply.”

Each role transition is a **separate** approval. Completing Developer does not authorize Quality review.

How to inspect proposed writes: read the preview JSON (issue types, summaries, transition names/ids). How to avoid duplicates: trust idempotent apply; do not re-run apply with a different fingerprint “just in case”.
