import { Host } from '@expo/ui';
import { Button, HStack, Image, List, Spacer, Text } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  contentShape,
  environment,
  font,
  foregroundStyle,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import { StyleSheet } from 'react-native';

import type { TrackerListProps } from './tracker-list.types';

import { deleteItems, moveItems, type TrackerItem } from '@/lib/tracker';

// Native SwiftUI List. In edit mode, iOS shows selection circles, delete buttons, and
// reorder handles on each row.
export function TrackerList({
  items,
  getTotal,
  onPressItem,
  editing,
  selection,
  onSelectionChange,
}: TrackerListProps) {
  function renderRow(item: TrackerItem) {
    return (
      <HStack spacing={12} modifiers={[contentShape(shapes.rectangle())]}>
        <Image
          systemName={item.symbol}
          size={20}
          color={item.color}
          modifiers={[frame({ width: 32 })]}
        />
        <Text>{item.label}</Text>
        <Spacer />
        <HStack spacing={4} alignment="firstTextBaseline">
          <Text modifiers={[font({ textStyle: 'title3', weight: 'semibold' })]}>
            {String(getTotal(item.id))}
          </Text>
          <Text
            modifiers={[
              font({ textStyle: 'subheadline' }),
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}>
            {item.unit}
          </Text>
        </HStack>
        {!editing && (
          <Image
            systemName="chevron.right"
            size={14}
            modifiers={[foregroundStyle({ type: 'hierarchical', style: 'tertiary' })]}
          />
        )}
      </HStack>
    );
  }

  return (
    <Host style={styles.host}>
      <List
        selection={selection}
        onSelectionChange={(keys) => onSelectionChange(keys.map(String))}
        modifiers={[environment('editMode', editing ? 'active' : 'inactive')]}>
        <List.ForEach
          data={items}
          keyExtractor={(item) => item.id}
          // Short list: render every row so edits and reorders never show placeholders.
          recycling={false}
          onDelete={(indices) => deleteItems(indices.map((i) => items[i].id))}
          onMove={moveItems}>
          {({ item }) =>
            // In edit mode, taps select the row instead of opening it.
            editing ? (
              renderRow(item)
            ) : (
              <Button onPress={() => onPressItem(item.id)} modifiers={[buttonStyle('plain')]}>
                {renderRow(item)}
              </Button>
            )
          }
        </List.ForEach>
      </List>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },
});
