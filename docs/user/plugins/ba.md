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
Проверь Epic PRX-1 и подготовь BA proposal.
Сначала изучи требования и существующие Story.
Не создавай ничего в Jira автоматически.
Покажи preview и дождись подтверждения.
```

Approved apply (WRITE):

```
Подтверждаю BA apply только для показанного preview
и соответствующего fingerprint.
```

Status (READ ONLY):

```
Покажи BA status PRX-1, canonical Stories,
superseded issues и готовность к Architect.
Ничего не изменяй.
```

After apply, Architect can start from artifacts without the BA plugin remaining installed. See [Architect only](/workflows/architect-only).
