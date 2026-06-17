import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import {
  evaluateP0ReviewPromotionReadiness,
  formatP0ReviewPromotionReport,
  p0ManualReviewRecords,
} from '../p0ReviewRecords';

describe('P0 review promotion readiness', () => {
  it('blocks brand data replacement until every brand has a complete manual review record', () => {
    const report = evaluateP0ReviewPromotionReadiness(brands, p0ManualReviewRecords);

    expect(report.ready).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 10,
      promotableBrands: 0,
      blockedBrands: 10,
    });
    expect(report.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        status: 'blocked',
        blockers: ['수동 원문 대조 기록 없음'],
      }),
    );
  });

  it('formats and exposes the promotion gate as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-promotion'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 review promotion: BLOCKED');
    expect(output).toContain('Promotable brands: 0/10');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
    expect(formatP0ReviewPromotionReport(evaluateP0ReviewPromotionReadiness(brands, []))).toContain(
      'Blocked brands: 10',
    );
  }, 15000);
});
