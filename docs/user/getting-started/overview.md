# Overview

Praxis is a role pipeline for product work that already lives in Jira.

```
Jira Epic  →  BA Stories  →  Architect Work Package  →  Developer implementation  →  Quality review  →  Jira Done
```

Human approval is required before Jira writes. Preview is not apply.

## Who this is for

Someone who has never installed Praxis and may not know MCP, Claude plugins, or Jira API tokens.

## What you install

From a Praxis release (not from `npm install -g`):

| File | Kind | Purpose |
|------|------|---------|
| `claude-extensions/praxis-runtime.mcpb` | Desktop extension | Shared Runtime / MCP tools / Jira config |
| `claude-plugins/praxis-ba.zip` | Role plugin | BA Skills |
| `claude-plugins/praxis-architect.zip` | Role plugin | Architect Skills |
| `claude-plugins/praxis-developer.zip` | Role plugin | Developer Skills |
| `claude-plugins/praxis-quality.zip` | Role plugin | Quality Skills |

Filenames are exact. Do not rename the archives.

## Recommended order

1. Install Praxis Runtime MCPB
2. Enter Jira settings in the Runtime
3. Install **one or more** role plugin ZIPs (only the roles you will use)
4. Open Cowork, enable local computer access, choose the product folder
5. Confirm with `praxis_doctor` / a Status skill
6. Start that role’s workflow

CLI (`praxis …`) is for advanced users, CI, and debugging. Ordinary Desktop users should not export `PRAXIS_JIRA_*` or create `.env` files.
