# First run

After Runtime + at least one role plugin:

## 1. Start Cowork

1. Open **Cowork** in Claude Desktop.
2. Turn **Only on this computer** / local computer access **ON** (wording varies by build). Developer and Quality cannot implement or re-test without local execution.
3. **New session** (do this after installing or updating extensions).
4. Choose the **product repository folder**.

### Screenshot placeholder — Cowork folder

> **Capture checklist:** Cowork new session; local access enabled; folder picker on a product repo; no secrets on screen.

## 2. Infer `.project` if missing

If the folder has no `.project`, the Skill runs `praxis_project_init_preview`, shows inferred YAML, and waits. Approve with `praxis_project_init_apply` and `confirmation=YES` only after you read it.

Do not hand-write `.project` unless you are an advanced user. Secrets do not belong there. See [Configuration](/reference/configuration).

## 3. Confirm Runtime

Ask the role Skill to run doctor/status, or paste a [read-only prompt](/reference/prompts).

Success looks like:

- Runtime tools available (`praxis_doctor`)
- Jira flags configured (base URL / email / project / token **present**, values not printed)
- Repository path is the folder you selected

Failure codes: [Troubleshooting](/reference/troubleshooting).

## 4. Start a role workflow

Pick **one** Skill:

- BA: *Jira Epic Analysis*
- Architect: *Plan Jira Epic* / *Materialize Work Package*
- Developer: *Implement Work Package* / *Developer Status*
- Quality: *Review Work Package* / *Quality Status*

Example (read-only):

```
Inspect Epic PRX-1 and show BA status.
Study the requirements and existing Stories first.
Do not create anything in Jira automatically.
```

Then follow [human approval](/concepts/approvals). Natural language “yes” does **not** bypass `confirmation=YES` and preview fingerprints.
