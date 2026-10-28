import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { changeDay, formatDateLabel, localDateKey, useTrackerState } from '@/lib/tracker';

export const HeaderColor = '#2563EB';

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  showDayNav?: boolean;
};

type IconButtonProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
};

function IconButton({ icon, onPress, disabled = false, accessibilityLabel }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[styles.iconButton, disabled && styles.disabled]}>
      <Ionicons name={icon} size={24} color="white" />
    </Pressable>
  );
}

// A plain, hand-rolled header bar. Intentionally generic for the first version of the demo.
export function AppHeader({ title, showBack = false, showDayNav = false }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { selectedDate } = useTrackerState();
  const isToday = localDateKey(selectedDate) === localDateKey(new Date());

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.navBar}>
        <View style={styles.side}>
          {showBack && (
            <IconButton icon="arrow-back" onPress={() => router.back()} accessibilityLabel="Back" />
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side} />
      </View>

      {showDayNav && (
        <View style={styles.dayNav}>
          <IconButton
            icon="chevron-back"
            onPress={() => changeDay(-1)}
            accessibilityLabel="Previous day"
          />
          <Text style={styles.dayLabel}>{formatDateLabel(selectedDate)}</Text>
          <IconButton
            icon="chevron-forward"
            onPress={() => changeDay(1)}
            disabled={isToday}
            accessibilityLabel="Next day"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HeaderColor,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  side: {
    width: 48,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dayNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
  },
  dayLabel: {
    color: 'white',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.3,
  },
});
