# Shared settings and helpers for the dev-build-simulator scripts.
# Source this file; do not run it.

# iOS Simulator development build from 03-widgets. It has every native module that
# main, 02-expo-ui, 03-widgets, and 04-agentic-workflows use. Override with DEV_BUILD_ID.
DEV_BUILD_ID="${DEV_BUILD_ID:-01f6108f-d59e-4ab5-b47f-9380d488b863}"
METRO_PORT="${METRO_PORT:-8083}"
BUNDLE_ID="com.keithco.cdmx2026demoapp"
SCHEME="cdmx2026demoapp"
EAS=(npx --yes eas-cli@latest)

# Hide the dev menu onboarding, auto-open, and floating button. agent-device takes
# them as --launch-args pairs; simulator:start takes them as --launch-arg pairs.
DEV_MENU_KEYS=(
  -EXDevMenuIsOnboardingFinished 1
  -EXDevMenuShowsAtLaunch 0
  -EXDevMenuShowFloatingActionButton 0
)

die() { echo "error: $*" >&2; exit 1; }

# Prints the Metro manifest host for iOS, or nothing when Metro is not ready.
manifest_host() {
  curl -s -m 10 -H "expo-platform: ios" -H "accept: application/expo+json,application/json" \
    "http://127.0.0.1:${METRO_PORT}/" 2>/dev/null \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).extra.expoClient.hostUri)}catch(e){}})"
}

# Waits up to 3 minutes for the tunnel host (*.on.expo.app) and prints it.
wait_for_tunnel_host() {
  local host=""
  for _ in $(seq 1 36); do
    host=$(manifest_host)
    case "$host" in *on.expo.app*) echo "$host"; return 0 ;; esac
    sleep 5
  done
  die "Metro on port ${METRO_PORT} has no tunnel host (last value: '${host}'). Is Metro running with --tunnel?"
}

# Requests the iOS bundle from local Metro, so the simulator does not wait for the compile.
warm_bundle() {
  local url
  url=$(curl -s -m 20 -H "expo-platform: ios" -H "accept: application/expo+json,application/json" \
    "http://127.0.0.1:${METRO_PORT}/" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).launchAsset.url.replace(/^https?:\/\/[^/]+/,'http://127.0.0.1:${METRO_PORT}')))")
  curl -s -m 400 -o /dev/null -w "bundle compiled: HTTP %{http_code} in %{time_total}s\n" "$url"
}

dev_client_url() {
  echo "${SCHEME}://expo-development-client/?url=https%3A%2F%2F$1"
}

# Prints "<id> <status>" for the session in .env.eas-simulator, or nothing.
session_status() {
  grep -q EAS_SIMULATOR_SESSION_ID .env.eas-simulator 2>/dev/null || return 0
  "${EAS[@]}" simulator:get --json --non-interactive 2>/dev/null \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const s=JSON.parse(d);console.log(s.id+' '+s.status)}catch(e){}})"
}
