#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path/to/backup.sql" >&2
  exit 1
fi

: "${POSTGRES_DB:=tinode}"
: "${POSTGRES_USER:=tinode}"

docker compose exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB" < "$1"
