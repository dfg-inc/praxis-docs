# Role plugins compared

Install **Praxis Runtime** once. Then install **only** the ZIP for the role you are performing.

| | BA | Architect | Developer | Quality |
|--|----|-----------|-----------|---------|
| ZIP | `praxis-ba.zip` | `praxis-architect.zip` | `praxis-developer.zip` | `praxis-quality.zip` |
| Does | Requirements, AC, Stories | Design, WP, Jira materialize | Claim, implement, verify, complete | Review, bugs, Done |
| Needs (data) | Jira Epic | BA artifacts/handoff (files or Jira) | WP + Architect handoff files | Developer evidence + quality handoff files |
| Needs (install) | Runtime | Runtime | Runtime | Runtime |
| Writes Jira | After BA apply | After Architect apply | Claim / complete metadata (not Done) | Bugs + Done on pass |
| Approval | preview fingerprint + YES | preview fingerprint + YES | claim YES; complete YES | review YES |
| When | New or existing Epic | After BA (or existing Stories) | After Architect WP | After Developer complete |
| Invoke | Skill *Jira Epic Analysis* | *Plan Jira Epic* / *Materialize Work Package* | *Implement Work Package* | *Review Work Package* |
| After | Stories + BA→Architect handoff | `design/<WP>/` + Developer handoff | evidence + Developer→Quality handoff | report; Jira Done if approved |

Quality unhealthy does **not** block BA, Architect, or Developer.

Details: [BA](/plugins/ba) · [Architect](/plugins/architect) · [Developer](/plugins/developer) · [Quality](/plugins/quality)
