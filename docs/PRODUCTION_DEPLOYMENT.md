# Production deployment

## Required components

- Tinode server.
- PostgreSQL.
- Caddy or Nginx reverse proxy.
- HTTPS with Let's Encrypt.
- Persistent database volume.
- Persistent upload/media volume.
- Secure server-side Firebase credentials if push is enabled.
- STUN/TURN for reliable calls outside one LAN.

## Production rules

- Do not commit `.env`.
- Do not commit signing keys, Firebase credentials, TURN credentials, TLS keys, database dumps, or backups.
- Expose only ports `80` and `443` publicly for the app, plus SSH as needed.
- Use WSS behind HTTPS.
- Preserve WebSocket Upgrade headers in reverse proxy config.
- Keep CORS/allowed origins limited to NightVex domains.
- Back up PostgreSQL and upload/media volumes.

## Domains

- Main production URL: `https://vshp-project.ru`.
- Optional app URL: `https://app.vshp-project.ru`.
- Every Android App Links domain must host `/.well-known/assetlinks.json`.
