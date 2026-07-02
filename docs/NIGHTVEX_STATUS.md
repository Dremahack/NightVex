# NightVex status

Date: 2026-07-02.

## Repository shape

- `server/` exists and contains upstream Tinode server code.
- `webapp/` exists and contains Tinode Web with NightVex branding changes.
- `android/` exists and contains Android/Tindroid code.
- `deploy/` exists with Docker Compose, Caddy/Nginx placeholders, local Tinode config, Firebase notes, backup scripts, and coturn example.
- iOS source is not present.
- This folder is now a Git monorepo connected to `https://github.com/Dremahack/NightVex`.

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
- Redacted Android Tinode SDK packet logs so auth JSON, session tokens, and device tokens are not written to logcat.
- Added a safe Android log line for successful FCM token registration: `FCM token reported to server.`

## Fixed in deploy/config stabilization phase

- Production PostgreSQL database defaults now use `POSTGRES_DB=tinode` and `TINODE_DB_NAME=tinode`.
- Production `POSTGRES_DSN` points to the same database PostgreSQL creates.
- Production `WEBRTC_ENABLED` is environment-driven and defaults to `false` until the calls/TURN phase.
- Production compose passes `FCM_PROJECT_ID` and `FCM_INCLUDE_ANDROID_NOTIFICATION=false` to Tinode.
- FCM runtime wiring is documented: production compose uses Tinode image config generation because it does not set `EXT_CONFIG`.
- The `EXT_CONFIG` caveat is documented: when a custom Tinode config is mounted, FCM must be configured in that file directly.
- Production deployment docs now include Firebase secret placement, compose validation, log checks, HTTPS/WebSocket checks, and Git ignore checks.

## Verified on physical Android device

- Debug APK with local `google-services.json` installed successfully on Samsung device `R5CY502596Y`.
- App opened to `ChatsActivity` after login.
- Android notification permission is granted.
- Firebase initialized from local `android/app/google-services.json`.
- Android app reported its FCM token to the Tinode server; logcat showed `FCM token reported to server.`
- Tinode debug packet logs no longer include raw protocol JSON.

## Verified on production VPS

- VPS `157.22.175.31` hosts NightVex at `/var/www/vshp-project`.
- Production Firebase service account JSON is deployed outside Git at `deploy/secrets/firebase-service-account.json`.
- Production `deploy/.env` has `FCM_PUSH_ENABLED=true`, `FCM_PROJECT_ID=nightvex`, `FCM_CRED_FILE=/opt/nightvex/secrets/firebase-service-account.json`, and `FCM_INCLUDE_ANDROID_NOTIFICATION=false`.
- Production compose mounts `deploy/secrets` into the Tinode container at `/opt/nightvex/secrets:ro`.
- `docker compose --env-file deploy/.env -f deploy/docker-compose.yml config --quiet` passes on the VPS.
- Tinode, PostgreSQL, and Caddy containers are running; Tinode and PostgreSQL are healthy.
- `https://vshp-project.ru/` returns HTTP 200; `https://vshp-project.ru/v0/channels` returns HTTP 403 without API key, as expected.
- The production VPS is a manual deployment directory, not currently a Git checkout; production changes were made directly with local backups of `deploy/.env` and `deploy/docker-compose.yml`.

## Fixed in discovery/blocking push test phase

- Android sign-up now sends safe public discovery tags for new users: `alias:<login>`, `<login>`, and words from display name.
- Android group creation now derives group search tags from the group title when the tags field is empty.
- Existing production users were reindexed on the VPS so Android search can find them by login/alias-style query.
- Existing production groups were reindexed from their public group titles.
- Production DB backups were created before discovery tag migration:
  - `server-backups/nightvex-before-discovery-tags-20260702-095235.sql`
  - `server-backups/nightvex-before-discovery-tags-20260702-095310.sql`
  - `server-backups/nightvex-before-discovery-tags-20260702-095343.sql`
- After migration, production `usertags` contains 12 rows and `topictags` contains 7 rows.

## Still allowed internally

Internal Java package names, SDK class names, protocol names, upstream README/license text, and comments may still contain `Tinode`. Do not blindly rename those because they are part of upstream code and can break builds.

## Requires manual verification

- Install the rebuilt APK and inspect login, registration, settings, about, invite, QR, notification, and call screens.
- Confirm that `https://vshp-project.ru/.well-known/assetlinks.json` is hosted with real release certificate fingerprints.
- Run a real end-to-end Firebase push delivery test with two users now that Android token registration and VPS FCM credentials are active.
- Build a signed release APK with a local keystore.
- Configure TURN/coturn outside Git.
- Test user discovery, direct chats, group write permissions, QR join, calls, push, and location on real devices.
- Upload production `assetlinks.json` with real release SHA256 fingerprints.
- Replace raw group topic-id QR invites with invite-token backend before public production use.
