import type { HealthSnapshotProps } from './health-snapshot.types';

// Shown in the widget gallery and before the app sends real data.
export const SAMPLE_HEALTH_SNAPSHOT: HealthSnapshotProps = {
  dateLabel: 'Today',
  trackers: [
    {
      id: 'water',
      label: 'Water',
      valueText: '6',
      unit: 'glasses',
      progress: 0.75,
      color: '#0EA5E9',
      symbol: 'drop.fill',
    },
    {
      id: 'steps',
      label: 'Steps',
      valueText: '6.4k',
      unit: 'steps',
      progress: 0.64,
      color: '#F97316',
      symbol: 'figure.walk',
    },
    {
      id: 'exercise',
      label: 'Exercise',
      valueText: '30',
      unit: 'min',
      progress: 1,
      color: '#A855F7',
      symbol: 'dumbbell.fill',
    },
    {
      id: 'sleep',
      label: 'Sleep',
      valueText: '7.5',
      unit: 'hrs',
      progress: 0.94,
      color: '#6366F1',
      symbol: 'bed.double.fill',
    },
  ],
};
