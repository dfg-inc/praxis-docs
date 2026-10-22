# Requirements

## You need

- **Claude** with plugin support: Claude Code (CLI 2.1.278 or later), Claude Desktop **Code**, or **Cowork**, on the computer that holds the project folder. For Claude Desktop **Chat**, the Runtime comes from the separate MCPB (see [Installation](/getting-started/installation)).
- **Node.js 20 or later** on that computer (the Runtime is a local Node process started by the plugin; the Desktop MCPB uses Claude Desktop's own runtime).
- A project folder you can read and write.

## Optional

- A **Jira Cloud** site and API token, only if you want Jira features ([Jira credentials](/getting-started/credentials)).
- A GitHub or GitLab token, only for pull/merge requests and CI status.

## You do not need

- Jira or SimpleOne (every local workflow works without them)
- `npm install`, Make, Docker or SQLite
- Administrator rights, a background service, an installer package or a hardware key
- A repository `.env` file
- All four role plugins (install only the roles you use)

## Project folder

Claude must be able to read, and for Developer and Quality write, the **product** repository, not the Praxis source tree unless you are developing Praxis itself.
