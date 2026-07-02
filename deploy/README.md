# Deployment scaffold

This directory contains a first-pass Docker Compose deployment for Tinode with PostgreSQL and a Caddy reverse proxy.

Russian step-by-step server launch guide: `../docs/run-on-server-ru.md`.

## Local preparation

1. Install Git, Docker Desktop, Go, Node.js, and npm.
2. Clone upstream projects into the repository root:

   ```powershell
   git clone https://github.com/tinode/chat.git server
   git clone https://github.com/tinode/webapp.git webapp
   ```

3. Copy the example environment file and replace placeholders:

   ```powershell
   Copy-Item deploy/.env.example deploy/.env
   ```

4. Review the upstream Tinode server Dockerfile and configuration before starting production services.

## Production notes

- Put Tinode behind HTTPS.
- Keep only required ports open: `22`, `80`, and `443`.
- Keep PostgreSQL and upload data on persistent volumes.
- Store real secrets only in `deploy/.env`, never in committed files.
- Keep WebSocket proxy headers enabled for realtime messaging.
- Configure restrictive origins before public launch.

## Operations

Backup PostgreSQL:

```sh
cd deploy
./scripts/backup-postgres.sh
```

Restore PostgreSQL:

```sh
cd deploy
./scripts/restore-postgres.sh ./backups/tinode-YYYYMMDD-HHMMSS.sql
```
