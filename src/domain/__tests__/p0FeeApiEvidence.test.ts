import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  createP0FeeApiEvidence,
  formatP0FeeApiEvidenceReport,
} from '../p0FeeApiEvidence';

const sampleFranchiseFeeResponse = {
  response: {
    body: {
      items: [
        {
          brandMnno: 'BRD_20080100308',
          brandNm: '한솥',
          jngAmtSeNm: '차액가맹금',
          jngAmtScopeVal: '12,300천원',
          jngAmtGiveDdlnDateCn: '월별',
          jngAmtGvbkCndCn: '정보공개서 원문 확인 필요',
        },
        {
          brandMnno: 'BRD_20080100308',
          brandNm: '한솥',
          jngAmtSeNm: '가입비',
          jngAmtScopeVal: '6,600천원',
        },
      ],
    },
  },
};

const sampleOtherCostResponse = {
  response: {
    body: {
      items: {
        brandMnno: 'BRD_20080100308',
        brandNm: '한솥',
        othctSeNm: '광고비',
        ctGiveTrgtNm: '가맹본부',
        giveAmtCn: '매출액의 1%',
        crtraArAmtScopeVal: '별도 확인',
        ctGiveDdlnDateCn: '월별',
      },
    },
  },
};

describe('P0 fee API evidence', () => {
  it('normalizes franchise-fee and other-cost API items into review evidence without verifying them', () => {
    const evidence = createP0FeeApiEvidence({
      brandId: 'hansot',
      registeredBrandName: '한솥',
      brandMnno: 'BRD_20080100308',
      franchiseFeeResponse: sampleFranchiseFeeResponse,
      otherCostResponse: sampleOtherCostResponse,
    });

    expect(evidence.readyForReviewRecord).toBe(false);
    expect(evidence.brandConfirmationRequired).toBe(true);
    expect(evidence.marginFeeCandidates).toEqual([
      expect.objectContaining({
        source: 'franchise-fee-api',
        label: '차액가맹금',
        amountText: '12,300천원',
        raw: expect.stringContaining('jngAmtScopeVal'),
      }),
    ]);
    expect(evidence.recurringCostCandidates).toEqual([
      expect.objectContaining({
        source: 'other-cost-api',
        label: '광고비',
        amountText: '매출액의 1%',
        target: '가맹본부',
      }),
    ]);
    expect(evidence.blockers).toEqual(['API 반환 브랜드명/원문 대조 필요', '수동 리뷰 기록 반영 필요']);
  });

  it('formats and exposes a sample evidence report for manual reviewers', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-fee-evidence-sample'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 fee API evidence: BLOCKED');
    expect(output).toContain('Margin fee candidates: 1');
    expect(output).toContain('Recurring cost candidates: 1');
    expect(output).toContain('API 반환 브랜드명/원문 대조 필요');
    expect(formatP0FeeApiEvidenceReport([createP0FeeApiEvidence({
      brandId: 'hansot',
      registeredBrandName: '한솥',
      brandMnno: 'BRD_20080100308',
      franchiseFeeResponse: sampleFranchiseFeeResponse,
      otherCostResponse: sampleOtherCostResponse,
    })])).toContain('차액가맹금 -> 12,300천원');
  }, 15000);
});
