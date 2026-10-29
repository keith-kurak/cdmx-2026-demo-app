import type { HealthSnapshotProps } from './health-snapshot.types';

// Web has no home screen widgets. iOS and Android use the platform files.
const HealthSnapshot = {
  updateSnapshot(_props: HealthSnapshotProps) {},
};

export default HealthSnapshot;
