# Jira credentials

Praxis Runtime needs four values. Only the API token is a secret.

## Fields

| Field | Meaning | Example |
|-------|---------|---------|
| Jira Base URL | Your Jira Cloud **site**, including `https://`, no trailing path | `https://example.atlassian.net` |
| Jira Email | The **Atlassian account email** that owns the API token | `user@example.com` |
| Jira Project Key | Short project key from Jira (not an issue key) | `PRX` |
| Jira API Token | Token from Atlassian account security | enter only in the Runtime token field |

## Issue key vs project key

- **Project key:** `PRX` — the project.
- **Issue key:** `PRX-1`, `PRX-3`, `PRX-4` — a single Epic, Story, or Task.

Do not put `PRX-1` in `jira_project_key`.

## Email vs username

Cloud auth uses the **account email**, not a Jira username/login alias. Praxis `jira_email` must match the account that created the token.

## API token vs password

`jira_token` is an **Atlassian API token**, not your account password, not a Jira Data Center PAT, and not a Forge/OAuth client secret.

Official documentation: [Manage API tokens for your Atlassian account](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/).

Create or revoke tokens at: [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens).

1. Sign in to Atlassian.
2. Open **Security** → **API tokens** (or use the URL above).
3. **Create API token**, copy it once.
4. Paste it only into Claude Desktop → **Settings → Extensions → Praxis Runtime → Settings** → Jira API Token.
5. Save.

Do not commit tokens. Do not put them in `.project`, chat, prompts, Marketplace forms, or screenshots.

## GitHub credentials (Git Delivery)

GitHub is the alpha.42 MVP for Push / Pull Request.

| Field | `user_config` | Secret |
|-------|----------------|--------|
| GitHub Token | `github_token` | **yes** |
| GitHub API URL | `github_api_url` | no (default `https://api.github.com`) |

Create a **classic or fine-grained PAT** with `repo` (and `workflow` if you need Actions writes). This is **not** OAuth.

1. GitHub → Settings → Developer settings → Personal access tokens.
2. Generate a token. Copy it once.
3. Paste only into Claude Desktop → Settings → Extensions → Praxis Runtime → **GitHub Token**.
4. Save.

SSH transport uses your existing `ssh-agent` keys (`git@github.com:owner/repo.git`). Praxis never asks for the private key file.

## GitLab credentials (optional)

Self-Managed: sign in to your GitLab → **User Settings → Access Tokens** → create a token with `api` scope. Paste it only into Runtime **GitLab Token**. Set **GitLab Base URL** to `https://gitlab.example.com` (no slash, not a Jira URL).

GitLab.com tokens: [https://gitlab.com/-/user_settings/personal_access_tokens](https://gitlab.com/-/user_settings/personal_access_tokens).


## Permissions

Roles need different Jira rights. See [Jira permissions](/reference/permissions). Read-only tools (`praxis_ba_status`, `praxis_developer_status`, …) need browse/read. Apply tools need create/transition/comment rights **and** a human `confirmation=YES`.

## Where values live

| Place | Allowed |
|-------|---------|
| Runtime `user_config` in Claude Desktop | **Yes** — this is the product path |
| OS keychain via Desktop | **Yes** (token) |
| `.project` | **No secrets** |
| Git / Markdown / chat | **No** |
| `launchctl setenv` / shell `.env` | Not the Desktop install path. CLI/CI only |

These examples are **fictional**. They are not from any live acceptance environment.
