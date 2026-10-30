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

- [Expo documentation](https://docs.expo.dev/)
- [Expo UI universal components](https://docs.expo.dev/versions/latest/sdk/ui/universal/)
- [Native tabs in Expo Router](https://docs.expo.dev/router/advanced/native-tabs/)
- [Expo Widgets](https://docs.expo.dev/versions/latest/sdk/widgets/)
- [`with-widgets` example](https://github.com/expo/examples/tree/master/with-widgets)
- [EAS Workflows pre-packaged jobs](https://docs.expo.dev/eas/workflows/pre-packaged-jobs/)
- [Repack an app](https://docs.expo.dev/build-reference/repack/)
- [Share an Expo Simulators session or start one from a link](https://docs.expo.dev/preview/simulators/how-to/hand-off-a-session/) (Expo Simulators is a limited-access preview)
- [keith-kurak/brooks-expo](https://github.com/keith-kurak/brooks-expo): the source of the agentic workflows
