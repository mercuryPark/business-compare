import type { Brand, P0Metric, VerificationStatus } from './types';
import { P0_REQUIRED_METRICS, getP0MetricLabel } from './qa';

export interface P0ReviewMetricRecord {
  status: VerificationStatus;
  rawValue: string;
  appValueNote: string;
  originalDisclosureChecked: boolean;
  crossChecked: boolean;
}

export type P0ReviewMetricRecordMap = Record<P0Metric, P0ReviewMetricRecord>;

export interface P0ReviewedAppValues {
  cost: {
    startupTotalM: number;
    franchiseFeeM: number;
    trainingFeeM: number;
    depositM: number;
    interiorM: number;
    equipmentM: number;
    otherStartupM: number;
    recurringRoyaltyRate: number;
    adFeeRate: number;
    requiredPurchaseBurdenRate: number;
    differenceFranchiseFeeTotalM: number;
    recurringCostNote: string;
  };
  sales: {
    averageAnnualSalesM: number;
    salesPerAreaM: number;
  };
  stability: {
    currentStores: number;
    directStores: number;
    storeChange3y: number;
    openings3y: number;
    closures3y: number;
    terminations3y: number;
    expirations3y: number;
    ownershipTransfers3y: number;
  };
}

export interface P0ManualReviewRecord {
  brandId: string;
  disclosureReferenceYear: number;
  disclosureSourceUrl: string;
  crossCheckSourceUrl: string;
  capturedAt: string;
  researcher: string;
  reviewer: string;
  reviewedAppValues: P0ReviewedAppValues;
  metrics: P0ReviewMetricRecordMap;
}

export interface P0ReviewRecordRow {
  brandId: string;
  brandName: string;
  status: 'complete' | 'missing' | 'invalid';
  blockers: string[];
}

export interface P0ReviewRecordReport {
  ready: boolean;
  summary: {
    totalBrands: number;
    completeRecords: number;
    missingRecords: number;
    invalidRecords: number;
  };
  rows: P0ReviewRecordRow[];
}

export interface P0ReviewPromotionResult {
  promoted: boolean;
  blockers: string[];
  brand?: Brand;
}

export interface P0ReviewPromotionRow {
  brandId: string;
  brandName: string;
  status: 'promotable' | 'blocked';
  blockers: string[];
}

export interface P0ReviewPromotionReport {
  ready: boolean;
  summary: {
    totalBrands: number;
    promotableBrands: number;
    blockedBrands: number;
  };
  rows: P0ReviewPromotionRow[];
}

export const p0ManualReviewRecords: P0ManualReviewRecord[] = [];

export function createVerifiedReviewMetric(rawValue: string, appValueNote: string): P0ReviewMetricRecord {
  return {
    status: 'verified',
    rawValue,
    appValueNote,
    originalDisclosureChecked: true,
    crossChecked: true,
  };
}

export function validateP0ReviewRecords(
  brands: Brand[],
  records: P0ManualReviewRecord[],
): P0ReviewRecordReport {
  const rows = brands.map((brand) => validateP0ReviewRecordRow(brand, records));
  const completeRecords = rows.filter((row) => row.status === 'complete').length;
  const missingRecords = rows.filter((row) => row.status === 'missing').length;
  const invalidRecords = rows.filter((row) => row.status === 'invalid').length;

  return {
    ready: completeRecords === brands.length,
    summary: {
      totalBrands: brands.length,
      completeRecords,
      missingRecords,
      invalidRecords,
    },
    rows,
  };
}

