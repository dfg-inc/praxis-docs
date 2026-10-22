# Praxis documentation

Praxis turns a business request (a Jira Epic is optional) into reviewed software through four **independent role plugins** that share one **Praxis Runtime**.

Install it from Claude: **Customize → Plugins → Add marketplace → `dfg-inc/praxis-marketplace` → Praxis → Add**. You do not need a terminal, npm, `sudo`, a background service or a `.env` file. Jira and SimpleOne are optional.

## Start here

1. [What you need](/getting-started/requirements)
2. [Install Praxis](/getting-started/installation)
3. [Jira credentials](/getting-started/credentials) (optional)
4. [First run](/getting-started/first-run)
5. [User guide](/guide/create-project) and [Approvals](/concepts/approvals)
6. [Role plugins](/plugins/overview)
7. [Copy-paste prompts](/reference/prompts)
8. [Full tutorial](/workflows/full-e2e)
9. [GitHub Delivery](/workflows/github-delivery)

## Product map

| Product | Repository | What it is |
|---------|------------|------------|
| Core | `praxis-core` | Shared libraries ([Core](/concepts/core)) |
| Runtime | `praxis-runtime` | Local MCP server (plugin) and Desktop MCPB ([Runtime](/concepts/runtime)) |
| BA | `praxis-ba` | Requirements Skills ZIP |
| Architect | `praxis-architect` | Design Skills ZIP |
| Developer | `praxis-developer` | Implementation Skills ZIP |
| Quality | `praxis-quality` | QA Skills ZIP |
| Docs | `praxis-docs` | This VitePress portal |
| Marketplace | `praxis-marketplace` | The Claude plugin marketplace ([Marketplace](/concepts/marketplace)) |

## The four roles

| Plugin | What it does | Install with |
|--------|----------------|--------------|
| Praxis BA | Requirements and Stories | `praxis-ba` (brings the Runtime) |
| Praxis Architect | Design and Work Packages | `praxis-architect` (brings the Runtime) |
| Praxis Developer | Claim, implement, verify, complete | `praxis-developer` (brings the Runtime) |
| Praxis Quality | QA review, bugs, Done | `praxis-quality` (brings the Runtime) |

Each role plugin is independently installable. You never need four Runtime copies. One shared Runtime serves every role.

## What is a plugin? An MCPB? A Skill?

- A **Claude plugin** (from the marketplace) bundles Skills and, for `praxis-runtime`, a local MCP server. **Praxis** is a bundle plugin that depends on the other five.
- An **MCPB** (`.mcpb`) is a Claude Desktop extension package. Use `praxis-runtime.mcpb` only for Desktop **Chat**, which does not get a plugin's local server.
- A **Skill** is a named workflow Claude follows (for example `praxis-ba:local-workflow`).

If the Runtime is missing, tools such as `praxis_doctor` are absent and a Skill stops with `PRAXIS_RUNTIME_UNAVAILABLE`.

## Source of this documentation

These pages are the **canonical user documentation**. The Praxis Marketplace site includes the same Markdown files at build time so installation instructions cannot drift between the two surfaces.

Marketplace catalog and method pages remain on the Marketplace site. This portal is the end-user installation and workflow guide.

Marketplace repository: https://github.com/dfg-inc/praxis-marketplace

