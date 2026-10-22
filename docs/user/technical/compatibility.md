# Compatibility

## Versions

All repositories are at `0.1.0-alpha.48`. `ecosystem.json` in each repository declares `policy: independent`: a sibling repository is not required to use the same version, and each repository checks only its own version and its own vendor pins (`npm run check:version`).

| Item | Value | Source |
| --- | --- | --- |
| Product version | `0.1.0-alpha.48` | `package.json`, `ecosystem.json`, plugin manifests |
| Marketplace entries | all `0.1.0-alpha.48` | `.claude-plugin/marketplace.json` |
| Node.js | `>=20` | `engines` in `package.json`; MCPB `compatibility.runtimes.node` |
| MCPB platforms | `darwin`, `win32`, `linux` | MCPB manifest |
| Claude Code (required by the release candidate) | `>=2.1.278` | `requiredHostVersions` in `release-candidate/manifest.json` |
| Claude Code used for verification | 2.1.304 | release candidate manifest and acceptance runs |

## Core and Runtime

Core is not installed separately. Runtime and each role repository vendor the Core packages they need as tarballs under `vendor/`, and record the Core revision in `vendor/manifest.json`:

| Repository | `vendor/manifest.json` version | Core baseline (commit) | Packages |
| --- | --- | --- | --- |
| praxis-runtime | `0.1.0-alpha.48` | `a42b8929dba02beb5dd14f397cffbee1956af09b` | contracts, project-config, knowledge, jira, vcs, cli |
| praxis-ba | `0.1.0-alpha.48` | `a42b8929dba02beb5dd14f397cffbee1956af09b` | plugin-sdk, knowledge, project-config, contracts |

The baseline equals the praxis-core commit "Release 0.1.0-alpha.48: version bump". `package.json` references the tarballs as `file:vendor/praxis-...-0.1.0-alpha.48.tgz`. `check-ecosystem-version.mjs` fails when a repository disagrees with its own version or vendor pins. The Runtime reports its own build identity in `praxis_doctor` (`build.version`, `build.coreBaseline`, `build.sourceDigest`, `build.bundleSha256`); a version string alone is not proof of which build is loaded.

Role plugins and Runtime are matched by version in the marketplace (all entries carry the same version). The role plugins call `praxis_*` tools by name; a Runtime with a different tool set shows up as a different `build.tools.count` and `build.tools.digest`. Expected for alpha.48: 52 tools.

## MCP protocol eras

The Runtime speaks both eras on stdio (`protocol=modern+legacy` in its start log):

| Era | Capabilities | How approval dialogs work |
| --- | --- | --- |
| Legacy (up to 2025-11-25) | Declared at `initialize` | The server sends `elicitation/create` to the client during the call |
| Modern (2026-07-28) | Sent in each request envelope | The server returns `input_required`; the client shows the dialog and retries the call with the answer |

`praxis_doctor` shows what the connected client declared in `approval.client`: `name`, `version`, `protocolVersion`, `elicitation`, `dialog`, `flow` and, when no dialog is available, `reason`.

## Client matrix

| Client | Skills from marketplace | Runtime | Approval dialog | Status |
| --- | --- | --- | --- | --- |
| Claude Code CLI 2.1.304 | Yes | Local stdio server from the `praxis-runtime` plugin | Declares `elicitation: {form, url}`; form dialog works in both protocol eras | **VERIFIED** (marketplace install with dependencies, single MCP server, update alpha.47 to alpha.48 in place; dialog driven end to end with the user's answer played by an `Elicitation` hook, so it proves the protocol and the client, not that a person answered) |
| Claude Desktop Code | Expected | Expected from the plugin | Not verified | **NOT VERIFIED** |
| Claude Cowork | Expected | Expected from the plugin | Not verified | **NOT VERIFIED** |
| Claude Desktop Chat | Skills may be available from the marketplace | A Runtime from a plugin is not automatically a Chat tool; install `praxis-runtime.mcpb` | No dialog declared (3.1623.1, client `claude-ai`, protocol 2026-07-28: `elicitation.declared: null`, `dialog: false`) | Dialog absence **VERIFIED**; marketplace install in Chat **NOT VERIFIED** |
| Claude Web Chat | Skills only | None (no remote Praxis service) | Not applicable | Not applicable |
| Official MCP SDK 2.0 client | Not applicable | Packed Runtime | Both protocol eras | **VERIFIED** (`npm run accept:approval-ux`) |
| Other MCP clients | Not applicable | Packed Runtime | Unknown | Not verified; `praxis_doctor` tells you |

Also **NOT VERIFIED**: the Claude UI flow (Customize, Plugins, Add marketplace) itself, a hosted GitHub marketplace, and Trusted Client from a live Claude Code session (the packed-runtime acceptance sets the environment variable directly).

In Claude Desktop Chat a protected apply may be held by Desktop's own tool-permission prompt before it reaches Praxis. See [Troubleshooting](./troubleshooting.md).
