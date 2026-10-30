---
name: dev-build-simulator
description: Start an iOS EAS Simulator session with this app's development build, connected to a live Metro dev server through the Expo tunnel, and hand the user the web preview. Use when asked for a dev build on a cloud simulator, a web preview against a live dev server, or Fast Refresh on a remote device. For Expo Go use the cloud-simulator skill instead; for anything not covered here load expo:eas-simulator.
---

# Dev build on a cloud simulator with a live dev server

Four steps, each one command. Run everything from the project root in Git Bash (the Bash tool). EAS sessions cost credits, and the Metro tunnel URL is publicly reachable while Metro runs, so stop both when the task is done.

## 0. Check out `03-widgets`

The user wants the iOS web preview to run the `03-widgets` branch. Before you start Metro, run `git checkout 03-widgets`, unless the user names a different branch for this run.

If the working tree has uncommitted changes, Git carries them over or refuses the checkout. Do not stash, reset, or discard anything to force it. Tell the user which files block the checkout and ask what to do.

## 1. Start Metro with the tunnel

The tunnel exposes this project's Metro server on port 8083 so the dev build on EAS Simulator can load its bundle. Start Metro with the Bash tool and `run_in_background: true` (timeout 7200000):

```bash
EXPO_UNSTABLE_TUNNEL_V2=1 npx expo start --tunnel --dev-client --port 8083 > "$TEMP/metro-8083.log" 2>&1
```

- Do **not** set `CI=1`. It turns off file watching, so Fast Refresh stops working.
- Use port 8083. The user may run their own server on 8081; do not touch it.
- Metro serves the checked-out branch, so do step 0 first.

## 2. Connect the simulator

```bash
bash .claude/skills/dev-build-simulator/scripts/connect.sh [minutes] [name]
```

The script waits for the tunnel host, compiles the iOS bundle locally, and starts the session. In that session it installs the dev build, hides the dev menu, and opens the Metro URL. Then it attaches agent-device, waits for "Tracker", and saves `.sim/dev-build.png`. Read the screenshot to confirm the screen. Give the user the printed **web preview** URL. If `.env.eas-simulator` already has a running session, the script reuses it and only reconnects the app.

Defaults: 60 minutes, named "Live dev server web preview".

## 3. Stop

```bash
bash .claude/skills/dev-build-simulator/scripts/stop.sh
```

It stops the session, resets `.env.eas-simulator`, and stops the Metro node processes on port 8083. Stopping the background shell task alone leaves Metro running.

## When Metro crashes

This machine's DNS fails from time to time. Metro then exits with code 7 and `getaddrinfo ENOTFOUND <host>.on.expo.app` at the end of `$TEMP/metro-8083.log`. The session keeps running, but the app has no server.

1. Start Metro again (step 1). It gets a **new** tunnel host.
2. Run `bash .claude/skills/dev-build-simulator/scripts/reconnect.sh`. It points the app at the new host and passes the dev menu keys again.

Do this once. If it fails again, or agent-device reports `Remote daemon is unavailable`, stop and tell the user. Do not loop on retries.

## Facts for this project

- **Dev build:** `01f6108f-d59e-4ab5-b47f-9380d488b863`, iOS Simulator, `development-simulator` profile, built from `03-widgets`. It has every native module that `main` through `04-agentic-workflows` use, so it can load any of those branches. It expires about 90 days after 2026-10-28. To use a newer build, set `DEV_BUILD_ID`. To find one, run `npx --yes eas-cli@latest build:list --platform ios --profile development-simulator --status finished --limit 1 --json`. If a branch adds native code, that branch needs a new dev build.
- **App:** bundle ID `com.keithco.cdmx2026demoapp`, URL scheme `cdmx2026demoapp`. Every branch shows "Tracker" on launch.
- **Fast Refresh check:** edit a visible string, wait for it with `simulator:exec agent-device wait text "..."`, then revert the edit with `git checkout -- <file>`. Using `sed` to revert leaves a CRLF-only diff.
- **Run agent-device only through `npx --yes eas-cli@latest simulator:exec`.** Called directly, it does not load the session settings and can use a local simulator by mistake.
