# Praxis Developer

**Install:** Runtime + `praxis-developer.zip`. Architect ZIP is not required if `design/<WP>/` already exists.

**Does:** Status, claim, implementation of the approved change-spec, tests, **Developer complete**, Quality handoff, then **Git Delivery** (GitHub Pull Request MVP).

**Inputs:** Work Package id or Jira key, Architect handoff, change-spec.

**Creates:** Product code changes, `design/<WP>/dev/completion-evidence.json`, `design/<WP>/dev/quality-handoff.json`.

**Jira writes:** Claim transitions to In Progress. Complete updates Praxis properties and comments. **Complete does not move Jira to Done** and does not start Quality.

## Alpha.35 lifecycle

```
implementation finished
  → required verification (e.g. npm test)
  → completion evidence (real results, not fabricated)
  → Developer → Quality handoff
  → readyForQuality=true
  → Quality review (separate plugin/session)
  → Quality approved
  → Jira Done
```

Preferred persisted states after complete:

- `claim.state`: `active`
- `implementationState`: `complete`
- `qualityState`: `pending` until Quality Apply; then `approved`
- `readyForQuality`: `true`
- Jira: **В работе / In Progress** until Quality Apply moves it to Done

`praxis_developer_status.qualityState` follows `praxis.state` and the local WP manifest. It does **not** stay `pending` merely because `status` is still `ready-for-qa`.

If verification fails, complete is refused (no readyForQuality, no Done).

## Prompts

Status (READ ONLY):

```
Check Developer status for WP-20260914-002.
Show Jira mapping, active claim, and readiness.
Do not change anything.
```

Claim (PREVIEW then WRITE):

```
Prepare a Developer claim for WP-20260914-002.
First show the current Jira status and the available
START_DEVELOPMENT transition.
Do not call claim without confirmation.
```

Implement:

```
Implement only the approved change-spec.
Keep existing changes.
Run the project's configured tests.
Show the diff and verification results.
```

Complete (WRITE, not Done):

```
Prepare Developer completion and the Quality handoff.
Show evidence and expected Jira writes.
Do not start Quality automatically.
Do not move Jira to Done.
```

Premature Done recovery is a **separate** preview/apply (`praxis_developer_complete_recovery_*`). Never auto-repair live Jira during install or tests.

## Git Delivery (alpha.44)

After Quality Apply, deliver approved product files through Claude — not by typing Git in a terminal.

**GitHub is the MVP provider** (HTTPS or SSH transport + GitHub API token for Pull Requests). GitLab.com / Self-Managed remain available for remotes and Merge Requests. Praxis does **not** guess `github.com`, `gl.jetru.by`, or any other host from Jira.

Canonical walkthrough (copy-paste): [GitHub Delivery](/workflows/github-delivery).

### Flow

1. **Git Status** (`praxis_developer_git_status`) — remotes, identity, dirty tree. Distinguishes configured GitHub `defaultBranch=main` from existing `refs/heads/main`. If `remoteConfigured=false`, ask the user for the target URL.
2. **Connect Git** — preview then `confirmation=YES`. Adds `origin` or **updates** it (`git remote set-url`) when HTTPS↔SSH for the same repo. Does not create a GitHub repository. Does not add a second `origin`. The apply result keeps the approved `previewFingerprint`. `wrote=true` only after the actual remote URL matches the plan.
3. **Baseline** (`praxis_developer_git_publish_preview` `mode=baseline`) — required when the GitHub repo is empty. Publishes **committed HEAD** with explicit refspec `sourceSha:refs/heads/main`. Local `master` is not renamed; remote `master` is not created. Working tree dirt is not published.
4. **Prepare Git Delivery** (`praxis_developer_git_preview`) — recompute file hashes from disk and compare to `design/<WP>/qa/quality-review.json`. Preview does not branch or commit.
5. **Commit Approved Changes** (`praxis_developer_git_commit`) — feature branch + allowlist only. Default for the counter WP: `src/counter.js`, `src/counter.test.js`. Hashes are read back from the Git commit. Never `git add -A`.
6. **Publish Branch** (`praxis_developer_git_publish` `mode=branch`) — exact feature refspec, read-back remote SHA. **Never force-push.**
7. **Create Pull Request** (`praxis_developer_git_merge_request_preview` then `praxis_developer_git_merge_request`) — head = feature branch, **base = `main`**, never local `master`. Reuses an existing PR. Does not merge. Does not claim CI PASS. Missing Actions → `ciStatus=not_configured`.
8. **Check Delivery Status** — journal: baseline SHA, feature SHA, PR URL/base/head, lifecycle, CI.

Jira linking (`praxis_developer_git_link_jira_*`) is a **separate** comment. It does not move PRX-4 out of Done or re-run Quality Apply.

On partial failure, MCP `ok` is false when `data.ok` is false. Retry does not create a second commit or PR.

### Staging

Not staged unless you opt in: `.praxis-jira/`, `.praxis-quality/`, `.praxis-git/`, `.praxis-local-tgz/`, `.npmrc`, SQLite, pid/log files, unknown untracked files. `.project`, `design/`, `work-packages/` need an explicit allowlist choice. Dirty `package.json` / lockfile stay in the working tree.

### Auth

| Kind | How |
|------|-----|
| Git transport | macOS/Windows SSH agent or Git credential helper. Praxis never asks for a private key. Do not use Linux Cowork bash to debug macOS SSH. |
| GitHub API | Runtime setting `github_token` (PAT, **not** OAuth). Stored in OS keychain. |
| GitHub API URL | `https://api.github.com` — not a git remote |
| GitLab API | Optional `gitlab_token` + `gitlab_base_url` (Self-Managed: User Settings → Access Tokens). |

Tokens must not appear in `.project`, Git, Markdown, evidence, handoff, tool results, logs, or chat.

### Prompts

**READ ONLY — Git Status**

```
Check Git Delivery status for WP-20260914-002.
If there is no remote, say so. Do not guess a GitHub URL.
Do not change anything.
```

**PREVIEW — Connect GitHub**

```
Prepare connecting this repo to
https://github.com/hisagedru/praxis-acceptance-test
as origin over HTTPS or SSH.
If origin already exists over HTTPS, preview switching it to
git@github.com:hisagedru/praxis-acceptance-test.git
Show the preview. Do not add or rewrite the remote yet.
```

**PREVIEW — Baseline master → main**

```
Preview baseline publication.
Local branch is master. GitHub default branch is main.
Show source SHA, target remote branch, and the exact refspec.
Do not push yet.
```

**WRITE — commit then publish then PR**

```
I confirm Git Delivery commit for the shown fingerprint only.
Do not push until I approve publish.
Do not open a pull request until I approve that step.
Do not merge. Do not write Jira.
```

