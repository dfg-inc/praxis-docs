# Полный сценарий (счётчик)

Есть `increment()` / `decrement()`. Нужен `reset()` → `0`.

Ключи `PRX-1` / `PRX-3` / `PRX-4` / `WP-20260914-002` — **пример**, не ваши обязательные номера.

1. Epic в Jira.
2. Плагин BA, Skill Epic Analysis.
3–5. Proposal → preview → apply с fingerprint (`confirmation=YES`).
6–9. Architect: дизайн, preview одного WP, apply.
10–16. Developer: claim (В работе), план, `reset()`, тесты, **complete + handoff**, Jira остаётся В работе.
17–20. Quality: ensure, review, apply; только тогда Готово.

Не сжимайте 20 шагов в один prompt. Примеры фраз: [английская Prompt Library](/reference/prompts).
