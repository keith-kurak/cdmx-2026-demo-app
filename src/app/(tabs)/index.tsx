import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppHeader, IconButton, TextButton } from '@/components/app-header';
import { DayNav } from '@/components/day-nav';
import { TrackerList } from '@/components/tracker-list';
import { useTheme } from '@/hooks/use-theme';
import { deleteItems, getDayTotal, localDateKey, useTrackerState } from '@/lib/tracker';

export default function TrackerScreen() {
  const theme = useTheme();
  const { selectedDate, items, entries } = useTrackerState();
  const dateKey = localDateKey(selectedDate);
  const [editing, setEditing] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  function toggleEditing() {
    setEditing(!editing);
    setSelection([]);
  }

  function handleDeleteSelected() {
    deleteItems(selection);
    setSelection([]);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <AppHeader
        title="Tracker"
        headerLeft={
          editing && (
            <IconButton
              icon="trash-outline"
              onPress={handleDeleteSelected}
              disabled={selection.length === 0}
              accessibilityLabel="Delete selected trackers"
            />
          )
        }
        headerRight={
          // Edit mode uses the native SwiftUI list, so it is iOS only
          Platform.OS === 'ios' && (
            <TextButton label={editing ? 'Done' : 'Edit'} onPress={toggleEditing} />
          )
        }
      />
      <DayNav />
      <TrackerList
        items={items}
        getTotal={(itemId) => getDayTotal(entries, itemId, dateKey)}
        onPressItem={(id) => router.push({ pathname: '/item/[id]', params: { id } })}
        editing={editing}
        selection={selection}
        onSelectionChange={setSelection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
