import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import {
  buildP0ManualReviewTodoReport,
  formatP0ManualReviewTodoReport,
} from '../domain/p0ManualReviewTodos';
import type { P0ManualReviewTemplateFile } from '../domain/p0ManualReviewTemplates';

const report = buildP0ManualReviewTodoReport(await readTemplateFiles());

console.log(formatP0ManualReviewTodoReport(report));

if (!report.ready) {
  process.exitCode = 1;
}

async function readTemplateFiles(): Promise<P0ManualReviewTemplateFile[]> {
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

  return files;
}
