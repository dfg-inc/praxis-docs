# Jira workflow mapping

Many Jira Cloud projects expose a simple three-status workflow:

| Transition id (example) | Name | Category |
|-------------------------|------|----------|
| 11 | К выполнению / To Do | new |
| 21 | В работе / In Progress | indeterminate |
| 31 | Готово / Done | done |

You do **not** reconfigure Jira to add a “Ready for QA” column.

Praxis maps *semantic* actions onto whatever transitions exist (by status category and mapping keys). IDs are **discovered**, never hardcoded.

| Praxis event | Jira | Praxis state |
|--------------|------|----------------|
| Developer claim | → In Progress / В работе | `claim.state=active` |
| Developer complete | **stays In Progress** | `implementationState=complete`, `readyForQuality=true` |
| Quality approval | → Done / Готово | `qa-passed` |

Developer complete must **not** mark the issue QA-approved or Done. That was a product defect in alpha.34 (`READY_FOR_QA` was mapped to Done). From alpha.35, Done is Quality’s job.

See [Developer](/plugins/developer) and [Quality](/plugins/quality).
