# Учётные данные Jira

| Поле | Пример |
|------|--------|
| Jira Base URL | `https://example.atlassian.net` |
| Jira Email | `user@example.com` (email аккаунта Atlassian, не «username») |
| Jira Project Key | `PRX` (не ключ задачи `PRX-1`) |
| Jira API Token | только в UI Runtime |

Токен — не пароль. Создайте его в [Atlassian API tokens](https://id.atlassian.com/manage-profile/security/api-tokens). Документация: [Manage API tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/).

Не кладите токен в `.project`, Git, чат, скриншоты. Не используйте `launchctl` как стандартную установку Desktop.
