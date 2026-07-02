# NightVex status

Date: 2026-07-02.

## Repository shape

- `server/` exists and contains upstream Tinode server code.
- `webapp/` exists and contains Tinode Web with NightVex branding changes.
- `android/` exists and contains Android/Tindroid code.
- `deploy/` exists with Docker Compose, Caddy/Nginx placeholders, local Tinode config, Firebase notes, backup scripts, and coturn example.
- iOS source is not present.
- This folder is not currently a Git repository, so changes cannot be reviewed with `git diff` until Git is initialized or the folder is placed in a repository.

## Confirmed in source

- Android `applicationId` is `ru.nightvex.messenger`.
- Android app label is `NightVex`.
- Debug host is `10.0.2.2:6060`; release host is `vshp-project.ru`.
- Web app title, manifest, main index metadata, support/privacy/terms links point to NightVex / `vshp-project.ru`.
- WebRTC call classes and Android camera/microphone permissions are present.
- Firebase Messaging service and Android 13+ `POST_NOTIFICATIONS` permission are present.
- QR/barcode dependencies are present.
- Deep link scheme `nightvex://` is present.
- One-time location permissions were added, but the send-location UI/message flow is not implemented yet.

## Fixed this pass

- Replaced public `hosts.tinode.co` config fetch with `https://vshp-project.ru/id/`.
- Updated Android App Links package name to `ru.nightvex.messenger`.
- Removed visible Tinode wording from primary Android strings and major localized strings.
- Replaced web development metadata that still pointed to `web.tinode.co`.
- Updated `.env.example` from Tinode Messenger to NightVex Messenger.
- Extended `.gitignore` for signing keys, Firebase files, env files, backups, data, and uploads.

## Fixed in QR/App Links phase

- Added Android release signing documentation.
- Added `*.pem` and `*.key` to ignored secret/signing files.
- Updated profile QR to emit `nightvex://user/<public-user-id>`.
- Updated group QR to emit `nightvex://group/<topic-id>`.
- Updated QR scanner to understand NightVex links, web fallback invite links, and legacy `tinode:id/...` QR payloads.
- Added invalid QR feedback.
- Forwarded logged-in App Link opens from `LoginActivity` to `MessageActivity`.
- Normal group invites now grant joined members `JRWP` so they can write; channel invites preserve channel defaults.
- `app.vshp-project.ru` is not enabled in Android manifest because it is currently optional/future, not active.

## Fixed in Firebase push setup phase

- Documented Firebase Console setup and exact `android/app/google-services.json` path.
- Kept Firebase Gradle plugins conditional so local builds work without real Firebase files.
- Kept Android package aligned with Firebase setup: `ru.nightvex.messenger`.
- Locked `FBaseMessagingService` to `android:exported="false"`.
- Added notification tap fallback for FCM `topic` extras.
- Added production FCM placeholders and ignored `deploy/secrets/`.
- Added safe Tinode FCM config template with data-only Android notifications.
- Added manual push tests to `docs/TEST_PLAN.md`.

## Still allowed internally

Internal Java package names, SDK class names, protocol names, upstream README/license text, and comments may still contain `Tinode`. Do not blindly rename those because they are part of upstream code and can break builds.

## Requires manual verification

- Install the rebuilt APK and inspect login, registration, settings, about, invite, QR, notification, and call screens.
- Confirm that `https://vshp-project.ru/.well-known/assetlinks.json` is hosted with real release certificate fingerprints.
- Configure Firebase credentials outside Git.
- Configure TURN/coturn outside Git.
- Test user discovery, direct chats, group write permissions, QR join, calls, push, and location on real devices.
