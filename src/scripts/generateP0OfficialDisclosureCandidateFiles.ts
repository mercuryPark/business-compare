import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { fetchP0OfficialDisclosureCandidates } from '../domain/p0OfficialDisclosureApiFetch';
import {
  buildP0OfficialDisclosureCandidateFiles,
  formatP0OfficialDisclosureCandidateFileGenerationReport,
} from '../domain/p0OfficialDisclosureCandidateFiles';
import { normalizeP0ServiceKey } from '../domain/p0ServiceKey';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const serviceKey = normalizeP0ServiceKey(process.env.DATA_GO_KR_SERVICE_KEY);

if (!serviceKey) {
  console.log('P0 official disclosure candidate files: BLOCKED');
  console.log('Files: 0');
  console.log('');
  console.log('Blockers: DATA_GO_KR_SERVICE_KEY 미설정');
  process.exitCode = 1;
} else {
  const report = await fetchP0OfficialDisclosureCandidates(P0_GYEONGGI_SOURCE_SNAPSHOTS, { serviceKey });
  const files = buildP0OfficialDisclosureCandidateFiles(report.rows);

  for (const file of files) {
    await mkdir(dirname(file.path), { recursive: true });
    await writeFile(file.path, file.content, 'utf8');
  }

  console.log(formatP0OfficialDisclosureCandidateFileGenerationReport(files));
  process.exitCode = 1;
}
