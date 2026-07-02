# Production Deployment

NightVex production deployment uses Docker Compose with Tinode, PostgreSQL, and Caddy.

## Required components

- VPS with Docker and Docker Compose v2.
- DNS record for `vshp-project.ru` pointing to the VPS.
- Open ports `80` and `443`; SSH as needed.
- Persistent PostgreSQL and upload/media volumes.
- Real Firebase credentials only when push is enabled.
- TURN/coturn later for reliable calls outside one LAN.

## Production sequence

1. Clone or pull the repository on the VPS:

```bash
git clone https://github.com/Dremahack/NightVex.git
cd NightVex
git pull origin main
```

2. Create the local environment file:

```bash
cp deploy/.env.production.example deploy/.env
```

3. Replace every placeholder in `deploy/.env`.

Database names must stay consistent:

```env
POSTGRES_DB=tinode
TINODE_DB_NAME=tinode
```

`POSTGRES_DB` is the database created by PostgreSQL. `TINODE_DB_NAME` is the database name used in `POSTGRES_DSN` by `deploy/docker-compose.yml`.

4. Put Firebase service account JSON outside Git if push will be tested:

```text
/opt/nightvex/secrets/firebase-service-account.json
```

For the current compose mount, place the host copy here:

```text
deploy/secrets/firebase-service-account.json
```

Compose mounts `deploy/secrets` into the container as:

```text
/opt/nightvex/secrets
```

5. Configure FCM in `deploy/.env`:

```env
FCM_PUSH_ENABLED=true
FCM_PROJECT_ID=your-firebase-project-id
FCM_CRED_FILE=/opt/nightvex/secrets/firebase-service-account.json
FCM_INCLUDE_ANDROID_NOTIFICATION=false
```

`FCM_CRED_FILE` must be the container path, not a Windows path and not a host-only path.

6. Leave WebRTC disabled until the calls/TURN phase unless you are intentionally testing existing basic calls:

```env
WEBRTC_ENABLED=false
```

7. Validate compose:

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.yml config
```

8. Start production compose:

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.yml up -d
```

9. Check logs:

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.yml logs -f tinode
docker compose --env-file deploy/.env -f deploy/docker-compose.yml logs -f caddy
```

10. Verify HTTPS and WebSocket routing:

```bash
curl -I https://vshp-project.ru/
```

11. Verify push initialization logs. Tinode should initialize the FCM adapter when `FCM_PUSH_ENABLED=true` and `FCM_CRED_FILE` points to a readable service account JSON.

12. Confirm no secrets are tracked:

```bash
git status --short
git check-ignore -v deploy/.env deploy/secrets/firebase-service-account.json
```

## FCM wiring note

`deploy/docker-compose.yml` does not set `EXT_CONFIG`, so the official Tinode image generates `working.config` from its bundled `config.template`. In that mode these env vars are consumed by Tinode runtime:

- `FCM_PUSH_ENABLED`
- `FCM_CRED_FILE`
- `FCM_PROJECT_ID`
- `FCM_INCLUDE_ANDROID_NOTIFICATION`

If you later set `EXT_CONFIG` and mount a full custom `tinode.conf`, most Tinode image environment variables are ignored. In that case, FCM must be configured directly in the mounted config file. Use `server/server/tinode.fcm.example.conf` only as a placeholder-only reference.

## Security rules

- Do not commit `deploy/.env`.
- Do not commit `deploy/secrets/`.
- Do not commit `android/app/google-services.json`.
- Do not commit Firebase service account JSON.
- Do not commit Android keystores, TURN credentials, TLS keys, database dumps, or backups.
- Keep CORS/allowed origins limited to NightVex domains.
- Keep WebSocket Upgrade headers in the reverse proxy.

## Domains

- Main production URL: `https://vshp-project.ru`.
- Optional app URL: `https://app.vshp-project.ru`.
- Every Android App Links domain must host `/.well-known/assetlinks.json`.
