import { Host, List, ListItem, Text } from '@expo/ui';
import { StyleSheet } from 'react-native';

import { PlatformIcon } from './platform-icon';
import { TotalText } from './total-text';
import type { TrackerListProps } from './tracker-list.types';

import { useTheme } from '@/hooks/use-theme';

// Universal Expo UI list for Android and web. Edit mode is only on iOS (see tracker-list.ios.tsx).
export function TrackerList({ items, getTotal, onPressItem }: TrackerListProps) {
  const theme = useTheme();

  return (
    <Host style={styles.host}>
      <List>
        <List.ForEach data={items} keyExtractor={(item) => item.id} recycling={false}>
          {({ item }) => (
            <ListItem onPress={() => onPressItem(item.id)}>
              <ListItem.Leading>
                <PlatformIcon
                  name={item.materialIcon}
                  webName={item.icon}
                  size={24}
                  color={item.color}
                />
              </ListItem.Leading>
              <Text>{item.label}</Text>
              <ListItem.Trailing>
                <TotalText total={getTotal(item.id)} unit={item.unit} unitColor={theme.muted} />
              </ListItem.Trailing>
            </ListItem>
          )}
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
