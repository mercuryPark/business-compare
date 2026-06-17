import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { createP0ReviewWorksheet, formatP0ReviewWorksheet } from '../p0ReviewWorksheet';

describe('P0 review worksheet', () => {
  it('creates one manual review row per brand with unresolved original-disclosure work', () => {
    const worksheet = createP0ReviewWorksheet(brands);

    expect(worksheet.summary).toEqual({
      totalBrands: 10,
      rowsRequiringOriginalDisclosureReview: 10,
      rowsMissingFeeFields: 10,
    });

    for (const row of worksheet.rows) {
      expect(row.verificationStatus).toBe('partial');
      expect(row.originalDisclosureReviewRequired).toBe(true);
      expect(row.unresolvedMetrics).toEqual(
        expect.arrayContaining(['차액가맹금 총액', '로열티/광고비/필수비용']),
      );
      expect(row.reviewActions).toEqual(
        expect.arrayContaining(['FTC 정보공개서 원문 대조', '차액가맹금/반복비용 수치 확보']),
      );
      expect(row.currentSourceUrl).toContain('fair.gg.go.kr');
      expect(row.officialDisclosureLookupUrl).toBe('https://franchise.ftc.go.kr/');
    }
  });

  it('formats a deterministic markdown worksheet for reviewers', () => {
    const output = formatP0ReviewWorksheet(createP0ReviewWorksheet(brands));

    expect(output).toContain('# P0 Original Disclosure Review Worksheet');
    expect(output).toContain('Brands requiring original disclosure review: 10/10');
    expect(output).toContain('| hansot | 한솥도시락 | partial | 초기비용, 가맹점 수 추이, 평균매출');
    expect(output).toContain('차액가맹금 총액, 로열티/광고비/필수비용');
    expect(output).toContain('https://franchise.ftc.go.kr/');
  });

  it('exposes the worksheet as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-review'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('# P0 Original Disclosure Review Worksheet');
    expect(output).toContain('Brands requiring original disclosure review: 10/10');
    expect(output).toContain('차액가맹금 총액');
  }, 15000);
});