export function formatP0ReviewRecordReport(report: P0ReviewRecordReport): string {
  const lines = [
    `P0 review records: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `Records complete: ${report.summary.completeRecords}/${report.summary.totalBrands}`,
    `Missing records: ${report.summary.missingRecords}`,
    `Invalid records: ${report.summary.invalidRecords}`,
    '',
  ];

  for (const row of report.rows) {
    lines.push(`- ${row.brandId} ${row.brandName}: ${row.status.toUpperCase()}`);
    if (row.blockers.length > 0) {
      lines.push(`  Blockers: ${row.blockers.join(', ')}`);
    }
  }

  return lines.join('\n');
}

export function promoteP0ReviewRecordToBrand(brand: Brand, record: P0ManualReviewRecord): P0ReviewPromotionResult {
  const blockers = getP0ReviewRecordBlockers(record);

  if (brand.id !== record.brandId) {
    blockers.push('브랜드 ID 불일치');
  }

  if (blockers.length > 0) {
    return {
      promoted: false,
      blockers,
    };
  }

  const reviewed = record.reviewedAppValues;
  const promotedBrand: Brand = {
    ...brand,
    oneLine: 'FTC 정보공개서 원문과 2차 출처 대조를 통과한 P0 검증 데이터입니다.',
    cost: {
      ...brand.cost,
      startupTotalM: reviewed.cost.startupTotalM,
      franchiseFeeM: reviewed.cost.franchiseFeeM,
      trainingFeeM: reviewed.cost.trainingFeeM,
      depositM: reviewed.cost.depositM,
      interiorM: reviewed.cost.interiorM,
      equipmentM: reviewed.cost.equipmentM,
      otherStartupM: reviewed.cost.otherStartupM,
      recurringRoyaltyRate: reviewed.cost.recurringRoyaltyRate,
      adFeeRate: reviewed.cost.adFeeRate,
      requiredPurchaseBurdenRate: reviewed.cost.requiredPurchaseBurdenRate,
      differenceFranchiseFeeTotalM: reviewed.cost.differenceFranchiseFeeTotalM,
      recurringCostBasis: 'official-disclosure',
      recurringCostNote: reviewed.cost.recurringCostNote,
    },
    sales: {
      ...brand.sales,
      averageAnnualSalesM: reviewed.sales.averageAnnualSalesM,
      salesPerAreaM: reviewed.sales.salesPerAreaM,
      averageSalesCaveat:
        'FTC 정보공개서 원문과 2차 출처 대조를 통과한 평균매출입니다. 점포별 편차는 별도 시나리오로 확인해야 합니다.',
    },
    stability: {
      ...brand.stability,
      currentStores: reviewed.stability.currentStores,
      directStores: reviewed.stability.directStores,
      storeChange3y: reviewed.stability.storeChange3y,
      openings3y: reviewed.stability.openings3y,
      closures3y: reviewed.stability.closures3y,
      terminations3y: reviewed.stability.terminations3y,
      expirations3y: reviewed.stability.expirations3y,
      ownershipTransfers3y: reviewed.stability.ownershipTransfers3y,
    },
    simulatorDefaults: {
      ...brand.simulatorDefaults,
      monthlySalesM: reviewed.sales.averageAnnualSalesM / 12,
      loanPrincipalM: reviewed.cost.startupTotalM * 0.5,
    },
    keyRisks: brand.keyRisks.filter((risk) => !risk.includes('P0') && !risk.includes('원문 대조')),
    sources: [
      {
        type: 'official-disclosure',
        title: '공정거래위원회 정보공개서 원문/API',
        url: record.disclosureSourceUrl,
        referenceYear: record.disclosureReferenceYear,
        capturedAt: record.capturedAt,
        confidence: 'high',
      },
      {
        type: 'public-data',
        title: 'P0 2차 교차확인 출처',
        url: record.crossCheckSourceUrl,
        referenceYear: record.disclosureReferenceYear,
        capturedAt: record.capturedAt,
        confidence: 'high',
      },
    ],
    audit: {
      ...brand.audit,
      p0Verified: true,
      verificationStatus: 'verified',
      p0Checklist: P0_REQUIRED_METRICS.map((metric) => ({
        metric,
        status: 'verified',
        sourceCount: 2,
        originalDisclosureChecked: true,
        crossChecked: true,
        note: record.metrics[metric].appValueNote,
      })),
      researcher: record.researcher,
      reviewer: record.reviewer,
      lastVerifiedAt: record.capturedAt,
      correctionStatus: 'none',
    },
    freshness: 'current',
  };

  return {
    promoted: true,
    blockers: [],
    brand: promotedBrand,
  };
}

export function evaluateP0ReviewPromotionReadiness(
  brands: Brand[],
  records: P0ManualReviewRecord[],
): P0ReviewPromotionReport {
  const rows = brands.map((brand) => {
    const record = records.find((item) => item.brandId === brand.id);

    if (!record) {
      return {
        brandId: brand.id,
        brandName: brand.name,
        status: 'blocked',
        blockers: ['수동 원문 대조 기록 없음'],
      } satisfies P0ReviewPromotionRow;
    }

    const result = promoteP0ReviewRecordToBrand(brand, record);

    return {
      brandId: brand.id,
      brandName: brand.name,
      status: result.promoted ? 'promotable' : 'blocked',
      blockers: result.blockers,
    } satisfies P0ReviewPromotionRow;
  });
  const promotableBrands = rows.filter((row) => row.status === 'promotable').length;

  return {
    ready: promotableBrands === brands.length,
    summary: {
      totalBrands: brands.length,
      promotableBrands,
      blockedBrands: brands.length - promotableBrands,
    },
    rows,
  };
}

export function formatP0ReviewPromotionReport(report: P0ReviewPromotionReport): string {
  const lines = [
    `P0 review promotion: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `Promotable brands: ${report.summary.promotableBrands}/${report.summary.totalBrands}`,
    `Blocked brands: ${report.summary.blockedBrands}`,
    '',
  ];

  for (const row of report.rows) {
    lines.push(`- ${row.brandId} ${row.brandName}: ${row.status.toUpperCase()}`);
    if (row.blockers.length > 0) {
      lines.push(`  Blockers: ${row.blockers.join(', ')}`);
    }
  }

  return lines.join('\n');
}

