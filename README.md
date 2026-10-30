# CDMX 2026 Expo demo app

A small daily health tracker built with [Expo](https://expo.dev). Each branch adds one step on top of the previous one, so you can compare the branches to see what each step changes.

## Run the app

This project uses [Bun](https://bun.sh).

```bash
bun install
bunx expo start
```

The `main` and `02-expo-ui` branches run in [Expo Go](https://expo.dev/go). From `03-widgets` on, the app has native code that Expo Go does not include, so you need a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

## What each branch shows

### `main`: the starting point

A tracker app built only with React Native components:

- JavaScript tabs from `expo-router/js-tabs`
- A hand-rolled header and day picker
- A `FlatList` of trackers
- A `TextInput` form to add entries

All data is in memory and resets when the app reloads.

### `02-expo-ui`: native UI with Expo UI

The same screens, rebuilt with [Expo UI](https://docs.expo.dev/versions/latest/sdk/ui/universal/) (`@expo/ui`):

- **iOS tracker list:** a SwiftUI `List` with native edit mode. Tap **Edit** to select trackers and delete them, swipe a row to delete it, or drag a row to reorder it.
- **Android and web:** the universal Expo UI `List` and `ListItem`.
- **Entry form:** `FieldGroup`, `TextInput`, and `Button` from Expo UI.
- **Icons:** SF Symbols on iOS, and Material Symbols from `@expo/material-symbols` on Android.
- **Tabs:** [native tabs](https://docs.expo.dev/router/advanced/native-tabs/) from `expo-router/native-tabs`.

### `03-widgets`: a home screen widget

A "Today's Health" home screen widget built with [`expo-widgets`](https://docs.expo.dev/versions/latest/sdk/widgets/):

- **iOS:** SwiftUI layouts in small, medium, and large sizes, with progress rings.
- **Android:** a Jetpack Compose layout.
- **Live data:** the app sends today's totals to the widget with `updateSnapshot`, so the widget updates when you add an entry.
- **EAS Build profiles:** development builds, and an iOS Simulator preview build.

### `04-agentic-workflows`: agents in CI

[EAS Workflows](https://docs.expo.dev/eas/workflows/pre-packaged-jobs/) that use Claude Code agents and cloud simulators. They are adapted from [keith-kurak/brooks-expo](https://github.com/keith-kurak/brooks-expo).

- **`expo-bot-issue`:** an agent tries to reproduce a GitHub issue on a cloud simulator. If it reproduces the issue, a second agent opens a fix pull request.
- **`expo-bot-verify`:** an agent reviews a pull request and tests it on a cloud simulator. It uses [repack](https://docs.expo.dev/build-reference/repack/) to put the pull request's JavaScript into an existing build, so no full native build is needed.
- **`testflight-feedback` and `testflight-crash`:** turn TestFlight feedback and crash reports into GitHub issues, then start `expo-bot-issue`.
- **`expo-bot-bridge`:** a GitHub Action that starts these workflows from `@expo-bot` comments.
- **`deploy`:** sends store builds or over-the-air updates when you push to `main`.

These workflows need tokens and project setup before they run. See the comments at the top of each file in `.eas/workflows/`.

## Resources

Links from the talk, in the order of the slides. Start with the [Expo documentation](https://docs.expo.dev/).

### Agents and Expo

- [AI agents and Expo overview](https://docs.expo.dev/agents/)
- [Claude Code and Expo](https://docs.expo.dev/agents/claude/)
- [Codex and Expo](https://docs.expo.dev/agents/codex/)
- [Cursor and Expo](https://docs.expo.dev/agents/cursor/)
- [Expo Skills for AI agents](https://docs.expo.dev/skills/): install them with `claude plugin install expo@claude-plugins-official`. This also registers the Expo MCP Server.
- [AGENTS.md from the create-expo template](https://raw.githubusercontent.com/expo/expo/main/packages/create-expo/template/agent-files/AGENTS.md)
- [Docs index for LLMs (llms.txt)](https://docs.expo.dev/llms.txt)

### Expo MCP

- [Using Model Context Protocol (MCP) with Expo](https://docs.expo.dev/eas/ai/mcp/)

### Expo UI, widgets, and development builds

- [Expo UI](https://docs.expo.dev/versions/latest/sdk/ui/): native SwiftUI and Jetpack Compose components
- [Native tabs in Expo Router](https://docs.expo.dev/router/advanced/native-tabs/)
- [Expo Widgets](https://docs.expo.dev/versions/latest/sdk/widgets/): home screen widgets and iOS Live Activities
- [`with-widgets` example](https://github.com/expo/examples/tree/master/with-widgets)
- [Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/)

### Expo Simulators (EAS Simulator)

Expo Simulators is a limited-access preview. Its CLI commands are experimental, and commands and flags can change.

- [Introduction to Expo Simulators](https://docs.expo.dev/preview/simulators/introduction/)
- [Get started](https://docs.expo.dev/preview/simulators/get-started/)
- [Install your app](https://docs.expo.dev/preview/simulators/how-to/install-your-app/)
- [Let an AI coding agent verify a change on a remote simulator](https://docs.expo.dev/preview/simulators/how-to/verify-a-change-with-an-agent/)
- [Share a session or start one from a link](https://docs.expo.dev/preview/simulators/how-to/hand-off-a-session/)
- [CLI reference](https://docs.expo.dev/preview/simulators/reference/cli/)
- [REST API reference](https://docs.expo.dev/preview/simulators/reference/rest-api/)
- [Troubleshooting](https://docs.expo.dev/preview/simulators/troubleshooting/)
- [agent-device and Expo](https://docs.expo.dev/agents/agent-device/)
- [Argent and Expo](https://docs.expo.dev/agents/argent/)
- Blog: [What if your app could fix itself?](https://expo.dev/blog/agent-fixes-bugs-on-eas-simulator)
- Blog: [You don't need a Mac to develop iOS apps](https://expo.dev/blog/build-ios-apps-on-windows-with-cloud-simulators)
- Article: [Share a new build with a simulator link](https://expo.dev/articles/cloud-simulators/share-a-simulator-link)
- Article: [Run Expo Simulators in GitHub Actions](https://expo.dev/articles/cloud-simulators/run-expo-simulators-in-github-actions)

### EAS Workflows (validation, triage, and fix)

- [Introduction to EAS Workflows](https://docs.expo.dev/eas/workflows/introduction/)
- [Workflow syntax reference](https://docs.expo.dev/eas/workflows/syntax/)
- [`on.app_store_connect` triggers](https://docs.expo.dev/eas/workflows/syntax/#onapp_store_connect): `beta_feedback.types` supports `crash` and `screenshot` (TestFlight feedback)
- [Pre-packaged jobs](https://docs.expo.dev/eas/workflows/pre-packaged-jobs/)
- [Repack an app](https://docs.expo.dev/build-reference/repack/)
- [keith-kurak/brooks-expo](https://github.com/keith-kurak/brooks-expo): the source of the agentic workflows in `04-agentic-workflows`

### Expo Modules API

- [Expo Modules API: Overview](https://docs.expo.dev/modules/overview/)
- [Get started](https://docs.expo.dev/modules/get-started/)
- [Module API reference](https://docs.expo.dev/modules/module-api/)
