# Uninstall

- **Marketplace install:** remove **Praxis** under **Customize → Plugins**. Dependencies installed with it (the Runtime and the roles) can be removed there too; from a terminal, `claude plugin uninstall praxis@praxis` and then `claude plugin prune` removes dependencies nothing else needs.
- **Desktop Chat (MCPB):** disable or remove **Praxis Runtime** under **Settings → Extensions**, then restart Claude Desktop.

Your project data is **not** deleted: `.project`, `.praxis/`, Jira issues and local artifacts stay. The decision journal and diagnostics live under `~/.praxis/` (`decisions/`, `diagnostics/`); delete that folder only if you want to discard them.

Removing one role does not remove the Runtime or the other roles.
