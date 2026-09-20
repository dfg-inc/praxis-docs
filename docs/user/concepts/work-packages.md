# Work Packages

A **Work Package** is the Architect→Developer unit of work.

- **Canonical local id** looks like `WP-20260914-002` (not a Jira key).
- After Architect apply, Jira materializes a Task such as `PRX-4` and stores the mapping in `work-packages/<id>/manifest.json`.
- Developer and Quality accept either the local id or the Jira key.

Example from the Praxis counter tutorial (not a requirement for your site):

| Local id | Jira WP | Canonical Story | Requirement |
|----------|---------|-----------------|-------------|
| `WP-20260914-002` | `PRX-4` | `PRX-3` | `E2-FR1` |

Architect preview/apply for one WP must not unexpectedly create sibling WPs. See [Architect](/plugins/architect).
