import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader, HeaderColor } from '@/components/app-header';
import {
  addEntry,
  deleteEntry,
  formatTime,
  getDayTotal,
  getEntriesForDay,
  getItem,
  localDateKey,
  useTrackerState,
} from '@/lib/tracker';

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getItem(id);
  const { selectedDate, entries } = useTrackerState();
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState('');

  if (!item) return null;

  const dateKey = localDateKey(selectedDate);
  const dayEntries = getEntriesForDay(entries, item.id, dateKey);
  const total = getDayTotal(entries, item.id, dateKey);

  function handleAdd() {
    const n = parseFloat(value);
    if (isNaN(n)) return;
    addEntry(item!.id, n);
    setValue('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title={item.label} showBack showDayNav />

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {total} {item.unit}
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          placeholder={`Enter ${item.unit}`}
          placeholderTextColor="#AAAAAA"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={dayEntries}
        keyExtractor={(entry) => String(entry.id)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 12 }]}
        ListEmptyComponent={<Text style={styles.empty}>No entries for this day</Text>}
        renderItem={({ item: entry }) => (
          <View style={styles.entryRow}>
            <Text style={styles.entryValue}>
              {entry.value} {item.unit}
            </Text>
            <Text style={styles.entryTime}>{formatTime(entry.ts)}</Text>
            <Pressable onPress={() => deleteEntry(entry.id)}>
              <Text style={styles.delete}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  totalBox: {
    margin: 12,
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#888888',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
  },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222222',
  },
  addButton: {
    backgroundColor: HeaderColor,
    borderRadius: 4,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 12,
    gap: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 16,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 12,
    gap: 12,
  },
  entryValue: {
    flex: 1,
    fontSize: 16,
    color: '#222222',
  },
  entryTime: {
    fontSize: 14,
    color: '#888888',
  },
  delete: {
    fontSize: 14,
    color: '#DC2626',
  },
});
