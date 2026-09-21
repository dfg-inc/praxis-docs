# Changelog (user)

User-facing notes. Marketplace keeps its own catalog changelog as well; both should describe the same install model.

## 0.1.0-alpha.43

- Connect Git updates `origin` when switching HTTPS ↔ SSH for the same GitHub repository (`git remote set-url`). Same repository identity is no longer treated as “already connected”
- `wrote=true` only after the actual remote URL matches the approved plan; apply keeps the approved `previewFingerprint`
- Git Status copies GitHub API `empty` onto `remoteEmpty` and `baselineRequired`; API failure stays unknown (`null`), not `false`
- Doctor rejects a git remote pasted into `github_api_url`

## 0.1.0-alpha.42

- Developer Git Delivery: GitHub Pull Request MVP (status, connect, snapshot-bound commit, baseline/feature push, PR)
- GitLab remotes and Merge Requests remain supported; GitHub live Desktop delivery is a separate manual gate
- Git tokens use Runtime `user_config` (`github_token`, optional `gitlab_token`); never chat or `.project`

## 0.1.0-alpha.41

- Developer status reads canonical `qualityState` from `praxis.state` and the local WP manifest, not `status=ready-for-qa`
- `praxis.workPackageManifest` is a membership/claim snapshot and does not override Quality approval
- Read-only `praxis_quality_apply_status` and `praxis_quality_review_show`; Quality worker exit is recorded by the Runtime supervisor

## 0.1.0-alpha.40

- Quality Apply binds Jira status and the approved numeric transition in the preview fingerprint
- Fresh Apply rejects Jira drift before the first write; retries resume from the apply journal
- `qualityState=approved` is written only after the approved transition; MCP envelope `ok` follows `data.ok`

## 0.1.0-alpha.39

- Quality Review uses the bundled Quality HTTP Service, executes change-spec acceptance checks, and persists QA evidence / SQLite reviews
- Review does not write Jira; Quality Apply Preview + human-gated Quality Apply perform Jira approval, Done, and Bugs
- Local WP `qualityState` is reconciled on apply; retries are idempotent

## 0.1.0-alpha.38

- Quality starts inside the Claude Desktop Runtime when the Desktop executable is not a Node CLI (no user-installed Node)
- Spawn failures wait for the real `error`/`exit` events instead of reporting only “did not return a pid”
- Packaged sql.js WASM from alpha.37 remains the SQLite fallback

## 0.1.0-alpha.37

- Quality starts from the installed Runtime MCPB without a user-installed Node or SQLite
- Desktop `node:sqlite` preflight no longer blocks ensure, and no longer maps every load error to “requires Node.js 22+”
- Packaged sql.js WASM is the SQLite fallback when the Desktop child has no `node:sqlite`
- Startup errors include `stage`, `nodeVersion`, `nodeExecutable`, `moduleLoadErrorCode`, `exitCode`, `durationMs`, `logPath`

## 0.1.0-alpha.36

- Quality HTTP service is bundled in the Runtime MCPB (`server/praxis-quality.cjs`)
- `praxis_quality_ensure` actually starts the service, waits for health, and creates `.praxis-quality/`
- Structured startup errors replace generic `WORKFLOW_BLOCKED`
- User documentation is English-only (Marketplace method pages may still have a Russian locale)

## 0.1.0-alpha.35

- Developer complete no longer maps to Jira Done
- Real verification evidence + Developer→Quality handoff
- Human-gated recovery for premature Done
- This documentation portal (VitePress) sharing Markdown with Marketplace

## 0.1.0-alpha.34

- Localized Jira transition discovery (numeric ids)
- Defect: Developer complete could still mark Done — fixed in .35

## 0.1.0-alpha.33

- Hard Work Package scope; invalid title `---`

## 0.1.0-alpha.32

- Preview performance / timeout budget

## 0.1.0-alpha.31

- Shared Runtime MCPB + secure `user_config`

## 0.1.0-alpha.30

- Official MCP stdio (`serveStdio`)
