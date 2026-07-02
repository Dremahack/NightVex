# QR and deep links

## Current Android support

- `nightvex://user/<public-user-id>`
- `nightvex://group/<topic-id>`
- `nightvex://topic/<topic-id>` for backward compatibility.
- `https://vshp-project.ru/invite/user/<public-user-id>`
- `https://vshp-project.ru/invite/group/<topic-id-or-future-token>`
- Legacy `tinode:id/<topic-id>` QR values are accepted only for old QR compatibility.

`app.vshp-project.ru` is not enabled in Android manifest in this phase because it is currently documented as optional/future. If that domain becomes active, add it to the manifest and host its own `/.well-known/assetlinks.json`.

## QR payload safety

QR payloads must not contain passwords, auth tokens, Firebase credentials, session cookies, TURN credentials, or private invite secrets.

Current MVP payloads contain only a public user id or group topic id. The server still controls whether the current user can subscribe or write.

## assetlinks.json template

Upload this to `https://vshp-project.ru/.well-known/assetlinks.json` after replacing placeholders with real SHA256 fingerprints:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "ru.nightvex.messenger",
      "sha256_cert_fingerprints": [
        "DEBUG_CERT_SHA256_PLACEHOLDER",
        "RELEASE_CERT_SHA256_PLACEHOLDER"
      ]
    }
  }
]
```

Use the debug fingerprint only for debug testing. Use the release fingerprint for production.

## Verification

Check hosted file:

```powershell
Invoke-WebRequest https://vshp-project.ru/.well-known/assetlinks.json
```

Check App Links on a connected Android device:

```powershell
adb shell pm get-app-links ru.nightvex.messenger
adb shell am start -a android.intent.action.VIEW -d "https://vshp-project.ru/invite/user/usrEXAMPLE" ru.nightvex.messenger
adb shell am start -a android.intent.action.VIEW -d "nightvex://user/usrEXAMPLE" ru.nightvex.messenger
```

Manual checks:

- Debug build opens `nightvex://user/...`.
- Release build opens `https://vshp-project.ru/invite/user/...` after assetlinks is hosted.
- Invalid QR shows `QR-код недействителен`.
