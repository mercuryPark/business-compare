import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import {
  formatP0ManualReviewTemplateImportReport,
  importP0ManualReviewTemplateFiles,
  parseP0ManualReviewTemplateFile,
} from '../p0ManualReviewTemplateImport';
import { buildP0ManualReviewTemplateFiles } from '../p0ManualReviewTemplates';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';

describe('P0 manual review template import', () => {
  it('turns a completed markdown template into a promotion-ready review record', () => {
    const generated = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);
    const hansotTemplate = generated.find((file) => file.path.endsWith('/hansot.md'))!;
    const completed = {
      ...hansotTemplate,
      content: completeHansotTemplate(hansotTemplate.content),
    };

    const result = parseP0ManualReviewTemplateFile(completed);

    expect(result.blockers).toEqual([]);
    expect(result.record).toMatchObject({
      brandId: 'hansot',
      disclosureReferenceYear: 2024,
      disclosureSourceUrl: 'https://franchise.ftc.go.kr/disclosure/hansot',
      reviewer: 'reviewer-b',
      reviewedAppValues: {
        cost: {
          startupTotalM: 100.259,
          recurringRoyaltyRate: 0.02,
          adFeeRate: 0.01,
          requiredPurchaseBurdenRate: 0.08,
          differenceFranchiseFeeTotalM: 12.3,
        },
        sales: {
          averageAnnualSalesM: 408.402,
        },
        stability: {
          closures3y: 86,
        },
      },
    });
    expect(result.record?.metrics['margin-fee-total']).toMatchObject({
      status: 'verified',
      originalDisclosureChecked: true,
      crossChecked: true,
    });
  });

  it('keeps generated placeholder templates blocked from import', () => {
    const report = importP0ManualReviewTemplateFiles(
      buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands),
    );

    expect(report.ready).toBe(false);
    expect(report.summary).toEqual({
      totalBrandFiles: 10,
      importableRecords: 0,
      blockedFiles: 10,
    });
    expect(report.rows.find((row) => row.brandId === 'hansot')?.blockers).toEqual(
      expect.arrayContaining(['FTC 원문 URL placeholder', '차액가맹금 placeholder']),
    );
  });

  it('formats a deterministic import dry-run report', () => {
    const output = formatP0ManualReviewTemplateImportReport(
      importP0ManualReviewTemplateFiles(buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands)),
    );

    expect(output).toContain('P0 manual review template import: BLOCKED');
    expect(output).toContain('Importable records: 0/10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
  });

  it('exposes the current docs import dry-run as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-template-import'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 manual review template import: BLOCKED');
    expect(output).toContain('Importable records: 0/10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
  }, 15000);
});

function completeHansotTemplate(content: string): string {
  return content
    .replace('FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED', 'https://franchise.ftc.go.kr/disclosure/hansot')
    .replace('REVIEWER_REQUIRED', 'reviewer-b')
    .replace('FTC_ORIGINAL_DISCLOSURE_ROYALTY_RATE_REQUIRED', '0.02')
    .replace('FTC_ORIGINAL_DISCLOSURE_AD_FEE_RATE_REQUIRED', '0.01')
    .replace('FTC_ORIGINAL_DISCLOSURE_REQUIRED_PURCHASE_RATE_REQUIRED', '0.08')
    .replace(/FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED/g, '12.3')
    .replace('FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED', '정보공개서 원문 반복비용 항목 기준')
    .replace(/FTC_ORIGINAL_DISCLOSURE_RECURRING_COSTS_REQUIRED/g, 'royalty=2%, ad=1%, requiredPurchase=8%')
    .replace(/\[ \]/g, '[x]');
}