function validateP0ReviewRecordRow(brand: Brand, records: P0ManualReviewRecord[]): P0ReviewRecordRow {
  const record = records.find((item) => item.brandId === brand.id);

  if (!record) {
    return {
      brandId: brand.id,
      brandName: brand.name,
      status: 'missing',
      blockers: ['수동 원문 대조 기록 없음'],
    };
  }

  const blockers = getP0ReviewRecordBlockers(record);

  return {
    brandId: brand.id,
    brandName: brand.name,
    status: blockers.length === 0 ? 'complete' : 'invalid',
    blockers,
  };
}

function getP0ReviewRecordBlockers(record: P0ManualReviewRecord): string[] {
  const blockers: string[] = [];

  if (!isOfficialDisclosureUrl(record.disclosureSourceUrl)) {
    blockers.push('공식 FTC 정보공개서 URL 필요');
  }

  if (!isCrossCheckUrl(record.crossCheckSourceUrl)) {
    blockers.push('2차 교차확인 출처 URL 필요');
  }

  if (record.crossCheckSourceUrl === record.disclosureSourceUrl) {
    blockers.push('공식 출처와 다른 2차 출처 필요');
  }

  if (!Number.isInteger(record.disclosureReferenceYear) || record.disclosureReferenceYear < 2000) {
    blockers.push('정보공개서 기준연도 필요');
  }

  if (!record.capturedAt) {
    blockers.push('수집일 필요');
  }

  if (
    !record.researcher ||
    !record.reviewer ||
    record.researcher === record.reviewer ||
    record.reviewer.includes('REQUIRED')
  ) {
    blockers.push('연구자와 검토자 분리 필요');
  }

  blockers.push(...getReviewedAppValueBlockers(record.reviewedAppValues));

  for (const metric of P0_REQUIRED_METRICS) {
    const metricRecord = record.metrics[metric];
    const label = getP0MetricLabel(metric);

    if (!metricRecord) {
      blockers.push(`${label} 기록 누락`);
      continue;
    }

    if (metricRecord.status !== 'verified' || !metricRecord.originalDisclosureChecked) {
      blockers.push(`${label} 원문 검증 미완료`);
    }

    if (!metricRecord.crossChecked) {
      blockers.push(`${label} 교차확인 미완료`);
    }

    if (!metricRecord.rawValue.trim() || !metricRecord.appValueNote.trim()) {
      blockers.push(`${label} 원값/환산 메모 누락`);
    }
  }

  return blockers;
}

function getReviewedAppValueBlockers(values: P0ReviewedAppValues | undefined): string[] {
  const blockers: string[] = [];

  if (!values) {
    return ['앱 반영값 기록 필요'];
  }

  const startupPartTotal =
    values.cost.franchiseFeeM +
    values.cost.trainingFeeM +
    values.cost.depositM +
    values.cost.interiorM +
    values.cost.equipmentM +
    values.cost.otherStartupM;

  if (!isPositiveFinite(values.cost.startupTotalM) || Math.abs(startupPartTotal - values.cost.startupTotalM) > 0.2) {
    blockers.push('앱 반영 창업비 합계 검수 필요');
  }

  if (
    [
      values.cost.franchiseFeeM,
      values.cost.trainingFeeM,
      values.cost.depositM,
      values.cost.interiorM,
      values.cost.equipmentM,
      values.cost.otherStartupM,
      values.cost.differenceFranchiseFeeTotalM,
      values.stability.directStores,
      values.stability.openings3y,
      values.stability.closures3y,
      values.stability.terminations3y,
      values.stability.expirations3y,
      values.stability.ownershipTransfers3y,
    ].some((value) => !isNonNegativeFinite(value))
  ) {
    blockers.push('앱 반영값 음수/비정상');
  }

  if (
    !isUnitRate(values.cost.recurringRoyaltyRate) ||
    !isUnitRate(values.cost.adFeeRate) ||
    !isUnitRate(values.cost.requiredPurchaseBurdenRate)
  ) {
    blockers.push('반복 비용 요율 범위 오류');
  }

  if (!values.cost.recurringCostNote.trim()) {
    blockers.push('반복 비용 근거 메모 필요');
  }

  if (!isPositiveFinite(values.sales.averageAnnualSalesM) || !isPositiveFinite(values.sales.salesPerAreaM)) {
    blockers.push('앱 반영 매출값 검수 필요');
  }

  if (!isPositiveFinite(values.stability.currentStores)) {
    blockers.push('앱 반영 가맹점 수 검수 필요');
  }

  return blockers;
}

function isOfficialDisclosureUrl(url: string): boolean {
  return url.includes('franchise.ftc.go.kr') || url.includes('apis.data.go.kr/1130000');
}

function isCrossCheckUrl(url: string): boolean {
  return url.includes('fair.gg.go.kr') || url.includes('data.go.kr') || url.includes('franchise.ftc.go.kr');
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegativeFinite(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function isUnitRate(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}
