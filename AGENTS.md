# AGENTS.md — NightVex self-hosted Tinode messenger project

## Project goal

Build and maintain a custom self-hosted messenger called **NightVex** based on open-source Tinode.

Target outcome:
- Backend server based on Tinode.
- Web client based on Tinode Web.
- Android client based on Tinode/Tindroid.
- Later iOS client support if requested.
- Docker-based production deployment.
- PostgreSQL database by default.
- Custom NightVex branding.
- Russian-first UI.
- Configurable server URLs.
- Safe, reviewable changes that can be opened as GitHub pull requests.

Important:
- Do not rewrite the whole messenger from scratch unless explicitly requested.
- First make the original upstream project run successfully, then customize it.
- Prefer small, isolated, reversible changes.
- Never commit secrets, passwords, tokens, certificates, Firebase keys, `.env` files, Android signing keys, TURN credentials, or production credentials.

---

## Current NightVex status

This project is no longer a fresh Tinode bootstrap project.

Current known state:
- Android package: `ru.nightvex.messenger`.
- Branding is mostly NightVex.
- Old public Tinode URLs should not be user-visible.
- Debug APK builds successfully.
- Release APK/AAB builds, but release signing requires a local keystore.
- Profile QR uses `nightvex://user/<user-id>`.
- Group QR uses `nightvex://group/<topic-id>`.
- QR scanner accepts NightVex links, web fallback links, and legacy links where needed.
- Normal group invites should grant joined users `JRWP` permissions so they can write.
- Channel behavior should remain read-only if a channel is intentionally created as a channel.
- `app.vshp-project.ru` is not active unless explicitly re-enabled.
- `assetlinks.json` template exists under `webapp/.well-known/assetlinks.json`.
- Firebase push is pending.
- TURN/coturn for reliable calls beyond LAN is pending.
- Full one-time location sharing UI is pending.
- Invite-token backend is pending; current group QR may use raw topic id.

Do not return to the old “clone Tinode from scratch” phase unless the repository is empty or the user explicitly requests a clean re-bootstrap.

---

## How Codex should work in this repository

Before making changes, Codex must:

1. Read this `AGENTS.md`.
2. Inspect the current repository layout.
3. Detect whether this is:
   - an empty project folder,
   - a Tinode server fork,
   - a Tinode Web fork,
   - a Tinode/Tindroid Android fork,
   - a combined monorepo,
   - or a deployment-only repository.
4. Detect the current phase:
   - bootstrap,
   - web customization,
   - Android customization,
   - QR/App Links,
   - push notifications,
   - calls/TURN,
   - location sharing,
   - production deployment.
5. Create a short execution plan.
6. Use available Codex skills/plugins only when they are relevant.
7. If a required plugin or external integration is not installed, request installation/approval instead of pretending it is available.
8. If system packages are missing, ask for approval before installing them.
9. Avoid destructive commands unless the user explicitly approves them.
10. Keep changes small, testable, and easy to review.

---

## Plugin and skill policy

Codex should use or request these capabilities when available:

### Highest priority

- GitHub integration or GitHub MCP/plugin:
  - clone repositories,
  - inspect branches,
  - create pull requests,
  - review diffs,
  - manage issues/tasks when asked.

- Codex Security plugin or equivalent security scanning skill:
  - scan authentication, authorization, uploads, logs, secrets, Docker files, and deployment changes.

- Local project skills from this repository:
  - `messenger-project-bootstrap`
  - `tinode-frontend-customization`
  - `tinode-server-deployment`
  - `messenger-security-review`
  - `nightvex-android-release`
  - `nightvex-qr-applinks`
  - `nightvex-firebase-push`
  - `nightvex-calls-turn`
  - `nightvex-location-sharing`

### Optional

- Sites/web preview plugin:
  - only for previewing the web client or demo frontend.
  - do not use it as the main production messenger backend.

- Docker/MCP or infrastructure tools:
  - only if they are explicitly available in the current Codex environment.

### Do not use unless user asks

- Gmail, Slack, Drive, Calendar, or other personal-data plugins.
- Payment, analytics, or tracking integrations.
- Any plugin that sends project secrets or private messages outside the local/dev environment.

### Plugin installation behavior

When plugin installation is supported in the current Codex surface:

