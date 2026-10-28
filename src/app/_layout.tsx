import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  // Load the icon font up front so it is included in the server-rendered HTML on web.
  // Without this, icons render a glyph on the server but an empty string on the client,
  // which causes a hydration mismatch.
  useFonts({ Ionicons: require('@react-native-vector-icons/ionicons/fonts/Ionicons.ttf') });

  // Match the native root view to the theme so Android screen transitions
  // don't flash white behind the screens in dark mode.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.screen);
  }, [theme.screen]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={[styles.root, { backgroundColor: theme.screen }]}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
