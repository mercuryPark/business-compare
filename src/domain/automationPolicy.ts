import type { Brand } from './types';
import { evaluateP0AutomationReadiness } from './p0Automation';
import { auditScoreReadiness } from './scoreAudit';
import { evaluateTradeAreaReadiness } from './tradeAreaReadiness';

export interface AutomationPromotionPolicyReport {
  promotable: boolean;
  summary: {
    p0Ready: boolean;
    scoreReady: boolean;
    tradeAreaReady: boolean;
  };
  blockers: string[];
}

export function evaluateAutomationPromotionPolicy(brands: Brand[]): AutomationPromotionPolicyReport {
  const p0 = evaluateP0AutomationReadiness(brands);
  const score = auditScoreReadiness(brands);
  const tradeArea = evaluateTradeAreaReadiness(brands);
  const blockers: string[] = [];

  if (!p0.ready) {
    blockers.push('P0 자동화 준비 미완료');
  }

  if (!score.readyForAbsoluteGrades) {
    blockers.push('점수 절대등급 준비 미완료');
  }

  if (!tradeArea.readyForEstimates) {
    blockers.push('상권 추정 준비 미완료');
  }

  return {
    promotable: blockers.length === 0,
    summary: {
      p0Ready: p0.ready,
      scoreReady: score.readyForAbsoluteGrades,
      tradeAreaReady: tradeArea.readyForEstimates,
    },
    blockers,
  };
}

export function formatAutomationPromotionPolicyReport(report: AutomationPromotionPolicyReport): string {
  const lines = [
    `Automation promotion policy: ${report.promotable ? 'PROMOTABLE' : 'BLOCKED'}`,
    `P0 gate: ${report.summary.p0Ready ? 'READY' : 'BLOCKED'}`,
    `Score gate: ${report.summary.scoreReady ? 'ABSOLUTE_GRADES_READY' : 'REFERENCE_ONLY'}`,
    `Trade-area gate: ${report.summary.tradeAreaReady ? 'READY' : 'STRUCTURAL_ONLY'}`,
  ];

  if (report.blockers.length > 0) {
    lines.push(`Blockers: ${report.blockers.join(', ')}`);
  }

  return lines.join('\n');
}
