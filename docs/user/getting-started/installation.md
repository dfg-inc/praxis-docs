# Install Praxis

Praxis installs from the Claude interface. You do not need a terminal, `npm`, `sudo`, a service or an installer package.

The marketplace is the GitHub repository **`dfg-inc/praxis-marketplace`** (`https://github.com/dfg-inc/praxis-marketplace`).

## Install from Claude UI (full Praxis)

1. Open Claude and go to **Customize → Plugins**.
2. Choose **Add → Add marketplace**.
3. Enter `dfg-inc/praxis-marketplace` (or the full GitHub URL above) and confirm.
4. Find **Praxis** in the list and press **Add**.
5. Check that the components are there (see below).
6. Start working: ask Claude to run the `getting-started` skill of the `praxis` plugin, or follow [First run](./first-run).

Adding **Praxis** installs its dependencies automatically: **Praxis Runtime** (the local MCP server with the `praxis_*` tools), **Praxis BA**, **Praxis Architect**, **Praxis Developer** and **Praxis Quality**. Only one Runtime is started.

> Status of this page: the Claude Code CLI behaviour below is verified (clean install, dependency resolution, update from alpha.47). The click-by-click UI flow in Claude is **not yet verified** by the Praxis team: menu labels can differ slightly between Claude versions. If a label differs, use the in-app search for "Plugins".

### Check the components

Ask Claude: *"Call praxis_doctor for this folder and show build.version, approval.mode and any errors."* You should see version `0.1.0-alpha.48`. In Claude Code you can also run `/plugin` and confirm that `praxis`, `praxis-runtime`, `praxis-ba`, `praxis-architect`, `praxis-developer` and `praxis-quality` are enabled.

## Which client gets what

| Client | Skills from the marketplace | Local Runtime (`praxis_*` tools) |
|---|---|---|
| Claude Code (CLI), Claude Desktop **Code**, **Cowork** | Yes | **Yes**, from the `praxis-runtime` plugin (a local stdio MCP server) |
| Claude Desktop **Chat** | May be available | **No** from a plugin. Install the separate `praxis-runtime.mcpb` (below) |
| Claude **Web** Chat | Skills only | No. Praxis has no remote service; the Runtime is local |

A plugin's local MCP server does not automatically become a tool in ordinary Chat. Do not expect `praxis_*` tools in Chat unless you installed the MCPB.

## Install one role only

Pick a single role in the plugin list (for example **Praxis Quality**) and press **Add**. The role's dependency **Praxis Runtime** is installed with it; nothing else is.

For developers, the same from a terminal (alternative, not required):

```bash
claude plugin marketplace add dfg-inc/praxis-marketplace
```

```bash
claude plugin install praxis@praxis
```

```bash
claude plugin install praxis-quality@praxis
```

## Claude Desktop Chat: connect the Runtime with the MCPB

Use this only if you work in Desktop **Chat**.

1. Download `praxis-runtime.mcpb` from the Praxis Runtime release on GitHub (`https://github.com/dfg-inc/praxis-runtime/releases`, version `v0.1.0-alpha.48`) and check its SHA-256 against `SHA256SUMS` / `release-meta.json` of that release.
2. Claude Desktop → **Settings → Extensions** → install the `.mcpb`. Quit and reopen Desktop, and start a **new** Chat (an old chat keeps the old tool list).
3. Optional: in the extension settings fill in Jira or GitHub/GitLab details (tokens are stored in the OS secure storage; never paste them into chat). Leave **Approval mode** empty unless you read [Approval Required and Trusted Client](../concepts/approvals).

Desktop Chat does not declare an approval dialog, so by default protected actions are refused with `APPROVAL_CLIENT_UI_REQUIRED` and a preview. To apply them in Chat the owner can explicitly choose Trusted Client; see [Approvals](../concepts/approvals).

## What you do not need

No Jira or SimpleOne (local workflows work without them), no `npm install`, no administrator rights, no background service, no approval installer, no browser authentication device. Missing integration credentials are reported as explicit codes (for example `JIRA_CONFIG_UNAVAILABLE`) and never block local work.

## Update and uninstall

See [Update](./update) and [Uninstall](./uninstall).
