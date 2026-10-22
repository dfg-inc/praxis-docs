# Tools catalog

Source of truth: `packages/mcp/src/catalog.ts` (tool definitions and role filter) and `PROTECTED_TOOLS` in `packages/mcp/src/tools.ts` in praxis-runtime. The Runtime exposes **52 tools**. The shipped plugin and MCPB start the server with `--role runtime`, which exposes all of them.

## How to read the tables

- **Kind** is the catalog `kind`: `read` (reads only), `preview` (computes a plan or runs a local check; does not execute the protected action), `apply` (changes state).
- **Protected** means the tool is in `PROTECTED_TOOLS`: Praxis obtains approval before it runs ([Security model](./security-model.md)). All 15 `apply` tools are protected; no other tool is.
- Preview tools return a `previewFingerprint` that the matching apply tool must receive.
- Every `apply` tool also accepts `instanceId` and `planText` (only used in host-permission mode) and requires `confirmation` (`YES` or `NO`). `confirmation=YES` is the agent's request, not the user's approval.
- **Roles**: `all` means BA, Architect, Developer and Quality. The `runtime` role always sees every tool.

Tools per role: BA 18, Architect 21, Developer 38, Quality 26, runtime 52.

## Common

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_doctor` | read | no | all | Capability check: runtime build, repository, `.project`, provider configuration (presence only, never secret values), Quality health, approval mode and client |
| `praxis_capabilities` | read | no | all | Contextual guidance for the current request; executes nothing |
| `praxis_session_start` | read | no | all | Role initialisation for hosts that cannot run the plugin bootstrap: `.project` status, knowledge rules, work items, role tools |
| `praxis_approval_plan` | read | no | all | The exact plan the user would be asked to approve for a protected apply tool, computed from live state; runs nothing |
| `praxis_project_status` | read | no | all | `.project` status for a repository |
| `praxis_project_init_preview` | preview | no | all | Show the inferred `.project` YAML; writes nothing |
| `praxis_project_init_apply` | apply | yes | all | Write `.project` from the previewed inference |

## Local workflow

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_workflow_status` | read | no | all | Local workflow state: requirement ids, stage, next role, all work items with the current one marked. No Jira needed |
| `praxis_workflow_inspect` | read | no | all | Stored workflow for one work item, by view (overview, requirements, stories, decisions, work, handoffs, open-items, quality, links, all) |
| `praxis_workflow_preview` | preview | no | all | Preview a local workflow command (open, select-work-item, link-work-item, add-requirement, handoff, revise-requirement, set-service, quality-check) |
| `praxis_workflow_apply` | apply | yes | all | Write a previewed workflow command. Approval is asked only for human acts (confirm a Story or decision, approve a service); agent-authored records need none |

## Jira (optional)

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_jira_smoke` | read | no | all | Jira connection check |
| `praxis_jira_discover` | read | no | all | Issue-type discovery, including the numeric `bugTypeId` |
| `praxis_jira_epic` | read | no | all | Fetch an epic and its children |
| `praxis_jira_status` | read | no | all | Hydrated epic status; filters superseded issues |

## BA

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_ba_status` | read | no | ba | BA/Jira status for an epic |
| `praxis_ba_preview` | preview | no | ba | Plan of Jira writes (CREATE, UPDATE, UNCHANGED, SUPERSEDED); no write |
| `praxis_ba_apply` | apply | yes | ba | Materialize the previewed BA plan in Jira |

## Architect and work packages

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_architect_status` | read | no | architect | Architect/Jira status for an epic |
| `praxis_architect_preview` | preview | no | architect | Plan for one canonical local Work Package (`workPackageId` scopes it); no write |
| `praxis_architect_apply` | apply | yes | architect | Materialize the previewed Architect plan in Jira |
| `praxis_work_package_list` | read | no | architect, developer, quality | List local work packages |
| `praxis_work_package_show` | read | no | architect, developer, quality | Local work package and its resolved Jira key |
| `praxis_work_package_status` | read | no | architect, developer, quality | Alias of `praxis_work_package_show` |

## Developer

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_developer_status` | read | no | developer | Status by `workPackage` (local id or Jira key) or by local `workItemId` |
| `praxis_developer_claim` | apply | yes | developer | Claim a work package (idempotent for the same actor) |
| `praxis_developer_release` | apply | yes | developer | Force-release a claim |
| `praxis_developer_complete` | apply | yes | developer | Run required verification, persist evidence, emit the Developer to Quality handoff; does not mark Done |
| `praxis_developer_complete_recovery_preview` | preview | no | developer | Preview reconciling a premature Jira Done or missing evidence; writes nothing |
| `praxis_developer_complete_recovery_apply` | apply | yes | developer | Apply the recovery; restores development status and reconciles evidence |

