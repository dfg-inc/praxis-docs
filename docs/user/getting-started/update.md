# Update Praxis

1. Obtain the new `praxis-runtime.mcpb` and any role ZIPs that changed.
2. In **Settings → Extensions**, update/replace **Praxis Runtime** with the new MCPB (Install extension / replace, then enable).
3. Re-open **Praxis Runtime → Settings**. Confirm Jira fields are still present. **Re-enter the token if the field is empty.** Praxis does not promise that every Claude Desktop update preserves `user_config`; if a field is blank, configure it again.
4. Update each installed role ZIP the same way you first uploaded it.
5. **Quit and restart Claude Desktop.**
6. Open a **new** Cowork session (do not continue a session that started on the old Runtime).
7. Run doctor/status. Check that the Runtime version matches the release you installed.
8. Confirm Jira read access with a status tool (`praxis_jira_smoke` / role status). Do not paste tokens.

Role plugins must stay compatible with that Runtime. Mixing a new Developer ZIP with an old Runtime (or the reverse) is a frequent cause of missing tools.

Do not leave multiple Praxis Runtime copies enabled.
