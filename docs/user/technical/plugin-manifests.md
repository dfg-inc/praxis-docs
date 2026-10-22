# Plugin manifests and dependencies

Source: `.claude-plugin/marketplace.json` and `plugins/*/.claude-plugin/plugin.json` in `dfg-inc/praxis-marketplace`.

## The marketplace

`marketplace.json` has `name: praxis`, `metadata.version: 0.1.0-alpha.48` and six plugin entries. Each entry points to a directory inside the marketplace repository (`source: ./plugins/NAME`); no entry points outside it.

| Plugin | Contents | `dependencies` | Declared in |
| --- | --- | --- | --- |
| `praxis` | One `getting-started` skill; no server, no MCP config | `praxis-runtime`, `praxis-ba`, `praxis-architect`, `praxis-developer`, `praxis-quality` | marketplace entry **and** its `plugin.json` |
| `praxis-runtime` | The MCP server `server/praxis-mcp.cjs` (+ `sql-wasm.wasm`) and `.mcp.json` | none | n/a |
| `praxis-ba` | Skills, prompts, hooks, templates, canon-graph tool | `praxis-runtime` | marketplace entry only |
| `praxis-architect` | Skills, prompts, hooks, agents, templates | `praxis-runtime` | marketplace entry only |
| `praxis-developer` | Skills, prompts, hooks, agents | `praxis-runtime` | marketplace entry only |
| `praxis-quality` | Skills, prompts, hooks | `praxis-runtime` | marketplace entry only |

## Why dependencies are where they are

- The bundle plugin `praxis` has nothing to run itself. Installing it installs the five plugins it depends on.
- A role plugin needs the Runtime for its `praxis_*` tools. The dependency on `praxis-runtime` is declared in the **marketplace entry**, not in the role's own `plugin.json`. The role's `plugin.json` is also what goes into `praxis-<role>.zip` (the manual upload package for Claude Desktop Chat), so the role manifest is kept free of `dependencies` to keep that ZIP uploadable on its own. The marketplace entry supplies the dependency when the plugin is installed from the marketplace.
- Installing a single role, for example `claude plugin install praxis-quality@praxis`, installs `praxis-runtime` automatically.

Verified with Claude Code CLI 2.1.304 against a git-cloned marketplace in a clean config directory: installing `praxis` pulled five dependencies; installing `praxis-quality` alone pulled `praxis-runtime`.

## The single MCP server

Only `praxis-runtime` has an MCP configuration:

```json
{
  "praxis-runtime": {
    "command": "node",
    "args": ["${CLAUDE_PLUGIN_ROOT}/server/praxis-mcp.cjs", "--role", "runtime"]
  }
}
```

The server is a stdio process started by the client, inherits the client's environment (this matters for `PRAXIS_APPROVAL_MODE`, see [Configuration](./configuration.md)), and exposes all tools. Role plugins contain no `.mcp.json`, so a full install has exactly one Praxis MCP server (checked by `accept:marketplace-install`). The role skills call the Runtime's tools; if `praxis_doctor` or `praxis_session_start` is not available, the skills stop with `PRAXIS_RUNTIME_UNAVAILABLE`.

## Role `plugin.json` fields

Role manifests carry `name`, `version`, `description`, `author`, `license`, `keywords` and `defaultEnabled: true`. `praxis-ba`, `praxis-architect` and `praxis-developer` are `Apache-2.0`; `praxis-quality`, `praxis-runtime` and the bundle are `UNLICENSED`. The role plugin directories also contain a `.claude-plugin/marketplace.json` of their own (a single-plugin catalog used by the role repository); the one that clients use is the marketplace repository's root file.

## Versioning and pinning

- Every manifest and marketplace entry carries the same version, `0.1.0-alpha.48`, written by `tools/scripts/set-ecosystem-version.mjs` in each source repository.
- The marketplace entries do not pin a git commit or SHA. What a client installs is what the marketplace repository contains at the revision it cloned. Release-candidate verification compares the staged copies with the role repositories file by file ([Marketplace distribution](./marketplace-distribution.md)).
- Dependencies are plain names without version constraints in the manifests above. Today all six plugins are released at the same version.

## How updates work

- Updating means pulling a newer marketplace revision and installing the newer plugin versions. Verified with Claude Code CLI 2.1.304: a marketplace at the previous revision (alpha.47) upgraded to alpha.48 in place.
- A new Runtime process starts with the next session. A chat or session that started earlier keeps the tool list it had. Check `build.version` and `build.tools.count` from `praxis_doctor`.
- Desktop Chat does not update from the marketplace: the `praxis-runtime.mcpb` is replaced by installing the new file in Settings, Extensions.
- A client that still shows an older Runtime after updating is usually running an old session or a second, older installation; see [Troubleshooting](./troubleshooting.md).

Not verified: the update behaviour in the Claude UI plugin manager and for a marketplace hosted on GitHub.
