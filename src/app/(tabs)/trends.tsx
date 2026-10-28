import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';

export default function TrendsScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Trends" />
      <View style={styles.body}>
        <Text style={styles.text}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#888888',
  },
});
