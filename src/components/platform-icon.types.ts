import type { IconName } from '@expo/ui';
import type { Ionicons } from '@react-native-vector-icons/ionicons';
import type { ComponentProps } from 'react';

export type PlatformIconProps = {
  // SF Symbol on iOS, Material Symbol XML drawable on Android
  name: IconName;
  // Fallback glyph for web, where the Expo UI Icon does not render
  webName: ComponentProps<typeof Ionicons>['name'];
  size: number;
  color: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};
