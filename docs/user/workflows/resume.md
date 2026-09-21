# Resume in the middle

Always **status first**. Do not rerun BA because you installed Developer later.

| Situation | Start here |
|-----------|------------|
| Epic already has BA Stories | Architect |
| Architect handoff exists | Developer |
| Implementation exists + handoff contract satisfied | Quality |
| Session interrupted | Status, inspect artifacts, resume Skill |
| One role plugin missing | The roles you *did* install still work if their **data** exists |

Interrupted Developer: `praxis_developer_status`. If Jira is Done without evidence, use recovery **preview**, then a **separate** human YES on recovery apply. Do not auto-repair.

Interrupted Quality Apply: `praxis_quality_status`. Retry the **same** preview fingerprint. Do not generate a new preview unless Jira drifted before this Apply, or you already generated a newer preview (including after a Runtime upgrade).
