import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { brands } from '../domain/brands';
import { buildP0ManualReviewTemplateFiles } from '../domain/p0ManualReviewTemplates';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const files = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);

for (const file of files) {
  await mkdir(dirname(file.path), { recursive: true });
  await writeFile(file.path, file.content, 'utf8');
}

console.log(`Generated ${files.length} P0 manual review template files`);
for (const file of files) {
  console.log(`- ${file.path}`);
}
