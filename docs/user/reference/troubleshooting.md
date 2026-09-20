# Troubleshooting

Ordinary users should not edit Praxis source to work around a defect. Distinguish **your configuration** from a **Praxis bug**.

| Symptom | Likely class | What to do |
|---------|--------------|------------|
| `PRAXIS_RUNTIME_UNAVAILABLE` | config | Enable `praxis-runtime.mcpb`. Do not `launchctl`. |
| `JIRA_CONFIG_UNAVAILABLE` | config | Settings → Extensions → Praxis Runtime → Settings |
| Invalid plugin ZIP path / nested folder | config | ZIP must have `.claude-plugin/plugin.json` at archive **root** |
| `Zip file contains path with invalid characters` | product (alpha.27) | Use current `claude-plugins/*.zip` (no `node_modules/@praxis` paths) |
| `Plugin contains a top-level bin/` | product (alpha.28 hosted) | Use current skills-only ZIPs |
| MCP handshake timeout / `REQUEST_TIMEOUT` | product (alpha.29 parser) | Use alpha.30+ Runtime (`serveStdio`) |
| Four Praxis MCP processes | config + old ZIPs | Uninstall pre-alpha.31 role plugins that bundled MCP |
| Missing Runtime configuration / empty token after update | config | Re-enter settings; [Update](/getting-started/update) |
| Localized issue types («История»/«Баг») | handled | Runtime uses numeric type ids |
| Duplicate BA Stories | product+data | Canonical vs superseded; do not create a fourth |
| BA/Architect preview timeout | product (alpha.32) | Current Runtime; retry preview; do not apply blind |
| Unexpected multiple Work Packages | product (alpha.33) | Hard WP id scope; preview one WP |
| Title `---` | product (alpha.33) | Invalid title; fix design title, re-preview |
| Invalid Jira transition identifier | config/product (alpha.34) | Must be discovered numeric id; localized names are not ids |
| Claim conflict | data | Other actor holds claim |
| Complete moved Jira to **Готово** without QA | **product bug alpha.34** | Do not treat `completed=true` as success. Use recovery **preview**, separate YES, then complete/evidence. Manual live repair is **not** automatic |
| Missing completion evidence / Quality handoff | follows alpha.34 | Developer complete (alpha.35+) or gated recovery |
| Quality runtime unhealthy | Quality-only | Does not block BA/Architect/Developer |
| `LOCAL_RUNTIME_UNAVAILABLE` | config | Cowork local access + folder |
| Stale preview fingerprint | expected | New preview |

CLI remains for CI (`praxis doctor --json`). Desktop users should stay on Skills.

If PRX-4 is live Done from alpha.34: follow [manual retest](/reference/changelog) — preview, **stop**, approve recovery separately. Tests never mutate live Jira.
