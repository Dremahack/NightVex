# NightVex audit

Дата: 2026-07-01.

## Что есть в проекте

- `server/` - upstream Tinode server (`tinode/chat`), shallow clone.
- `webapp/` - upstream Tinode Web с локальными NightVex-правками.
- `android/` - upstream Tindroid Android client (`tinode/tindroid`), shallow clone.
- `deploy/` - production scaffold и отдельный local scaffold.
- `docs/` - инструкции и отчеты.
- `ios/` пока отсутствует.

## Найдено и исправлено

- Локальный `server/` был пустой - добавлен upstream Tinode server.
- Локальный `webapp/` был частичной выгрузкой - сохранен backup `webapp-partial-backup-*`, затем добавлен полный upstream webapp и возвращены NightVex-ассеты.
- Android-клиент отсутствовал - добавлен `android/`.
- Web logo больше не ведет на GitHub.
- Web alert `.info-box.error` приведен к темному NightVex-стилю с читаемым текстом.
- Web fonts переключены на Inter/Manrope.
- Web Firebase config больше не использует чужой Tinode Firebase project; push отключен до реальной настройки.
- Android debug-сборка больше не должна требовать `google-services.json` и release keystore.
- Android package name изменен на `ru.nightvex.messenger`.
- Android app name изменен на `NightVex`.
- Android deep links добавлены для `https://vshp-project.ru`, `nightvex://user/...`, `nightvex://group/...`, `nightvex://topic/...`. `app.vshp-project.ru` оставлен как будущая опция и сейчас не включен в Android manifest.
- FCM token больше не пишется в Android logcat.

## Остатки старого Tinode

- В upstream README/docs/tests остаются ссылки на `tinode.co`, `web.tinode.co`, `sandbox.tinode.co`; это документация upstream, не пользовательский UI.
- В Android переводах не на всех языках заменены строки Tinode на NightVex. Базовые строки обновлены, русские строки требуют отдельной аккуратной перекодировки/ревизии.
- В server sample data есть демонстрационные данные upstream. Локальный compose запускается с `TINODE_SAMPLE_DATA=` и не должен загружать sample data.

## Секреты и ключи

- Реальные `.env`, `google-services.json`, Firebase service account JSON, keystore, TURN credentials добавлены в `.gitignore`.
- В проект добавлены только `.example` файлы с placeholders.
- Production VPS в этом проходе не менялся.

## Android состояние

- Tindroid уже содержит FCM, notification channels, QR/barcode scanning, WebRTC dependencies, audio/video call UI and services.
- Debug APK локально собирается без `google-services.json`.
- Для реальных Android push нужны ручные действия в Firebase Console и настоящий `android/app/google-services.json`.
- Для надежных звонков в production нужен TURN/coturn и реальные TURN credentials.

## Риски

- Без Firebase push не работают, но чат должен работать.
- Без TURN звонки могут работать только в простых сетях; за NAT часто нужен coturn.
- Нужно отдельно проверить group default permissions на живом локальном сервере.
- Нужно отдельно проверить QR join/invite flow, потому что deep links добавлены, но бизнес-логика invite tokens еще не дорабатывалась.
