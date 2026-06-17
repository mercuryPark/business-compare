import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { brands } from '../domain/brands';
import { evaluateP0DataReplacementGaps } from '../domain/p0DataGaps';
import {
  buildP0OperatorWorkflowReport,
  formatP0OperatorWorkflowReport,
} from '../domain/p0OperatorWorkflow';
import {
  importP0ManualReviewTemplateFiles,
} from '../domain/p0ManualReviewTemplateImport';
import type { P0ManualReviewTemplateFile } from '../domain/p0ManualReviewTemplates';
import { p0ManualReviewRecords } from '../domain/p0ReviewRecords';

const templateImportReport = importP0ManualReviewTemplateFiles(await readTemplateFiles());
const dataGapReport = evaluateP0DataReplacementGaps(brands, p0ManualReviewRecords);
const workflowReport = buildP0OperatorWorkflowReport({
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
  dataGapReport,
  templateImportSummary: {
    totalBrandFiles: templateImportReport.summary.totalBrandFiles,
    importableRecords: templateImportReport.summary.importableRecords,
  },
});

console.log(formatP0OperatorWorkflowReport(workflowReport));

if (!workflowReport.readyForPromotion) {
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
