import { Icon } from '@expo/ui';

import type { PlatformIconProps } from './platform-icon.types';

// Native Expo UI icon: SF Symbol on iOS, Material Symbol on Android.
// Must be rendered inside an Expo UI Host.
export function PlatformIcon({ name, size, color, onPress, accessibilityLabel }: PlatformIconProps) {
  return (
    <Icon
      name={name}
      size={size}
      color={color}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
