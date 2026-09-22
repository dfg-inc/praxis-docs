# praxis-docs

Canonical VitePress user portal for Core, Runtime, BA, Architect, Developer, Quality, and Marketplace.

```bash
npm ci
npm run verify   # docs:build + accept:docs
```

## Sections

- Concepts: Core, Runtime, Plugins, Marketplace
- Plugins: BA / Architect / Developer / Quality
- Workflows and reference

## Release

Static site artifact from CI (`public/`). **No production deploy** in the default pipeline — enable Pages/hosting only with an explicit ops confirmation.

Marketplace builds clone this repo's `docs/user` via `CI_JOB_TOKEN`.
