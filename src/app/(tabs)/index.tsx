import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { useTheme } from '@/hooks/use-theme';
import { ITEMS, getDayTotal, localDateKey, useTrackerState } from '@/lib/tracker';

export default function TrackerScreen() {
  const theme = useTheme();
  const { selectedDate, entries } = useTrackerState();
  const dateKey = localDateKey(selectedDate);

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <AppHeader title="Tracker" showDayNav />
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/item/[id]', params: { id: item.id } }} asChild>
            <Pressable
              // Link asChild requires a flat style object, not an array.
              style={StyleSheet.flatten([
                styles.row,
                { backgroundColor: theme.card, borderColor: theme.border },
              ])}>
              <View style={[styles.iconBox, { backgroundColor: theme.accentSoft }]}>
                <Ionicons name={item.icon} size={22} color={theme.accent} />
              </View>
              <View style={styles.labelCol}>
                <Text style={[styles.label, { color: theme.label }]}>{item.label}</Text>
                <Text style={[styles.unit, { color: theme.muted }]}>{item.unit}</Text>
              </View>
              <Text style={[styles.total, { color: theme.label }]}>
                {getDayTotal(entries, item.id, dateKey)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.faint} />
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: {
    flex: 1,
  },
  label: {
    fontSize: 18,
  },
  unit: {
    fontSize: 13,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
