# Approval modes

Praxis changes things outside the agent's own notes only through the flow Action, Preview, Approval, Execute, Result. There are two modes you would normally use, and one advanced option.

## Approval Required (default)

When Claude calls a protected apply tool, Praxis asks you in the MCP client's own approval dialog. The dialog shows the exact action.

- Approve runs exactly that action.
- Reject or closing the dialog runs nothing (`APPROVAL_REJECTED`). No answer in time gives `APPROVAL_TIMED_OUT`.
- Your answer reaches Praxis as the client's reply. The agent cannot write it; `confirmation=YES`, tool arguments and chat text are not your approval.
- If the preview changed since you were shown it, the call is refused before you are asked (`APPROVAL_FINGERPRINT_MISMATCH`).
- A client that cannot show the dialog gets `APPROVAL_CLIENT_UI_REQUIRED` at once, with the preview and `executed: false`. Reads, previews, the doctor and agent-authored records keep working.

Verified: Claude Code CLI 2.1.304 declares the dialog. Claude Desktop Chat (3.1623.1) declared none in a real test, and its own tool-permission prompt can hold a call before Praxis sees it. Other clients: Not verified; `praxis_doctor` tells you.

## Trusted Client (explicit opt-in)

You tell Praxis you trust this client to run protected actions without asking you about each one, for example Claude Desktop with "Always allow".

How to enable:

- Claude Desktop: Settings, Extensions, Praxis Runtime, Settings, field "Approval mode (advanced, optional)": enter `trusted-client`. Start a new session afterwards.
- Claude Code: set the environment variable `PRAXIS_APPROVAL_MODE=trusted-client` before you start `claude`; the plugin's Runtime inherits it. Not verified end to end with a live Claude Code session in this release; the packed-Runtime acceptance sets the variable directly.
- It cannot be set from a repository `.env`; such a line is ignored and the doctor says so (`dotenvRejected`).

What it means: Praxis runs a protected action when the agent passes `confirmation=YES` with the matching preview fingerprint. The result and the journal say `trusted-client`.

What stays checked: previews and their fingerprints (a stale preview is refused), argument validation, role gating, `confirmation=NO` (recorded as a rejection, runs nothing), the Git safety rules (no force-push, allowlist, secret scan, Quality snapshot binding), the decision journal.

Honest limits:

- It is a standing permission, not proof that you confirmed each action. The agent effectively approves itself within what you allowed.
- Acts only a person may perform are **not** covered: confirming a Story or a decision and approving a service are refused with `APPROVAL_CLIENT_UI_REQUIRED` in this mode. Do them in a client with an approval dialog (Claude Code) or the `praxis` CLI.
- Commit and push (including Quality fixes) are no longer separate dialogs; the push still only follows its own call.
- Praxis is a workflow and consent mechanism, not a security boundary against a program running as you.

Use it when you accept those trade-offs, for example a personal sandbox. Leave it off when pushes must be yours.

## host-permission (advanced, weaker)

For a client with no dialog that asks before running an MCP tool. Set the extension setting to `host-permission` (or `PRAXIS_APPROVAL_MODE=host-permission`). The agent calls `praxis_approval_plan` (read-only; returns the exact plan), shows it, then passes that text as `planText` to the apply tool. Praxis recomputes it and refuses a mismatch (`APPROVAL_SCOPE_MISMATCH`), so the host prompt shows what will run. Praxis cannot see whether the prompt appeared; with "always allow" the agent approves itself. Result label: `host-prompt`. Quality fixes still need a dialog.

## Read `praxis_doctor`

Ask: "Run Praxis doctor". Look at `approval`:

- `mode`: `client-ui` (dialog available), `no-dialog`, `trusted-client`, or `host-permission`.
- `client`: `name`, `version`, `protocolVersion`, `elicitation`, `dialog` (true or false), `flow`, and `reason` when there is no dialog.
- `note`: what the mode means.
- `hostGate`: shown when there is no dialog; explains that a host prompt may hold the call before Praxis.
- `decisionLog`: your journal, `~/.praxis/decisions/<repository id>.jsonl` (`PRAXIS_STATE_HOME` moves it). It records time, action, digest, outcome and channel.
- `diagnosticsLog`: `~/.praxis/diagnostics/mcp.jsonl`: per call `tool_enter`, `tool_finished` (with ms and code), `input_required`; no arguments. A call missing there never reached Praxis.
- `nextSteps` and `dotenvRejected`.

Results of protected calls carry `approval[]` with `channel` and `assurance` (`client-ui`, `trusted-client`, `host-prompt`).

## If something goes wrong

- `APPROVAL_CLIENT_UI_REQUIRED`: no dialog. Use a client that has one, or choose Trusted Client or host-permission knowingly.
- `APPROVAL_REJECTED`: you or the agent (`confirmation=NO`) declined. Nothing ran.
- `APPROVAL_TIMED_OUT`: dialog shown, no answer. Nothing ran. Ask again.
- `APPROVAL_FINGERPRINT_MISMATCH`: stale preview. Preview again.
- `APPROVAL_SCOPE_MISMATCH`: host-permission `planText` does not match the current plan. Get it again from `praxis_approval_plan`.
- `APPROVAL_REQUIRED`: a mutation outside an approved action.
- `CONFIRMATION_REQUIRED`: apply without `confirmation=YES`.
- A Claude Desktop Chat apply that seems to hang: look for Desktop's own permission prompt; check `diagnosticsLog`.
