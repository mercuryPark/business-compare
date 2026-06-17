import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { evaluateP0DataReplacementGaps, formatP0DataReplacementGapReport } from '../p0DataGaps';
import { p0ManualReviewRecords } from '../p0ReviewRecords';

describe('P0 data replacement gaps', () => {
  it('summarizes the remaining work before replacing sample data with verified data', () => {
    const report = evaluateP0DataReplacementGaps(brands, p0ManualReviewRecords);

    expect(report.readyForReplacement).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 10,
      replaceableBrands: 0,
      blockedBrands: 10,
      missingManualReviewRecords: 10,
    });

    const hansot = report.brands.find((brand) => brand.brandId === 'hansot');
    expect(hansot).toMatchObject({
      brandName: '한솥도시락',
      status: 'blocked',
      nextAction: 'FTC 원문 대조 기록 작성 후 차액가맹금/반복비용까지 검토자 2차 확인',
    });
    expect(hansot?.unverifiedMetrics).toEqual(['차액가맹금 총액', '로열티/광고비/필수비용']);
    expect(hansot?.blockers).toEqual(
      expect.arrayContaining([
        '수동 원문 대조 기록 없음',
        '차액가맹금 수치 미확보',
        '반복 비용 가정 포함',
      ]),
    );
  });

  it('formats a deterministic operator-facing gap report', () => {
    const output = formatP0DataReplacementGapReport(
      evaluateP0DataReplacementGaps(brands, p0ManualReviewRecords),
    );

    expect(output).toContain('P0 data replacement gaps: BLOCKED');
    expect(output).toContain('Replaceable brands: 0/10');
    expect(output).toContain('Missing manual review records: 10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
    expect(output).toContain('Unverified metrics: 차액가맹금 총액, 로열티/광고비/필수비용');
    expect(output).toContain('Next: FTC 원문 대조 기록 작성 후 차액가맹금/반복비용까지 검토자 2차 확인');
  });

  it('exposes the gap report as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-gaps'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 data replacement gaps: BLOCKED');
    expect(output).toContain('Replaceable brands: 0/10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
  }, 15000);
});
