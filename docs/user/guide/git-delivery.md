# Git delivery: commit, branch, publish, PR/MR

Developer tools `praxis_developer_git_*` take your reviewed work to a Git branch and a Pull Request (GitHub) or Merge Request (GitLab). Every write is previewed and approved by you; each step is its own approval.

Hard rules: Praxis never force-pushes (`GIT_FORCE_PUSH_FORBIDDEN`), never merges, and never claims CI passed unless the provider reports it (`ciStatus=success`; without a workflow it is `not_configured`).

## Before you start

- Delivery is bound to a Work Package id and to the Quality review snapshot (`design/<WP>/qa/quality-review.json`). The files you commit must match the hashes Quality reviewed, else `GIT_QUALITY_SNAPSHOT_MISMATCH` and you need a new Quality review. See [Quality](/guide/quality).
- A GitHub token (`PRAXIS_GITHUB_TOKEN`, PAT with repo scope) or GitLab token (`PRAXIS_GITLAB_TOKEN`) is needed for the PR/MR and provider API; set it in the extension settings or environment, never in chat. Push uses your system SSH agent or Git credential helper.
- Not verified: the Developer Git skills are written to stop with `JIRA_CONFIG_UNAVAILABLE` when Jira is unconfigured, although the Git tools themselves do not call Jira. If a skill stops that way, tell Claude to call the tools directly.

## The sequence

| Step | You say | Tools | Approval |
| --- | --- | --- | --- |
| Look | "Show Git status" | `praxis_developer_git_status` (remotes, identity, working tree, whether the remote is empty), `praxis_developer_git_delivery_status` (journal: SHA, PR/MR URL, CI if known) | none |
| Remote | "Connect origin to git@github.com:..." (your real URL) | `praxis_developer_git_connect_preview`, `praxis_developer_git_connect_apply` (does not create the repository, does not push) | you |
| Identity | "Use this author" | `praxis_developer_git_identity_preview`, `praxis_developer_git_identity_apply` (repo-local `user.name` and `user.email`; Praxis does not invent an author) | you |
| Plan commit | "Prepare the commit" | `praxis_developer_git_preview`: allowlist, SHA-256 hashes, Quality binding, branch, commit message, fingerprint. Writes nothing | none |
| Commit | "Commit" | `praxis_developer_git_commit`: local feature branch, stage only the allowlist, commit | you |
| Publish plan | "Prepare the push" | `praxis_developer_git_publish_preview`: source SHA, target remote branch, exact refspec | none |
| Publish | "Push" | `praxis_developer_git_publish` (`mode`: `baseline` or `branch`) | you |
| PR/MR plan | "Prepare the pull request" | `praxis_developer_git_merge_request_preview` (base is the published remote default branch, usually `main`, never local `master`) | none |
| PR/MR | "Open it" | `praxis_developer_git_merge_request` (reuses an existing PR/MR; never merges) | you |
| Jira comment (optional) | "Link it in Jira" | `praxis_developer_git_link_jira_preview`, `praxis_developer_git_link_jira_apply` (comment only; no status change) | you |

Always pass `workPackage`. Providers: `provider` is `github` or `gitlab`. `remoteName` is needed when several remotes exist.

Empty remote: first `praxis_developer_git_publish` with `mode=baseline` (pushes the approved committed HEAD to the remote default branch), then `mode=branch` for the feature branch. If the remote already has history it is never overwritten.

## Safety checks you will see

Index paths outside the allowlist block the commit (`GIT_FOREIGN_STAGED`). Secret-looking content is blocked (`GIT_SECRETS_DETECTED`). After the commit the hashes are read back from Git and compared to the Quality snapshot; a mismatch is reported as partial, not success. Retrying an already-done commit, push or PR is a no-op. A stale preview is refused (`GIT_PREVIEW_STALE`). Commit does not push; push does not open a PR.

## If something goes wrong

- `GIT_IDENTITY_REQUIRED`: set the identity (step above).
- `GIT_REMOTE_REQUIRED` / `GIT_REMOTE_SELECTION_REQUIRED`: connect a remote, or name `remoteName`.
- `GIT_PROVIDER_UNKNOWN` / `GIT_PROVIDER_UNSUPPORTED`: pass `provider` as `github` or `gitlab`.
- `GIT_BASELINE_REQUIRED`: empty remote; publish with `mode=baseline` first.
- `GIT_REMOTE_HISTORY_CONFLICT`, `GIT_COMMIT_DIVERGED`: remote or local history differs; Praxis will not overwrite. Resolve it yourself.
- `GIT_PUSH_BLOCKED`, `GIT_TRANSPORT_FAILED`: nothing pushed; read `errors`.
- `GITHUB_TOKEN_UNAVAILABLE`, `GITLAB_TOKEN_UNAVAILABLE`, `GITHUB_API_URL_INVALID`: fix the settings.
- `GIT_PREVIEW_STALE`, `GIT_CONFIRMATION_REQUIRED`: preview again, then apply.
- `GIT_QUALITY_SNAPSHOT_MISMATCH`: files changed since Quality review; review again.
- `APPROVAL_REJECTED`, `APPROVAL_CLIENT_UI_REQUIRED`, `APPROVAL_TIMED_OUT`: see [Approval modes](/guide/approval-modes).
