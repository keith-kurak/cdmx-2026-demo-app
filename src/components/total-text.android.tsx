import { Text } from '@expo/ui/jetpack-compose';

import type { TotalTextProps } from './total-text.types';

// One Compose Text with a nested span, so the number and the unit share a baseline.
export function TotalText({ total, unit, unitColor }: TotalTextProps) {
  return (
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
      {String(total)}
      <Text color={unitColor} style={{ fontSize: 14, fontWeight: 'normal' }}>
        {` ${unit}`}
      </Text>
    </Text>
  );
}
