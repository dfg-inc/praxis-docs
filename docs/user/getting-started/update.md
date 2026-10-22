# Update Praxis

## Plugins (Claude Code, Desktop Code, Cowork)

Updating from an earlier alpha (for example 0.1.0-alpha.47) is an update in place:

1. Refresh the marketplace and update the plugins. In the Claude UI use **Customize → Plugins** and update **Praxis**. From a terminal: `claude plugin marketplace update praxis`, then `claude plugin update praxis@praxis` (and any single role you installed, for example `claude plugin update praxis-ba@praxis`).
2. Restart Claude (or reload plugins) so the new Runtime starts.
3. Run `praxis_doctor` and check `build.version` is `0.1.0-alpha.48`.

If you installed **only a role** before, it keeps working: it now also installs `praxis-runtime` as a dependency. If you had installed `praxis-runtime` separately, it is updated by the same command. Previews created on the previous Runtime must be created again before applying (do not reuse an old fingerprint).

Verified on Claude Code CLI 2.1.304: `praxis-ba` and `praxis-runtime` 0.1.0-alpha.47 updated in place to 0.1.0-alpha.48 and `praxis@praxis` could then be added. The Claude UI update flow is not yet verified.

## Claude Desktop Chat (MCPB)

1. Download the new `praxis-runtime.mcpb` from the Praxis Runtime GitHub release and check its SHA-256.
2. **Settings → Extensions**: install it over the old one. Your settings are kept; re-enter a token if a field is empty.
3. Quit and reopen Claude Desktop, and start a **new** Chat.
4. Call `praxis_doctor` and compare `build.bundleSha256` with the release notes.

Different builds can share one version string, so always compare `build.bundleSha256`.

## Old approval components

Earlier alphas could include a native approval service, a broker or an installer package. alpha.48 needs none of them. If you started installing any of them, follow the clean-up notes in the Praxis Core repository (`docs/cleanup-native-approval-service.md`); nothing is removed automatically.
