# Praxis Architect

**Install:** Runtime + `praxis-architect.zip`. BA ZIP is not required if BA artifacts already exist.

**Does:** Intake, codebase analysis, design package, NFRs, Work Package identity, Jira materialization.

**Inputs:** Epic, canonical Stories, optional `ba.architect.handoff` / proposal files.

**Creates:** `design/<WP>/index.md`, `change-spec.json`, `architect-developer.handoff.json`, Jira WP Task (apply).

**Jira writes:** After `praxis_architect_preview` + `praxis_architect_apply`.

Hard `workPackageId` scope: preview/apply for `WP-20260914-002` must not unexpectedly materialize siblings. Invalid titles such as `---` are rejected.

## Canonical example (test scenario, not your keys)

In Praxis acceptance, Epic `PRX-1`, Story `PRX-3`, WP `WP-20260914-002` → Jira `PRX-4`. Your project will have different keys.

## Prompts

Start (READ then PREVIEW):

```
Continue PRX-1 as Architect. Prepare the design and Work Package WP-20260914-002.
Show the preview first. Do not create Jira issues without confirmation.
```

One WP:

```
Inspect only WP-20260914-002. Do not materialize other work packages.
Show the Architect preview and wait.
```

Approved apply (WRITE):

```
I confirm Architect apply only for the shown WP and fingerprint.
```

Resume:

```
Show Architect status for PRX-1 and WP-20260914-002. Do not change anything.
```
