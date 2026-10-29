import { Box, Column, LinearProgressIndicator, Row, Spacer, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  cornerRadius,
  fillMaxSize,
  fillMaxWidth,
  height,
  paddingAll,
  size,
} from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

import { SAMPLE_HEALTH_SNAPSHOT } from './health-snapshot.sample';
import type { HealthSnapshotProps } from './health-snapshot.types';

// Runs in the widget runtime. Android widgets support only a subset of Compose components
// and modifiers, and only the body of this function is bundled.
const HealthSnapshot = (props: HealthSnapshotProps) => {
  'widget';
  const white = '#FFFFFF';
  const muted = '#94A3B8';

  return (
    <Column
      verticalArrangement={{ spacedBy: 10 }}
      modifiers={[fillMaxSize(), cornerRadius(24), background('#1E1B4B'), paddingAll(16)]}>
      <Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
        <Box modifiers={[size(10, 10), cornerRadius(5), background('#FB7185')]} />
        <Spacer modifiers={[size(8, 1)]} />
        <Text color={white} style={{ fontSize: 14, fontWeight: 'bold' }}>
          {"Today's Health"}
        </Text>
        <Spacer modifiers={[fillMaxWidth()]} />
      </Row>
      {props.trackers.map((tracker) => (
        <Column key={tracker.id} verticalArrangement={{ spacedBy: 4 }} modifiers={[fillMaxWidth()]}>
          <Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
            <Box modifiers={[size(8, 8), cornerRadius(4), background(tracker.color)]} />
            <Spacer modifiers={[size(8, 1)]} />
            <Text color={white} style={{ fontSize: 13, fontWeight: '500' }}>
              {tracker.label}
            </Text>
            <Spacer modifiers={[size(8, 1)]} />
            <Text color={white} style={{ fontSize: 15, fontWeight: 'bold' }}>
              {tracker.valueText}
            </Text>
            <Spacer modifiers={[size(4, 1)]} />
            <Text color={muted} style={{ fontSize: 11 }}>
              {tracker.unit}
            </Text>
          </Row>
          <LinearProgressIndicator
            progress={tracker.progress}
            color={tracker.color}
            trackColor="#334155"
            modifiers={[fillMaxWidth(), height(6), cornerRadius(3)]}
          />
        </Column>
      ))}
    </Column>
  );
};

export default createWidget('HealthSnapshot', HealthSnapshot, SAMPLE_HEALTH_SNAPSHOT);
