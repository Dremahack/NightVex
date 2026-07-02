---
name: messenger-security-review
description: Use when reviewing authentication, authorization, uploads, logs, secrets, push notifications, privacy, deployment, and production security for a messenger app.
---

Security checklist:
- No secrets, tokens, keys, credentials, certificates, or .env files committed.
- No private messages, passwords, tokens, phone/email codes, or uploaded file contents logged.
- Auth and authorization are checked on server-side changes.
- Admin/debug endpoints are not public in production.
- Upload size and file type limits are configured.
- TLS is required in production.
- CORS and allowed origins are restrictive.
- Backup/restore steps do not expose secrets.
- Any analytics/tracking requires explicit user approval and documentation.
