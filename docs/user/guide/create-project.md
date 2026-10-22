# Create a project and `.project`

A Praxis project is a normal Git repository with a small `.project` file at its root. Praxis infers the file from the repository, shows it to you, and writes it only after you approve.

## What you say

Open the repository folder in Claude Code, Claude Desktop (Code or Cowork) and say:

> Set up Praxis for this repository. Show me the `.project` you would create.

If the folder is not a Git repository yet, run `git init` first (or ask Claude to). `praxis_doctor` reports `repository: no-git` otherwise.

## What happens

1. Claude calls `praxis_doctor` and `praxis_project_status`. If `.project` is missing, `project.status` is `missing`.
2. Claude calls `praxis_project_init_preview`. It writes nothing. You get the inferred YAML (`yaml`), the structured proposal (`preview`), and `notes`. `existing` tells you whether a `.project` is already there.
3. Claude shows you the YAML and stops. Read it. Secrets do not belong in it.
4. You say to go ahead. Claude calls `praxis_project_init_apply` with `confirmation=YES`. This call takes no `previewFingerprint`; Praxis recomputes the inference and binds your approval to the exact file content.
5. In the default mode (Approval Required) your client shows an approval dialog with the full file content. Approve writes `.project`; Reject or closing the dialog writes nothing (`APPROVAL_REJECTED`).
6. If `.project` already exists, apply changes nothing and returns `wrote: false`, `reason: already-exists`.

Verify afterwards with "Show the Praxis project status" (`praxis_project_status`).

## Who approves what

| Step | Tool | Approval |
| --- | --- | --- |
| Check | `praxis_doctor`, `praxis_project_status` | none, read-only |
| Preview | `praxis_project_init_preview` | none, writes nothing |
| Write `.project` | `praxis_project_init_apply` | you, in the client dialog (or Trusted Client, see [Approval modes](/guide/approval-modes)) |

## Where Praxis keeps its state

- `.project` in the repository root.
- `.praxis/workflow/` in the repository: work items (`index.json`, `items/<id>.json`).
- The decision journal is outside the repository: `~/.praxis/decisions/<repository id>.jsonl`.

Next: [Work without Jira](/guide/without-jira), then [BA](/guide/ba).

## If something goes wrong

- `APPROVAL_CLIENT_UI_REQUIRED`: your client cannot show the approval dialog. Nothing was written; the preview is returned. See [Approval modes](/guide/approval-modes).
- `APPROVAL_REJECTED`: you rejected it (or Claude sent `confirmation=NO`). Nothing was written.
- `APPROVAL_TIMED_OUT`: the dialog was shown and nobody answered. Nothing was written. Ask again.
- `CONFIRMATION_REQUIRED`: apply was called without `confirmation=YES`. Ask Claude to show the preview and apply again.
- `REPOSITORY_UNAVAILABLE`: the `repo` path does not exist. Open the right folder.
- `PRAXIS_RUNTIME_UNAVAILABLE`: the Runtime tools are not installed or enabled in this client. See [Installation](/getting-started/installation).
