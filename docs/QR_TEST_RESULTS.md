# QR test results

Date: 2026-07-02.

## Source audit

- Android QR generation exists through `UiUtils.generateQRCode`.
- QR scanning exists through ML Kit barcode scanning and CameraX.
- Profile QR in the new-chat/add-by-id screen now emits `nightvex://user/<my-user-id>`.
- Topic info QR now emits `nightvex://group/<topic-id>` for group topics and `nightvex://user/<topic-id>` for non-group topics.
- Scanner accepts NightVex links and legacy `tinode:id/<topic-id>` QR values.
- Scanner rejects unsupported QR payloads with a friendly error.

## Build verification

- `:app:assembleDebug` passed after QR changes.
- `:app:assembleRelease` passed and produced an unsigned release APK because no local release keystore is present.
- `:app:bundleRelease` passed and produced a release AAB.

## Manual testing still required

- User A opens profile QR.
- User B scans profile QR.
- User B opens direct chat and sends a message.
- User A opens normal group QR.
- User B scans group QR.
- User B joins and can write.
- Read-only channel QR does not grant write access.
- Invalid QR displays a friendly error.
