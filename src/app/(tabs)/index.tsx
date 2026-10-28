import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ITEMS, getDayTotal, localDateKey, useTrackerState } from '@/lib/tracker';

export default function TrackerScreen() {
  const { selectedDate, entries } = useTrackerState();
  const dateKey = localDateKey(selectedDate);

  return (
    <View style={styles.container}>
      <AppHeader title="Tracker" showDayNav />
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/item/[id]', params: { id: item.id } }} asChild>
            <Pressable style={styles.row}>
              <View style={styles.labelCol}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
              </View>
              <Text style={styles.total}>{getDayTotal(entries, item.id, dateKey)}</Text>
              <Text style={styles.chevron}>{'>'}</Text>
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
    backgroundColor: '#F2F2F2',
  },
  list: {
    padding: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  labelCol: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    color: '#222222',
  },
  unit: {
    fontSize: 13,
    color: '#888888',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  chevron: {
    fontSize: 16,
    color: '#AAAAAA',
  },
});
