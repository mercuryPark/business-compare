import { brands } from '../domain/brands';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS, validateP0SourceSnapshotAlignment } from '../domain/p0SourceSnapshots';

const mismatches = validateP0SourceSnapshotAlignment(brands);

if (mismatches.length === 0) {
  console.log('P0 source snapshot alignment: OK');
  console.log(`Brands checked: ${P0_GYEONGGI_SOURCE_SNAPSHOTS.length}`);
} else {
  console.error('P0 source snapshot alignment: FAILED');
  for (const mismatch of mismatches) {
    console.error(
      `- ${mismatch.brandId} ${mismatch.field}: expected ${mismatch.expected}, actual ${mismatch.actual ?? 'missing'}`,
    );
  }
  process.exitCode = 1;
}
