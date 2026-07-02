# Как запустить мессенджер Tinode на своем сервере

Эта инструкция описывает практический путь запуска self-hosted Tinode-мессенджера на VPS или выделенном сервере. Текущий проект уже содержит каркас деплоя, но upstream-код Tinode еще нужно клонировать в `server/` и `webapp/`.

## Что понадобится

Минимально:

- VPS или сервер с Ubuntu 22.04/24.04 LTS.
- Домен или поддомен, например `chat.example.com`.
- Доступ по SSH к серверу.
- Открытые порты `22`, `80`, `443`.
- Установленные на сервере:
  - Git;
  - Docker Engine;
  - Docker Compose v2;
  - Go, если будете собирать сервер вручную;
  - Node.js LTS и npm, если будете собирать webapp вручную.

Рекомендуемый минимум для первой VPS:

- 2 CPU;
- 2-4 GB RAM;
- 20+ GB SSD;
- регулярные снапшоты или внешний бэкап.

## Общая схема

```text
Пользователь -> HTTPS -> Caddy/Nginx -> Tinode server -> PostgreSQL
                                      -> persistent uploads volume
```

PostgreSQL и файлы загрузок должны храниться в постоянных Docker volumes. Реальные пароли и домены должны быть только в локальном `deploy/.env`, а не в Git.

## 1. Подготовить DNS

Создайте DNS-запись:

```text
chat.example.com  A  <публичный IPv4 вашего сервера>
```

Если есть IPv6, можно добавить:

```text
chat.example.com  AAAA  <публичный IPv6 вашего сервера>
```

Дождитесь применения DNS. Проверить можно так:

```sh
nslookup chat.example.com
```

## 2. Подключиться к серверу

```sh
ssh root@SERVER_IP
```

Лучше создать отдельного пользователя для деплоя:

```sh
adduser deploy
usermod -aG sudo deploy
```

Дальше можно работать под ним:

```sh
su - deploy
```

## 3. Установить системные зависимости

Для Ubuntu:

```sh
sudo apt update
sudo apt install -y ca-certificates curl gnupg git
```

Установите Docker по официальной инструкции Docker для вашей версии Ubuntu. После установки проверьте:

```sh
git --version
docker --version
docker compose version
```

Если будете собирать webapp на сервере, также установите Node.js LTS и npm. Если будете собирать Tinode server вручную, установите Go версии, указанной в upstream `server/go.mod`.

## 4. Скопировать проект на сервер

Вариант А: если проект будет в GitHub/GitLab, клонируйте его:

```sh
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ> messenger
cd messenger
```

Вариант Б: если Git-репозитория еще нет, скопируйте папку проекта на сервер через `scp` или SFTP.

Важно: не копируйте реальные `.env` с чужими или временными паролями. Создайте их заново на сервере.

## 5. Клонировать upstream Tinode

Из корня проекта:

```sh
git clone https://github.com/tinode/chat.git server
git clone https://github.com/tinode/webapp.git webapp
```

Если папки `server/` или `webapp/` уже существуют и не пустые, сначала проверьте их содержимое:

```sh
ls -la server
ls -la webapp
```

Не перезаписывайте существующие изменения без бэкапа.

## 6. Проверить лицензии

Перед коммерческим или закрытым использованием внимательно проверьте:

```sh
cat server/LICENSE
cat webapp/LICENSE
```

На момент первичной проверки:

- Tinode server использует GPLv3;
- Tinode Web использует Apache-2.0.

Не удаляйте upstream license/copyright notices.

## 7. Создать production `.env`

Скопируйте пример:

```sh
cp deploy/.env.example deploy/.env
```

Откройте:

```sh
nano deploy/.env
```

Заполните минимум:

```env
COMPOSE_PROJECT_NAME=tinode_messenger
TINODE_DOMAIN=chat.example.com
TINODE_LISTEN=:6060
TINODE_USE_TLS=false
TINODE_UPLOAD_MAX_SIZE=10485760
POSTGRES_DB=tinode
POSTGRES_USER=tinode
POSTGRES_PASSWORD=<длинный-случайный-пароль>
CADDY_EMAIL=admin@example.com
```

Пароль можно сгенерировать так:

```sh
openssl rand -base64 32
```

Никогда не коммитьте `deploy/.env`.

## 8. Проверить Docker Compose

Из папки `deploy/`:

```sh
cd deploy
docker compose config
```

