import type { ObservableState } from '@expo/ui';

export type AddEntryRowProps = {
  value: ObservableState<string>;
  placeholder: string;
  onAdd: (text: string) => void;
};
