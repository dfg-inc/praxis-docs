# praxis-docs

Canonical VitePress user portal for Core, Runtime, BA, Architect, Developer, Quality, and Marketplace.

**Production URL (GitLab Pages, unique domain):** https://praxis-docs-e263c2.pages.jetru.by

Access: project is **private**; sign into `gl.jetru.by` (same SSO session) before opening Pages. VitePress `base` is `/` because unique domain is enabled.

```bash
npm ci
npm run verify   # docs:build + accept:docs
```

## Sections

- Concepts: Core, Runtime, Plugins, Marketplace
- Plugins: BA / Architect / Developer / Quality
- Workflows and reference

## Deploy

Push to `master` runs `build_docs` then the GitLab `pages` job, which publishes `public/` to the unique-domain URL above. Marketplace: https://praxis-marketplace-833761.pages.jetru.by

Marketplace builds clone this repo's `docs/user` via `CI_JOB_TOKEN`.
