#!/bin/sh
set -e

echo "Running Prisma migrations..."

ATTEMPTS=30
DELAY=3
i=1

until npx prisma migrate deploy; do
  if [ $i -ge $ATTEMPTS ]; then
    echo "Prisma Migrate Deploy failed after $ATTEMPTS attempts."
    exit 1
  fi
  echo "Migrate failed. Retry $i/$ATTEMPTS in ${DELAY}s..."
  i=$((i+1))
  sleep $DELAY
done

echo "Starting app..."
exec node dist/index.js
