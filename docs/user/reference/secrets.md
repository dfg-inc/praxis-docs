# Secrets

Runtime keys: `jira_base_url`, `jira_email`, `jira_project_key`, `jira_token`, optional `github_token`, `github_api_url`, `gitlab_token`, `gitlab_base_url`.

`jira_token`, `github_token`, and `gitlab_token` are sensitive. Configure them only in Claude Desktop Runtime settings. They are PATs, not OAuth.

Do **not** put API tokens in:

- `.project`
- repository files
- Git
- Markdown
- screenshots
- example prompts
- chat
- Marketplace forms meant for public content

Do not recommend `launchctl setenv` as the Desktop install. Do not tell ordinary users to create `.env` for Desktop.
