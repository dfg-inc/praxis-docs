# GitHub Delivery walkthrough

Copy this into Claude Desktop / Cowork with **Praxis Runtime** and **Praxis Developer** installed. You do **not** type Git commands.

This is the full path after Quality has already approved the Work Package:

Git Status → Connect Git → Baseline → Feature commit → Push → Pull Request → CI / Delivery Status → optional Jira link.

Every write is a **PREVIEW**, then a separate **WRITE** with `confirmation=YES` and the matching `previewFingerprint`. Do not reuse an older fingerprint.

## What you need

- Runtime MCPB + `praxis-developer.zip`
- A Quality-approved Work Package (example: `WP-20260914-002` / Jira `PRX-4`, Quality Review `1` PASSED / applied)
- Git identity on the machine (`user.name` / `user.email`) or use Git Identity preview/apply
- GitHub repository URL (HTTPS or SSH). Empty GitHub repos created in the UI without a README are supported
- Git transport: SSH agent or Git credential helper on **this Mac**. Do not debug SSH in Linux Cowork bash
- GitHub PAT in Runtime settings (`github_token`, **not** OAuth) only when you create a Pull Request
- `github_api_url` = `https://api.github.com` (not the git remote)

## What Praxis will not do

- Rename local `master`
- Create remote `master` when GitHub’s default branch is `main`
- `git add -A`, `git reset --hard`, `git clean -fd`, force-push, or merge
- Commit dirty `package.json` / `package-lock.json` / `.npmrc` / `.project` / `.praxis-*` unless you explicitly allowlist them
- Start Quality Review or Quality Apply
- Transition Jira (optional link comment is a separate gate)
- Report CI PASS when Actions is missing (`not_configured`) or still running

## Copy-paste (one session)

Replace keys if yours differ. The example matches the counter Work Package.

```
We are doing GitHub Delivery for WP-20260914-002 (Jira PRX-4).
Quality Review 1 is already PASSED and applied. Do not run Quality Review or Quality Apply.

1. READ ONLY — Git Status
Call praxis_developer_git_status.
Show local branch, HEAD SHA, remotes, identity, dirty tree, remoteEmpty, baselineRequired.
If there is no remote, say so. Do not guess a GitHub URL.
Do not change anything.

2. PREVIEW — Connect Git (only if origin is missing or the URL is wrong)
I want origin to be git@github.com:hisagedru/praxis-acceptance-test.git over SSH.
If origin is already that GitHub repo over HTTPS, preview git remote set-url (do not add a second origin).
Show the Connect Git preview. Do not apply yet.

3. WRITE — Connect (separate message after I approve)
I confirm only the shown Connect Git fingerprint.
confirmation=YES. Do not push.

4. PREVIEW — Baseline publication
The GitHub repo was created empty (no README). Local branch is master.
Preview mode=baseline.
I must see:
  sourceBranch = master
  sourceCommitSha = the committed HEAD (not the dirty working tree)
  targetRemote = origin
  targetRemoteBranch = main
  exact refspec = <HEAD-SHA>:refs/heads/main
  force = false
  remoteEmpty = true
Do not publish the working tree. Do not create remote master.
Do not apply yet.

5. WRITE — Baseline (separate message)
I confirm only the shown baseline fingerprint, mode=baseline.
confirmation=YES.
If writeSucceeded but verification failed, show partial and stop.

6. PREVIEW — Feature commit
Prepare Git Delivery for WP-20260914-002.
Recompute SHA256 of src/counter.js and src/counter.test.js from disk
against design/WP-20260914-002/qa/quality-review.json (Review 1).
Commit message must be: feat(PRX-4): add counter reset support
Branch: feature/PRX-4-counter-reset from the approved baseline HEAD.
Do not include package.json, package-lock.json, .npmrc, .project,
.praxis-*, design/, work-packages/.
Do not create a branch or commit yet.

7. WRITE — Feature commit (separate message)
I confirm only the shown commit fingerprint.
confirmation=YES.
Do not push.

8. PREVIEW — Feature push
Preview mode=branch for feature/PRX-4-counter-reset.
Show source SHA, remote, branch, refspec, Quality snapshot binding.
force=false. Do not apply yet.

9. WRITE — Feature push (separate message)
I confirm only the shown publish fingerprint, mode=branch.
confirmation=YES.

10. PREVIEW — Pull Request
Preview a GitHub Pull Request:
  head = feature/PRX-4-counter-reset
  base = main
  not local master
Do not create it yet.

11. WRITE — Pull Request (separate message)
I confirm only the shown merge-request fingerprint.
confirmation=YES.
Do not merge. Do not claim CI PASS unless ciStatus=success.
If CI is missing, say CI not configured.

12. READ ONLY — Delivery status
praxis_developer_git_delivery_status.
Show lifecycle, baseline SHA, feature SHA, PR URL/number/base/head, ciStatus.
Do not write Jira unless I later approve git_link_jira.

If any step is partial, retry that step only. Do not create a second commit or PR.
```

## Baseline mapping (`master` → `main`)

| Field | Value |
|-------|--------|
| Local source branch | `master` (unchanged) |
| Source | committed HEAD SHA |
| Remote | `origin` |
| Target branch | GitHub **configured** default branch `main` |
| Refspec | `<baselineSha>:refs/heads/main` |
| Force | `false` |

Configured `defaultBranch=main` is not the same as “`refs/heads/main` already exists”. An empty UI-created repo has the configured default and no refs. After baseline, `refs/heads/main` exists and matches the approved SHA. `refs/heads/master` must not appear.

## Feature commit

From the approved baseline HEAD. Selected files come from the Quality snapshot (example: `src/counter.js`, `src/counter.test.js`). Praxis re-reads SHA256 from `quality-review.json`, then from the created commit. Drift → block. A later commit is not automatically QA-approved.

## CI

PASS only when GitHub Actions has a workflow **and** a run is `completed` + `success`. Otherwise: `not_configured`, `not_started`, `queued`, `in_progress`, or `failure`. Missing workflows are not PASS.

## Retry / partial

Read remote refs, not only the local journal. If the write landed and the response was lost, retry is a no-op when SHAs already match. Results include `ok`, `writeSucceeded`, `verificationStatus`, `partial`, `completed`, `recoveryInstructions`. Outer MCP `ok` is false when `data.ok` is false.

## Optional Jira comment

`praxis_developer_git_link_jira_preview` then apply. Comment only. No extra transitions, no Quality Apply.

## Auth

| Kind | Where |
|------|--------|
| Git SSH / HTTPS | macOS SSH agent or Git credential helper. Never paste a private key |
| GitHub API | Runtime `github_token` PAT with `repo`. Never chat |
| GitHub API URL | `https://api.github.com` |

See [Credentials](/getting-started/credentials) and [Secrets](/reference/secrets).
