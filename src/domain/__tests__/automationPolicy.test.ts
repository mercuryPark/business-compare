import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { evaluateAutomationPromotionPolicy, formatAutomationPromotionPolicyReport } from '../automationPolicy';

describe('automation promotion policy', () => {
  it('blocks crawler promotion until P0, score, and trade-area gates are all ready', () => {
    const policy = evaluateAutomationPromotionPolicy(brands);

    expect(policy.promotable).toBe(false);
    expect(policy.summary).toEqual({
      p0Ready: false,
      scoreReady: false,
      tradeAreaReady: false,
    });
    expect(policy.blockers).toEqual([
      'P0 자동화 준비 미완료',
      '점수 절대등급 준비 미완료',
      '상권 추정 준비 미완료',
    ]);
  });

  it('formats a deterministic operator-facing policy report', () => {
    const output = formatAutomationPromotionPolicyReport(evaluateAutomationPromotionPolicy(brands));

    expect(output).toContain('Automation promotion policy: BLOCKED');
    expect(output).toContain('P0 gate: BLOCKED');
    expect(output).toContain('Score gate: REFERENCE_ONLY');
    expect(output).toContain('Trade-area gate: STRUCTURAL_ONLY');
    expect(output).toContain('Blockers: P0 자동화 준비 미완료, 점수 절대등급 준비 미완료, 상권 추정 준비 미완료');
  });

  it('exposes the policy as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:automation-policy'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('Automation promotion policy: BLOCKED');
    expect(output).toContain('P0 gate: BLOCKED');
    expect(output).toContain('Score gate: REFERENCE_ONLY');
    expect(output).toContain('Trade-area gate: STRUCTURAL_ONLY');
  }, 15000);
});
