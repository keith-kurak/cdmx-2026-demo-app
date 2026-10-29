// Props for the "Today's Health" home screen widget. Everything the widget shows comes in
// through these props: widget code runs in an isolated runtime with no access to app state.
export type HealthSnapshotTracker = {
  id: string;
  label: string;
  // Already formatted for display, for example "6.4k"
  valueText: string;
  unit: string;
  // 0 to 1, progress toward the daily goal
  progress: number;
  color: string;
  // SF Symbol name, used on iOS
  symbol: string;
};

export type HealthSnapshotProps = {
  dateLabel: string;
  trackers: HealthSnapshotTracker[];
};
