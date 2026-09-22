# Praxis documentation

Praxis turns a Jira Epic into reviewed software through four **independent role plugins** that share one **Praxis Runtime**.

The primary product experience is **Claude Desktop / Cowork**. You install a Runtime desktop extension, configure Jira once, then install only the role plugins you need.

You do **not** need Make, npm, a terminal, `launchctl`, or a `.env` file for ordinary Desktop use.

## Start here

1. [What you need](/getting-started/requirements)
2. [Install Praxis](/getting-started/installation)
3. [Jira credentials](/getting-started/credentials)
4. [First run](/getting-started/first-run)
5. [Role plugins](/plugins/overview)
6. [Copy-paste prompts](/reference/prompts)
7. [Full tutorial](/workflows/full-e2e)
8. [GitHub Delivery](/workflows/github-delivery)

## Product map

| Product | Repository | What it is |
|---------|------------|------------|
| Core | `praxis-core` | Shared libraries ([Core](/concepts/core)) |
| Runtime | `praxis-runtime` | Desktop MCPB + Quality HTTP worker ([Runtime](/concepts/runtime)) |
| BA | `praxis-ba` | Requirements Skills ZIP |
| Architect | `praxis-architect` | Design Skills ZIP |
| Developer | `praxis-developer` | Implementation Skills ZIP |
| Quality | `praxis-quality` | QA Skills ZIP |
| Docs | `praxis-docs` | This VitePress portal |
| Marketplace | `praxis-marketplace` | Catalog site ([Marketplace](/concepts/marketplace)) |

## The four roles

| Plugin | What it does | Install with |
|--------|----------------|--------------|
| Praxis BA | Requirements and Stories | Runtime + `praxis-ba.zip` |
| Praxis Architect | Design and Work Packages | Runtime + `praxis-architect.zip` |
| Praxis Developer | Claim, implement, verify, complete | Runtime + `praxis-developer.zip` |
| Praxis Quality | QA review, bugs, Done | Runtime + `praxis-quality.zip` |

Each role plugin is independently installable. You never need four Runtime copies. One shared Runtime serves every role.

## What is MCPB? What is a plugin? What is a Skill?

- **MCPB** (`.mcpb`) is a Claude Desktop **extension package**. Praxis Runtime is one file: `claude-extensions/praxis-runtime.mcpb`. It is the local engine that talks to Jira and the repository.
- A **Claude plugin** ZIP contains **Skills** (instructions Claude follows) for one role. Role ZIPs do not embed a second Runtime.
- A **Skill** is a named workflow you start in Cowork (for example *Jira Epic Analysis* or *Implement Work Package*).

If you install a role ZIP without the Runtime, tools such as `praxis_doctor` are missing and the Skill stops with `PRAXIS_RUNTIME_UNAVAILABLE`.

## Source of this documentation

These pages are the **canonical user documentation**. The Praxis Marketplace site includes the same Markdown files at build time so installation instructions cannot drift between the two surfaces.

Marketplace catalog and method pages remain on the Marketplace site. This portal is the end-user installation and workflow guide.
