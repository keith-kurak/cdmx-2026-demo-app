import { Button, Row, TextInput } from '@expo/ui';
import { weight } from '@expo/ui/jetpack-compose/modifiers';

import type { AddEntryRowProps } from './add-entry-row.types';

// Input and Add button on one line, as a single Material list row.
export function AddEntryRow({ value, placeholder, onAdd }: AddEntryRowProps) {
  return (
    <Row spacing={8} alignment="center">
      <TextInput
        value={value}
        keyboardType="decimal-pad"
        placeholder={placeholder}
        returnKeyType="done"
        onSubmitEditing={onAdd}
        modifiers={[weight(1)]}
      />
      <Button label="Add" onPress={() => onAdd(value.get())} />
    </Row>
  );
}
