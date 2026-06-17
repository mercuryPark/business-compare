import type { Brand, TradeAreaScenario } from './types';

export interface TradeAreaBrandReadiness {
  brandId: string;
  brandName: string;
  readyForEstimates: boolean;
  totalScenarios: number;
  estimatedOrVerifiedScenarios: number;
  structuralOnlyScenarios: number;
  blockers: string[];
}

export interface TradeAreaReadinessReport {
  readyForEstimates: boolean;
  summary: {
    totalBrands: number;
    totalScenarios: number;
    estimatedOrVerifiedScenarios: number;
    structuralOnlyScenarios: number;
  };
  brands: TradeAreaBrandReadiness[];
}

export function evaluateTradeAreaReadiness(brands: Brand[]): TradeAreaReadinessReport {
  const brandReports = brands.map(evaluateBrandTradeAreaReadiness);
  const totalScenarios = brandReports.reduce((sum, brand) => sum + brand.totalScenarios, 0);
  const estimatedOrVerifiedScenarios = brandReports.reduce(
    (sum, brand) => sum + brand.estimatedOrVerifiedScenarios,
    0,
  );
  const structuralOnlyScenarios = brandReports.reduce((sum, brand) => sum + brand.structuralOnlyScenarios, 0);

  return {
    readyForEstimates: brandReports.every((brand) => brand.readyForEstimates),
    summary: {
      totalBrands: brandReports.length,
      totalScenarios,
      estimatedOrVerifiedScenarios,
      structuralOnlyScenarios,
    },
    brands: brandReports,
  };
}

export function formatTradeAreaReadinessReport(report: TradeAreaReadinessReport): string {
  const lines = [
    `Trade-area readiness: ${report.readyForEstimates ? 'READY' : 'STRUCTURAL_ONLY'}`,
    `Estimated scenarios: ${report.summary.estimatedOrVerifiedScenarios}/${report.summary.totalScenarios}`,
    '',
  ];

  for (const brand of report.brands) {
    lines.push(`- ${brand.brandId} ${brand.brandName}: ${brand.readyForEstimates ? 'READY' : 'STRUCTURAL_ONLY'}`);
    if (brand.blockers.length > 0) {
      lines.push(`  Blockers: ${brand.blockers.join(', ')}`);
    }
  }

  return lines.join('\n');
}

function evaluateBrandTradeAreaReadiness(brand: Brand): TradeAreaBrandReadiness {
  const blockers = new Set<string>();
  const structuralOnlyScenarios = brand.tradeAreaScenarios.filter(
    (scenario) => scenario.status === 'structural-only',
  ).length;
  const estimatedOrVerifiedScenarios = brand.tradeAreaScenarios.length - structuralOnlyScenarios;

  if (structuralOnlyScenarios > 0) {
    blockers.add('지역/상권 데이터 미연동');
  }

  for (const scenario of brand.tradeAreaScenarios) {
    for (const blocker of getScenarioBlockers(scenario)) {
      blockers.add(blocker);
    }
  }

  return {
    brandId: brand.id,
    brandName: brand.name,
    readyForEstimates: blockers.size === 0,
    totalScenarios: brand.tradeAreaScenarios.length,
    estimatedOrVerifiedScenarios,
    structuralOnlyScenarios,
    blockers: [...blockers],
  };
}

function getScenarioBlockers(scenario: TradeAreaScenario): string[] {
  const blockers: string[] = [];

  if (scenario.expectedNetProfitM === null) {
    blockers.push('상권 예상순수익 미산출');
  }

  if (scenario.monthlyRentM === null) {
    blockers.push('상권 임대료 미산출');
  }

  if (scenario.deliveryRatio === null) {
    blockers.push('상권 배달비중 미산출');
  }

  return blockers;
}
