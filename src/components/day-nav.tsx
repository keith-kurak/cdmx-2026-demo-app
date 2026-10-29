import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/app-header';
import { useListBackground } from '@/hooks/use-list-background';
import { useTheme } from '@/hooks/use-theme';
import { changeDay, formatDateLabel, localDateKey, useTrackerState } from '@/lib/tracker';

// Day picker that sits under the header, on the same background as the list below it.
export function DayNav() {
  const theme = useTheme();
  const backgroundColor = useListBackground();
  const { selectedDate } = useTrackerState();
  const isToday = localDateKey(selectedDate) === localDateKey(new Date());

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <IconButton
        icon="chevron-back"
        onPress={() => changeDay(-1)}
        accessibilityLabel="Previous day"
        color={theme.muted}
      />
      <Text style={[styles.label, { color: theme.label }]}>{formatDateLabel(selectedDate)}</Text>
      <IconButton
        icon="chevron-forward"
        onPress={() => changeDay(1)}
        disabled={isToday}
        accessibilityLabel="Next day"
        color={theme.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