1. Inspect available plugins and local repo marketplace entries.
2. Install or request approval to install only plugins needed for the current task.
3. Prefer local repo-scoped plugins from `.agents/plugins/marketplace.json` when present.
4. Do not install unrelated plugins.
5. If installation is not possible from the current surface, continue using the local `.agents/skills` and this `AGENTS.md`.

---

## NightVex local skills

Use these local skills when relevant:

### `nightvex-android-release`

Use for:
- release signing,
- APK/AAB builds,
- keystore documentation,
- SHA256 fingerprints,
- release/debug separation.

### `nightvex-qr-applinks`

Use for:
- QR generation,
- QR scanning,
- `nightvex://` deep links,
- Android App Links,
- `assetlinks.json`,
- invite/profile/group QR flows.

### `nightvex-firebase-push`

Use for:
- Firebase Messaging,
- `google-services.json`,
- FCM server configuration,
- Android 13+ notification permission,
- notification tap handling,
- push notification manual tests.

### `nightvex-calls-turn`

Use for:
- WebRTC,
- 1-on-1 voice calls,
- 1-on-1 video calls,
- STUN/TURN,
- coturn,
- missed calls,
- calls across mobile networks.

### `nightvex-location-sharing`

Use for:
- one-time geolocation sharing,
- runtime permissions,
- location message attachments,
- location preview cards,
- map opening behavior.

---

## Preferred repository layout

If the current folder is empty or only contains project instructions, create this layout:

```text
.
├── AGENTS.md
├── README.md
├── server/             # Tinode server fork or clone
├── webapp/             # Tinode Web fork or clone
├── android/            # Tindroid/NightVex Android client
├── ios/                # Optional future iOS client
├── deploy/             # Docker Compose, reverse proxy, environment examples
├── docs/               # specs, customization plan, operations notes
├── scripts/            # helper scripts for setup/build/deploy
└── .env.example        # safe example environment variables only
```

If the user wants separate repositories, keep server, webapp, and Android app separate and create a lightweight `deploy` repository.

If these folders already exist, do not overwrite them. Inspect them first.

---

## Upstream projects

Use these upstream repositories unless the user chooses another base:

- Tinode server:
  - `https://github.com/tinode/chat.git`

- Tinode Web:
  - `https://github.com/tinode/webapp.git`

- Tinode Android/Tindroid:
  - `https://github.com/tinode/tindroid.git`

Default bootstrap commands for an empty monorepo:

```bash
git clone https://github.com/tinode/chat.git server
git clone https://github.com/tinode/webapp.git webapp
git clone https://github.com/tinode/tindroid.git android
mkdir -p deploy docs scripts
```

If folders already exist, inspect them first and do not overwrite user work.

---

## Required local tools

Codex should check for these tools before building:

```bash
git --version
docker --version
docker compose version
go version
node --version
npm --version
java -version
```

For Android tasks, also check:
```bash
cd android
./gradlew --version
```

On Windows:
```powershell
cd android
.\gradlew.bat --version
```

Preferred versions:
- Git: current stable.
- Docker Engine / Docker Desktop: current stable.
- Docker Compose v2.
- Go: version required by the Tinode server repository.
- Node.js: current LTS unless `webapp/package.json` requires something else.
- npm/pnpm/yarn: use whatever the webapp repository declares; prefer `npm ci` when `package-lock.json` exists.
- JDK: version required by the Android Gradle project.
- Android Studio / Android SDK for mobile preview and APK builds.

If a tool is missing:
- On local user machines, explain what is missing and ask before installing.
- In disposable CI/dev containers, install the minimum required dependency.
- Do not run system-level package installation without permission.

---

## Current task priorities for NightVex

Unless the user overrides priorities, follow this order now:

1. Preserve working Android/Web builds.
2. Do not break existing QR, App Links, direct chats, and group permissions.
3. Finish Android release signing documentation and signed APK/AAB flow.
4. Verify profile QR and group QR on real users.
5. Verify 1-on-1 user search and private chats.
6. Verify normal group join + write permissions.
7. Configure Firebase push notifications.
8. Configure TURN/coturn for stable 1-on-1 voice/video calls.
9. Implement one-time location sharing UI and message card.
10. Replace raw group topic-id QR invites with invite-token backend.
11. Prepare production deployment checklist.
12. Polish UI, onboarding, privacy pages, and app store readiness.

---

## First setup workflow

When asked to create or initialize the messenger project from scratch:

