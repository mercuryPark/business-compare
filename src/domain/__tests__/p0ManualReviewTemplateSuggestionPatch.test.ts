import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import {
  buildP0ManualReviewTemplateSuggestionPatchFiles,
  formatP0ManualReviewTemplateSuggestionPatchReport,
} from '../p0ManualReviewTemplateSuggestionPatch';
import { importP0ManualReviewTemplateFiles } from '../p0ManualReviewTemplateImport';
import { buildP0ManualReviewTemplateFiles } from '../p0ManualReviewTemplates';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';
import type { P0FeeApiTemplateSuggestionRow } from '../p0FeeApiTemplateSuggestions';
import type { P0OfficialDisclosureFetchRow } from '../p0OfficialDisclosureApiFetch';

describe('P0 manual review template suggestion patch', () => {
  it('creates a fee-field preview without marking original disclosure review complete', () => {
    const templates = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);
    const files = buildP0ManualReviewTemplateSuggestionPatchFiles(templates, [sampleHansotSuggestion], {
      capturedAt: '2026-06-16T08:00:00.000Z',
    });
    const preview = files.find((file) => file.path.endsWith('/hansot.md'))!;

    expect(files.map((file) => file.path)).toEqual([
      'docs/research/p0-manual-review-preview/README.md',
      'docs/research/p0-manual-review-preview/hansot.md',
    ]);
    expect(files[0].content).toContain('Captured at: 2026-06-16T08:00:00.000Z');
    expect(preview.content).toContain('- disclosureSourceUrl: FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED');
    expect(preview.content).toContain('- reviewer: REVIEWER_REQUIRED');
    expect(preview.content).toContain('- recurringRoyaltyRate: 0.02');
    expect(preview.content).toContain('- adFeeRate: 0.01');
    expect(preview.content).toContain('- requiredPurchaseBurdenRate: 0.08');
    expect(preview.content).toContain('- differenceFranchiseFeeTotalM: 12.3');
    expect(preview.content).toContain('- recurringCostNote: API 후보: 차액가맹금=12,300천원; 로열티=매출액의 2%; 광고비=매출액의 1%; 필수구매=매출액의 8%');
    expect(preview.content).toContain('| 차액가맹금 총액 | 12.3백만원 (API 후보) | [ ] | [ ] | 백만원 단위로 입력. |');
    expect(preview.content).toContain('| 로열티/광고비/필수비용 | royalty=0.02, ad=0.01, requiredPurchase=0.08 (API 후보) | [ ] | [ ] | 0-1 요율 또는 근거 메모 입력. |');

    const importReport = importP0ManualReviewTemplateFiles([preview]);
    expect(importReport.summary.importableRecords).toBe(0);
    expect(importReport.rows[0].blockers).toEqual(
      expect.arrayContaining(['FTC 원문 URL placeholder', '검토자 placeholder', 'FTC 원문 확인 미체크']),
    );
  });

  it('formats a deterministic preview generation report', () => {
    const templates = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);
    const output = formatP0ManualReviewTemplateSuggestionPatchReport(
      buildP0ManualReviewTemplateSuggestionPatchFiles(templates, [sampleHansotSuggestion], {
        capturedAt: '2026-06-16T08:00:00.000Z',
      }),
    );

    expect(output).toContain('P0 manual review template preview: GENERATED');
    expect(output).toContain('Files: 2');
    expect(output).toContain('- docs/research/p0-manual-review-preview/hansot.md');
  });

  it('can preview a single official disclosure URL candidate without marking review complete', () => {
    const templates = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);
    const files = buildP0ManualReviewTemplateSuggestionPatchFiles(templates, [], {
      capturedAt: '2026-06-16T08:00:00.000Z',
      disclosureRows: [sampleHansotDisclosureRow],
    });
    const preview = files.find((file) => file.path.endsWith('/hansot.md'))!;

    expect(files.map((file) => file.path)).toEqual([
      'docs/research/p0-manual-review-preview/README.md',
      'docs/research/p0-manual-review-preview/hansot.md',
    ]);
    expect(preview.content).toContain(
      '- disclosureSourceUrl: https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&serviceKey=TEST_SERVICE_KEY',
    );
    expect(preview.content).toContain('- reviewer: REVIEWER_REQUIRED');
    expect(preview.content).toContain('- differenceFranchiseFeeTotalM: FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED');
    expect(preview.content).toContain(
      '| 정보공개서 기준연도/출처 | referenceYear=2024, disclosureCandidate=111111, crossCheckSource=https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100308 | [ ] | [x] | FTC 원문 URL 필수. |',
    );

    const importReport = importP0ManualReviewTemplateFiles([preview]);
    expect(importReport.summary.importableRecords).toBe(0);
    expect(importReport.rows[0].blockers).toEqual(
      expect.arrayContaining(['검토자 placeholder', '차액가맹금 placeholder', '반복비용 placeholder', 'FTC 원문 확인 미체크']),
    );
    expect(importReport.rows[0].blockers).not.toContain('FTC 원문 URL placeholder');
  });

  it('exposes service-key gated preview generation as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'generate:p0-template-preview'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 manual review template preview: BLOCKED');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  }, 15000);
});

const sampleHansotSuggestion: P0FeeApiTemplateSuggestionRow = {
  brandId: 'hansot',
  registeredBrandName: '한솥',
  brandMnno: 'BRD_20080100308',
  status: 'needs-review',
  suggestedFields: {
    recurringRoyaltyRate: 0.02,
    adFeeRate: 0.01,
    requiredPurchaseBurdenRate: 0.08,
    differenceFranchiseFeeTotalM: 12.3,
    recurringCostNote: 'API 후보: 차액가맹금=12,300천원; 로열티=매출액의 2%; 광고비=매출액의 1%; 필수구매=매출액의 8%',
  },
  blockers: ['FTC 원문 대조 필요'],
};

const sampleHansotDisclosureRow: P0OfficialDisclosureFetchRow = {
  brandId: 'hansot',
  registeredBrandName: '한솥',
  lookupKeyword: '한솥',
  candidateCount: 1,
  candidates: [
    {
      disclosureSerial: '111111',
      brandName: '한솥',
      corporationName: '주식회사 한솥',
      businessRegistrationNumber: '1234567890',
      registrationNumber: '20240001',
      viewerUrl: 'https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&serviceKey=TEST_SERVICE_KEY',
      raw: '<item><jngIfrmpSn>111111</jngIfrmpSn><brandNm>한솥</brandNm></item>',
    },
  ],
  blockers: ['정보공개서 원문 URL 수동 입력 필요', 'API 후보와 FTC 원문 수동 대조 필요'],
};
