# Configuration

## Where settings come from

| Client | How settings reach the Runtime |
| --- | --- |
| Claude Desktop with the MCPB | Extension settings (`user_config`) are mapped to environment variables for the server process. Sensitive fields are stored in the operating system secret vault |
| Claude Code, Desktop Code, Cowork (plugin) | The plugin server inherits the environment of the client process. Set variables before starting the client |
| CLI and CI | `PRAXIS_*` environment variables |
| A repository file | `.env.praxis`, `.env`, `.env.praxis.local` in the repository root, with restrictions below |

All settings are optional. Local workflows need none of them.

## Extension settings

Authoritative list: `JIRA_USER_CONFIG` and `JIRA_ENV_MAP` in `praxis-runtime/tools/scripts/claude-extensions-shared.mjs`.

| Setting key | Environment variable | Sensitive | Purpose |
| --- | --- | --- | --- |
| `jira_base_url` | `PRAXIS_JIRA_BASE_URL` | no | Jira Cloud or Data Center origin, no trailing slash |
| `jira_email` | `PRAXIS_JIRA_EMAIL` | no | Account email (Cloud: email plus API token) |
| `jira_project_key` | `PRAXIS_JIRA_PROJECT_KEY` | no | Jira project key, for example `PRX` |
| `jira_token` | `PRAXIS_JIRA_TOKEN` | yes | Jira API token |
| `approval_mode` | `PRAXIS_APPROVAL_MODE` | no | Blank (default, Approval Required), `trusted-client`, or `host-permission` |
| `github_token` | `PRAXIS_GITHUB_TOKEN` | yes | GitHub personal access token with repo scope (PAT, not OAuth) for Pull Requests and Actions status |
| `github_api_url` | `PRAXIS_GITHUB_API_URL` | no | Optional: `https://api.github.com` or `https://HOST/api/v3` for GitHub Enterprise; not a git remote URL |
| `gitlab_token` | `PRAXIS_GITLAB_TOKEN` | yes | GitLab personal access token (api scope) for Merge Requests |
| `gitlab_base_url` | `PRAXIS_GITLAB_BASE_URL` | no | Optional GitLab origin, no trailing slash |

A blank optional setting reaches the process as the unexpanded text `${user_config.NAME}`. The Runtime treats any `PRAXIS_*` value of the form `${...}` as unset and lists the names in `praxis_doctor` as `hostPlaceholdersIgnored`.

Jira is considered configured when base URL, email, project key and token are all set. Jira operations are available when base URL, token and project key are set (`capabilities.jiraConfig` in the doctor). Otherwise Jira tools return `JIRA_CONFIG_UNAVAILABLE` naming the missing settings; local tools are unaffected.

## Other environment variables read by the Runtime

| Variable | Purpose |
| --- | --- |
| `PRAXIS_STATE_HOME` | Relocates `~/.praxis` (decision journal and diagnostics log) |
| `PRAXIS_QUALITY_PORT`, `PRAXIS_QUALITY_URL`, `PRAXIS_QUALITY_DB`, `PRAXIS_QUALITY_ALLOWED_ROOT`, `PRAXIS_QUALITY_HOST` | Local Quality service port, URL, database and root. When the Runtime starts the service it sets port, database, allowed root (the repository) and host `127.0.0.1` itself |
| `PRAXIS_QUALITY_STARTUP_TIMEOUT_MS` | Quality service start timeout |
| `PRAXIS_SKIP_DOTENV=1` | Do not read repository `.env` files |
| `PRAXIS_BUILD_INFO`, `PRAXIS_BUNDLE_KIND` | Build identity embedded in a shipped bundle; not for users to set |
| `PRAXIS_TEST_APPROVALS`, `PRAXIS_TEST_*` | Test harness only; never set in production |

This is the set seen in the sources; settings used only by acceptance scripts are not listed.

## What a repository `.env` may and may not set

Core's `loadPraxisDotenv` (praxis-core, `packages/cli/src/operations.ts`; tests in `dotenv-trust.test.ts`) reads `.env.praxis`, `.env` and `.env.praxis.local` from the repository, in that order. Rules:

| Rule | Behaviour |
| --- | --- |
| Real environment wins | A key already set in the process environment is never overwritten by a file |
| Forbidden prefixes | Keys starting with `PRAXIS_APPROVAL_`, `PRAXIS_ALLOW_`, `PRAXIS_FIXTURE_`, `PRAXIS_TEST_` are ignored. So a repository cannot set `PRAXIS_APPROVAL_MODE`, switch on test approvals, or relax execution settings |
| Visibility | The names (never values) of rejected keys are reported by `praxis_doctor` in `dotenvRejected`, with a next step |
| Ordinary settings | Other `PRAXIS_*` keys (for example `PRAXIS_JIRA_PROJECT_KEY`) load normally when not already in the environment |
| Format | Only lines `UPPER_CASE_NAME=value`; surrounding quotes are stripped |
| Opt out | `PRAXIS_SKIP_DOTENV=1` |

Reason: files in a repository are writable by the agent, so they must not decide how a change is approved. Only the operator's real environment (or the extension settings) can.

Code observation: `PRAXIS_STATE_HOME` is not on the forbidden list. A repository file could therefore relocate the journal and diagnostics if the variable is not already set in the environment. Not verified whether this is intended.

## Secrets handling

- Tokens are entered in the extension settings (stored in the OS secret vault) or in the environment of the operator. Never paste a token into chat.
- `praxis_doctor` and the provider diagnostics report only whether each setting is configured, never its value.
- The diagnostics log records tool names, durations, result codes and declared capability keys, not arguments, plan text, tokens or file contents.
- Workflow state written to `.praxis/` passes through the Runtime's redaction. `praxis-state-policy.mjs scan` checks committable files for credentials and home paths and reports the kind and location, never the value.
- Do not put `PRAXIS_JIRA_TOKEN`, `PRAXIS_GITHUB_TOKEN` or `PRAXIS_GITLAB_TOKEN` in a committed `.env`. A repository `.env` can supply them (they are ordinary settings), so keep such files out of version control.
- Git Delivery never prints credentials; `praxis_developer_git_status` reports provider and identity state only.
