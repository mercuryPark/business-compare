import type { Brand, P0Metric } from './types';
import { getP0ChecklistGaps, getUnverifiedP0ChecklistItems } from './qa';

export interface P0BrandAutomationReport {
  brandId: string;
  brandName: string;
  ready: boolean;
  blockers: string[];
  unresolvedMetrics: P0Metric[];
}

export interface P0AutomationReadinessReport {
  ready: boolean;
  summary: {
    totalBrands: number;
    readyBrands: number;
    blockedBrands: number;
  };
  brands: P0BrandAutomationReport[];
}

export interface P0CandidateIntakeResult {
  action: 'promote' | 'quarantine';
  promotable: boolean;
  blockers: string[];
  reason: string;
}

export function evaluateP0AutomationReadiness(brands: Brand[]): P0AutomationReadinessReport {
  const brandReports = brands.map((brand) => {
    const blockers = getAutomationBlockers(brand);
    return {
      brandId: brand.id,
      brandName: brand.name,
      ready: blockers.length === 0,
      blockers,
      unresolvedMetrics: getUnverifiedP0ChecklistItems(brand).map((item) => item.metric),
    };
  });
  const readyBrands = brandReports.filter((brand) => brand.ready).length;

  return {
    ready: readyBrands === brandReports.length,
    summary: {
      totalBrands: brandReports.length,
      readyBrands,
      blockedBrands: brandReports.length - readyBrands,
    },
    brands: brandReports,
  };
}

export function evaluateP0CandidateIntake(candidate: Brand): P0CandidateIntakeResult {
  const blockers = getAutomationBlockers(candidate);
  const promotable = blockers.length === 0;

  return {
    action: promotable ? 'promote' : 'quarantine',
    promotable,
    blockers,
    reason: promotable ? 'P0 수동 검증 기준 통과' : '자동 수집 후보는 격리 후 수동 검증 필요',
  };
}

export function formatP0AutomationReport(report: P0AutomationReadinessReport): string {
  const lines = [
    `P0 automation readiness: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `Brands: ${report.summary.readyBrands}/${report.summary.totalBrands} ready`,
    '',
  ];

  for (const brand of report.brands) {
    lines.push(`- ${brand.brandId} ${brand.brandName}: ${brand.ready ? 'READY' : 'BLOCKED'}`);
    if (brand.blockers.length > 0) {
      lines.push(`  Blockers: ${brand.blockers.join(', ')}`);
    }
    if (brand.unresolvedMetrics.length > 0) {
      lines.push(`  Unresolved: ${brand.unresolvedMetrics.join(', ')}`);
    }
  }

  return lines.join('\n');
}

function getAutomationBlockers(brand: Brand): string[] {
  const blockers = new Set(getP0ChecklistGaps(brand));

  if (brand.cost.differenceFranchiseFeeTotalM === null) {
    blockers.add('차액가맹금 수치 미확보');
  }

  return [...blockers];
}
