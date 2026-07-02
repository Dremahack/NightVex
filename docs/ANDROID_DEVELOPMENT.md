# NightVex: Android-разработка

## Открыть проект

1. Запустить Android Studio.
2. Выбрать `Open`.
3. Открыть папку `android/`.
4. Дождаться Gradle Sync.

## Debug APK без Firebase

Локальная сборка не требует `google-services.json`. Push-уведомления в таком режиме отключены.

```powershell
cd android
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
.\gradlew.bat assembleDebug
```

APK создается здесь:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Запуск на эмуляторе

На этом ПК доступен AVD `Medium_Phone`.

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Medium_Phone
```

Установить APK:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" uninstall ru.nightvex.messenger
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" shell monkey -p ru.nightvex.messenger -c android.intent.category.LAUNCHER 1
```

Debug default server:

```text
10.0.2.2:6060
```

TLS для debug на эмуляторе выключен. Cleartext-доступ к `10.0.2.2` разрешен в `network_security_config.xml`.

## Регистрация локально

Для локальной разработки `deploy/tinode.local.conf` отключает обязательный email-код, потому что SMTP не настроен. Если приложение просит confirmation code, значит сервер запущен со старым конфигом или старым окружением. Пересоздайте контейнер Tinode:

```powershell
docker compose --env-file deploy\.env.local -f deploy\docker-compose.local.yml up -d --force-recreate tinode
```

После этого переустановите приложение, чтобы сбросить старые настройки:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" uninstall ru.nightvex.messenger
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
```

## Запуск на физическом телефоне

1. Включить Developer options.
2. Включить USB debugging.
3. Подключить телефон по USB.
4. Убедиться, что телефон и ПК в одной Wi-Fi сети.
5. В настройках NightVex указать `IP_КОМПЬЮТЕРА:6060`.
6. TLS выключить.

## Firebase push

Для настоящих push-уведомлений:

1. Firebase Console -> создать project.
2. Add Android app.
3. Package name: `ru.nightvex.messenger`.
4. Скачать `google-services.json`.
5. Положить в `android/app/google-services.json`.
6. Пересобрать APK.
7. На Android 13+ разрешить notifications.

Серверная часть описана в `deploy/firebase/README.md`.

## Release signing

Для release APK нужен `android/keystore.properties` и `.jks` файл. Используйте `android/keystore.properties.example` как шаблон. Реальный `.jks` и пароли не хранить в git.

## Deep links

Подготовлены схемы:

- `nightvex://user/<public-id-or-username>`
- `nightvex://topic/<topic-id-or-invite-token>`
- `https://vshp-project.ru/invite/user/<public-id>`
- `https://vshp-project.ru/invite/group/<invite-token>`

Логика invite tokens еще требует отдельной проверки и доработки.