Если команда показывает итоговую конфигурацию без ошибок, можно двигаться дальше.

## 9. Важный момент про текущий Dockerfile

Файл `deploy/docker-compose.yml` ожидает, что в `../server` есть Dockerfile Tinode server или что upstream-репозиторий можно собрать из этого контекста.

После клонирования `server/` проверьте:

```sh
ls -la ../server
find ../server -maxdepth 2 -iname '*docker*' -o -iname 'Dockerfile'
```

Если upstream Dockerfile отличается от ожиданий, нужно будет адаптировать `deploy/docker-compose.yml` под фактическую структуру Tinode. Это нормальный следующий шаг после клонирования upstream.

## 10. Запустить сервисы

Из папки `deploy/`:

```sh
docker compose up -d --build
```

Проверить состояние:

```sh
docker compose ps
docker compose logs -f tinode
```

Проверить Caddy:

```sh
docker compose logs -f caddy
```

Если DNS уже указывает на сервер, Caddy должен автоматически получить TLS-сертификат Let's Encrypt для `TINODE_DOMAIN`.

## 11. Проверить доступность

Откройте в браузере:

```text
https://chat.example.com
```

Также проверьте HTTP-ответ:

```sh
curl -I https://chat.example.com
```

Если webapp будет запускаться отдельно, убедитесь, что он настроен на правильный backend URL и WebSocket URL.

## 12. Собрать и подключить webapp

Tinode Web находится в `webapp/`. После клонирования:

```sh
cd webapp
npm install
npm run build
```

Перед production-запуском проверьте `package.json`, lockfile и upstream README. Если есть `package-lock.json`, для воспроизводимой установки лучше использовать:

```sh
npm ci
```

Дальше есть два обычных варианта:

- встроить/раздавать webapp через тот же reverse proxy;
- развернуть webapp отдельным static site контейнером и направить API/WebSocket на Tinode server.

Конкретную схему лучше зафиксировать после проверки upstream webapp-конфигурации.

## 13. Настроить firewall

Оставьте открытыми только нужные порты:

```sh
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

PostgreSQL не должен быть доступен из интернета.

## 14. Бэкапы

Бэкап базы:

```sh
cd deploy
./scripts/backup-postgres.sh
```

Восстановление:

```sh
cd deploy
./scripts/restore-postgres.sh ./backups/tinode-YYYYMMDD-HHMMSS.sql
```

Кроме базы, нужно отдельно продумать бэкап Docker volume с загрузками пользователей. В текущем compose это volume:

```text
tinode_uploads
```

## 15. Проверки перед реальным запуском пользователей

Перед тем как приглашать пользователей:

- HTTPS работает без ошибок.
- WebSocket-соединения не обрываются reverse proxy.
- Регистрация настроена так, как нужно продукту.
- CORS/allowed origins ограничены production-доменом.
- Размер загрузок ограничен.
- PostgreSQL не торчит наружу.
- `.env` не попал в Git.
- Есть понятный план бэкапа и восстановления.
- Логи не содержат паролей, токенов, приватных сообщений и кодов подтверждения.

## 16. Что еще нужно доделать в этом проекте

Текущий каркас еще не является полностью готовым production-деплоем, потому что upstream-код пока не клонирован и не проверен. Следующие практические шаги:

1. Установить Git, Docker, Go, Node.js и npm на рабочей машине или сервере.
2. Клонировать `tinode/chat` в `server/`.
3. Клонировать `tinode/webapp` в `webapp/`.
4. Проверить upstream build/test инструкции.
5. Адаптировать `deploy/docker-compose.yml` под реальный Dockerfile/config Tinode server.
6. Собрать оригинальный server без кастомизаций.
7. Собрать оригинальный webapp без кастомизаций.
8. Только после этого начинать брендинг, русский-first UI и изменение настроек.

## Быстрый чеклист запуска

```text
[ ] VPS куплен
[ ] Домен указывает на сервер
[ ] Git установлен
[ ] Docker и Docker Compose установлены
[ ] Проект скопирован на сервер
[ ] server/ содержит tinode/chat
[ ] webapp/ содержит tinode/webapp
[ ] deploy/.env создан и заполнен
[ ] docker compose config проходит без ошибок
[ ] docker compose up -d --build запускает сервисы
[ ] HTTPS работает
[ ] WebSocket работает
[ ] Бэкап базы проверен
```
