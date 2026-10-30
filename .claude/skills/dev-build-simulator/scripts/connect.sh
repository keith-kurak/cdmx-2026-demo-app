#!/usr/bin/env bash
# Starts (or reuses) an iOS EAS Simulator session with the development build,
# connected to the Metro tunnel. Metro must already run with --tunnel on METRO_PORT.
#
# Usage: bash .claude/skills/dev-build-simulator/scripts/connect.sh [minutes] [name]
#   minutes  session max duration (default 60)
#   name     session name (default "Live dev server web preview")
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
. .claude/skills/dev-build-simulator/scripts/lib.sh

MINUTES="${1:-60}"
NAME="${2:-Live dev server web preview}"

HOST=$(wait_for_tunnel_host)
echo "tunnel host: $HOST"
warm_bundle

# Reuse a live session from the dotenv; otherwise start a new one.
read -r SESSION_ID SESSION_STATUS <<<"$(session_status) "
if [ "${SESSION_STATUS:-}" = "IN_PROGRESS" ]; then
  echo "reusing session $SESSION_ID; reconnecting the app"
  exec bash .claude/skills/dev-build-simulator/scripts/reconnect.sh
fi

printf '# managed by eas-cli\n' > .env.eas-simulator
LAUNCH_ARGS=()
for arg in "${DEV_MENU_KEYS[@]}"; do LAUNCH_ARGS+=(--launch-arg "$arg"); done

# The JSON contains tokens: parse it here and print only the id and preview URL.
"${EAS[@]}" simulator:start --platform ios --type agent-device \
  --build-id "$DEV_BUILD_ID" "${LAUNCH_ARGS[@]}" \
  --open-url "$(dev_client_url "$HOST")" \
  --name "$NAME" --max-duration-minutes "$MINUTES" --non-interactive --json 2>/dev/null \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const s=JSON.parse(d);console.log('session: '+s.id);console.log('web preview: '+s.remoteConfig.webPreviewUrl)})" \
  || die "simulator:start failed; run it without --json to see why"

# The launch above creates no controller session; attach without relaunching.
"${EAS[@]}" simulator:exec agent-device open "$BUNDLE_ID" --foreground --platform ios >/dev/null 2>&1 || true
"${EAS[@]}" simulator:exec agent-device wait text "Tracker" 240000 >/dev/null \
  || die "the app did not show 'Tracker'; take a screenshot to see the screen"
mkdir -p .sim
"${EAS[@]}" simulator:exec agent-device screenshot .sim/dev-build.png >/dev/null
echo "app is running from Metro; screenshot: .sim/dev-build.png"
grep -h "iOS Bundled" "${TEMP:-/tmp}/metro-${METRO_PORT}.log" 2>/dev/null | tail -1 || true
