import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { changeDay, formatDateLabel, localDateKey, useTrackerState } from '@/lib/tracker';

export const HeaderColor = '#2563EB';

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  showDayNav?: boolean;
};

// A plain, hand-rolled header bar. Intentionally generic for the first version of the demo.
export function AppHeader({ title, showBack = false, showDayNav = false }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { selectedDate } = useTrackerState();
  const isToday = localDateKey(selectedDate) === localDateKey(new Date());

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.titleRow}>
        {showBack && (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.headerText}>{'< Back'}</Text>
          </Pressable>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {showDayNav && (
        <View style={styles.dayNav}>
          <Pressable onPress={() => changeDay(-1)} style={styles.dayButton}>
            <Text style={styles.headerText}>{'<'}</Text>
          </Pressable>
          <Text style={styles.dayLabel}>{formatDateLabel(selectedDate)}</Text>
          <Pressable
            onPress={() => changeDay(1)}
            disabled={isToday}
            style={[styles.dayButton, isToday && styles.disabled]}>
            <Text style={styles.headerText}>{'>'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HeaderColor,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    paddingVertical: 4,
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dayLabel: {
    color: 'white',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.3,
  },
});
