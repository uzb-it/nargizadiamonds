#!/usr/bin/env bash
# Builds the static site and publishes it to the gh-pages branch (GitHub Pages).
# Usage: npm run deploy:pages
set -euo pipefail
cd "$(dirname "$0")/.."

npm run db:start
npm run build:pages

REMOTE=$(git remote get-url origin)
SSH_CMD=$(git config core.sshCommand || true)
TMP=$(mktemp -d)
cp -r .next-pages/. "$TMP"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" \
  commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
GIT_SSH_COMMAND="${SSH_CMD:-ssh}" git push -q -f "$REMOTE" gh-pages
cd - >/dev/null
rm -rf "$TMP"
echo "Published: https://uzb-it.github.io/nargizadiamonds/"
