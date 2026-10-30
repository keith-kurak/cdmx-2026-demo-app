#!/usr/bin/env bash
# Stops the simulator session in .env.eas-simulator and the Metro server on METRO_PORT.
#
# Usage: bash .claude/skills/dev-build-simulator/scripts/stop.sh
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
. .claude/skills/dev-build-simulator/scripts/lib.sh

if grep -q EAS_SIMULATOR_SESSION_ID .env.eas-simulator 2>/dev/null; then
  "${EAS[@]}" simulator:stop --non-interactive 2>&1 | tail -1
fi
printf '# managed by eas-cli\n' > .env.eas-simulator

# Stopping the background shell task can leave the Metro node processes running.
# Only processes whose command line names this port are stopped.
powershell -NoProfile -Command "
  Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" |
    Where-Object { \$_.CommandLine -match 'expo.*start.*--port ${METRO_PORT}' } |
    ForEach-Object { Stop-Process -Id \$_.ProcessId -Force; \"stopped Metro process \$(\$_.ProcessId)\" }
"
curl -s -m 5 -o /dev/null "http://127.0.0.1:${METRO_PORT}/status" \
  && echo "warning: port ${METRO_PORT} still answers" \
  || echo "port ${METRO_PORT} is closed"
