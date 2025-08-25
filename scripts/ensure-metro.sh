#!/usr/bin/env bash
set -euo pipefail

# Ensure Metro (Expo) bundler is running for Detox tests.
# If it's not running, start it in the background and wait until ready.
# Uses RCT_METRO_PORT if set, else defaults to 8081.

export EXPO_NO_TELEMETRY=${EXPO_NO_TELEMETRY:-1}
PORT=${RCT_METRO_PORT:-8081}
STATUS_URL="http://localhost:${PORT}/status"

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
log_dir="$root_dir/e2e/artifacts/local"
mkdir -p "$log_dir"
log_file="$log_dir/metro.ensure.log"

have() { command -v "$1" >/dev/null 2>&1; }

if ! have npx; then
  echo "npx not found. Please install Node.js (includes npx)." >&2
  exit 1
fi

# Quick probe: is Metro already running?
if curl -fs "$STATUS_URL" 2>/dev/null | grep -q "packager-status:running"; then
  echo "[ensure-metro] Metro already running at $STATUS_URL"
  exit 0
fi

# Otherwise, start Metro in the background.
echo "[ensure-metro] Starting Metro on port $PORT ..."
# Try to kill anything listening on the port to avoid confusion (best-effort)
if command -v lsof >/dev/null 2>&1; then
  if lsof -i tcp:"$PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "[ensure-metro] Port $PORT is in use; terminating owning process..."
    lsof -i tcp:"$PORT" -sTCP:LISTEN -t | xargs -I {} kill -9 {} || true
  fi
fi

nohup npx expo start --dev-client --no-interactive --clear --port "$PORT" \
  > "$log_file" 2>&1 &
METRO_PID=$!
echo "[ensure-metro] Metro PID: $METRO_PID (logs: $log_file)"

# Wait for Metro to be ready
sleep 2
ready="false"
for i in {1..60}; do
  STATUS=$(curl -fs "$STATUS_URL" || true)
  if echo "$STATUS" | grep -q "packager-status:running"; then
    echo "[ensure-metro] Metro is running at $STATUS_URL"
    ready="true"
    break
  fi
  sleep 2
 done

if [ "$ready" != "true" ]; then
  echo "[ensure-metro] Metro did not become ready in time. Tail of log:" >&2
  tail -n 200 "$log_file" || true
  exit 1
fi
