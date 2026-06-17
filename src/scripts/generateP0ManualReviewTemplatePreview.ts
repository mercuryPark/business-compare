import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { brands } from '../domain/brands';
import { fetchP0FeeApiEvidenceRows } from '../domain/p0FeeApiEvidence';
import { buildP0FeeApiTemplateSuggestionReport } from '../domain/p0FeeApiTemplateSuggestions';
import { fetchP0OfficialDisclosureCandidates } from '../domain/p0OfficialDisclosureApiFetch';
import {
  buildP0ManualReviewTemplateSuggestionPatchFiles,
  formatP0ManualReviewTemplateSuggestionPatchReport,
} from '../domain/p0ManualReviewTemplateSuggestionPatch';
import { buildP0ManualReviewTemplateFiles } from '../domain/p0ManualReviewTemplates';
import { normalizeP0ServiceKey } from '../domain/p0ServiceKey';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const serviceKey = normalizeP0ServiceKey(process.env.DATA_GO_KR_SERVICE_KEY);

if (!serviceKey) {
  console.log('P0 manual review template preview: BLOCKED');
  console.log('Files: 0');
  console.log('');
  console.log('Blockers: DATA_GO_KR_SERVICE_KEY 미설정');
  process.exitCode = 1;
} else {
  const disclosureReport = await fetchP0OfficialDisclosureCandidates(P0_GYEONGGI_SOURCE_SNAPSHOTS, { serviceKey });
  const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS, { serviceKey });
  const suggestionReport = buildP0FeeApiTemplateSuggestionReport(evidenceRows);
  const templates = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);
  const files = buildP0ManualReviewTemplateSuggestionPatchFiles(templates, suggestionReport.rows, {
    disclosureRows: disclosureReport.rows,
  });

  for (const file of files) {
    await mkdir(dirname(file.path), { recursive: true });
    await writeFile(file.path, file.content, 'utf8');
  }

  console.log(formatP0ManualReviewTemplateSuggestionPatchReport(files));
  process.exitCode = 1;
}
