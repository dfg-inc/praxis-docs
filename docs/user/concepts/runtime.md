# Praxis Runtime

Praxis Runtime is the single local MCP server used by every role plugin.

- Packaged as `claude-extensions/praxis-runtime.mcpb`
- Configured once in Claude Desktop (`jira_base_url`, `jira_email`, `jira_project_key`, `jira_token`, optional `github_token` / `gitlab_token`)
- Exposes public tools such as `praxis_doctor`, `praxis_ba_preview`, `praxis_developer_complete`

Claude Desktop does **not** reliably inherit `launchctl setenv` or shell `.env` into the MCP child. That path failed after alpha.30. Desktop users configure `user_config`, not environment inheritance.

Quality is started by `praxis_quality_ensure` from `server/praxis-quality.cjs` in the same MCPB. In Claude Desktop it runs inside the Runtime process. Under a normal `node` CLI it is a detached child. Users do not start it themselves, and they do not install Node or SQLite for it.

CLI and CI still use `PRAXIS_JIRA_*`. That is not the ordinary Desktop install.

See [Installation](/getting-started/installation) and [Secrets](/reference/secrets).
