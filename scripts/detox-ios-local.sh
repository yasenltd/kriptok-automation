#!/usr/bin/env bash
set -euo pipefail

# A local runner that mirrors the CI workflow for iOS Detox tests.
# Prereqs: Xcode + iOS simulator, CocoaPods, pnpm, Node 20+, Expo CLI.

# Config
export CI=${CI:-false}
export TERM=xterm
export NODE_OPTIONS="--max_old_space_size=4096"
export EXPO_NO_TELEMETRY=1
export RCT_METRO_PORT=${RCT_METRO_PORT:-8081}

# Optional test data envs can be set in your shell:
#   TEST_PIN, TEST_SEED_PHRASE, TEST_WALLET_NAME

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
ios_dir="$root_dir/ios"
log_dir="$root_dir/e2e/artifacts/local"
mkdir -p "$log_dir"

function have() { command -v "$1" >/dev/null 2>&1; }

if ! have pnpm; then
  echo "pnpm not found. Please install pnpm (https://pnpm.io)" >&2
  exit 1
fi

if ! have xcrun; then
  echo "Xcode command line tools not found (xcrun missing). Install Xcode." >&2
  exit 1
fi

if ! have pod; then
  echo "CocoaPods (pod) not found. Install with: sudo gem install cocoapods" >&2
  exit 1
fi

if ! have npx; then
  echo "npx not found. Install Node.js 20+." >&2
  exit 1
fi

pushd "$root_dir" >/dev/null

echo "[1/7] Installing JS dependencies (pnpm install)"
pnpm install --frozen-lockfile

# Build Detox native framework cache locally to speed up.
echo "[2/7] (Optional) Build Detox framework cache"
(npx -y detox@20.40.2 clean-framework-cache || true)
(npx -y detox@20.40.2 build-framework-cache || true)

# Ensure ios/ exists (Expo prebuild). Keep --no-install to avoid reinstalling Pods here.
echo "[3/7] Expo prebuild (ios)"
npx expo prebuild --platform ios --no-install

# Install CocoaPods
if [ -d "$ios_dir" ]; then
  echo "[4/7] Installing CocoaPods"
  pushd "$ios_dir" >/dev/null
  pod install
  popd >/dev/null
else
  echo "[warn] iOS directory not found at $ios_dir"
fi

# Build the app for Detox
echo "[5/7] Build Detox app (ios.sim.debug)"
pnpm exec detox build -c ios.sim.debug

# Start Metro on the pinned port and wait until ready
echo "[6/7] Start Metro (Expo) on port $RCT_METRO_PORT"
metro_log="$log_dir/metro.local.log"
# Kill any existing Metro on that port to avoid confusion
if lsof -i tcp:"$RCT_METRO_PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Found existing process on port $RCT_METRO_PORT. Terminating..."
  lsof -i tcp:"$RCT_METRO_PORT" -sTCP:LISTEN -t | xargs -I {} kill -9 {} || true
fi

nohup npx expo start --dev-client --no-interactive --clear --port "$RCT_METRO_PORT" \
  > "$metro_log" 2>&1 &
METRO_PID=$!
echo "Metro PID: $METRO_PID (logs: $metro_log)"

cleanup() {
  echo "[cleanup] Stopping Metro (PID $METRO_PID)"
  if ps -p "$METRO_PID" >/dev/null 2>&1; then
    kill "$METRO_PID" || true
    sleep 1
    if ps -p "$METRO_PID" >/dev/null 2>&1; then
      kill -9 "$METRO_PID" || true
    fi
  fi
}
trap cleanup EXIT

# Wait until Metro responds
status_url="http://localhost:$RCT_METRO_PORT/status"
echo "Waiting for Metro at $status_url ..."
for i in {1..60}; do
  if curl -sSf "$status_url" | grep -q "packager-status:running"; then
    echo "Metro is running."
    break
  fi
  sleep 2
  if [ $i -eq 60 ]; then
    echo "Metro did not become ready in time." >&2
    exit 1
  fi
done

# Determine which test command to run
# Usage examples:
#   bash scripts/detox-ios-local.sh                 # defaults to e2e:createFlow:tests
#   bash scripts/detox-ios-local.sh e2e:ios         # runs `pnpm run e2e:ios`
#   bash scripts/detox-ios-local.sh e2e:importFlow:tests  # runs `pnpm run e2e:importFlow:tests`
#   bash scripts/detox-ios-local.sh "detox test -c ios.sim.debug --reuse e2e/tests/setup.test.js"
if [ $# -gt 0 ]; then
  # If the argument contains a space, treat it as a full command; otherwise, treat it as an npm script name.
  if [[ "$*" == *" "* ]]; then
    RUN_TEST_CMD="$*"
  else
    RUN_TEST_CMD="pnpm run $1"
  fi
else
  RUN_TEST_CMD="pnpm run e2e:createFlow:tests"
fi

# Run the Detox tests
echo "[7/7] Run Detox tests: $RUN_TEST_CMD"
/bin/bash -lc "$RUN_TEST_CMD"

popd >/dev/null
