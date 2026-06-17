import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  formatP0ManualReviewTemplateImportReport,
  importP0ManualReviewTemplateFiles,
} from '../domain/p0ManualReviewTemplateImport';
import type { P0ManualReviewTemplateFile } from '../domain/p0ManualReviewTemplates';

const templateDir = 'docs/research/p0-manual-review-records';
const entries = await readdir(templateDir);
const files: P0ManualReviewTemplateFile[] = [];

for (const entry of entries.filter((item) => item.endsWith('.md')).sort()) {
  const path = join(templateDir, entry);
  files.push({
    path,
    content: await readFile(path, 'utf8'),
  });
}

const report = importP0ManualReviewTemplateFiles(files);

console.log(formatP0ManualReviewTemplateImportReport(report));

if (!report.ready) {
  process.exitCode = 1;
}
