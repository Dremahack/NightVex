# NightVex Firebase/FCM

Реальные Firebase-файлы нельзя хранить в репозитории.

## Android

1. Создать Firebase Project.
2. Добавить Android app с package name `ru.nightvex.messenger`.
3. Скачать `google-services.json`.
4. Положить файл в `android/app/google-services.json`.
5. Собрать debug APK:

```powershell
cd android
.\gradlew.bat assembleDebug
```

Если `google-services.json` отсутствует, локальная debug-сборка должна работать без push-уведомлений.

## Server

Для отправки FCM серверу нужен service account JSON.

1. Firebase Console -> Project Settings -> Service accounts.
2. Generate new private key.
3. Сохранить JSON вне git, например на сервере как `/opt/nightvex/secrets/firebase-service-account.json`.
4. Включить переменные:

```env
FCM_PUSH_ENABLED=true
FCM_CRED_FILE=/opt/nightvex/secrets/firebase-service-account.json
```

Не печатать содержимое JSON в логи и не отправлять его в чат.
