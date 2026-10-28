import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { useTheme } from '@/hooks/use-theme';

export default function TrendsScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <AppHeader title="Trends" />
      <View style={styles.body}>
        <Text style={[styles.text, { color: theme.muted }]}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
