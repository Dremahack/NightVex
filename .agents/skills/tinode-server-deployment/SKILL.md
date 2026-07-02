---
name: tinode-server-deployment
description: Use when changing Tinode server setup, Docker deployment, PostgreSQL, reverse proxy, domain, TLS, backups, tinode.conf, and production operations.
---

Deployment defaults:
- Docker Compose.
- PostgreSQL for production.
- Caddy or Nginx reverse proxy.
- HTTPS with Let's Encrypt.
- Persistent volumes for database and uploaded files.
- .env files excluded from git.
- .env.example with placeholders only.
- Preserve WebSocket proxy support.
- Add backup/restore notes for database and media.
