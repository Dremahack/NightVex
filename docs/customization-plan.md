# Tinode customization plan

## Phase 1: upstream baseline

- Clone Tinode server into `server/`.
- Clone Tinode Web into `webapp/`.
- Confirm upstream server build and documented tests.
- Confirm upstream webapp install and build.
- Preserve upstream license and copyright notices.

## Phase 2: deployment

- Wire Tinode server to PostgreSQL.
- Keep uploads on persistent storage.
- Put the service behind Caddy or Nginx with HTTPS.
- Keep push notifications disabled until credentials are supplied.
- Document backup and restore steps.

## Phase 3: product customization

- Apply custom app name, logo, favicon, and theme.
- Make Russian the primary UI language where upstream supports it.
- Keep backend URLs environment-driven.
- Simplify onboarding and empty states for the MVP.
- Avoid protocol changes unless explicitly planned and tested.

## Security checklist

- No committed `.env` files or private credentials.
- No public database ports.
- No public admin or debug endpoints.
- Upload size and accepted file types reviewed.
- Login/register rate limits reviewed.
- CORS and allowed origins restricted for production.
