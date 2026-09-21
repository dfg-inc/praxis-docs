# Install Praxis (Claude Desktop / Cowork)

This is the ordinary-user path. It does **not** use Makefile, npm, or `PRAXIS_JIRA_*` environment variables.

Labels below match the Claude Desktop paths documented for current Praxis Desktop acceptance (Settings → Extensions, plugin upload). Exact wording can differ slightly by Claude Desktop version and OS. If a label is missing, use the in-app search for **Extensions** or **Plugins** rather than guessing a hidden menu.

## 1. Obtain release artifacts

Take them from the Praxis release you were given (git tag such as `v0.1.0-alpha.35`, an internal mirror, or Marketplace downloads that point at **real** files).

Required files:

```
claude-extensions/praxis-runtime.mcpb
claude-plugins/praxis-ba.zip
claude-plugins/praxis-architect.zip
claude-plugins/praxis-developer.zip
claude-plugins/praxis-quality.zip
```

| File | What it is |
|------|------------|
| `praxis-runtime.mcpb` | **Praxis Runtime** — the shared engine. `.mcpb` is a Claude Desktop extension bundle (MCP server + `user_config`). |
| `praxis-ba.zip` | BA **Skills only** |
| `praxis-architect.zip` | Architect Skills only |
| `praxis-developer.zip` | Developer Skills only |
| `praxis-quality.zip` | Quality Skills only |

Runtime and role plugins are different on purpose. The MCPB talks to Jira and the disk. Role ZIPs tell Claude *how* to use those tools for one job. Role ZIPs do **not** embed another Runtime.

Install only the role ZIPs you need. Installing BA does not require Architect, Developer, or Quality to be present.

## 2. Install Praxis Runtime

1. Open **Claude Desktop**.
2. Open **Settings**.
3. Open **Extensions**.
4. Open **Advanced settings** (if shown) and choose **Install extension** (or **Install desktop extension**).
5. Select `praxis-runtime.mcpb`.
6. **Enable** the extension named **Praxis Runtime**.

You should see **one** Praxis Runtime process, not one per role.

### Screenshot placeholder — Runtime install

> **Capture checklist (do not fabricate):** Settings window; Extensions list; Install extension file picker showing `praxis-runtime.mcpb`; extension enabled toggle; no token visible.

## 3. Configure the Runtime (Jira)

1. Still in **Settings → Extensions**, open **Praxis Runtime**.
2. Open **Settings** (extension configuration).
3. Fill in:

| UI field | `user_config` key | Example | Sensitive |
|----------|-------------------|---------|-----------|
| Jira Base URL | `jira_base_url` | `https://example.atlassian.net` | no |
| Jira Email | `jira_email` | `user@example.com` | no |
| Jira Project Key | `jira_project_key` | `PRX` | no |
| Jira API Token | `jira_token` | *(paste only in this field)* | **yes** |
| GitHub Token (Git Delivery) | `github_token` | *(optional PAT, not OAuth)* | **yes** |
| GitHub API URL | `github_api_url` | `https://api.github.com` | no |
| GitLab Token | `gitlab_token` | *(optional)* | **yes** |
| GitLab Base URL | `gitlab_base_url` | `https://gitlab.example.com` | no |

4. **Save**.

How to mint the token: [Jira credentials](/getting-started/credentials). Never paste the token into chat, Markdown, git, or screenshots.

Claude Desktop stores `jira_token` in OS secure storage (macOS Keychain, Windows Credential Manager, Linux keychain where supported).

### Screenshot placeholder — Runtime settings

> **Capture checklist:** Praxis Runtime settings form with the four fields; token field masked; Save control; no live token value.

## 4. Install role plugins

1. In Claude, open **Customize → Plugins** (or **Settings → Plugins**, depending on the Desktop build).
2. Choose **Add** / **Upload plugins**.
3. Select one ZIP, for example `praxis-ba.zip`.
4. **Enable** that plugin.
5. Repeat for any other roles you need.

Each ZIP’s `.claude-plugin/plugin.json` must sit at the **archive root**. Do not re-zip a parent folder around it.

### Screenshot placeholder — plugin upload

> **Capture checklist:** Plugins list; upload control; `praxis-ba.zip` selected; plugin enabled; Skills list showing Praxis BA skills. Repeat optionally for other roles.

## 5. Confirm installation

1. Confirm **Praxis Runtime** is enabled.
2. Confirm at least one role plugin is enabled.
3. Confirm Skills for that role appear (see [Plugins](/plugins/overview)).
4. Open a **new** Cowork session after enabling anything (see [First run](/getting-started/first-run)).

If a Skill says `PRAXIS_RUNTIME_UNAVAILABLE`, the Runtime is missing or disabled. Installing another role ZIP will not fix that.

## 6. Why this order

| If you only install… | What happens |
|----------------------|----------------|
| Role ZIP, no Runtime | `praxis_doctor` is absent → `PRAXIS_RUNTIME_UNAVAILABLE` |
| Runtime, no role ZIP | Tools exist, but you have no role Skill/prompts |
| Four Runtimes | Wrong. Uninstall extra MCP copies. One Runtime is enough |
| All four ZIPs | Allowed, not required |

## 7. Developer rebuild (not for end users)

Rebuilders and CI use `make claude-extension` / `make claude-plugins` from the Praxis monorepo. Ordinary users must not be sent there.