1. Inspect current directory.
2. Create the preferred layout if missing.
3. Clone upstream Tinode server into `server/` if absent.
4. Clone Tinode Web into `webapp/` if absent.
5. Clone Tinode Android/Tindroid into `android/` if absent and requested.
6. Add safe `.env.example`.
7. Add `deploy/docker-compose.yml` for:
   - Tinode server,
   - PostgreSQL,
   - reverse proxy placeholder or Caddy/Nginx config.
8. Add `deploy/README.md` with local and VPS deployment instructions.
9. Add `docs/customization-plan.md`.
10. Run build checks where possible.
11. Summarize what changed and what commands the user should run next.

Do not customize branding before the original application builds and runs, unless the current repository is already in the customization phase.

---

## Backend policy: Tinode server

Default backend approach:
- Preserve Tinode protocol compatibility.
- Do not make protocol-breaking changes unless the user explicitly requests them.
- Keep server configuration environment-driven.
- Prefer PostgreSQL for production.
- Keep file uploads configurable.
- Keep push notifications optional until the user provides Firebase/Web Push credentials.
- Keep calls configurable through STUN/TURN settings.
- Keep QR/invite behavior safe and token-based when possible.

Safe backend changes:
- configuration,
- Docker files,
- environment examples,
- logging configuration,
- registration policy,
- upload limits,
- branding-related server metadata,
- deployment documentation,
- FCM placeholder configuration,
- TURN/STUN placeholder configuration.

Dangerous backend changes:
- authentication flow,
- authorization checks,
- message protocol,
- encryption/security code,
- database migrations,
- user deletion/data retention,
- file upload handling,
- invite token implementation,
- default ACL changes.

For dangerous changes:
- create a plan first,
- add tests where possible,
- run security review,
- document rollback steps.

Validation:
- inspect Go module files,
- run the repository’s documented build/test commands,
- use `go test ./...` only after confirming it is appropriate for this repository.

---

## Frontend policy: Tinode Web

Default frontend approach:
- Change UI/branding first.
- Do not change backend API assumptions unless required.
- Keep server URL configurable.
- Preserve Russian language support.
- Prefer existing React structure and styling system.
- Keep web fallback for invite links and QR links.

Safe frontend customization:
- logo,
- favicon,
- app name,
- colors,
- typography,
- login/register copy,
- sidebar labels,
- empty states,
- Russian translations,
- theme variables,
- environment config,
- invite fallback pages,
- no-JavaScript fallback text.

Initial design priorities:
1. Replace app name and logo.
2. Replace color palette.
3. Russian-first login/register screens.
4. Configure backend URL via `.env`.
5. Simplify navigation for MVP.
6. Adjust chat bubble styling.
7. Add product-specific onboarding.
8. Add invite/profile/group fallback pages if QR links use web fallback.

Validation:
- inspect `package.json`,
- use the package manager implied by the lockfile,
- run lint/build commands if available,
- do not introduce new UI libraries unless needed.

---

## Android policy: NightVex mobile app

Android app package:
- `ru.nightvex.messenger`

Rules:
- Do not change `applicationId` without explicit approval.
- Do not commit real `google-services.json`.
- Do not commit `.jks`, `.keystore`, or `keystore.properties`.
- Do not commit Firebase service accounts or production credentials.
- Do not commit real TURN credentials.
- Keep debug and release configuration separate.
- Keep Android App Links aligned with `assetlinks.json`.
- Keep Russian strings updated.
- Do not remove QR/deep link support unless replacing it with a tested equivalent.
- Do not remove or disable push/call/location permissions without checking feature impact.
- Do not hardcode production secrets in resources, Gradle files, or Java/Kotlin code.

Required Android checks after changes:

On Linux/macOS:
```bash
cd android
./gradlew :app:assembleDebug
./gradlew :app:assembleRelease
```

On Windows:
```powershell
cd android
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:assembleRelease
```

If release signing is configured locally:
```powershell
.\gradlew.bat :app:bundleRelease
```

Report:
- Debug APK path.
- Release APK path.
- AAB path if built.
- Whether release is signed or unsigned.
- Whether `google-services.json` is required.
- Whether `assetlinks.json` must be uploaded.

---

## Android release signing policy

Goal:
Prepare production-ready Android builds without committing secrets.

Rules:
- Release keystore must be created manually by the user.
- Codex may document keystore creation but must not create or commit a real keystore.
- `keystore.properties` with real passwords must never be committed.
- `*.jks`, `*.keystore`, `*.pem`, and `*.key` must be ignored.
- Build outputs may be referenced but should not be committed unless the user explicitly asks.

