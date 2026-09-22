# Marketplace

The **Praxis Marketplace** site (`praxis-marketplace`) publishes the product catalog and mirrors the same user Markdown as this Docs portal.

**Live Marketplace:** https://praxis-marketplace-833761.pages.jetru.by  
(Private GitLab Pages — sign into `gl.jetru.by` first.)

## What you get from Marketplace

- Catalog of Runtime MCPB and independent role ZIPs with version and compatibility
- Direct links to each product’s **GitLab Release** install assets
- Installation entry points that point at **product GitLab repositories**, not the old monorepo
- The same `docs/user` content synced at Marketplace build time

## Distribution artifacts

| Product | Where to download | Artifact |
|---------|-------------------|----------|
| Runtime | [praxis-runtime Releases](https://gl.jetru.by/engineering/ai-tooling/praxis-runtime/-/releases) | `praxis-runtime.mcpb` |
| BA | [praxis-ba Releases](https://gl.jetru.by/engineering/ai-tooling/praxis-ba/-/releases) | `praxis-ba.zip` |
| Architect | [praxis-architect Releases](https://gl.jetru.by/engineering/ai-tooling/praxis-architect/-/releases) | `praxis-architect.zip` |
| Developer | [praxis-developer Releases](https://gl.jetru.by/engineering/ai-tooling/praxis-developer/-/releases) | `praxis-developer.zip` |
| Quality | [praxis-quality Releases](https://gl.jetru.by/engineering/ai-tooling/praxis-quality/-/releases) | `praxis-quality.zip` |

Current wave: [v0.1.0-alpha.44](https://gl.jetru.by/engineering/ai-tooling/praxis-runtime/-/releases/v0.1.0-alpha.44) (each product has its own matching tag).

Install Runtime first, then only the role ZIPs you need. Do not use temporary CI job artifacts for ordinary installation.
