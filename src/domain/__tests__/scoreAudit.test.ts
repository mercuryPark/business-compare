import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { auditScoreReadiness, formatScoreAuditReport } from '../scoreAudit';

describe('score audit report', () => {
  it('keeps the current 10-brand dataset reference-only until P0 verification and benchmark depth pass', () => {
    const audit = auditScoreReadiness(brands);

    expect(audit.summary.totalBrands).toBe(10);
    expect(audit.summary.absoluteGradeBrands).toBe(0);
    expect(audit.summary.referenceOnlyBrands).toBe(10);
    expect(audit.readyForAbsoluteGrades).toBe(false);

    for (const item of audit.brands) {
      expect(item.grade).toBe('insufficient-data');
      expect(item.label).toBe('자료 부족');
      expect(item.referenceOnly).toBe(true);
      expect(item.blockers).toContain('P0 데이터 검증 전');
    }
  });

  it('formats a deterministic operator-facing score audit report', () => {
    const report = formatScoreAuditReport(auditScoreReadiness(brands));

    expect(report).toContain('Score audit: REFERENCE_ONLY');
    expect(report).toContain('Absolute grades: 0/10');
    expect(report).toContain('- hansot 한솥도시락: 자료 부족');
    expect(report).toContain('Blockers: P0 데이터 검증 전');
  });

  it('exposes the score audit as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:score'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('Score audit: REFERENCE_ONLY');
    expect(output).toContain('Absolute grades: 0/10');
    expect(output).toContain('P0 데이터 검증 전');
  }, 15000);
});
