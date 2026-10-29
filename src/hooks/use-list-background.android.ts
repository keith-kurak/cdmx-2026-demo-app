import { useMaterialColors } from '@expo/ui/jetpack-compose';

// Material list items and form groups use the surface color on Android.
export function useListBackground() {
  return useMaterialColors().surface;
}
