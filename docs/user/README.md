# Canonical user documentation

This tree is the **single source of truth** for Praxis end-user guides.

```
docs/user  (canonical Markdown)
    ├── apps/docs-site          VitePress portal (`srcDir` → here)
    └── apps/marketplace-site   `npm run build` copies this tree to docs/user-guide/
```

Do not maintain a second copy of installation or role guides. Edit files here; Marketplace and the docs portal pick them up at build time (copy, not symlinks, not runtime fetch).

Developer-oriented WBS/specs stay in `docs/` outside `user/`. Marketplace catalog/method pages stay in `apps/marketplace-site/docs/` and are not duplicated here.
