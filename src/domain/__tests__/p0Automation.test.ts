import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

import { brands } from '../brands';
import { evaluateP0AutomationReadiness, evaluateP0CandidateIntake, formatP0AutomationReport } from '../p0Automation';

describe('P0 automation readiness gate', () => {
  it('blocks automated collection promotion while required P0 fee fields remain unresolved', () => {
    const report = evaluateP0AutomationReadiness(brands);

    expect(report.ready).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 10,
      readyBrands: 0,
      blockedBrands: 10,
    });

    for (const brandReport of report.brands) {
      expect(brandReport.ready).toBe(false);
      expect(brandReport.blockers).toEqual(
        expect.arrayContaining(['P0 전체 검증 미완료', '반복 비용 가정 포함', '차액가맹금 수치 미확보']),
      );
      expect(brandReport.unresolvedMetrics).toEqual(
        expect.arrayContaining(['margin-fee-total', 'royalty-ad-required-cost']),
      );
    }
  });

  it('formats a deterministic operator-facing preflight report', () => {
    const report = evaluateP0AutomationReadiness(brands);
    const output = formatP0AutomationReport(report);

    expect(output).toContain('P0 automation readiness: BLOCKED');
    expect(output).toContain('Brands: 0/10 ready');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
    expect(output).toContain('차액가맹금 수치 미확보');
    expect(output).toContain('Unresolved: margin-fee-total, royalty-ad-required-cost');
  });

  it('exposes the preflight report as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 automation readiness: BLOCKED');
    expect(output).toContain('Brands: 0/10 ready');
    expect(output).toContain('- hansot 한솥도시락: BLOCKED');
    expect(output).toContain('차액가맹금 수치 미확보');
  }, 15000);

  it('quarantines automated candidate data until all P0 gates pass', () => {
    const candidate = structuredClone(brands[0]);

    const intake = evaluateP0CandidateIntake(candidate);

    expect(intake.action).toBe('quarantine');
    expect(intake.promotable).toBe(false);
    expect(intake.blockers).toEqual(
      expect.arrayContaining(['P0 전체 검증 미완료', '반복 비용 가정 포함', '차액가맹금 수치 미확보']),
    );
    expect(intake.reason).toContain('자동 수집 후보는 격리');
  });

  it('promotes automated candidate data only after P0 checklist, official source, and fee fields pass', () => {
    const candidate = structuredClone(brands[0]);
    candidate.audit.p0Verified = true;
    candidate.audit.verificationStatus = 'verified';
    candidate.audit.reviewer = 'qa';
    candidate.audit.lastVerifiedAt = '2026-06-16';
    candidate.audit.p0Checklist = candidate.audit.p0Checklist.map((item) => ({
      ...item,
      status: 'verified',
      sourceCount: 2,
      originalDisclosureChecked: true,
      crossChecked: true,
    }));
    candidate.sources = [
      {
        type: 'official-disclosure',
        title: '공정거래위원회 정보공개서 원문',
        url: 'https://franchise.ftc.go.kr/example',
        referenceYear: 2024,
        capturedAt: '2026-06-16',
        confidence: 'high',
      },
    ];
    candidate.cost.recurringCostBasis = 'official-disclosure';
    candidate.cost.differenceFranchiseFeeTotalM = 12.3;

    const intake = evaluateP0CandidateIntake(candidate);

    expect(intake).toEqual({
      action: 'promote',
      promotable: true,
      blockers: [],
      reason: 'P0 수동 검증 기준 통과',
    });
  });
});
