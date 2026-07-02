# NightVex: локальная разработка

## Быстрый запуск web + server

1. Собрать webapp:

```powershell
cd webapp
npm.cmd ci
npm.cmd run build
cd ..
```

2. Подготовить static build для Tinode:

```powershell
New-Item -ItemType Directory -Force webapp-build
Copy-Item webapp\umd,webapp\audio,webapp\css,webapp\img -Destination webapp-build -Recurse -Force
Copy-Item webapp\index.html,webapp\manifest.json,webapp\service-worker.js,webapp\version.js,webapp\firebase-init.js -Destination webapp-build -Force
```

3. Создать локальный env, если его еще нет:

```powershell
Copy-Item deploy\.env.local.example deploy\.env.local
```

Для локального режима после первого создания базы держите:

```dotenv
TINODE_RESET_DB=false
FCM_PUSH_ENABLED=false
```

Если контейнер Tinode был создан раньше с `RESET_DB=true`, простого `restart` мало. Нужно пересоздать контейнер, не удаляя PostgreSQL-том:

```powershell
docker compose --env-file deploy\.env.local -f deploy\docker-compose.local.yml up -d --force-recreate tinode
```

Локальный `deploy/tinode.local.conf` отключает обязательное email-подтверждение регистрации, потому что SMTP для локальной разработки не настроен. В production это нужно вернуть: включить email validation и настроить реальный SMTP.

4. Запустить:

```powershell
docker compose --env-file deploy\.env.local -f deploy\docker-compose.local.yml up -d
```

5. Открыть web:

```text
http://localhost:6060
```

## Проверка состояния

```powershell
docker compose --env-file deploy\.env.local -f deploy\docker-compose.local.yml ps
docker exec nightvex_local-tinode-1 ps aux
```

Внутри контейнера должен быть процесс `./tinode`. В браузере `http://localhost:6060` должен открывать NightVex.

## Остановка

```powershell
docker compose --env-file deploy\.env.local -f deploy\docker-compose.local.yml down
```

Чтобы удалить локальную базу и uploads:

```powershell
docker compose --env-file deploy\.env.local -f deploy\docker-compose.local.yml down -v
```

## Android emulator

- Server URL: `10.0.2.2:6060`
- TLS: выключено
- Это уже default для debug-сборки.

## Физический Android-телефон

1. Телефон и компьютер должны быть в одной Wi-Fi сети.
2. Узнать LAN IP компьютера:

```powershell
ipconfig
```

3. В Android app открыть настройки сервера.
4. Server address: `LAN_IP:6060`, например `192.168.1.20:6060`.
5. TLS: выключено.

## Production

- Server URL: `vshp-project.ru`
- TLS: включено
- WebSocket должен работать через `wss://vshp-project.ru/v0/channels`.

## Что не хранить в git

- `deploy/.env.local`
- `android/app/google-services.json`
- Firebase service account JSON
- `android/keystore.properties`
- `.jks` / `.keystore`
- TURN credentials
