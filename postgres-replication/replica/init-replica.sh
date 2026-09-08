#!/bin/bash
set -e

PGDATA="${PGDATA:-/var/lib/postgresql/data}"

echo "${PRIMARY_HOST}:${PRIMARY_PORT}:*:${REPLICATOR_USER}:${REPLICATOR_PASSWORD}" > /tmp/.pgpass
chmod 600 /tmp/.pgpass
export PGPASSFILE=/tmp/.pgpass

if [ -z "$(ls -A "$PGDATA" 2>/dev/null)" ]; then
  echo "PGDATA is empty - waiting for primary at ${PRIMARY_HOST}:${PRIMARY_PORT}..."

  until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPLICATOR_USER" -d postgres; do
    sleep 2
  done

  echo "Taking base backup from primary..."
  pg_basebackup \
    -h "$PRIMARY_HOST" \
    -p "$PRIMARY_PORT" \
    -D "$PGDATA" \
    -U "$REPLICATOR_USER" \
    -Fp -Xs -P -R

  chmod 700 "$PGDATA"
  echo "Base backup complete, starting as standby."
else
  echo "PGDATA already populated, skipping base backup."
fi

exec docker-entrypoint.sh postgres
