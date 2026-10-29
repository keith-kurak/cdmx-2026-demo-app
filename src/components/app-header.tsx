import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { ComponentProps, ReactNode } from 'react';
import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
};

type IconButtonProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  // Defaults to the header foreground color
  color?: ColorValue;
};

export function IconButton({
  icon,
  onPress,
  disabled = false,
  accessibilityLabel,
  color,
}: IconButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[styles.iconButton, disabled && styles.disabled]}>
      <Ionicons name={icon} size={24} color={color ?? theme.onHeader} />
    </Pressable>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={8}
      style={styles.textButtonContainer}>
      <Text style={[styles.textButton, { color: theme.onHeader }]}>{label}</Text>
    </Pressable>
  );
}

// A plain, hand-rolled header bar. Intentionally generic for the first version of the demo.
export function AppHeader({ title, showBack = false, headerLeft, headerRight }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.header }]}>
      <View style={styles.navBar}>
        <View style={styles.side}>
          {showBack && (
            <IconButton icon="arrow-back" onPress={() => router.back()} accessibilityLabel="Back" />
          )}
          {headerLeft}
        </View>
        <Text style={[styles.title, { color: theme.onHeader }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side}>{headerRight}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  side: {
    width: 64,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonContainer: {
    height: 40,
    justifyContent: 'center',
  },
  textButton: {
    fontSize: 17,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});
