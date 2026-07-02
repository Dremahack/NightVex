# Codex Messenger Starter

Распакуй этот архив в корень папки проекта.

Минимально важный файл — `AGENTS.md`. Codex читает его перед работой и будет использовать как проектные инструкции.

В архив также добавлены локальные skills и repo-scoped marketplace-заготовка для локального плагина `messenger-builder`.

После распаковки:
1. Перезапусти Codex в этой папке проекта.
2. Открой Codex Plugin Directory, если он доступен.
3. Проверь marketplace `Custom Messenger Local Plugins`.
4. Установи локальный plugin `messenger-builder`, если Codex показывает его как доступный.
5. Если plugin installation недоступен, Codex всё равно сможет работать по `AGENTS.md`.

Первый запрос в Codex можно дать такой:

> Initialize this project as a self-hosted Tinode-based messenger. Follow AGENTS.md, clone the upstream server and webapp if missing, create deploy scaffolding, and do not commit secrets.
