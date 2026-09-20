# Плагины ролей

Общий Runtime. Каждый ZIP ставится отдельно.

| Плагин | ZIP | Делает | Jira |
|--------|-----|--------|------|
| BA | `praxis-ba.zip` | требования, Story | apply после preview |
| Architect | `praxis-architect.zip` | дизайн, WP | materialize после preview |
| Developer | `praxis-developer.zip` | claim, код, complete | In Progress, **не Готово** |
| Quality | `praxis-quality.zip` | QA, bugs | Готово после approve |

Developer не требует установленного Architect ZIP, если файлы handoff уже есть. Quality не требует Developer ZIP, если есть evidence.

Quality unhealthy не блокирует BA/Architect/Developer.
