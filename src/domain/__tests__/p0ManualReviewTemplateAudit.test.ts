import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  auditP0ManualReviewTemplateFiles,
  formatP0ManualReviewTemplateAuditReport,
} from '../p0ManualReviewTemplateAudit';
import { buildP0ManualReviewTemplateFiles } from '../p0ManualReviewTemplates';
import { brands } from '../brands';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';

describe('P0 manual review template audit', () => {
  it('blocks promotion while generated markdown templates still contain placeholders', () => {
    const files = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);
    const report = auditP0ManualReviewTemplateFiles(files);

    expect(report.ready).toBe(false);
    expect(report.summary).toEqual({
      totalBrandFiles: 10,
      completeBrandFiles: 0,
      blockedBrandFiles: 10,
    });

    const hansot = report.rows.find((row) => row.brandId === 'hansot');
    expect(hansot).toMatchObject({
      brandName: '한솥도시락',
      status: 'blocked',
    });
    expect(hansot?.blockers).toEqual(
      expect.arrayContaining([
        'FTC 원문 URL placeholder',
        '검토자 placeholder',
        '차액가맹금 placeholder',
        '반복비용 placeholder',
        'FTC 원문 확인 미체크',
      ]),
    );
  });

  it('formats a deterministic template audit report', () => {
    const output = formatP0ManualReviewTemplateAuditReport(
      auditP0ManualReviewTemplateFiles(buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands)),
    );

    expect(output).toContain('P0 manual review templates: BLOCKED');
    expect(output).toContain('Complete templates: 0/10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
    expect(output).toContain('FTC 원문 URL placeholder');
  });

  it('exposes the current docs template audit as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'check:p0-review-templates'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 manual review templates: BLOCKED');
    expect(output).toContain('Complete templates: 0/10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
  }, 15000);
});
