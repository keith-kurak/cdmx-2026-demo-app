import {
  Button,
  FieldGroup,
  Host,
  Icon,
  Row,
  Spacer,
  Text,
  TextInput,
  useNativeState,
} from '@expo/ui';
import { useLocalSearchParams } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { AddEntryRow } from '@/components/add-entry-row';
import { AppHeader } from '@/components/app-header';
import { DayNav } from '@/components/day-nav';
import { PlatformIcon } from '@/components/platform-icon';
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

const TRASH_ICON = Icon.select({
  ios: 'trash',
  android: import('@expo/material-symbols/delete.xml'),
});

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { selectedDate, items, entries } = useTrackerState();
  const item = getItem(items, id);
  // Native text state: typing does not re-render this screen
  const value = useNativeState('');

  if (!item) return null;

  const dateKey = localDateKey(selectedDate);
  const dayEntries = getEntriesForDay(entries, item.id, dateKey);
  const total = getDayTotal(entries, item.id, dateKey);

  function handleAdd(text: string) {
    const n = parseFloat(text);
    if (isNaN(n)) return;
    addEntry(item!.id, n);
    value.set('');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <AppHeader title={item.label} showBack />
      <DayNav />
      <Host style={styles.host}>
        <FieldGroup>
          <FieldGroup.Section title="Total">
            <Text textStyle={{ fontSize: 32, fontWeight: 'bold' }}>{`${total} ${item.unit}`}</Text>
          </FieldGroup.Section>

          <FieldGroup.Section title="Add entry">
            {Platform.OS === 'android' ? (
              <AddEntryRow value={value} placeholder={`Enter ${item.unit}`} onAdd={handleAdd} />
            ) : (
              <>
                <TextInput
                  value={value}
                  keyboardType="decimal-pad"
                  placeholder={`Enter ${item.unit}`}
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />
                <Button label="Add" onPress={() => handleAdd(value.get())} />
              </>
            )}
          </FieldGroup.Section>

          <FieldGroup.Section title="Entries">
            {dayEntries.length === 0 ? (
              <Text textStyle={{ color: theme.muted }}>No entries for this day</Text>
            ) : (
              dayEntries.map((entry) => (
                <Row key={entry.id} spacing={12} alignment="center">
                  <Text>{`${entry.value} ${item.unit}`}</Text>
                  <Spacer />
                  <Text textStyle={{ color: theme.muted }}>{formatTime(entry.ts)}</Text>
                  <PlatformIcon
                    name={TRASH_ICON}
                    webName="trash-outline"
                    size={22}
                    color={theme.danger}
                    onPress={() => deleteEntry(entry.id)}
                    accessibilityLabel="Delete entry"
                  />
                </Row>
              ))
            )}
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  host: {
    flex: 1,
  },
});
