import { getDayTotal, localDateKey, type Entry, type TrackerItem } from '@/lib/tracker';
import HealthSnapshot from '@/widgets/health-snapshot';
import type { HealthSnapshotTracker } from '@/widgets/health-snapshot.types';

// Trackers shown on the widget, with a daily goal for each progress ring
const WIDGET_GOALS: Record<string, number> = {
  water: 8,
  steps: 10000,
  exercise: 30,
  sleep: 8,
};

function formatValue(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(value);
}

// Sends today's totals to the home screen widget. The widget always shows today,
// whichever day is selected in the app.
export function syncHealthWidget(items: TrackerItem[], entries: Entry[]) {
  const todayKey = localDateKey(new Date());
  const trackers: HealthSnapshotTracker[] = items
    .filter((item) => item.id in WIDGET_GOALS)
    .map((item) => {
      const total = getDayTotal(entries, item.id, todayKey);
      return {
        id: item.id,
        label: item.label,
        valueText: formatValue(total),
        unit: item.unit,
        progress: Math.min(total / WIDGET_GOALS[item.id], 1),
        color: item.color,
        symbol: item.symbol,
      };
    });

  HealthSnapshot.updateSnapshot({
    dateLabel: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    trackers,
  });
}
