# NightVex

This repository is a local monorepo scaffold for a custom self-hosted messenger based on upstream Tinode.

Planned layout:

- `server/` - Tinode server fork or clone from `https://github.com/tinode/chat.git`
- `webapp/` - Tinode Web fork or clone from `https://github.com/tinode/webapp.git`
- `android/` - NightVex Android client based on Tindroid
- `deploy/` - Docker Compose, reverse proxy, and deployment notes
- `docs/` - product and customization documentation
- `scripts/` - helper scripts for local setup and operations

No secrets belong in this repository. Use `.env` files locally and keep committed examples limited to placeholders.

## Current status

NightVex includes Android, Web, server, deployment scaffolding, QR/App Links docs, Android release signing docs, and Firebase push setup documentation.

Firebase credentials, Android release keystores, production `.env` files, TURN credentials, and VPS secrets must be configured manually outside Git.

## Russian deployment guide

See `docs/run-on-server-ru.md` for a step-by-step Russian guide to preparing a VPS, configuring DNS, cloning Tinode, creating production `.env`, starting Docker Compose, checking HTTPS/WebSocket behavior, and planning backups.
