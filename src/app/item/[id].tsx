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

import { AppHeader } from '@/components/app-header';
import { useTheme } from '@/hooks/use-theme';
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
  const theme = useTheme();
  const { selectedDate, entries } = useTrackerState();
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState('');

  if (!item) return null;

  const dateKey = localDateKey(selectedDate);
  const dayEntries = getEntriesForDay(entries, item.id, dateKey);
  const total = getDayTotal(entries, item.id, dateKey);
  const cardColors = { backgroundColor: theme.card, borderColor: theme.border };

  function handleAdd() {
    const n = parseFloat(value);
    if (isNaN(n)) return;
    addEntry(item!.id, n);
    setValue('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.screen }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title={item.label} showBack showDayNav />

      <View style={[styles.totalBox, cardColors]}>
        <Text style={[styles.totalLabel, { color: theme.muted }]}>Total</Text>
        <Text style={[styles.totalValue, { color: theme.label }]}>
          {total} {item.unit}
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.label },
          ]}
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          placeholder={`Enter ${item.unit}`}
          placeholderTextColor={theme.faint}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Pressable style={[styles.addButton, { backgroundColor: theme.header }]} onPress={handleAdd}>
          <Text style={[styles.addButtonText, { color: theme.onHeader }]}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={dayEntries}
        keyExtractor={(entry) => String(entry.id)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 12 }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>No entries for this day</Text>
        }
        renderItem={({ item: entry }) => (
          <View style={[styles.entryRow, cardColors]}>
            <Text style={[styles.entryValue, { color: theme.label }]}>
              {entry.value} {item.unit}
            </Text>
            <Text style={[styles.entryTime, { color: theme.muted }]}>{formatTime(entry.ts)}</Text>
            <Pressable onPress={() => deleteEntry(entry.id)}>
              <Text style={[styles.delete, { color: theme.danger }]}>Delete</Text>
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
  },
  totalBox: {
    margin: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    borderRadius: 4,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 12,
    gap: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 16,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    gap: 12,
  },
  entryValue: {
    flex: 1,
    fontSize: 16,
  },
  entryTime: {
    fontSize: 14,
  },
  delete: {
    fontSize: 14,
  },
});
