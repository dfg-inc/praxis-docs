# Marketplace

The **Praxis Marketplace** site (`praxis-marketplace`) publishes the product catalog and mirrors the same user Markdown as this Docs portal.

## What you get from Marketplace

- Catalog of Runtime MCPB and independent role ZIPs
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

Install Runtime first, then only the role ZIPs you need. Do not use temporary CI job artifacts for ordinary installation.


Production deployment of the Marketplace site is a separate operations decision and is not part of the default Docs/Marketplace CI pipelines.