Required docs:
- `docs/ANDROID_RELEASE_SIGNING.md`

Required manual steps to document:
1. Create release keystore.
2. Fill local `android/keystore.properties`.
3. Build signed release APK.
4. Build release AAB.
5. Get SHA256 fingerprint for debug certificate.
6. Get SHA256 fingerprint for release certificate.
7. Add SHA256 fingerprints to `assetlinks.json`.

---

## QR and App Links policy

NightVex deep link scheme:
- `nightvex://user/<public-user-id-or-username>`
- `nightvex://group/<topic-id-or-invite-token>`

Web fallback:
- `https://vshp-project.ru/invite/user/<public-user-id-or-username>`
- `https://vshp-project.ru/invite/group/<topic-id-or-invite-token>`

Rules:
- QR codes must not contain passwords, auth tokens, session tokens, Firebase tokens, or private credentials.
- QR codes must not point to `tinode.co` or `hosts.tinode.co`.
- Invalid QR codes must show a friendly Russian error.
- Profile QR should open a user profile or direct chat.
- Group QR should let a user join a normal group and write messages if group permissions allow it.
- Current topic-id QR is acceptable for testing, but production should move to invite-token backend later.
- If Android App Links are changed, update:
  - AndroidManifest intent filters,
  - `webapp/.well-known/assetlinks.json`,
  - `docs/QR_AND_DEEPLINKS.md`,
  - `docs/QR_TEST_RESULTS.md` if tests are run.

Production assetlinks location:
- `https://vshp-project.ru/.well-known/assetlinks.json`

If `app.vshp-project.ru` is re-enabled, it must also host:
- `https://app.vshp-project.ru/.well-known/assetlinks.json`

Required manual tests:
1. User A shows profile QR.
2. User B scans it.
3. User B opens User A profile or direct chat.
4. User B sends User A a message.
5. User A creates normal group.
6. User A shows group QR.
7. User B scans it.
8. User B joins group.
9. User B can write in the group.
10. Invalid QR shows a friendly Russian error.

---

## Direct chats and user discovery policy

Goal:
Users must be able to find each other and start private 1-on-1 chats like Telegram.

Rules:
- Do not expose private emails or phone numbers unless intentionally public.
- Prefer username/display-name search where allowed.
- Direct chat creation must not require admin intervention.
- Direct chats must appear in both users’ chat lists.
- Search UI must have Russian empty/error states.

Required UI:
- “Новый чат”
- “Найти людей”
- “Написать”
- “Пользователь не найден”
- “Введите имя пользователя”

Acceptance tests:
1. User A registers.
2. User B registers.
3. User A finds User B.
4. User A starts direct chat.
5. User B receives message.
6. User B replies.
7. Chat remains visible later.

---

## Group permissions policy

Goal:
Normal groups should allow joined members to write by default.

Rules:
- Distinguish normal groups from read-only channels.
- Normal joined members should receive read + write permissions.
- Joined users must not become admins by default.
- Channel behavior must remain read-only if a read-only channel is intentionally created.
- Do not change global ACL defaults without documenting impact.

Current expected access for normal joined users:
- joined/read/write/presence permissions sufficient for normal messaging, such as `JRWP` where compatible with the current Tinode permission model.

Acceptance tests:
1. User A creates normal group.
2. User B joins via invite/QR/link.
3. User B can write immediately.
4. User B does not become admin.
5. If group is a channel, UI clearly shows read-only behavior.

---

## Firebase push policy

Goal:
Enable Android push notifications for direct messages, group messages, and missed calls if supported.

Rules:
- Never commit real `google-services.json`.
- Never commit Firebase service account JSON.
- Never commit FCM server keys.
- Use placeholders in docs and `.env.example`.
- Android package must remain `ru.nightvex.messenger`.
- Android 13+ `POST_NOTIFICATIONS` runtime permission must be handled.
- Notification tap must open the correct chat or group.
- Push setup should support both debug testing and release production.

Required docs:
- `docs/PUSH_SETUP.md`
- `docs/TEST_PLAN.md`

Required checks:
- Firebase dependencies in Gradle.
- Android manifest services/receivers.
- Firebase token registration flow.
- Tinode server FCM configuration.
- Notification channel creation.
- Android 13+ notification permission prompt.
- Notification tap routing.

