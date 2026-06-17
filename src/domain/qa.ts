import type { Brand, Freshness, P0ChecklistItem, P0Metric, VerificationStatus } from './types';

export const P0_REQUIRED_METRICS: P0Metric[] = [
  'startup-cost',
  'store-count-trend',
  'average-sales',
  'closure-contract',
  'margin-fee-total',
  'royalty-ad-required-cost',
  'disclosure-source',
];

const p0MetricLabels: Record<P0Metric, string> = {
  'startup-cost': '초기비용',
  'store-count-trend': '가맹점 수 추이',
  'average-sales': '평균매출',
  'closure-contract': '폐점/계약해지 지표',
  'margin-fee-total': '차액가맹금 총액',
  'royalty-ad-required-cost': '로열티/광고비/필수비용',
  'disclosure-source': '정보공개서 기준연도/출처',
};

export function getP0MetricLabel(metric: P0Metric): string {
  return p0MetricLabels[metric];
}

export function createP0Checklist(status: VerificationStatus = 'unverified'): P0ChecklistItem[] {
  return P0_REQUIRED_METRICS.map((metric) => ({
    metric,
    status,
    sourceCount: 0,
    originalDisclosureChecked: false,
    crossChecked: false,
    note: 'FTC 정보공개서 원문 대조 전',
  }));
}

export function createPartialP0Checklist(partialMetrics: P0Metric[], note: string): P0ChecklistItem[] {
  return P0_REQUIRED_METRICS.map((metric) => {
    const isPartial = partialMetrics.includes(metric);
    return {
      metric,
      status: isPartial ? 'partial' : 'unverified',
      sourceCount: isPartial ? 1 : 0,
      originalDisclosureChecked: false,
      crossChecked: false,
      note: isPartial ? note : 'FTC 정보공개서 원문 대조 전',
    };
  });
}

export function getUnverifiedP0ChecklistItems(brand: Brand): P0ChecklistItem[] {
  return brand.audit.p0Checklist.filter((item) => item.status === 'unverified');
}

export function getP0Limitations(brand: Brand): string[] {
  const limitations: string[] = [];

  if (!brand.audit.p0Verified) {
    limitations.push('P0 데이터 검증 전');
  }

  if (brand.sources.some((source) => source.type === 'manual-assumption')) {
    limitations.push('프로토타입 수동 가정 포함');
  }

  if (brand.cost.recurringCostBasis === 'manual-assumption') {
    limitations.push('반복 비용 가정 포함');
  }

  if (brand.freshness !== 'current') {
    limitations.push(getFreshnessLabel(brand.freshness));
  }

  return limitations;
}

export function getMechanicalCautionLabels(brand: Brand): string[] {
  const labels: string[] = [];
  const hasDisclosureLikeSource = brand.sources.some(
    (source) => source.type !== 'manual-assumption' && Boolean(source.url),
  );

  if (isNegativeLabelAllowed({ hasSource: hasDisclosureLikeSource, hasRule: brand.trendDriven })) {
    labels.push('트렌드 시차 주의');
  }

  return labels;
}

export function getP0ChecklistGaps(brand: Brand): string[] {
  const gaps: string[] = [];
  const checklist = brand.audit.p0Checklist ?? [];
  const checklistMetrics = checklist.map((item) => item.metric);
  const hasFullChecklist =
    checklist.length === P0_REQUIRED_METRICS.length &&
    P0_REQUIRED_METRICS.every((metric, index) => checklistMetrics[index] === metric);
  const checklistVerified = checklist.every(
    (item) =>
      item.status === 'verified' &&
      item.sourceCount >= 1 &&
      item.originalDisclosureChecked &&
      item.crossChecked,
  );

  if (!brand.audit.p0Verified || brand.audit.verificationStatus !== 'verified' || !hasFullChecklist || !checklistVerified) {
    gaps.push('P0 전체 검증 미완료');
  }

  if (brand.sources.some((source) => source.type === 'manual-assumption')) {
    gaps.push('수동 가정 출처 포함');
  }

  if (brand.sources.some((source) => !source.url)) {
    gaps.push('출처 URL 누락');
  }

  if (brand.sources.some((source) => !source.referenceYear)) {
    gaps.push('정보공개서 기준연도 누락');
  }

  if (brand.cost.recurringCostBasis === 'manual-assumption') {
    gaps.push('반복 비용 가정 포함');
  }

  if (getP0NumericAnomalies(brand).length > 0) {
    gaps.push('P0 숫자 검수 필요');
  }

  if (brand.audit.p0Verified && !brand.sources.some((source) => source.type === 'official-disclosure')) {
    gaps.push('공식 정보공개서 출처 누락');
  }

  return gaps;
}

