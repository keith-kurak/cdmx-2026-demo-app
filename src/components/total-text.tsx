import { RNHostView } from '@expo/ui';
import { StyleSheet, Text } from 'react-native';

import type { TotalTextProps } from './total-text.types';

// Web: nested React Native Text, so the number and the unit share a baseline.
export function TotalText({ total, unit, unitColor }: TotalTextProps) {
  return (
    <RNHostView matchContents>
      <Text style={styles.total}>
        {total}
        <Text style={[styles.unit, { color: unitColor }]}> {unit}</Text>
      </Text>
    </RNHostView>
  );
}

const styles = StyleSheet.create({
  total: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
});
