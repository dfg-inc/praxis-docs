# Marketplace distribution

The marketplace repository (`dfg-inc/praxis-marketplace`, marketplace name `praxis`) does not own the plugins. It stages copies of them from the role repositories and the Runtime repository. Scripts live in `praxis-marketplace/tools/scripts`.

## Sources

| Marketplace plugin | Source repository | Source directory |
| --- | --- | --- |
| `praxis` | praxis-marketplace | `plugins/praxis` (authored in the marketplace) |
| `praxis-ba` | praxis-ba | `plugins/ba` |
| `praxis-architect` | praxis-architect | `plugins/architect` |
| `praxis-developer` | praxis-developer | `plugins/developer` |
| `praxis-quality` | praxis-quality | `plugins/quality` |
| `praxis-runtime` | praxis-runtime | `plugins/runtime` (contains the bundled `server/praxis-mcp.cjs`) |

## Scripts

| Script | What it does | Publishes? |
| --- | --- | --- |
| `stage-portable-plugins.mjs` | Replaces the marketplace's `plugins/` entries (except `praxis`) with self-contained copies from the source directories (no `node_modules`, no `.git`). For every plugin with `tools/session-bootstrap.mjs` it bundles a standalone `tools/session-bootstrap.cjs` with esbuild, because an installed plugin does not have the `@praxis/plugin-sdk` the source imports. Checks that every marketplace `source` is relative, stays inside the repository and has a `plugin.json`. Writes `plugins/.staged-at`. Runs `claude plugin validate` on the marketplace. | No |
| `build-release-candidate.mjs` | Builds `release-candidate/` from the six source directories: copies each plugin, writes `FILES.sha256.json` per plugin, copies the real `marketplace.json`, and writes `manifest.json` (contract `praxis.marketplace.release-candidate`): host (Node, platform, Claude Code version), required host versions, per plugin source revision, branch, dirty flag, skills, whether it has a server and `.mcp.json`, artifact checksum and file count. Records dirty working trees explicitly and sets a `warning` instead of claiming a clean revision. Runs `claude plugin validate` on the result. | No |
| `verify-release-candidate.mjs` | Compares the release candidate with each source directory file by file. Any changed, missing or extra file means STALE and exit code 1: rebuild. Optionally compares an installed Desktop extension (`--installed-extension`) and installed role plugins (`--installed-plugins`) with source; those are warnings unless `--strict-installed`. `--json` prints the report. | No |

npm entry points: `npm run check:rc` (verify) and `npm run test:rc` (its tests). `npm run verify` builds the marketplace site (`fetch:docs`, `sync-docs`, `build`, `accept:marketplace`); the site build is separate from the plugin catalog.

## Release candidate

The release candidate is a complete marketplace tree under `release-candidate/` that can be validated and installed from locally before anything is published. Read `dirtySources` and `warning` in its `manifest.json`: a dirty source means the build must not be described as a published revision. The `claude` CLI must be on the path (`claude plugin validate`).

## What gets published

Nothing in these scripts pushes, tags or uploads. Publishing is a separate owner decision (see [Release process](./release-process.md)). The target repositories are under the `dfg-inc` GitHub organisation:

| Repository | Published artifact |
| --- | --- |
| `dfg-inc/praxis-core` | Source; the Release workflow publishes the `@praxis/*` vendor tarballs, `vendor-checksums.json` and `release-meta.json` |
| `dfg-inc/praxis-runtime` | Release asset `praxis-runtime.mcpb` and `release-meta.json` |
| `dfg-inc/praxis-ba`, `praxis-architect`, `praxis-developer`, `praxis-quality` | Release asset `praxis-<role>.zip` and `release-meta.json` |
| `dfg-inc/praxis-marketplace` | The marketplace itself: users add it as `dfg-inc/praxis-marketplace`. Not yet on GitHub as of this document; no release workflow, only CI (`npm run verify`) |
| `praxis-docs` | The documentation site (CI only in the repository) |

Order, because each step feeds the next:

1. praxis-core (source and vendor tarballs).
2. praxis-runtime and the four role repositories, each vendoring that Core.
3. praxis-marketplace: restage from the released sources, rebuild and verify the release candidate, then publish the marketplace repository. The marketplace must be updated after the plugins it contains.

## Claude Desktop Chat: the MCPB

The marketplace plugin `praxis-runtime` is a Claude Code style plugin with a stdio server. Claude Desktop Chat does not automatically get a plugin's local Runtime as a Chat tool, so Chat uses `praxis-runtime.mcpb`, built from the same Runtime sources by `npm run pack:mcpb` in praxis-runtime and installed in Settings, Extensions. The MCPB manifest (version 0.4, extension id `praxis-runtime`) adds a settings form ([Configuration](./configuration.md)). Role ZIPs (`praxis-<role>.zip`, skills only) can still be uploaded manually in Desktop Chat, but that is not the install path for Code or Cowork, where the marketplace is used.

Not verified: Claude Desktop Chat installing skills from the marketplace.
