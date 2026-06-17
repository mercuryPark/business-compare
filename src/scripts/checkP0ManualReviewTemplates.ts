import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  auditP0ManualReviewTemplateFiles,
  formatP0ManualReviewTemplateAuditReport,
} from '../domain/p0ManualReviewTemplateAudit';
import type { P0ManualReviewTemplateFile } from '../domain/p0ManualReviewTemplates';

const templateDir = 'docs/research/p0-manual-review-records';
const entries = await readdir(templateDir);
const markdownFiles = entries.filter((entry) => entry.endsWith('.md')).sort();
const files: P0ManualReviewTemplateFile[] = [];

for (const entry of markdownFiles) {
  const path = join(templateDir, entry);
  files.push({
    path,
    content: await readFile(path, 'utf8'),
  });
}

const report = auditP0ManualReviewTemplateFiles(files);

console.log(formatP0ManualReviewTemplateAuditReport(report));

if (!report.ready) {
  process.exitCode = 1;
}
