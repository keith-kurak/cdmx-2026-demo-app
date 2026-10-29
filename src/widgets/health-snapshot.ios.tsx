import { Gauge, HStack, Image, ProgressView, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  frame,
  gaugeStyle,
  monospacedDigit,
  opacity,
  tint,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type { SFSymbol } from 'sf-symbols-typescript';

import { SAMPLE_HEALTH_SNAPSHOT } from './health-snapshot.sample';
import type { HealthSnapshotProps, HealthSnapshotTracker } from './health-snapshot.types';

// Runs in the widget runtime. Only the body of this function is bundled, so every helper
// and constant must be declared inside it.
const HealthSnapshot = (props: HealthSnapshotProps, environment: WidgetEnvironment) => {
  'widget';
  const family = environment.widgetFamily ?? 'systemMedium';
  const white = '#FFFFFF';

  const header = (
    <HStack spacing={6}>
      <Image systemName="heart.fill" size={13} color="#FB7185" />
      <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(white)]}>
        {family === 'systemSmall' ? 'Today' : "Today's Health"}
      </Text>
      <Spacer />
      {family !== 'systemSmall' && (
        <Text
          modifiers={[font({ size: 12, weight: 'medium' }), foregroundStyle(white), opacity(0.6)]}>
          {props.dateLabel}
        </Text>
      )}
    </HStack>
  );

  // The icon sits on top of the ring. The gauge's own value label does not render in widgets.
  const ring = (tracker: HealthSnapshotTracker, size: number) => (
    <ZStack modifiers={[frame({ width: size, height: size })]}>
      <Gauge
        value={tracker.progress}
        modifiers={[
          gaugeStyle('circularCapacity'),
          tint(tracker.color),
          frame({ width: size, height: size }),
        ]}
      />
      <Image systemName={tracker.symbol as SFSymbol} size={size * 0.32} color={tracker.color} />
    </ZStack>
  );

  const background = containerBackground(
    {
      type: 'linearGradient',
      colors: ['#1E1B4B', '#0F172A'],
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 1, y: 1 },
    },
    'widget'
  );
  const rootModifiers = [background, widgetURL('cdmx2026demoapp://')];

  // Small: 2x2 grid of goal rings
  if (family === 'systemSmall') {
    const [a, b, c, d] = props.trackers;
    return (
      <VStack alignment="leading" spacing={10} modifiers={rootModifiers}>
        {header}
        <Spacer />
        <HStack spacing={14}>
          {a && ring(a, 52)}
          {b && ring(b, 52)}
        </HStack>
        <HStack spacing={14}>
          {c && ring(c, 52)}
          {d && ring(d, 52)}
        </HStack>
      </VStack>
    );
  }

  // Large: one row per tracker with a progress bar
  if (family === 'systemLarge') {
    return (
      <VStack alignment="leading" spacing={14} modifiers={rootModifiers}>
        {header}
        {props.trackers.map((tracker) => (
          <HStack key={tracker.id} spacing={12}>
            {ring(tracker, 44)}
            <VStack alignment="leading" spacing={6}>
              <HStack alignment="firstTextBaseline" spacing={4}>
                <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(white)]}>
                  {tracker.label}
                </Text>
                <Spacer />
                <Text
                  modifiers={[
                    font({ size: 20, weight: 'bold', design: 'rounded' }),
                    monospacedDigit(),
                    foregroundStyle(white),
                  ]}>
                  {tracker.valueText}
                </Text>
                <Text
                  modifiers={[font({ size: 12 }), foregroundStyle(white), opacity(0.6)]}>
                  {tracker.unit}
                </Text>
              </HStack>
              <ProgressView value={tracker.progress} modifiers={[tint(tracker.color)]} />
            </VStack>
          </HStack>
        ))}
        <Spacer />
      </VStack>
    );
  }

  // Medium: four rings with values underneath
  return (
    <VStack alignment="leading" spacing={12} modifiers={rootModifiers}>
      {header}
      <Spacer />
      <HStack spacing={0}>
        {props.trackers.map((tracker) => (
          <VStack key={tracker.id} spacing={6} modifiers={[frame({ maxWidth: Infinity })]}>
            {ring(tracker, 50)}
            <Text
              modifiers={[
                font({ size: 17, weight: 'bold', design: 'rounded' }),
                monospacedDigit(),
                foregroundStyle(white),
              ]}>
              {tracker.valueText}
            </Text>
            <Text
              modifiers={[
                font({ size: 11, weight: 'medium' }),
                foregroundStyle(white),
                opacity(0.6),
              ]}>
              {tracker.unit}
            </Text>
          </VStack>
        ))}
      </HStack>
      <Spacer />
    </VStack>
  );
};

export default createWidget('HealthSnapshot', HealthSnapshot, SAMPLE_HEALTH_SNAPSHOT);
