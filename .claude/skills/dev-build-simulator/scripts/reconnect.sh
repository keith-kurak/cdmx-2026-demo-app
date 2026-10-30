#!/usr/bin/env bash
# Points the app in the running session at the current Metro tunnel. Use it after
# Metro restarts, because each restart gets a new tunnel host.
#
# Usage: bash .claude/skills/dev-build-simulator/scripts/reconnect.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
. .claude/skills/dev-build-simulator/scripts/lib.sh

read -r SESSION_ID SESSION_STATUS <<<"$(session_status) "
[ "${SESSION_STATUS:-}" = "IN_PROGRESS" ] \
  || die "no running session (status: '${SESSION_STATUS:-none}'); run connect.sh instead"

HOST=$(wait_for_tunnel_host)
echo "tunnel host: $HOST"
warm_bundle

# --relaunch restarts the app, so pass the dev menu keys again or the onboarding returns.
LAUNCH_ARGS=()
for arg in "${DEV_MENU_KEYS[@]}"; do LAUNCH_ARGS+=(--launch-args "$arg"); done
"${EAS[@]}" simulator:exec agent-device open "$BUNDLE_ID" "$(dev_client_url "$HOST")" \
  --platform ios --relaunch "${LAUNCH_ARGS[@]}" >/dev/null
# A deep link from the controller can raise "Open in ...?"; this is a no-op without it.
"${EAS[@]}" simulator:exec agent-device alert accept 2500 --platform ios >/dev/null 2>&1 || true
"${EAS[@]}" simulator:exec agent-device wait text "Tracker" 240000 >/dev/null \
  || die "the app did not show 'Tracker'; take a screenshot to see the screen"
mkdir -p .sim
"${EAS[@]}" simulator:exec agent-device screenshot .sim/dev-build.png >/dev/null
echo "session $SESSION_ID reconnected; screenshot: .sim/dev-build.png"
