# Marketplace

The **Praxis Marketplace** is a Claude plugin marketplace hosted in the GitHub repository `dfg-inc/praxis-marketplace` (`https://github.com/dfg-inc/praxis-marketplace`, marketplace name `praxis`). It is the primary way to install Praxis.

## Install from Claude UI

**Customize → Plugins → Add → Add marketplace** → `dfg-inc/praxis-marketplace` → choose **Praxis** → **Add**. See [Install Praxis](/getting-started/installation).

## What the marketplace offers

| Plugin | Role |
|---|---|
| `praxis` | The complete set. Installs the five plugins below as dependencies |
| `praxis-runtime` | The local MCP server (`praxis_*` tools). Installed automatically with any role |
| `praxis-ba`, `praxis-architect`, `praxis-developer`, `praxis-quality` | Role skills, installable separately |

A role plugin declares its dependency on `praxis-runtime`, so installing one role never leaves it without tools, and only one Runtime runs.

## What it does not do

A plugin's local MCP server is not an ordinary-Chat tool. For Claude Desktop **Chat**, install the Runtime from the release `praxis-runtime.mcpb`. Claude Web Chat gets skills only. Praxis has no remote service.

## Release artifacts

The Runtime MCPB and the role ZIPs (for Desktop Chat uploads) are published as GitHub Releases of each product repository (for example `https://github.com/dfg-inc/praxis-runtime/releases`), each with `release-meta.json` and SHA-256. Do not use CI job artifacts for ordinary installation.

How the marketplace is built and released: see [Marketplace distribution](/technical/marketplace-distribution).
