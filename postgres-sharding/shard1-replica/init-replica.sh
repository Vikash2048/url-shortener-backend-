#!/bin/bash

set -e

echo "Waiting for Shard 1..."

until pg_isready -h postgres-shard-1 -p 5432 -U Admin; do
    sleep 2
done

echo "Shard 1 is ready."

rm -rf /var/lib/postgresql/data/*

PGPASSWORD=shard1_replicator_password pg_basebackup \
    -h postgres-shard-1 \
    -p 5432 \
    -U replicator \
    -D /var/lib/postgresql/data \
    -Fp \
    -Xs \
    -P \
    -R

echo "Base backup completed."

exec postgres