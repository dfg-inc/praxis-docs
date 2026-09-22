# Marketplace

The **Praxis Marketplace** site (`praxis-marketplace`) publishes the product catalog and mirrors the same user Markdown as this Docs portal.

## What you get from Marketplace

- Catalog of Runtime MCPB and independent role ZIPs
- Installation entry points that point at **product GitLab repositories**, not the old monorepo
- The same `docs/user` content synced at Marketplace build time

## Distribution artifacts

| Product | Artifact |
|---------|----------|
| Runtime | `praxis-runtime.mcpb` from `praxis-runtime` |
| BA | `praxis-ba.zip` from `praxis-ba` |
| Architect | `praxis-architect.zip` from `praxis-architect` |
| Developer | `praxis-developer.zip` from `praxis-developer` |
| Quality | `praxis-quality.zip` from `praxis-quality` |

Install Runtime first, then only the role ZIPs you need.

Production deployment of the Marketplace site is a separate operations decision and is not part of the default Docs/Marketplace CI pipelines.
