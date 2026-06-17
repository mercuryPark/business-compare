import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';
import { fetchP0FeeApiEvidence, formatP0FeeApiFetchReport } from '../domain/p0FeeApiFetch';

const report = await fetchP0FeeApiEvidence(P0_GYEONGGI_SOURCE_SNAPSHOTS, {
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
});

console.log(formatP0FeeApiFetchReport(report));

if (!report.readyForReviewRecordInput) {
  process.exitCode = 1;
}
