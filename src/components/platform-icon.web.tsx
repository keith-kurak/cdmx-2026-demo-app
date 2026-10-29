import { RNHostView } from '@expo/ui';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable } from 'react-native';

import type { PlatformIconProps } from './platform-icon.types';

// The Expo UI Icon does not render on web, so use Ionicons instead.
export function PlatformIcon({
  webName,
  size,
  color,
  onPress,
  accessibilityLabel,
}: PlatformIconProps) {
  return (
    <RNHostView matchContents>
      <Pressable onPress={onPress} disabled={!onPress} accessibilityLabel={accessibilityLabel}>
        <Ionicons name={webName} size={size} color={color} />
      </Pressable>
    </RNHostView>
  );
}
