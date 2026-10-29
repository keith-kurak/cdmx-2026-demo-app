import type { TrackerItem } from '@/lib/tracker';

export type TrackerListProps = {
  items: TrackerItem[];
  getTotal: (itemId: string) => number;
  onPressItem: (itemId: string) => void;
  // Edit mode (iOS only): multi-select to delete, drag to reorder
  editing: boolean;
  selection: string[];
  onSelectionChange: (selection: string[]) => void;
};
