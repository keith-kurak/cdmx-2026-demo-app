import type { Ionicons } from '@react-native-vector-icons/ionicons';
import { ComponentProps, useSyncExternalStore } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

// Simple in-memory store for the demo. Data resets when the app reloads.

export type TrackerItem = {
  id: string;
  label: string;
  unit: string;
  // Icon color, readable in both light and dark mode
  color: string;
  // Ionicons glyph for web
  icon: ComponentProps<typeof Ionicons>['name'];
  // SF Symbol for iOS
  symbol: SFSymbol;
  // Material Symbol XML drawable for Android
  materialIcon: ImageSourcePropType;
};

export type Entry = {
  id: number;
  itemId: string;
  dateKey: string; // YYYY-MM-DD
  value: number;
  ts: number;
};

const DEFAULT_ITEMS: TrackerItem[] = [
  {
    id: 'water',
    label: 'Water',
    unit: 'glasses',
    color: '#0EA5E9',
    icon: 'water',
    symbol: 'drop.fill',
    materialIcon: require('@expo/material-symbols/water_drop.xml'),
  },
  {
    id: 'coffee',
    label: 'Coffee',
    unit: 'cups',
    color: '#A16207',
    icon: 'cafe',
    symbol: 'cup.and.saucer.fill',
    materialIcon: require('@expo/material-symbols/coffee.xml'),
  },
  {
    id: 'fruit',
    label: 'Fruit',
    unit: 'servings',
    color: '#EF4444',
    icon: 'nutrition',
    symbol: 'basket.fill',
    materialIcon: require('@expo/material-symbols/nutrition.xml'),
  },
  {
    id: 'veggies',
    label: 'Veggies',
    unit: 'servings',
    color: '#22C55E',
    icon: 'leaf',
    symbol: 'leaf.fill',
    materialIcon: require('@expo/material-symbols/eco.xml'),
  },
  {
    id: 'steps',
    label: 'Steps',
    unit: 'steps',
    color: '#F97316',
    icon: 'footsteps',
    symbol: 'figure.walk',
    materialIcon: require('@expo/material-symbols/directions_walk.xml'),
  },
  {
    id: 'exercise',
    label: 'Exercise',
    unit: 'min',
    color: '#A855F7',
    icon: 'barbell',
    symbol: 'dumbbell.fill',
    materialIcon: require('@expo/material-symbols/fitness_center.xml'),
  },
  {
    id: 'outdoors',
    label: 'Outdoors',
    unit: 'min',
    color: '#EAB308',
    icon: 'sunny',
    symbol: 'sun.max.fill',
    materialIcon: require('@expo/material-symbols/sunny.xml'),
  },
  {
    id: 'meditation',
    label: 'Meditation',
    unit: 'min',
    color: '#14B8A6',
    icon: 'flower',
    symbol: 'figure.mind.and.body',
    materialIcon: require('@expo/material-symbols/self_improvement.xml'),
  },
  {
    id: 'reading',
    label: 'Reading',
    unit: 'pages',
    color: '#EC4899',
    icon: 'book',
    symbol: 'book.fill',
    materialIcon: require('@expo/material-symbols/menu_book.xml'),
  },
  {
    id: 'sleep',
    label: 'Sleep',
    unit: 'hrs',
    color: '#6366F1',
    icon: 'bed',
    symbol: 'bed.double.fill',
    materialIcon: require('@expo/material-symbols/bed.xml'),
  },
];

export function getItem(items: TrackerItem[], id: string) {
  return items.find((item) => item.id === id);
}

// --- Date utilities ---

export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, n: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}

export function formatDateLabel(date: Date): string {
  const todayKey = localDateKey(new Date());
  const dateKey = localDateKey(date);
  if (dateKey === todayKey) return 'Today';
  if (dateKey === localDateKey(addDays(new Date(), -1))) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// --- Store ---

type State = {
  selectedDate: Date;
  items: TrackerItem[];
  entries: Entry[];
};

function midnightToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

let nextId = 1;
let state: State = {
  selectedDate: midnightToday(),
  items: DEFAULT_ITEMS,
  entries: seedEntries(),
};
const listeners = new Set<() => void>();

function setState(update: Partial<State>) {
  state = { ...state, ...update };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTrackerState() {
  // Third argument is required for server rendering on web
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function changeDay(n: number) {
  setState({ selectedDate: addDays(state.selectedDate, n) });
}

export function addEntry(itemId: string, value: number) {
  const entry: Entry = {
    id: nextId++,
    itemId,
    dateKey: localDateKey(state.selectedDate),
    value,
    ts: Date.now(),
  };
  setState({ entries: [...state.entries, entry] });
}

export function deleteEntry(id: number) {
  setState({ entries: state.entries.filter((e) => e.id !== id) });
}

export function deleteItems(ids: string[]) {
  setState({
    items: state.items.filter((item) => !ids.includes(item.id)),
    entries: state.entries.filter((e) => !ids.includes(e.itemId)),
  });
}

// Matches SwiftUI's onMove: `destination` is an index in the list before the move.
export function moveItems(sourceIndices: number[], destination: number) {
  const moving = sourceIndices.map((i) => state.items[i]);
  const isMoving = (item: TrackerItem) => moving.includes(item);
  setState({
    items: [
      ...state.items.slice(0, destination).filter((item) => !isMoving(item)),
      ...moving,
      ...state.items.slice(destination).filter((item) => !isMoving(item)),
    ],
  });
}

export function getEntriesForDay(entries: Entry[], itemId: string, dateKey: string) {
  return entries.filter((e) => e.itemId === itemId && e.dateKey === dateKey);
}

export function getDayTotal(entries: Entry[], itemId: string, dateKey: string) {
  return getEntriesForDay(entries, itemId, dateKey).reduce((sum, e) => sum + e.value, 0);
}

// --- Seed data so the demo has something to show ---

function seedEntries(): Entry[] {
  const seed: Record<string, number[]> = {
    water: [2, 3, 1],
    coffee: [1, 1],
    fruit: [1, 2],
    veggies: [3],
    steps: [6400],
    exercise: [30],
    outdoors: [20, 15],
    meditation: [10],
    reading: [25],
    sleep: [7.5],
  };
  const entries: Entry[] = [];
  for (let daysAgo = 3; daysAgo >= 0; daysAgo--) {
    const date = addDays(midnightToday(), -daysAgo);
    for (const [itemId, values] of Object.entries(seed)) {
      // Leave a couple of gaps on older days
      if (daysAgo > 0 && (itemId.length + daysAgo) % 4 === 0) continue;
      values.forEach((value, i) => {
        entries.push({
          id: nextId++,
          itemId,
          dateKey: localDateKey(date),
          value,
          ts: date.getTime() + (8 + i * 4) * 60 * 60 * 1000,
        });
      });
    }
  }
  return entries;
}
