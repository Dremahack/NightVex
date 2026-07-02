# NightVex test plan

## Android build

1. Build debug APK.
2. Build signed release APK with local `android/keystore.properties`.
3. Build release AAB with `:app:bundleRelease` if Play/App Bundle testing is needed.
4. Install debug APK.
5. Install release APK.

## App Links

1. Generate debug SHA256 fingerprint.
2. Generate release SHA256 fingerprint.
3. Upload `assetlinks.json` to `https://vshp-project.ru/.well-known/assetlinks.json`.
4. Verify `adb shell pm get-app-links ru.nightvex.messenger`.
5. Open `nightvex://user/usrEXAMPLE`.
6. Open `https://vshp-project.ru/invite/user/usrEXAMPLE`.

## Profile QR

1. Register User A.
2. Register User B.
3. User A opens "Новый чат".
4. User A shows "Мой QR-код".
5. User B taps "Сканировать QR".
6. User B scans User A QR.
7. User B opens User A profile or direct chat.
8. User B sends a private message.
9. User A receives and replies.

## Group QR

1. User A creates a normal group.
2. User A opens group info.
3. User A shows group invite QR.
4. User B scans group QR.
5. User B joins the group.
6. User B can write immediately.
7. User B does not become admin.
8. User A creates a read-only channel.
9. User B joins channel and cannot write.

## Search and private chats

1. User A sets an alias/username if required.
2. User B searches by exact username/display name.
3. Result shows display name, username/alias, avatar, and message action.
4. User B starts direct chat.
5. Chat appears in both users' chat lists.
6. Private email/phone is not shown unless intentionally public.

## Invalid and edge cases

1. Scan invalid QR and confirm "QR-код недействителен".
2. Scan expired/future invite token and confirm friendly failure.
3. Open missing group link and confirm friendly failure.
4. Try joining a group without permission and confirm friendly failure.
5. Scan the same group QR twice and confirm already-joined behavior is harmless.
6. Verify no user-visible Tinode branding remains.

## Firebase push

1. Add real `android/app/google-services.json` outside Git.
2. Add real Firebase service account JSON outside Git.
3. Set `FCM_PUSH_ENABLED=true` and `FCM_CRED_FILE=/opt/nightvex/secrets/firebase-service-account.json` in `deploy/.env`.
4. Build and install debug APK on a physical Android phone.
5. Log in as User B on Android.
6. On Android 13+, grant notification permission.
7. Background or close the app.
8. Log in as User A on another device or web client.
9. Send User B a direct message.
10. Verify User B receives a push notification.
11. Tap it and verify the correct direct chat opens.
12. Send User B a group message in a normal group.
13. Verify User B receives a group push notification.
14. Tap it and verify the correct group opens.
15. If call push is enabled, test a missed 1-on-1 call notification.
16. Confirm no Firebase credentials were committed.

## Pending feature test areas

- Firebase push requires real Firebase credentials and physical-device testing.
- TURN/coturn and calls outside one LAN.
- One-time location sharing UI.
