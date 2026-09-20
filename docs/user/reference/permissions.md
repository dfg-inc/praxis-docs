# Jira permissions

Verified against the provider operations Praxis actually calls.

## Read-only vs write

Read-only: get issue, search, transitions list, properties get, comments read.

Write/apply: create issue, update, comment, issue links, property set, **transition**.

## By role

**BA** — read Epic/children; on apply: create/update Story, comments, properties, links.

**Architect** — read issues; on apply: create WP Task, links, properties, comments.

**Developer** — read WP; claim: transition to In Progress, claim property; complete: properties/comments, **not** Done.

**Quality** — read evidence locally; on apply: bugs (numeric type id), properties, comments, transition to Done on pass.

If a transition is missing, Praxis fails with `JIRA_TRANSITION_NOT_AVAILABLE` and lists available id/name/target. That is a Jira permission or workflow gap, not a reason to hardcode id `31`.
