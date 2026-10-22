# Release process

This page describes how a Praxis release is prepared, from the scripts in the repositories. **Publishing steps (push, tags, GitHub Releases, updating the marketplace repository) change public state and need explicit owner confirmation. Do not run them on your own.**

## Overview

| Step | Where | Publishes? |
| --- | --- | --- |
| 1. Set the version | every repository | no |
| 2. Pack and vendor Core, refresh pins and lockfiles | praxis-core, then Runtime and roles | no |
| 3. Verify each repository | each repository | no |
| 4. Build artifacts: MCPB and role ZIPs | Runtime, roles | no |
| 5. Restage the marketplace, verify the release candidate | praxis-marketplace | no |
| 6. Acceptance: install from the marketplace | praxis-runtime | no |
| 7. Checksums and release notes | desktop kit / Releases | no |
| 8. Tag and push; Release workflows; marketplace update | GitHub (`dfg-inc`) | **yes, owner confirmation** |

## 1. Version bump

In each repository (praxis-core, praxis-runtime, praxis-ba, praxis-architect, praxis-developer, praxis-quality):

```
node tools/scripts/set-ecosystem-version.mjs 0.1.0-alpha.48
```

It writes `ecosystem.json`, the root `package.json` and every version-bearing manifest it discovers, and syncs internal workspace dependencies. It does not commit, tag, push or touch sibling repositories. Hard-coded versions in `package.json` scripts (`pack:mcpb`, `pack:zip`) are rewritten too. The marketplace's own manifests (`marketplace.json`, `plugins/praxis`) are edited in praxis-marketplace.

## 2. Core vendor refresh

1. In praxis-core: `npm run build`, then `npm run pack:vendor`. This writes the `@praxis/*` tarballs to `dist/vendor/VERSION`.
2. In Runtime and each role repository: copy the tarballs it uses into `vendor/` and run
   ```
   node tools/scripts/set-ecosystem-version.mjs --vendor 0.1.0-alpha.48
   ```
   which retargets the `file:vendor/...` pins. The script reminds you to replace `vendor/*.tgz` and refresh `package-lock.json` before committing (run `npm install` to update the lockfile).
3. `vendor/manifest.json` records `version` and the Core `baseline` commit. In alpha.48 it equals the praxis-core release commit. Not verified: which script writes `baseline` in the current flow (`scripts/vendor.mjs` in the split workspace does it for the migration tooling).
4. `npm run check:version` in each repository fails on version or vendor-pin disagreement.

## 3. Verify

| Repository | Command | Covers |
| --- | --- | --- |
| praxis-core | `npm run verify` | build, typecheck, tests, test-completeness check |
| praxis-runtime | `npm run verify` | build, typecheck, tests, `check:tests`, `pack:mcpb`, git-delivery, quality startup/review/apply/state-consistency/readback, `accept:mcpb-runtime`, `accept:approval-ux` |
| praxis-ba, praxis-quality | `npm run verify` | tests, `plugins:validate`, `check:skill-cli`, `check:boundaries`, `pack:zip`, `pack:full-zip`, `accept:claude-plugins` (BA adds build and its diagnostics and outcomes acceptance) |
| praxis-architect, praxis-developer | `npm run verify` | their own `package.json` defines the exact list |
| praxis-marketplace | `npm run verify` | docs fetch and sync, site build, `accept:marketplace` |
| praxis-docs | `npm run verify` | `docs:build`, `accept:docs` |

Further acceptance in praxis-runtime, run when the area changed: `accept:workflow`, `accept:git-delivery-e2e`, `accept:claude-code-approval`, `accept:quality-*`.

## 4. Artifacts

- Runtime: `npm run pack:mcpb` produces `praxis-runtime.mcpb` under `dist/claude-extensions/VERSION` (the repository also keeps `claude-extensions/praxis-runtime.mcpb` and `manifest.json` with its sha256). `npm run accept:mcpb-runtime` runs the packed bundle.
- Roles: `npm run pack:zip` produces `praxis-ROLE.zip` under `dist/claude-plugins`. These skills-only ZIPs remain for manual upload in Claude Desktop Chat. `npm run accept:claude-plugins` validates them.

