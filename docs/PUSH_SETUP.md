# NightVex Android Push Setup

NightVex uses Firebase Cloud Messaging (FCM) through the existing Android Firebase Messaging service and the Tinode server FCM push adapter.

No real Firebase secrets belong in this repository.

## What is already in the app

- Android package: `ru.nightvex.messenger`.
- Firebase Gradle plugins are applied only when `android/app/google-services.json` exists.
- Android dependencies include Firebase Messaging.
- `POST_NOTIFICATIONS` is declared for Android 13+.
- `FBaseMessagingService` receives FCM messages and registers refreshed tokens with Tinode.
- `Cache.getTinode()` requests the FCM token and calls `Tinode.setDeviceToken(token)`.
- Notification channels are created in `TindroidApp`.
- Direct and group message push taps open `MessageActivity` with the pushed topic.

## Firebase Console

1. Open Firebase Console.
2. Create a Firebase project for NightVex.
3. Add an Android app.
4. Use package name `ru.nightvex.messenger`.
5. Download `google-services.json`.
6. Put the file here:

```text
android/app/google-services.json
```

Do not commit this file. The repository contains only `android/app/google-services.json.example` with fake placeholder values.

## Server credentials

Tinode server needs a Firebase service account JSON to send FCM push messages.

1. Firebase Console -> Project settings -> Service accounts.
2. Generate a new private key.
3. Save it outside Git, for example on the VPS:

```text
/opt/nightvex/secrets/firebase-service-account.json
```

4. For the Docker deployment, copy it to the host path mounted by compose:

```text
deploy/secrets/firebase-service-account.json
```

The whole `deploy/secrets/` directory is ignored by Git.

## Production placeholders

Set these in `deploy/.env` on the VPS:

```env
FCM_PUSH_ENABLED=true
FCM_CRED_FILE=/opt/nightvex/secrets/firebase-service-account.json
```

`deploy/.env.production.example` contains placeholders only. Do not put real JSON contents into `.env` files.

## Tinode FCM config

Use `server/server/tinode.fcm.example.conf` as a safe template. Keep Android notifications data-only for the current Android app:

```json
"android": {
  "enabled": false,
  "click_action": ".MessageActivity",
  "icon": "ic_icon_push",
  "color": "#2F6BFF"
}
```

Data-only Android push lets `FBaseMessagingService` create the notification and attach the correct topic to the tap intent.

## Windows PowerShell build commands

Without `google-services.json`, the app builds without Firebase resources and push is disabled:

```powershell
cd C:\Users\Dmitriy\OneDrive\Desktop\Messengers_project 1.0\android
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:assembleRelease
.\gradlew.bat :app:bundleRelease
```

After adding `android/app/google-services.json`, rebuild:

```powershell
cd C:\Users\Dmitriy\OneDrive\Desktop\Messengers_project 1.0\android
.\gradlew.bat clean
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:assembleRelease
.\gradlew.bat :app:bundleRelease
```

Release APK signing still requires local `android/keystore.properties` and a local keystore as described in `docs/ANDROID_RELEASE_SIGNING.md`.

## Physical device test

1. Install the debug APK on a physical Android phone as User B.
2. Log in as User B.
3. On Android 13+, allow notification permission when prompted.
4. Background or close the app.
5. Log in as User A on another phone or web client.
6. Send User B a direct message.
7. Verify User B receives a push notification.
8. Tap the notification and verify the direct chat opens.
9. Add both users to a normal group.
10. Background User B again.
11. Send a group message as User A.
12. Verify User B receives a group push notification.
13. Tap it and verify the correct group opens.
14. Start a 1-on-1 call and let it become missed, if current call push is enabled on the server.
15. Confirm no Firebase credential files appear in source control.

## Troubleshooting

- If no token is registered, check that `android/app/google-services.json` package is `ru.nightvex.messenger`.
- If push is not sent, check server logs for FCM adapter initialization and confirm `FCM_PUSH_ENABLED=true`.
- If notification tap opens the chat list, confirm the FCM payload has `topic`.
- If Android 13+ receives no visible notification, confirm the user granted notification permission.
- If local builds fail after adding `google-services.json`, download it again for the exact package name.
