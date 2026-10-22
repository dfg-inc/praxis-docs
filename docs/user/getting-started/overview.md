# Overview

Praxis is a role pipeline for product work: a business request becomes requirements, architecture, an implementation and an independent verification. Jira is optional; everything works locally first.

```
Request  →  BA Stories  →  Architect decisions  →  Developer implementation  →  Quality verdict  →  (optional) Jira / Git delivery
```

Protected actions (writes, Git, Jira, confirming a Story) follow **Action → Preview → Approval → Execute → Result**. Preview is not apply, and the agent's own "yes" is not your approval. See [Approvals](/concepts/approvals).

## Who this is for

Someone who has never installed Praxis and may not know MCP, Claude plugins or Jira API tokens.

## What you install

From the Claude interface (**Customize → Plugins → Add marketplace → `dfg-inc/praxis-marketplace` → Praxis → Add**):

| Plugin | Purpose |
|---|---|
| `praxis` | The complete set (dependencies on the five below) |
| `praxis-runtime` | Local MCP server: the `praxis_*` tools |
| `praxis-ba`, `praxis-architect`, `praxis-developer`, `praxis-quality` | Role skills |

Claude Desktop **Chat** additionally needs the `praxis-runtime.mcpb` extension, because a plugin's local server is not a Chat tool. See [Install Praxis](/getting-started/installation).

## Recommended order

1. Add the marketplace and the **Praxis** plugin
2. Optionally enter Jira, GitHub or GitLab settings in the Runtime (not needed for local work)
3. Open your project folder and call `praxis_doctor` (or run the `getting-started` skill)
4. Create the project (`.project`) and start with the role you need

The `praxis` command line is for advanced users, CI and debugging. Ordinary users should not export `PRAXIS_*` variables or create `.env` files (the one deliberate exception is the owner's opt-in [Trusted Client](/concepts/approvals) setting).
