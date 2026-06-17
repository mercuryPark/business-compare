import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';
import { createP0ReviewRecordDrafts, formatP0ReviewRecordDrafts } from '../domain/p0ReviewRecordDrafts';

const drafts = createP0ReviewRecordDrafts(P0_GYEONGGI_SOURCE_SNAPSHOTS);

console.log(formatP0ReviewRecordDrafts(drafts));
console.log('');
console.log('Drafts are not promotion-ready until FTC original disclosure URLs, fee values, and second reviewer sign-off are completed.');

process.exitCode = 1;
