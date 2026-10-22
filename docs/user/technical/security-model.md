# Security model

Sources: `praxis-core/docs/user-approval.md`, `packages/contracts/src/user-approval.ts` (Core), `approval-channel.ts`, `server.ts`, `tools.ts` (Runtime).

Praxis changes things outside the agent's own notes only after an approval bound to exactly that change. There is no approval service, Broker, signing key, system account or administrator step. The earlier native approval service was removed.

## What needs approval

The 15 protected tools ([Tools catalog](./tools-catalog.md)): writing `.project`; Jira and SimpleOne writes (BA apply, Architect apply, claim, release, complete, recovery, Quality apply, Jira link); Git connect, identity, commit, push, merge request; and `praxis_workflow_apply` for human acts (confirming a Story, confirming an architecture decision, approving a service). Reading, previews, the doctor and agent-authored workflow records do not need approval.

An approval names one action and one subject (the exact content shown). A commit approval is not a push approval; approving a decision does not confirm a Story.

## Three ways approval is obtained

`PRAXIS_APPROVAL_MODE` selects the mode. It is read only from the real environment or the extension setting, never from a repository `.env` ([Configuration](./configuration.md)).

| Mode | Setting | Who answers | Result `channel` / `assurance` | Doctor `approval.mode` |
| --- | --- | --- | --- | --- |
| **Approval Required** (default) | blank | The user, in the MCP client's own elicitation dialog. Approve runs exactly the preview; Reject, Dismiss or Cancel run nothing | `client-elicitation` / `client-ui` | `client-ui` |
| Approval Required, client without a dialog | blank | Nobody. The protected call returns `APPROVAL_CLIENT_UI_REQUIRED` at once with the preview and `executed: false` | none | `no-dialog` |
| **Trusted Client** (opt-in) | `trusted-client` | The owner, in advance. The channel always approves; Praxis requires the agent's `confirmation=YES` with the matching `previewFingerprint`. `confirmation=NO` is a recorded rejection | `trusted-client` / `trusted-client` | `trusted-client` |
| **host-permission** (advanced opt-in) | `host-permission` | The host's own tool-permission prompt. The apply tool must carry `planText` equal to the plan from `praxis_approval_plan`; Praxis recomputes and refuses on mismatch | `host-permission` / `host-prompt` | `host-permission` (only for a client with no dialog) |

In the default mode the user's answer reaches Praxis as the client's protocol response to the server, not as a tool argument, so an agent cannot write it. Only "Accept" with "approve" selected approves. Nothing in tool arguments or text (`confirmation=YES`, `approved`, `userApproval`, a file in the repository, "the user said yes") substitutes for it. `confirmation=NO` is the one text input that works: it records a rejection and runs nothing.

## How a protected call is checked

1. **Confirmation and preview fingerprint.** The apply tool needs `confirmation` and, where the preview defines one, `previewFingerprint`. Praxis recomputes the current plan; if its fingerprint differs from the one passed, the call fails with `APPROVAL_FINGERPRINT_MISMATCH` (stale preview or state drift) **before anyone is asked**. What the user approves is what runs.
2. **Ask.** The channel presents the exact action. A dialog nobody answers within 10 minutes ends with `APPROVAL_TIMED_OUT` (nothing executed).
3. **UserApproval.** On approve, Core issues a frozen `UserApproval` (action, kind, summary, `subjectDigest`, decision, channel, assurance, `decidedAt`). It is tracked in an in-process set; parsed JSON, a tool argument or a look-alike object is never recognized as an approval.
4. **Verification.** `verifyUserApproval` checks it was issued by Core, is for this action, matches the digest of the subject as it is now (`APPROVAL_SCOPE_MISMATCH` otherwise) and is recent: valid for 10 minutes (`APPROVAL_EXPIRED`).
5. **Lease.** The write runs inside a mutation lease (`runApprovedMutation`). The lowest-level writers call `requireMutationLease()` and refuse outside it with `APPROVAL_REQUIRED`: a direct library call cannot write without an approved action. Operations nested inside an approved action share its approval.
6. **Journal.** The decision (approved, rejected, dismissed or refused) is appended to the decision journal. Journal writes are best effort and never change a decision.

## Decision journal

`~/.praxis/decisions/HASH.jsonl`, one file per repository, where HASH is the first 16 hex characters of the sha256 of the repository path. `PRAXIS_STATE_HOME` moves the root. Directory mode 0700, file mode 0600. Entries: time, action, summary, digest of the exact content, decision, channel, reason, repository. It is outside the repository, so it cannot be committed with the project or edited as part of it, and it is never read back as an authorization. `praxis_doctor` shows the path as `approval.decisionLog`.

## Error codes

| Code | Meaning |
| --- | --- |
| `APPROVAL_CLIENT_UI_REQUIRED` | The client cannot show the dialog; nothing executed; preview returned |
| `APPROVAL_REJECTED` | The user rejected or dismissed, or `confirmation=NO` |
| `APPROVAL_TIMED_OUT` | A declared dialog was not answered in time; nothing executed; ask again |
| `APPROVAL_SCOPE_MISMATCH` | The approval is for another action or for different content |
| `APPROVAL_EXPIRED` | The approval is older than 10 minutes |
| `APPROVAL_FINGERPRINT_MISMATCH` | The preview is stale; preview again |
| `APPROVAL_REQUIRED` | A mutation was attempted outside an approved action |

## What is not guaranteed

- **Always Allow is a standing permission.** In Trusted Client mode, or when a host is set to "Always allow" for a tool, no per-action confirmation takes place. Praxis labels such runs `trusted-client` and never reports them as the user's confirmation.
- **Host prompts are not verifiable.** Praxis cannot see whether a host's tool-permission prompt was shown. In host-permission mode, choosing "always allow" removes the prompt and the agent has then approved itself. Result label `host-prompt`, never `client-ui`. Quality fixes (commit, then push) still need a dialog.
- **No identity check.** Whoever answers the client's dialog is "the user". There is no biometric or hardware key.
- **Not a boundary against a program running as you.** An agent with a shell can edit repository files, run Git itself, or call Jira with your credentials without going through Praxis. Approval is a consent and workflow mechanism: when the agent uses Praxis to change something, you were shown it and agreed, and Praxis tells the truth about how it knows. Git hooks, CI and the repository host are not changed by it.
- **The scripted evidence is not a person.** Acceptance runs play the user's answer with a hook or a scripted client; they prove the protocol and the client, not that a person answered.

An approval an agent cannot influence even with a shell would need a separate trust domain (another OS account or a hosted approval service). Praxis does not provide one.

## Which clients show the dialog

See the client matrix in [Compatibility](./compatibility.md). `praxis_doctor` → `approval.client` is the evidence for the client you actually use.