export function getP0CrossCheckSummary(brand: Brand): {
  total: number;
  crossChecked: number;
  crossCheckable: number;
  singleSourceOnly: number;
  missingSource: number;
} {
  const checklist = brand.audit.p0Checklist ?? [];

  return checklist.reduce(
    (summary, item) => {
      summary.total += 1;

      if (item.crossChecked) {
        summary.crossChecked += 1;
      } else if (item.sourceCount >= 2) {
        summary.crossCheckable += 1;
      } else if (item.sourceCount === 1) {
        summary.singleSourceOnly += 1;
      } else {
        summary.missingSource += 1;
      }

      return summary;
    },
    {
      total: 0,
      crossChecked: 0,
      crossCheckable: 0,
      singleSourceOnly: 0,
      missingSource: 0,
    },
  );
}

export function getP0NumericAnomalies(brand: Brand): string[] {
  const anomalies: string[] = [];
  const startupParts = [
    brand.cost.franchiseFeeM,
    brand.cost.trainingFeeM,
    brand.cost.depositM,
    brand.cost.interiorM,
    brand.cost.equipmentM,
    brand.cost.otherStartupM,
  ];
  const startupPartTotal = startupParts.reduce((sum, value) => sum + value, 0);

  if (!isPositiveFinite(brand.cost.startupTotalM) || brand.cost.startupTotalM > 1000) {
    anomalies.push('창업비 단위 확인 필요');
  }

  if (startupParts.some((value) => !isNonNegativeFinite(value))) {
    anomalies.push('창업비 구성 음수/비정상');
  }

  if (Number.isFinite(startupPartTotal) && Math.abs(startupPartTotal - brand.cost.startupTotalM) > 0.2) {
    anomalies.push('창업비 구성 합계 불일치');
  }

  if (!isPositiveFinite(brand.sales.averageAnnualSalesM) || brand.sales.averageAnnualSalesM > 2000) {
    anomalies.push('평균매출 단위 확인 필요');
  }

  if (!isPositiveFinite(brand.sales.salesPerAreaM) || brand.sales.salesPerAreaM > 200) {
    anomalies.push('면적당 매출 단위 확인 필요');
  }

  if (!isPositiveFinite(brand.stability.currentStores) || brand.stability.currentStores > 10000) {
    anomalies.push('가맹점 수 음수/비정상');
  }

  if (
    [brand.stability.directStores, brand.stability.openings3y, brand.stability.closures3y, brand.stability.terminations3y, brand.stability.expirations3y]
      .some((value) => !isNonNegativeFinite(value))
  ) {
    anomalies.push('점포 변동 지표 음수/비정상');
  }

  if (!isUnitRate(brand.cost.recurringRoyaltyRate)) {
    anomalies.push('로열티율 범위 오류');
  }

  if (!isUnitRate(brand.cost.adFeeRate)) {
    anomalies.push('광고비율 범위 오류');
  }

  if (!isUnitRate(brand.cost.requiredPurchaseBurdenRate)) {
    anomalies.push('필수구매율 범위 오류');
  }

  return anomalies;
}

export function getFreshnessLabel(freshness: Freshness): string {
  const labels: Record<Freshness, string> = {
    current: '최신 검토',
    'needs-update': '업데이트 필요',
    outdated: '오래된 자료',
  };
  return labels[freshness];
}

export function isNegativeLabelAllowed(input: { hasSource: boolean; hasRule: boolean }): boolean {
  return input.hasSource && input.hasRule;
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegativeFinite(value: number | undefined): boolean {
  return value !== undefined && Number.isFinite(value) && value >= 0;
}

function isUnitRate(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}
