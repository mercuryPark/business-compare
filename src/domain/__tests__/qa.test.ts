import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import {
  P0_REQUIRED_METRICS,
  getFreshnessLabel,
  getMechanicalCautionLabels,
  getP0ChecklistGaps,
  getP0CrossCheckSummary,
  getP0Limitations,
  getP0MetricLabel,
  getP0NumericAnomalies,
  getUnverifiedP0ChecklistItems,
  isNegativeLabelAllowed,
} from '../qa';

describe('qa helpers', () => {
  it('lists P0 limitation when prototype data is not verified', () => {
    expect(getP0Limitations(brands[0])).toContain('P0 데이터 검증 전');
  });

  it('maps freshness to Korean labels', () => {
    expect(getFreshnessLabel('current')).toBe('최신 검토');
    expect(getFreshnessLabel('needs-update')).toBe('업데이트 필요');
    expect(getFreshnessLabel('outdated')).toBe('오래된 자료');
  });

  it('allows only source-driven negative labels', () => {
    expect(isNegativeLabelAllowed({ hasSource: true, hasRule: true })).toBe(true);
    expect(isNegativeLabelAllowed({ hasSource: true, hasRule: false })).toBe(false);
    expect(isNegativeLabelAllowed({ hasSource: false, hasRule: true })).toBe(false);
  });

  it('derives trend caution labels only when a source and rule are both present', () => {
    const brand = structuredClone(brands.find((item) => item.id === 'yoajung')!);

    expect(getMechanicalCautionLabels(brand)).toContain('트렌드 시차 주의');

    brand.sources = brand.sources.map((source) => ({ ...source, url: undefined }));

    expect(getMechanicalCautionLabels(brand)).not.toContain('트렌드 시차 주의');
  });

  it('requires every brand to carry the full P0 metric checklist', () => {
    for (const brand of brands) {
      const metricKeys = brand.audit.p0Checklist.map((item) => item.metric);
      expect(metricKeys).toEqual(P0_REQUIRED_METRICS);
      expect(getP0ChecklistGaps(brand)).toContain('P0 전체 검증 미완료');
    }
  });

  it('blocks verified status when source metadata is not disclosure-grade', () => {
    const brand = structuredClone(brands[0]);
    brand.audit.p0Verified = true;
    brand.audit.verificationStatus = 'verified';

    expect(getP0ChecklistGaps(brand)).toEqual(
      expect.arrayContaining(['P0 전체 검증 미완료', '공식 정보공개서 출처 누락', '반복 비용 가정 포함']),
    );
  });

  it('surfaces unresolved fee-related P0 checklist items by label', () => {
    const brand = brands.find((item) => item.id === 'hansot');

    expect(brand).toBeDefined();
    expect(getUnverifiedP0ChecklistItems(brand!).map((item) => getP0MetricLabel(item.metric))).toEqual([
      '차액가맹금 총액',
      '로열티/광고비/필수비용',
    ]);
  });

  it('summarizes P0 cross-check readiness by source count and review flag', () => {
    const brand = structuredClone(brands.find((item) => item.id === 'hansot')!);

    expect(getP0CrossCheckSummary(brand)).toEqual({
      total: 7,
      crossChecked: 0,
      crossCheckable: 0,
      singleSourceOnly: 5,
      missingSource: 2,
    });

    brand.audit.p0Checklist[0].sourceCount = 2;
    brand.audit.p0Checklist[1].sourceCount = 2;
    brand.audit.p0Checklist[1].crossChecked = true;

    expect(getP0CrossCheckSummary(brand)).toEqual({
      total: 7,
      crossChecked: 1,
      crossCheckable: 1,
      singleSourceOnly: 3,
      missingSource: 2,
    });
  });

  it('does not flag numeric anomalies for the current sourced dataset', () => {
    for (const brand of brands) {
      expect(getP0NumericAnomalies(brand)).toEqual([]);
    }
  });

  it('flags likely unit typos and startup component mismatches', () => {
    const brand = structuredClone(brands[0]);
    brand.sales.averageAnnualSalesM = brand.sales.averageAnnualSalesM * 1000;
    brand.cost.otherStartupM = brand.cost.otherStartupM + 10;
    brand.stability.currentStores = -1;
    brand.cost.requiredPurchaseBurdenRate = 1.2;

    expect(getP0NumericAnomalies(brand)).toEqual(
      expect.arrayContaining([
        '평균매출 단위 확인 필요',
        '창업비 구성 합계 불일치',
        '가맹점 수 음수/비정상',
        '필수구매율 범위 오류',
      ]),
    );
  });
});
