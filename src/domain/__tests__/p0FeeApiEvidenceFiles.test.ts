import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  buildP0FeeApiEvidenceFiles,
  formatP0FeeApiEvidenceFileGenerationReport,
} from '../p0FeeApiEvidenceFiles';
import type { P0FeeApiEvidence } from '../p0FeeApiEvidence';

describe('P0 fee API evidence files', () => {
  it('builds one review evidence markdown file per fetched API evidence row', () => {
    const files = buildP0FeeApiEvidenceFiles([sampleHansotEvidence], {
      capturedAt: '2026-06-16T07:00:00.000Z',
    });

    expect(files.map((file) => file.path)).toEqual([
      'docs/research/p0-fee-api-evidence/README.md',
      'docs/research/p0-fee-api-evidence/hansot.md',
    ]);
    expect(files[0].content).toContain('P0 수수료 API 증거 파일');
    expect(files[0].content).toContain('Captured at: 2026-06-16T07:00:00.000Z');
    expect(files[0].content).toContain('- [hansot 한솥](./hansot.md)');
    expect(files[1].content).toContain('# hansot 한솥 P0 수수료 API 증거');
    expect(files[1].content).toContain('- brandMnno: BRD_20080100308');
    expect(files[1].content).toContain('| 차액가맹금 | 12,300천원 | 2026-12-31 |');
    expect(files[1].content).toContain('| 광고비 | 매출액의 1% | 가맹점 | 매월 |');
    expect(files[1].content).toContain('- API 반환 브랜드명/원문 대조 필요');
  });

  it('formats a deterministic generation report', () => {
    const output = formatP0FeeApiEvidenceFileGenerationReport(
      buildP0FeeApiEvidenceFiles([sampleHansotEvidence], {
        capturedAt: '2026-06-16T07:00:00.000Z',
      }),
    );

    expect(output).toContain('P0 fee API evidence files: GENERATED');
    expect(output).toContain('Files: 2');
    expect(output).toContain('- docs/research/p0-fee-api-evidence/hansot.md');
  });

  it('exposes service-key gated evidence file generation as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'generate:p0-fee-evidence'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 fee API evidence files: BLOCKED');
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
