# Requirements

## You need

- **Claude Desktop** with Cowork (local folder / computer use) on the computer that holds the product repository
- A **Jira Cloud** site you can read (and, for apply workflows, write) in the target project
- A **Jira API token** for your Atlassian account ([how to get one](/getting-started/credentials))
- The Praxis **release artifacts** listed on [Installation](/getting-started/installation)

## You do not need (ordinary Desktop install)

- Node.js, npm, Make, Docker, or SQLite
- Editing Praxis source
- `launchctl setenv`
- A repository `.env` file
- Installing all four role plugins
- A separate Runtime per role

## Supported Jira

Praxis Cloud authentication uses **Atlassian account email + API token** (`jira_email` + `jira_token`) against a site such as `https://example.atlassian.net`.

Do not put the password for your Atlassian account in `jira_token`. Do not put a Data Center personal access token into the Cloud token field.

## Product folder

Cowork must be able to read (and, for Developer/Quality, write) the **product** repository — the code you are changing — not the Praxis source tree unless you are developing Praxis itself.
