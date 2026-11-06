#!/usr/bin/env bash
# Starts the private PostgreSQL of this project (data/postgres, port 5544) for development.
# First run creates it and writes DATABASE_URL into .env. Usage: npm run db:start
set -euo pipefail
cd "$(dirname "$0")/.."

PGBIN=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGDATA=data/postgres
PORT=5544

if [ ! -f "$PGDATA/PG_VERSION" ]; then
  PASS=$(openssl rand -hex 24)
  "$PGBIN/initdb" -D "$PGDATA" -U nargiza --pwfile=<(printf %s "$PASS") \
    --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null
  touch .env
  sed -i '/^DATABASE_URL=/d' .env
  echo "DATABASE_URL=postgres://nargiza:$PASS@127.0.0.1:$PORT/nargiza" >> .env
  NEW=1
fi

if ! "$PGBIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
  "$PGBIN/pg_ctl" -D "$PGDATA" -w -l "$PGDATA/server.log" \
    -o "-p $PORT -c listen_addresses=127.0.0.1 -c unix_socket_directories=''" start >/dev/null
fi

if [ "${NEW:-}" ]; then
  PGPASSWORD=$PASS "$PGBIN/createdb" -h 127.0.0.1 -p "$PORT" -U nargiza nargiza
fi
echo "PostgreSQL is running on 127.0.0.1:$PORT"