Manual acceptance tests:
1. User B logs in on Android.
2. User B backgrounds or closes the app.
3. User A sends User B a direct message.
4. User B receives push.
5. Tapping push opens the direct chat.
6. User A sends a group message.
7. User B receives group push.
8. Tapping push opens the group.
9. If supported, missed call notification is tested.

---

## Voice/video calls policy

Goal:
Support 1-on-1 voice and video calls.

Rules:
- Do not implement group calls in the current phase.
- Do not rewrite WebRTC unless necessary.
- First verify existing Tinode/Tindroid call implementation.
- Calls must use HTTPS/WSS in production.
- STUN is enough only for basic local testing.
- TURN/coturn is required for reliable production calls across mobile networks.
- TURN credentials must never be committed.
- Hide call buttons in unsupported contexts.

Required docs:
- `docs/CALLS_SETUP.md`
- `deploy/coturn/turnserver.conf.example` if coturn config is added.

Manual acceptance tests:
1. Android-to-Android voice call on same Wi-Fi.
2. Android-to-Android video call on same Wi-Fi.
3. Android-to-Android call with one user on mobile internet.
4. Android-to-Web call if web client supports calls.
5. Missed call behavior.
6. Incoming call notification behavior if supported.

Future group calls:
- Do not implement without approval.
- If requested, compare LiveKit, Jitsi, Janus, mediasoup, and other SFU options first.

---

## Location sharing policy

Goal:
Implement one-time location sharing, not live tracking.

Rules:
- Do not implement background tracking.
- Do not implement live location unless explicitly requested.
- Do not log exact coordinates.
- Request location permission only when the user taps “Поделиться геолокацией”.
- Location should be sent as a normal message attachment/card.
- Recipient should be able to open location in an external map app/browser.
- If location is denied, show a friendly Russian message.
- Location is stored only as part of normal message history.

Required Android permissions:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

Required UI:
- “Поделиться геолокацией”
- Friendly permission denied message.
- Compact location message card.
- External map opening behavior.

Manual acceptance tests:
1. User shares one-time location in a direct chat.
2. Recipient sees a location card.
3. Recipient opens it in a map.
4. User shares one-time location in a writable group.
5. Permission denied state is handled.
6. App does not track location continuously.

---

## Deployment policy

Default deployment stack:

```text
Tinode server + PostgreSQL + Docker Compose + Caddy or Nginx + Let's Encrypt
```

Deployment files should live under `deploy/`.

Production rules:
- Never hardcode secrets.
- Use `.env` files excluded from git.
- Provide `.env.example` with placeholders.
- Keep database volumes persistent.
- Keep upload/media volumes persistent.
- Add backup and restore notes.
- Expose only necessary ports.
- Put Tinode behind HTTPS.
- Preserve WebSocket reverse proxy settings.
- Include firewall notes for ports 22, 80, 443.
- Provide secure placeholders for Firebase/FCM credentials.
- Provide secure placeholders for TURN/coturn credentials.
- Ensure `assetlinks.json` is served at the correct `.well-known` path.

Preferred `deploy/` files:

```text
deploy/
├── docker-compose.yml
├── docker-compose.local.yml
├── .env.example
├── .env.production.example
├── caddy/
│   └── Caddyfile
├── nginx/
│   └── tinode.conf
├── coturn/
│   └── turnserver.conf.example
├── scripts/
│   ├── backup-postgres.sh
│   └── restore-postgres.sh
└── README.md
```

---

## Security rules

Always follow these rules:

- Never commit private keys, tokens, passwords, certificates, Firebase credentials, Android signing keys, TURN credentials, or `.env`.
- Never log passwords, access tokens, refresh tokens, private messages, email verification codes, phone codes, exact location coordinates, Firebase tokens, or uploaded file contents.
- Do not expose admin/debug endpoints publicly.
- Validate upload size and file type.
- Keep CORS and allowed origins restrictive in production.
- Keep rate limits and anti-abuse controls in mind for login/register endpoints.
- Before changing authentication, authorization, uploads, or deployment, run or request a security review.
- Prefer least-privilege database credentials.
- Do not disable TLS verification in production.
- Do not add analytics/tracking unless the user asks and privacy impact is documented.
- Do not put auth/session secrets in QR codes or deep links.
- Do not put private credentials in Android resources.

---

## Stop conditions