## Developer: Git delivery

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_developer_git_status` | read | no | developer | Git Delivery assessment: branch, HEAD, working tree, remotes, provider, identity; never prints credentials |
| `praxis_developer_git_connect_preview` | preview | no | developer | Preview adding or selecting a remote; does not create a repository |
| `praxis_developer_git_connect_apply` | apply | yes | developer | `git remote add` or `set-url`; no push |
| `praxis_developer_git_identity_preview` | preview | no | developer | Preview repository-local `user.name` and `user.email` |
| `praxis_developer_git_identity_apply` | apply | yes | developer | Write the repository-local identity |
| `praxis_developer_git_preview` | preview | no | developer | Allowlist, hashes, Quality snapshot binding, commit message, fingerprint; does not branch, stage or commit |
| `praxis_developer_git_commit` | apply | yes | developer | Create a local feature branch, stage the allowlist, commit; no push, no pull request, no Jira |
| `praxis_developer_git_publish_preview` | preview | no | developer | Preview a push (baseline or branch): source SHA, remote branch, refspec; never force |
| `praxis_developer_git_publish` | apply | yes | developer | `git push` without `--force` |
| `praxis_developer_git_merge_request_preview` | preview | no | developer | Preview a GitHub Pull Request or GitLab Merge Request against the published default branch |
| `praxis_developer_git_merge_request` | apply | yes | developer | Create the PR or MR after push; deduplicates; does not merge and does not claim CI passed |
| `praxis_developer_git_delivery_status` | read | no | developer | Git Delivery journal: commit SHA, remote, PR or MR URL, CI status if known |
| `praxis_developer_git_link_jira_preview` | preview | no | developer | Preview a Jira comment that links the PR or MR |
| `praxis_developer_git_link_jira_apply` | apply | yes | developer | Write that Jira comment; no status change |

## Quality

| Tool | Kind | Protected | Roles | Purpose |
| --- | --- | --- | --- | --- |
| `praxis_quality_status` | read | no | quality | Quality service health and the work package Quality lifecycle; does not start the service |
| `praxis_quality_ensure` | preview | no | quality | Start or reuse the local Quality HTTP service bundled in the Runtime; runs no review, writes no Jira |
| `praxis_quality_review` | preview | no | quality | Run a Quality Review for a work package; persists QA evidence and a SQLite review; does not change Jira |
| `praxis_quality_report` | preview | no | quality | Safe alias of `praxis_quality_review` |
| `praxis_quality_review_show` | read | no | quality | Read a stored review by id |
| `praxis_quality_apply_preview` | preview | no | quality | Preview the Jira writes for a persisted review (live transitions); no write |
| `praxis_quality_apply` | apply | yes | quality | Write the previewed Quality Apply plan; Jira Done or Bugs only from this approved plan |
| `praxis_quality_apply_status` | read | no | quality | Postconditions of a Quality Apply: Jira properties, comment, manifest, journal, consistency |

Note: `praxis_quality_ensure`, `praxis_quality_review` and `praxis_quality_report` are `preview` in the catalog but have local side effects (a local service, evidence files, a SQLite review). They are not in `PROTECTED_TOOLS`, and the catalog states that they do not write Jira.

## The 15 protected tools

`praxis_project_init_apply`, `praxis_ba_apply`, `praxis_architect_apply`, `praxis_developer_claim`, `praxis_developer_release`, `praxis_developer_complete`, `praxis_developer_complete_recovery_apply`, `praxis_quality_apply`, `praxis_developer_git_connect_apply`, `praxis_developer_git_identity_apply`, `praxis_developer_git_commit`, `praxis_developer_git_publish`, `praxis_developer_git_merge_request`, `praxis_developer_git_link_jira_apply`, `praxis_workflow_apply`.

To check that your client sees the full set, compare `praxis_doctor` `data.build.tools.count` (52) and `digest` with the digest of the sorted tool names. A different count means a stale tool registry or another build.
