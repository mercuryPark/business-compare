import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { evaluateTradeAreaReadiness, formatTradeAreaReadinessReport } from '../tradeAreaReadiness';

describe('trade-area readiness report', () => {
  it('keeps all trade-area scenarios structural-only until regional data is integrated', () => {
    const report = evaluateTradeAreaReadiness(brands);

    expect(report.readyForEstimates).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 10,
      totalScenarios: 30,
      estimatedOrVerifiedScenarios: 0,
      structuralOnlyScenarios: 30,
    });

    for (const brand of report.brands) {
      expect(brand.readyForEstimates).toBe(false);
      expect(brand.blockers).toContain('지역/상권 데이터 미연동');
      expect(brand.blockers).toContain('상권 예상순수익 미산출');
    }
  });

  it('formats a deterministic operator-facing trade-area report', () => {
    const output = formatTradeAreaReadinessReport(evaluateTradeAreaReadiness(brands));

    expect(output).toContain('Trade-area readiness: STRUCTURAL_ONLY');
    expect(output).toContain('Estimated scenarios: 0/30');
    expect(output).toContain('- hansot 한솥도시락: STRUCTURAL_ONLY');
    expect(output).toContain('Blockers: 지역/상권 데이터 미연동, 상권 예상순수익 미산출');
  });

  it('exposes trade-area readiness as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:trade-area'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('Trade-area readiness: STRUCTURAL_ONLY');
    expect(output).toContain('Estimated scenarios: 0/30');
    expect(output).toContain('지역/상권 데이터 미연동');
  }, 15000);
});
