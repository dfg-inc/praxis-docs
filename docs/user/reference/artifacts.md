# Artifacts

| Path | Contract / role |
|------|-----------------|
| `.project` | Product config |
| `.praxis-jira/proposals/<EPIC>.json` | BA proposal |
| `work-packages/<WP>/manifest.json` | Local WP ↔ Jira key |
| `design/<WP>/change-spec.json` | Architect → Developer |
| `design/<WP>/architect-developer.handoff.json` | `architect.developer.handoff` |
| `design/<WP>/dev/completion-evidence.json` | `developer.completion.evidence` |
| `design/<WP>/dev/quality-handoff.json` | `developer.quality.handoff` |
| `.praxis-jira/quality/<KEY>.json` | Quality report |

Quality discovers readiness from the last two Developer files, not from Jira Done.