Codex must stop and ask for approval before:

- Deleting user data.
- Running database migrations on production.
- Modifying production VPS.
- Replacing authentication or authorization logic.
- Changing Android `applicationId`.
- Changing production domain.
- Committing files that may contain secrets.
- Removing existing QR/deep link behavior.
- Rewriting Tinode protocol code.
- Adding analytics/tracking.
- Adding paid services or third-party SDKs.
- Implementing group calls.
- Implementing live/background location tracking.
- Removing or changing license files.
- Pushing build artifacts to repository unless explicitly requested.

---

## Licensing note

Tinode server and clients can have different licenses. Before turning this into a commercial closed-source product, inspect the current upstream license files and summarize obligations. Do not remove copyright notices or license files.

---

## Branching and commits

Use branches like:

```text
feature/bootstrap-project
feature/branding
feature/webapp-theme
feature/android-branding
feature/android-release-signing
feature/qr-applinks
feature/firebase-push
feature/calls-turn
feature/location-sharing
feature/deploy-docker-compose
security/auth-review
```

Commit style:
- small commits,
- clear messages,
- mention affected area.

Examples:

```text
chore: add docker compose deployment scaffold
feat(webapp): apply initial custom branding
feat(android): update NightVex app links
feat(android): add Firebase push setup docs
docs: add Android release signing guide
security: document upload and auth review checklist
```

---

## Pull request checklist

Before opening or finalizing a PR:

- [ ] Project still builds or documented why build was not run.
- [ ] Android debug build still works if Android files changed.
- [ ] Android release build still works or documented why not.
- [ ] No secrets committed.
- [ ] `.env.example` contains placeholders only.
- [ ] Deployment files use persistent volumes.
- [ ] WebSocket proxy settings are preserved.
- [ ] Russian UI/localization still works.
- [ ] QR/deep links still work or test status is documented.
- [ ] Group write permissions are not broken.
- [ ] Security-sensitive changes reviewed.
- [ ] License files preserved.
- [ ] User-facing changes documented.
- [ ] Manual setup steps are clearly listed.

---

## Definition of Done

A task is not complete until Codex reports:

1. What files were inspected.
2. What files were changed.
3. What commands were run.
4. Whether the build passed.
5. What was not tested and why.
6. What requires manual setup.
7. What secrets or credentials must be provided by the user.
8. What can break in production.
9. Exact next commands for the user.
10. What remains after this phase.

For Android tasks, always report:
- Debug APK path.
- Release APK/AAB path if built.
- Whether release is signed or unsigned.
- Whether `google-services.json` is required.
- Whether `assetlinks.json` must be uploaded.
- Whether debug/release SHA256 fingerprints are needed.
- Whether physical device testing is required.

For deployment tasks, always report:
- Required environment variables.
- Required secrets.
- Required DNS records.
- Required ports.
- Required HTTPS/WSS settings.
- Backup/restore notes.

---

## Default task priorities

### If project is empty or fresh

1. Bootstrap repository structure.
2. Clone upstream server and webapp.
3. Make original server run locally.
4. Make original webapp build locally.
5. Add Docker Compose deployment.
6. Add branding/theme changes.
7. Add Russian-first copy/localization.
8. Add production VPS documentation.
9. Add backup/restore scripts.
10. Add mobile app work only after Web MVP is stable.

### If project is already in current NightVex phase

1. Preserve existing working builds.
2. Verify manual QR/direct/group flows.
3. Finish Android release signing and App Links.
4. Configure Firebase push.
5. Configure TURN/coturn and verify calls.
6. Implement one-time location sharing.
7. Replace raw topic-id group QR with invite-token backend.
8. Polish production deployment.
9. Prepare app store and public landing assets.

The user may override these priorities at any time.

---

## Initial user prompt template

If the user says “start” or asks to begin from scratch, proceed with:

1. Inspect directory.
2. Create or update the structure.
3. Clone upstream projects if missing.
4. Add deployment scaffold.
5. Run available checks.
6. Report exact changed files and next commands.

Do not ask unnecessary clarification questions if a safe default exists.

---

## Codex response format

For every substantial task, Codex should respond in this structure:

```text
Summary
- ...

Changed files
- ...

Commands run
- ...

Build/test status
- ...

Manual steps required
- ...

Secrets required but not committed
- ...

Risks / not tested
- ...

Next recommended step
- ...
```

Keep responses concise but complete.
