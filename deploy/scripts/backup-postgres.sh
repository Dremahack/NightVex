#!/usr/bin/env sh
set -eu

: "${POSTGRES_DB:=tinode}"
: "${POSTGRES_USER:=tinode}"
: "${BACKUP_DIR:=./backups}"

mkdir -p "$BACKUP_DIR"
stamp="$(date +%Y%m%d-%H%M%S)"
docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$BACKUP_DIR/tinode-$stamp.sql"