## 5. Marketplace restage and release candidate

In praxis-marketplace, after the role and Runtime sources are final:

```
node tools/scripts/stage-portable-plugins.mjs
node tools/scripts/build-release-candidate.mjs
npm run check:rc
```

Update the version in `.claude-plugin/marketplace.json` (metadata, every entry) and `plugins/praxis/.claude-plugin/plugin.json` first. `check:rc` must report the release candidate current (not STALE). Inspect `dirtySources` and `warning` in `release-candidate/manifest.json`: build from clean, committed sources before a release. Details: [Marketplace distribution](./marketplace-distribution.md).

## 6. Acceptance: install from the marketplace

In praxis-runtime: `npm run accept:marketplace-install` (script `marketplace-install-acceptance.mjs`, which takes `--marketplace DIR` and `--previous GIT_REF`). It clones the marketplace from git (so only committed content counts), installs with the real `claude plugin` CLI in a throwaway `CLAUDE_CONFIG_DIR`, and proves: `praxis` installs its five dependencies; one role installs `praxis-runtime` alone; exactly one MCP server; skills present; the installed Runtime lists its tools and answers `praxis_doctor`; Approval Required refuses a write at once while explicit Trusted Client allows it; an older marketplace revision upgrades in place; no absolute developer path ships. It does not exercise the Claude UI flow. Commit the marketplace changes locally before running it. The `--previous` value in `package.json` is a fixed commit and must be updated for each release.

## 7. Checksums

Compute SHA-256 for each artifact. The Release workflows write `release-meta.json` with the artifact's `sha256`, bytes and source SHA; the desktop install kit carries a `SHA256SUMS` file verified with `shasum -a 256 -c SHA256SUMS`. The `.mcpb` is a ZIP with timestamps, so rebuilds differ byte for byte: always publish the checksum of the file actually released. Not verified: which script writes the kit's `SHA256SUMS`.

## 8. Tags and Releases (owner confirmation required)

Each repository with a release workflow (`praxis-core`, `praxis-runtime`, `praxis-ba`, `praxis-architect`, `praxis-developer`, `praxis-quality`) has `.github/workflows/release.yml` triggered by a tag `v*`.

| Repository | Workflow does | Assets |
| --- | --- | --- |
| praxis-runtime | check version, assert tag equals `v` plus the `package.json` version, `npm ci`, `npm run build`, `npm run pack:mcpb`, `npm run accept:mcpb-runtime`, write `release-meta.json`, create the Release | `praxis-runtime.mcpb`, `release-meta.json` |
| praxis-ba, architect, developer, quality | same checks, `npm run build` where defined, `npm run pack:zip`, `npm run accept:claude-plugins`, create the Release | `praxis-ROLE.zip`, `release-meta.json` (BA shown; check each file) |
| praxis-core | version and tag checks, also runnable by `workflow_dispatch` for an existing tag, `pack:vendor`, `vendor-checksums.json`, `release-meta.json` | `@praxis/*` vendor tarballs, vendor `manifest.json`, `vendor-checksums.json`, `release-meta.json` |
| praxis-marketplace, praxis-docs | CI only (`npm run verify`); no release workflow | none |

Typical sequence, each command only after the owner approves:

```
git tag vVERSION
git push origin vVERSION
```

then wait for the workflow, download the assets and compare their SHA-256 with `release-meta.json`. Order: Core, then Runtime and the role repositories, then the marketplace repository update. Pushing the marketplace is what makes a new version visible to `dfg-inc/praxis-marketplace` users.

Not part of this process: Broker or approval-service packages, PKG installers, or a manual ZIP upload as the install path for Claude Code or Cowork.
