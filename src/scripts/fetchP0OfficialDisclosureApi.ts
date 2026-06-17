import {
  fetchP0OfficialDisclosureCandidates,
  formatP0OfficialDisclosureFetchReport,
} from '../domain/p0OfficialDisclosureApiFetch';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const report = await fetchP0OfficialDisclosureCandidates(P0_GYEONGGI_SOURCE_SNAPSHOTS, {
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
});

console.log(formatP0OfficialDisclosureFetchReport(report));

process.exitCode = 1;
