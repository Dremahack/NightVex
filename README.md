# Self-hosted Tinode messenger

This repository is a local monorepo scaffold for a custom self-hosted messenger based on upstream Tinode.

Planned layout:

- `server/` - Tinode server fork or clone from `https://github.com/tinode/chat.git`
- `webapp/` - Tinode Web fork or clone from `https://github.com/tinode/webapp.git`
- `deploy/` - Docker Compose, reverse proxy, and deployment notes
- `docs/` - product and customization documentation
- `scripts/` - helper scripts for local setup and operations

No secrets belong in this repository. Use `.env` files locally and keep committed examples limited to placeholders.

## Bootstrap status

The local scaffold has been created. Clone upstream repositories when Git is available:

```powershell
git clone https://github.com/tinode/chat.git server
git clone https://github.com/tinode/webapp.git webapp
```

Then inspect the upstream build instructions before customizing branding or server behavior.

## Russian deployment guide

See `docs/run-on-server-ru.md` for a step-by-step Russian guide to preparing a VPS, configuring DNS, cloning Tinode, creating production `.env`, starting Docker Compose, checking HTTPS/WebSocket behavior, and planning backups.
