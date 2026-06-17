import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  buildP0FeeApiTemplateSuggestionReport,
  formatP0FeeApiTemplateSuggestionReport,
} from '../p0FeeApiTemplateSuggestions';
import type { P0FeeApiEvidence } from '../p0FeeApiEvidence';

describe('P0 fee API template suggestions', () => {
  it('converts explicit API fee candidates into manual-review template field suggestions', () => {
    const report = buildP0FeeApiTemplateSuggestionReport([sampleHansotEvidence]);
    const row = report.rows[0];

    expect(report.readyForManualReviewInput).toBe(false);
    expect(row.brandId).toBe('hansot');
    expect(row.suggestedFields).toMatchObject({
      differenceFranchiseFeeTotalM: 12.3,
      adFeeRate: 0.01,
      recurringCostNote: 'API 후보: 차액가맹금=12,300천원; 광고비=매출액의 1%',
    });
    expect(row.suggestedFields).not.toHaveProperty('recurringRoyaltyRate');
    expect(row.blockers).toEqual([
      'FTC 원문 대조 필요',
      'API 반환 브랜드명/원문 대조 필요',
      '수동 리뷰 기록 반영 필요',
      '로열티 요율 후보 없음',
      '필수비용 요율 후보 없음',
    ]);
  });

  it('formats a deterministic operator report without implying verification', () => {
    const output = formatP0FeeApiTemplateSuggestionReport(
      buildP0FeeApiTemplateSuggestionReport([sampleHansotEvidence]),
    );

    expect(output).toContain('P0 fee API template suggestions: BLOCKED');
    expect(output).toContain('Rows with suggestions: 1/1');
    expect(output).toContain('- hansot 한솥: NEEDS_REVIEW');
    expect(output).toContain('differenceFranchiseFeeTotalM: 12.3');
    expect(output).toContain('adFeeRate: 0.01');
    expect(output).toContain('Blockers: FTC 원문 대조 필요');
  });

  it('exposes service-key gated template suggestions as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-template-suggestions'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 fee API template suggestions: BLOCKED');
    expect(output).toContain('Rows with suggestions: 0/0');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  }, 15000);
});

const sampleHansotEvidence: P0FeeApiEvidence = {
  brandId: 'hansot',
  registeredBrandName: '한솥',
  brandMnno: 'BRD_20080100308',
  readyForReviewRecord: false,
  brandConfirmationRequired: true,
  marginFeeCandidates: [
    {
      source: 'franchise-fee-api',
      label: '차액가맹금',
      amountText: '12,300천원',
      deadline: '2026-12-31',
      raw: '{"jngAmtSeNm":"차액가맹금","jngAmtScopeVal":"12,300천원"}',
    },
  ],
  recurringCostCandidates: [
    {
      source: 'other-cost-api',
      label: '광고비',
      amountText: '매출액의 1%',
      target: '가맹점',
      deadline: '매월',
      raw: '{"othctSeNm":"광고비","giveAmtCn":"매출액의 1%"}',
    },
  ],
  blockers: ['API 반환 브랜드명/원문 대조 필요', '수동 리뷰 기록 반영 필요'],
};
