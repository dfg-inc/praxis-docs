# FAQ

**Do I need to install Node.js or SQLite?** No. Quality starts from the Runtime MCPB. Do not install Node 22/24 or a SQLite library to make `praxis_quality_ensure` work.

**Do I install four Runtimes?** No.

**Must I install all four role ZIPs?** No.

**Is CLI required?** No for Desktop.

**Does Developer complete mean QA passed?** No. Jira stays In Progress.

**Can Quality run without the Developer plugin?** Yes, if evidence/handoff files exist.

**Where is the token?** Only Runtime settings.

**Can I reuse last week's Quality Apply fingerprint?** No. Approve the fingerprint from the preview you just generated. After a Runtime upgrade, generate a new preview. A partial Apply is the exception: retry that same approved fingerprint until postconditions pass.
