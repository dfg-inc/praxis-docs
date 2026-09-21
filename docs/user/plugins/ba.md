# Praxis BA

**Install:** Runtime + `praxis-ba.zip`. Architect/Developer/Quality ZIPs are optional.

**Does:** Read an Epic, clarify requirements, decompose Stories, mark canonical vs superseded, emit a BA→Architect handoff.

**Inputs:** Jira Epic key (for example `PRX-1`). Existing children are read, not blindly recreated.

**Creates:** Canonical Stories (apply), proposal JSON, `jira.ba.architect.handoff`, comments.

**Jira writes:** Only after `praxis_ba_preview` + human `praxis_ba_apply` (`confirmation=YES`, `previewFingerprint`).

## Distinctions

| Tool | Writes? |
|------|---------|
| `praxis_ba_status` | no |
| `praxis_ba_preview` | no |
| `praxis_ba_apply` | yes |

Idempotent apply reuses canonical keys (example: PRX-3 canonical, PRX-2 superseded). Do not “fix” duplicates by creating a fourth Story.

## Prompts

Inspect Epic (READ ONLY):

```
Inspect Epic PRX-1 and prepare a BA proposal.
Study the requirements and existing Stories first.
Do not create anything in Jira automatically.
Show the preview and wait for confirmation.
```

Approved apply (WRITE):

```
I confirm BA apply only for the shown preview
and the matching fingerprint.
```

Status (READ ONLY):

```
Show BA status for PRX-1: canonical Stories,
superseded issues, and Architect readiness.
Do not change anything.
```

After apply, Architect can start from artifacts without the BA plugin remaining installed. See [Architect only](/workflows/architect-only).
