# APK audit fixes

Source APK noted by the continuation prompt: `app-debug.apk`.

## Findings addressed

- Debug APK status documented in Android build docs.
- `applicationId` verified in source as `ru.nightvex.messenger`.
- NightVex app name and public URLs are configured in source.
- `hosts.tinode.co` was replaced in Android branding config.
- Web and Android public metadata now use `vshp-project.ru` / NightVex values.
- Duplicate backup APK copy was identified under `webapp-partial-backup-20260701-182752/`.

## Not fully verifiable from APK alone

- 1-on-1 chat discovery must be tested against a running server with two users.
- Group write permissions must be tested after invite/join.
- FCM push requires a real Firebase project and server-side credentials.
- Voice/video calls require HTTPS/WSS and TURN for mobile-network testing.
- Location sharing still needs UI/message implementation after permissions.

## Rebuild required

Run a fresh Android build after these source changes:

```powershell
cd android
.\gradlew.bat :app:assembleDebug
```

Then inspect the new APK:

```powershell
adb install -r app\build\outputs\apk\debug\app-debug.apk
```
