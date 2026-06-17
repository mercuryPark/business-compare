import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { fetchP0FeeApiEvidenceRows } from '../domain/p0FeeApiEvidence';
import {
  buildP0FeeApiEvidenceFiles,
  formatP0FeeApiEvidenceFileGenerationReport,
} from '../domain/p0FeeApiEvidenceFiles';
import { normalizeP0ServiceKey } from '../domain/p0ServiceKey';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const serviceKey = normalizeP0ServiceKey(process.env.DATA_GO_KR_SERVICE_KEY);

if (!serviceKey) {
  console.log('P0 fee API evidence files: BLOCKED');
  console.log('Files: 0');
  console.log('');
  console.log('Blockers: DATA_GO_KR_SERVICE_KEY 미설정');
  process.exitCode = 1;
} else {
  const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS, { serviceKey });
  const files = buildP0FeeApiEvidenceFiles(evidenceRows);

  for (const file of files) {
    await mkdir(dirname(file.path), { recursive: true });
    await writeFile(file.path, file.content, 'utf8');
  }

  console.log(formatP0FeeApiEvidenceFileGenerationReport(files));
}
