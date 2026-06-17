import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { evaluateP0DataReplacementGaps } from '../p0DataGaps';
import {
  buildP0OperatorWorkflowReport,
  formatP0OperatorWorkflowReport,
} from '../p0OperatorWorkflow';
import { p0ManualReviewRecords } from '../p0ReviewRecords';

describe('P0 operator workflow', () => {
  it('summarizes the external API key, template import, and replacement blockers in run order', () => {
    const report = buildP0OperatorWorkflowReport({
      serviceKey: '',
      dataGapReport: evaluateP0DataReplacementGaps(brands, p0ManualReviewRecords),
      templateImportSummary: {
        totalBrandFiles: 10,
        importableRecords: 0,
      },
    });

    expect(report.readyForPromotion).toBe(false);
    expect(report.serviceKeyConfigured).toBe(false);
    expect(report.steps.map((step) => [step.label, step.status])).toEqual([
      ['Configure fee API key', 'blocked'],
      ['Locate official disclosures', 'blocked'],
      ['Fetch official disclosure candidates', 'blocked'],
      ['Generate disclosure candidate handoff', 'blocked'],
      ['Fetch fee evidence', 'blocked'],
      ['Generate review preview', 'blocked'],
      ['Complete manual review templates', 'blocked'],
      ['Promote verified data', 'blocked'],
    ]);
    expect(formatP0OperatorWorkflowReport(report)).toContain('P0 operator workflow: BLOCKED');
    expect(formatP0OperatorWorkflowReport(report)).toContain('DATA_GO_KR_SERVICE_KEY: MISSING');
    expect(formatP0OperatorWorkflowReport(report)).toContain('Template import: 0/10 importable');
    expect(formatP0OperatorWorkflowReport(report)).toContain('Replacement: 0/10 replaceable');
  });

  it('does not treat the documented service-key placeholder as configured', () => {
    const report = buildP0OperatorWorkflowReport({
      serviceKey: 'DATA_GO_KR_SERVICE_KEY_REQUIRED',
      dataGapReport: evaluateP0DataReplacementGaps(brands, p0ManualReviewRecords),
      templateImportSummary: {
        totalBrandFiles: 10,
        importableRecords: 0,
      },
    });

    expect(report.serviceKeyConfigured).toBe(false);
    expect(report.steps[0]).toMatchObject({
      label: 'Configure fee API key',
      status: 'blocked',
    });
    expect(formatP0OperatorWorkflowReport(report)).toContain('DATA_GO_KR_SERVICE_KEY: MISSING');
  });

  it('exposes the current workflow as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-workflow'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 operator workflow: BLOCKED');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY: MISSING');
    expect(output).toContain('1. Configure fee API key: BLOCKED');
    expect(output).toContain('2. Locate official disclosures: BLOCKED');
    expect(output).toContain('3. Fetch official disclosure candidates: BLOCKED');
    expect(output).toContain('4. Generate disclosure candidate handoff: BLOCKED');
    expect(output).toContain('Template import: 0/10 importable');
    expect(output).toContain('Replacement: 0/10 replaceable');
  }, 15000);
});
