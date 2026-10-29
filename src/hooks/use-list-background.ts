import { useTheme } from '@/hooks/use-theme';

// Background color of the Expo UI lists and forms, so React Native views next to them blend in.
// Web: the lists render on the screen background.
export function useListBackground() {
  return useTheme().screen;
}
