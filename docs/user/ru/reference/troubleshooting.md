# Диагностика

| Симптом | Что делать |
|---------|------------|
| `PRAXIS_RUNTIME_UNAVAILABLE` | Включить `praxis-runtime.mcpb` |
| `JIRA_CONFIG_UNAVAILABLE` | Settings → Extensions → Praxis Runtime |
| Complete сразу в «Готово» | Дефект alpha.34. Не считать успехом. Recovery preview, отдельное YES |
| Нет evidence / handoff | Complete в alpha.35 или согласованный recovery |
| Quality unhealthy | Не блокирует другие роли |
| Старые ZIP с `bin/` или `@` в путях | Взять текущие `claude-plugins/*.zip` |

Не просите обычного пользователя править исходники Praxis. Полная таблица: [English troubleshooting](/reference/troubleshooting).
