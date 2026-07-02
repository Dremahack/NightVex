# Calls setup

Android source includes WebRTC dependencies, call activities, call notifications, and microphone/camera permissions. Production calling still needs network setup.

## Local test

1. Run Tinode locally.
2. Install the debug APK on two Android devices or emulators.
3. Log in as two users.
4. Open a direct chat.
5. Test voice call.
6. Test video call.
7. Test accept, decline, hang up, and missed call states.

## Production requirements

- HTTPS for web.
- WSS for Tinode WebSocket.
- STUN server for basic NAT traversal.
- TURN server for reliable calls across mobile networks and strict NAT.
- TURN credentials must never be committed.

## coturn

Use `deploy/coturn/turnserver.conf.example` as a placeholder and create a real server config outside Git with real realm, user, and secret values.
