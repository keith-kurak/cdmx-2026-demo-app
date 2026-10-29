import { PlatformColor } from 'react-native';

// SwiftUI List and Form use the grouped background on iOS.
export function useListBackground() {
  return PlatformColor('systemGroupedBackground');
}
