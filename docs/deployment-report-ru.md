# Отчет о первичном деплое Tinode

Дата: 2026-07-01

## Сервер

- IP: `157.22.175.31`
- Домен: `vshp-project.ru`
- ОС: Ubuntu 22.04.5 LTS
- Рабочий каталог нового проекта: `/var/www/vshp-project`

## Бэкап старого приложения

Перед очисткой сервера был сделан архив старого Django/Gunicorn/PostgreSQL проекта.

Локальный архив:

```text
server-backups/messenger-prewipe-backup-20260701-133229.tar.gz
```

Старый проект также оставлен на VPS:

```text
/var/www/vshp-project.old-20260701-133344
```

## Что было изменено на VPS

- Остановлен и отключен старый `vshp-project.service`.
- Остановлен и отключен системный `nginx`.
- Остановлен и отключен системный `postgresql`.
- Установлены Docker Engine и Docker Compose plugin.
- Новый проект размещен в `/var/www/vshp-project`.
- Upstream Tinode server клонирован в `/var/www/vshp-project/server`.
- Upstream Tinode Web клонирован в `/var/www/vshp-project/webapp`.
- Создан production-файл `/var/www/vshp-project/deploy/.env` с правами `600`.
- Запущены Docker-сервисы:
  - PostgreSQL;
  - Tinode;
  - Caddy reverse proxy с HTTPS.

## Проверки

На момент проверки:

```text
Tinode container: healthy
PostgreSQL container: healthy
Caddy container: running
https://vshp-project.ru/: HTTP 200
https://vshp-project.ru/v0/channels: HTTP 403 без API key, что ожидаемо для прямого тестового запроса
```

## Обновление 2026-07-01: NightVex

Выполнено дополнительное обновление:

- База Tinode пересоздана без sample data.
- Проверка после очистки базы:
  - `users=0`;
  - `topics=1`, системный topic.
- Приложение переименовано в `NightVex`.
- Установлены логотипы NightVex из папки `Дизайн`.
- Добавлен fallback-аватар для пользователей без фото на основе третьего значка из `avatars.png`.
- Собран кастомный Tinode Web и подключен к Tinode через `EXT_STATIC_DIR`.
- Добавлен CSS-слой `css/nightvex.css` с NightVex-палитрой.

Проверка публичного сайта:

```text
https://vshp-project.ru/: HTTP 200
HTML title: NightVex
manifest name: NightVex
img/nightvex-logo-full.png: HTTP 200
img/nightvex-auth-avatar.png: HTTP 200
Tinode container: healthy
PostgreSQL container: healthy
Caddy container: running
```

Перед очисткой sample-базы был сделан дополнительный локальный дамп:

```text
server-backups/tinode-before-clean-reset-20260701-141800.sql
```

При сборке webapp `npm audit` сообщил о vulnerabilities в upstream-зависимостях Tinode Web. Это не исправлялось автоматически, чтобы не вносить breaking changes без отдельного review.

## Обновление 2026-07-01: cache-bust и иконки

После проверки в браузере были найдены старые видимые элементы Tinode:

- экран информации всё ещё мог показывать старый lazy-loaded chunk из service worker cache;
- `manifest.json` всё ещё ссылался на старый `img/logo.svg`;
- `logo32x32a.png` и `badge96.png` оставались upstream-иконками.

Исправлено:

- версия webapp/cache поднята до `0.25.2-nightvex.1`;
- `service-worker.js` изменён, чтобы браузер увидел новое обновление;
- `manifest.json` больше не ссылается на `logo.svg`;
- `logo.svg`, `logo32x32a.png` и `badge96.png` заменены на NightVex-версии;
- публичная проверка показывает `NightVex` и `NightVexWeb/`, без `Tinode Web`/`TinodeWeb/` в основном production bundle.

Если браузер всё ещё показывает старую картинку, нужно обновить страницу с очисткой service worker cache: `Ctrl+F5`, либо DevTools -> Application -> Service Workers -> Unregister, затем перезагрузить сайт.

## Управление сервисами

Подключиться к серверу:

```sh
ssh root@157.22.175.31
```

Перейти в deploy:

```sh
cd /var/www/vshp-project/deploy
```

Посмотреть состояние:

```sh
docker compose --env-file .env ps
```

Посмотреть логи Tinode:

```sh
docker compose --env-file .env logs -f tinode
```

Посмотреть логи Caddy:

```sh
docker compose --env-file .env logs -f caddy
```

Перезапустить:

```sh
docker compose --env-file .env restart
```

Остановить:

```sh
docker compose --env-file .env down
```

## Важные замечания

- Файл `deploy/.env` содержит реальные секреты и не должен попадать в Git.
- Файл локального доступа `доступ.txt` добавлен в `.gitignore` и удален с VPS после случайной первичной выгрузки.
- На публичный сервер уже приходят автоматические сканеры, которые ищут `.env`, `wp-config.php`, SQL-дампы и ключи. Это нормально для публичного IP, но нельзя хранить секреты в web root.
- Tinode сейчас инициализирован без sample data.
