# Approval Required and Trusted Client

Praxis changes things only through one flow: **Action → Preview → Approval → Execute → Result**. Reading, previews and diagnostics never need approval. Protected actions do: creating the `.project` file, confirming a Story or decision, approving a service, Git commits and pushes, pull requests, Jira writes, Quality fixes.

Two modes are supported. The default is **Approval Required**.

## Approval Required (default)

The MCP client shows a dialog with the exact action (the file to be written, the commit, the plan). **Approve** runs exactly that action. **Reject**, **Cancel** or closing the dialog runs nothing. The agent cannot answer the dialog and cannot supply an approval in tool arguments.

If your client cannot show the dialog, the protected action is **not executed**. The tool returns `APPROVAL_CLIENT_UI_REQUIRED` at once, together with the preview, and says "NOT executed". `confirmation=YES`, text such as "I approve", or any argument does not change that. A declared dialog that nobody answers ends with `APPROVAL_TIMED_OUT` (nothing runs; ask again).

`praxis_doctor` → `approval.mode` tells you which case you are in (`client-ui` or `no-dialog`) and `approval.client` shows what your client declared.

## Trusted Client (explicit opt-in)

You tell Praxis to trust your client with protected actions without asking about each one. This is meant for owners who already run a client such as Claude Desktop with **Always allow** and accept that choice.

Turn it on yourself:

- **Claude Desktop (MCPB):** Settings → Extensions → Praxis Runtime → **Approval mode** → `trusted-client`.
- **Claude Code / Cowork:** start the client with `PRAXIS_APPROVAL_MODE=trusted-client` in its environment. It cannot be set from a repository `.env` file, so a project can never turn it on for you. (Not verified with a live Claude Code session; the packed Runtime is verified with this variable set.)

What happens: when the agent applies a previewed action with `confirmation=YES` and the matching `previewFingerprint`, Praxis runs it. The result and the journal say **`trusted-client`**.

What stays in force: the preview, the check that the plan is still current (a stale preview is refused), argument validation, `confirmation=NO` as a recorded refusal, and the decision journal.

Be honest about what it is: **Always allow is a standing permission, not proof that you confirmed each action.** Praxis never reports a trusted-client run as your confirmation.

**Trusted Client does not cover acts only you can perform:** confirming a Story or an architecture decision, and approving a service. Those return `APPROVAL_CLIENT_UI_REQUIRED` even in this mode; do them in a client that shows an approval dialog (for example Claude Code) or in the `praxis` CLI. A standing permission is not you doing them.

## host-permission (advanced)

For a host that has no dialog but shows its own tool-permission prompt with the arguments, the apply tool can carry the exact plan text (`planText` from `praxis_approval_plan`). It is weaker than the dialog because Praxis cannot see whether the prompt was shown. Leave it off unless you know you need it.

## What was observed in Claude Desktop Chat

A real Desktop Chat test (Desktop 3.1623.1) declared no approval dialog (`approval.mode: no-dialog`). Desktop held a protected call at its own tool-permission prompt before the call reached Praxis, which looked like a long hang. With the current build, a call that reaches Praxis is answered immediately. Check `~/.praxis/diagnostics/mcp.jsonl`: no `tool_enter` for a call means Desktop never passed it on.

## Where decisions are recorded

`~/.praxis/decisions/<repository hash>.jsonl`, outside the repository (set `PRAXIS_STATE_HOME` to move it). Each entry has the action, the channel (`client-elicitation`, `trusted-client`, ...), the outcome and the time.
