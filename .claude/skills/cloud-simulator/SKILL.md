---
name: cloud-simulator
description: Run this app on an iOS EAS cloud simulator in Expo Go and drive it with the globally installed agent-device, from this Windows machine. Use when asked to run, screenshot, or click through the app on a simulator or device. Project-specific adaptation of the expo:eas-simulator skill — load that skill for anything not covered here (dev builds, recordings, crash logs, troubleshooting).
---

# Cloud simulator for this project

This host is Windows. It has no Xcode, and the local Android emulator is too heavy to run. Use an **iOS EAS Simulator** session with **Expo Go**. EAS sessions cost credits, so stop a session when the task is done.

Facts for this project:

- EAS project: `@keithco/cdmx-2026-demo-app`. EAS Simulator is enabled for `keithco`.
- Run commands in **Git Bash** (the Bash tool), from the project root.
- `agent-device` is installed globally. Call it as `agent-device`, not `npx agent-device@latest`. It works through `simulator:exec` on Windows.
- `.env.eas-simulator` (session token) and `.sim/` (screenshots) are gitignored.
- Expo Go runs this app. `npx @expo/agent-cli status` says Expo Go is not compatible because of `@react-native-vector-icons/ionicons`. That is a static check — the icons render correctly in Expo Go.

Shorthand used below: `EAS="npx --yes eas-cli@latest"`.

## 1. Find the dev server

The user usually has a dev server with a tunnel running already. Do not start a second one.

```bash
npx --yes @expo/agent-cli@latest status          # "dev server  running on http://127.0.0.1:8081 ..."
curl -s -H "expo-platform: ios" -H "accept: application/expo+json,application/json" http://127.0.0.1:8081/ \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).extra.expoClient.hostUri))"
# → <id>.on.expo.app   (the tunnel host)
```

If no dev server runs, ask the user to start one with a tunnel.

## 2. Start the session with Expo Go

If `.env.eas-simulator` names a session, check it with `$EAS simulator:get --json` first. Reuse it if it is `IN_PROGRESS` and belongs to this work.

```bash
$EAS simulator:availability --json --non-interactive
$EAS simulator:start --platform ios --type agent-device --expo-go \
  --open-url "exp://<tunnel host>" \
  --name "<purpose in 3-6 words>" --max-duration-minutes 30 --non-interactive --json
```

The JSON output contains `agentDeviceRemoteSessionToken`. Never print it. Redact token fields before you show output.

Give the user `remoteConfig.webPreviewUrl` so they can watch.

## 3. Drive the app

```bash
$EAS simulator:exec agent-device open host.exp.Exponent --foreground --platform ios
```

- If Expo Go shows its Home screen, press the `cdmx-2026-demo-app` button under "RECENTLY OPENED".
- Wait for the app: `$EAS simulator:exec agent-device wait text "Tracker" 120000`.
- The first launch shows the Expo Go developer menu onboarding. Press "Continue", then "Close".
- Refs go stale after a change. If a press fails, retry with the pinned ref the error prints (for example `@e20~s835400`).
- Screenshots: `$EAS simulator:exec agent-device screenshot .sim/<name>.png`, then read the PNG.
- Fast Refresh is on in Expo Go, so code edits show on the device without a rebuild.
- Dark mode: `$EAS simulator:exec agent-device settings appearance dark` (or `light`). The app follows the change without a reload.
- If the screen stays blank after you fix a render error, reload the app: press the Expo Go gear button (`press 366 88 --settle`), then `press 'label="Reload"' --settle`.

Full verb list: `$EAS simulator:exec agent-device help` and `help workflow`. Use `help <topic>`, not `--help`.

## 4. Stop

When the task is done (unless the user asked to keep the preview open):

```bash
$EAS simulator:stop
printf '# managed by eas-cli\n' > .env.eas-simulator
```

Do not stop the user's dev server.
