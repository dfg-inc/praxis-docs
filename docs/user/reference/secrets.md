# Secrets

Runtime keys: `jira_base_url`, `jira_email`, `jira_project_key`, `jira_token`.

`jira_token` is sensitive. Configure it only in Claude Desktop Runtime settings.

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
