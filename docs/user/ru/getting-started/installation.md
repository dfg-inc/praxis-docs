# Установка Praxis

Обычный путь — Claude Desktop, без Makefile и `PRAXIS_JIRA_*`.

## Файлы релиза

```
claude-extensions/praxis-runtime.mcpb
claude-plugins/praxis-ba.zip
claude-plugins/praxis-architect.zip
claude-plugins/praxis-developer.zip
claude-plugins/praxis-quality.zip
```

`.mcpb` — пакет расширения Desktop (Runtime). ZIP — только Skills роли. Runtime и роли — разные вещи: без Runtime будет `PRAXIS_RUNTIME_UNAVAILABLE`. Четыре копии Runtime не нужны.

## Порядок

1. Settings → Extensions → Advanced settings → Install extension → `praxis-runtime.mcpb` → включить.
2. Settings → Extensions → Praxis Runtime → Settings: Base URL, Email, Project Key, API Token → Save. Токен только в этом поле.
3. Customize → Plugins → Add → Upload: нужные ZIP, включить. Можно поставить только BA или только Developer.
4. Cowork: доступ к компьютеру, новая сессия, папка продукта.
5. Status / doctor, затем Skill роли.

Подписи меню могут чуть отличаться в разных сборках Claude Desktop — ищите Extensions и Plugins.

Полный английский текст с чеклистами скриншотов: [Installation](/getting-started/installation).
