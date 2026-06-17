import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';
import { fetchP0FeeApiEvidenceRows, formatP0FeeApiEvidenceReport } from '../domain/p0FeeApiEvidence';
import { normalizeP0ServiceKey } from '../domain/p0ServiceKey';

const serviceKey = normalizeP0ServiceKey(process.env.DATA_GO_KR_SERVICE_KEY);
const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS, { serviceKey });

console.log(formatP0FeeApiEvidenceReport(evidenceRows));

if (!serviceKey) {
  console.log('Blockers: DATA_GO_KR_SERVICE_KEY 미설정');
}

process.exitCode = 1;
