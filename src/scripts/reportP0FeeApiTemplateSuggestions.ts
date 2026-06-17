import { fetchP0FeeApiEvidenceRows } from '../domain/p0FeeApiEvidence';
import {
  buildP0FeeApiTemplateSuggestionReport,
  formatP0FeeApiTemplateSuggestionReport,
} from '../domain/p0FeeApiTemplateSuggestions';
import { normalizeP0ServiceKey } from '../domain/p0ServiceKey';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const serviceKey = normalizeP0ServiceKey(process.env.DATA_GO_KR_SERVICE_KEY);

if (!serviceKey) {
  console.log(formatP0FeeApiTemplateSuggestionReport(buildP0FeeApiTemplateSuggestionReport([])));
  console.log('Blockers: DATA_GO_KR_SERVICE_KEY 미설정');
  process.exitCode = 1;
} else {
  const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS, { serviceKey });
  console.log(formatP0FeeApiTemplateSuggestionReport(buildP0FeeApiTemplateSuggestionReport(evidenceRows)));
  process.exitCode = 1;
}
