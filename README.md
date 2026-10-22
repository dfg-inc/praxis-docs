# praxis-docs

Canonical VitePress user portal for Core, Runtime, BA, Architect, Developer, Quality, and Marketplace.

Repository: https://github.com/dfg-inc/praxis-docs. Praxis installs from the Claude plugin marketplace `dfg-inc/praxis-marketplace` (https://github.com/dfg-inc/praxis-marketplace): Claude → Customize → Plugins → Add marketplace → Praxis → Add.

```bash
npm ci
npm run verify   # docs:build + accept:docs
```

## Sections

- Concepts: Core, Runtime, Plugins, Marketplace
- Plugins: BA / Architect / Developer / Quality
- Workflows and reference

## Deploy

The site is built with VitePress (`npm run docs:build`). The maintainers' internal CI also publishes it to an internal Pages site; the marketplace repository syncs this repo's `docs/user` into its own site.
