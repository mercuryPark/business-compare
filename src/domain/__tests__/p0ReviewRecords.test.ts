import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import {
  createVerifiedReviewMetric,
  formatP0ReviewRecordReport,
  promoteP0ReviewRecordToBrand,
  validateP0ReviewRecords,
  type P0ManualReviewRecord,
} from '../p0ReviewRecords';
import { getP0ChecklistGaps } from '../qa';

const hansotBrand = brands.find((brand) => brand.id === 'hansot')!;

const validHansotRecord: P0ManualReviewRecord = {
  brandId: 'hansot',
  disclosureReferenceYear: 2024,
  disclosureSourceUrl: 'https://franchise.ftc.go.kr/disclosure/hansot',
  crossCheckSourceUrl: 'https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100308',
  capturedAt: '2026-06-16',
  researcher: 'researcher-a',
  reviewer: 'reviewer-b',
  reviewedAppValues: {
    cost: {
      startupTotalM: hansotBrand.cost.startupTotalM,
      franchiseFeeM: hansotBrand.cost.franchiseFeeM,
      trainingFeeM: hansotBrand.cost.trainingFeeM,
      depositM: hansotBrand.cost.depositM,
      interiorM: hansotBrand.cost.interiorM,
      equipmentM: hansotBrand.cost.equipmentM,
      otherStartupM: hansotBrand.cost.otherStartupM,
      recurringRoyaltyRate: 0.02,
      adFeeRate: 0.01,
      requiredPurchaseBurdenRate: 0.08,
      differenceFranchiseFeeTotalM: 12.3,
      recurringCostNote: '정보공개서 원문 반복비용 항목 기준',
    },
    sales: {
      averageAnnualSalesM: hansotBrand.sales.averageAnnualSalesM,
      salesPerAreaM: hansotBrand.sales.salesPerAreaM,
    },
    stability: {
      currentStores: hansotBrand.stability.currentStores,
      directStores: hansotBrand.stability.directStores,
      storeChange3y: hansotBrand.stability.storeChange3y,
      openings3y: hansotBrand.stability.openings3y,
      closures3y: hansotBrand.stability.closures3y,
      terminations3y: hansotBrand.stability.terminations3y,
      expirations3y: hansotBrand.stability.expirations3y,
      ownershipTransfers3y: hansotBrand.stability.ownershipTransfers3y!,
    },
  },
  metrics: {
    'startup-cost': createVerifiedReviewMetric('원문 초기비용 항목 대조', '백만원 환산'),
    'store-count-trend': createVerifiedReviewMetric('원문 가맹점 수 추이 대조', '건수 그대로 반영'),
    'average-sales': createVerifiedReviewMetric('원문 평균매출 대조', '천원 / 1000'),
    'closure-contract': createVerifiedReviewMetric('원문 계약종료/해지 대조', '3년 합산'),
    'margin-fee-total': createVerifiedReviewMetric('원문 차액가맹금 대조', '백만원 환산'),
    'royalty-ad-required-cost': createVerifiedReviewMetric('원문 반복비용 대조', '요율 0-1 환산'),
    'disclosure-source': createVerifiedReviewMetric('정보공개서 기준연도와 URL 대조', '메타데이터 기록'),
  },
};

describe('P0 review records', () => {
  it('reports every brand as missing until a manual original-disclosure review record exists', () => {
    const report = validateP0ReviewRecords(brands, []);

    expect(report.ready).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 10,
      completeRecords: 0,
      missingRecords: 10,
      invalidRecords: 0,
    });
    expect(report.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        status: 'missing',
        blockers: ['수동 원문 대조 기록 없음'],
      }),
    );
  });

  it('accepts a complete two-person review record with every P0 metric verified', () => {
    const report = validateP0ReviewRecords([hansotBrand], [validHansotRecord]);

    expect(report.ready).toBe(true);
    expect(report.summary).toEqual({
      totalBrands: 1,
      completeRecords: 1,
      missingRecords: 0,
      invalidRecords: 0,
    });
    expect(report.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        status: 'complete',
        blockers: [],
      }),
    );
  });

  it('rejects records missing independent review, official source, cross-check, or fee metrics', () => {
    const invalidRecord: P0ManualReviewRecord = {
      ...validHansotRecord,
      disclosureSourceUrl: 'https://example.com/not-official',
      crossCheckSourceUrl: 'https://example.com/not-cross-check',
      reviewer: 'researcher-a',
      metrics: {
        ...validHansotRecord.metrics,
        'margin-fee-total': {
          ...validHansotRecord.metrics['margin-fee-total'],
          status: 'partial',
          originalDisclosureChecked: false,
        },
        'royalty-ad-required-cost': {
          ...validHansotRecord.metrics['royalty-ad-required-cost'],
          crossChecked: false,
        },
      },
    };
    const report = validateP0ReviewRecords([hansotBrand], [invalidRecord]);

    expect(report.ready).toBe(false);
    expect(report.rows[0].status).toBe('invalid');
    expect(report.rows[0].blockers).toEqual(
      expect.arrayContaining([
        '공식 FTC 정보공개서 URL 필요',
        '2차 교차확인 출처 URL 필요',
        '연구자와 검토자 분리 필요',
        '차액가맹금 총액 원문 검증 미완료',
        '로열티/광고비/필수비용 교차확인 미완료',
      ]),
    );
  });

  it('rejects records that reuse the official disclosure URL as the cross-check source', () => {
    const reusedSourceRecord: P0ManualReviewRecord = {
      ...validHansotRecord,
      crossCheckSourceUrl: validHansotRecord.disclosureSourceUrl,
    };
    const report = validateP0ReviewRecords([hansotBrand], [reusedSourceRecord]);

    expect(report.ready).toBe(false);
    expect(report.rows[0].blockers).toContain('공식 출처와 다른 2차 출처 필요');
  });

  it('rejects records without reviewed app values for the promoted brand data', () => {
    const recordWithoutAppValues = {
      ...validHansotRecord,
      reviewedAppValues: undefined,
    } as unknown as P0ManualReviewRecord;
    const report = validateP0ReviewRecords([hansotBrand], [recordWithoutAppValues]);

    expect(report.ready).toBe(false);
    expect(report.rows[0].blockers).toContain('앱 반영값 기록 필요');
  });

  it('promotes a brand only from a complete review record with official source metadata and app values', () => {
    const result = promoteP0ReviewRecordToBrand(hansotBrand, validHansotRecord);

    expect(result.promoted).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.brand?.audit.p0Verified).toBe(true);
    expect(result.brand?.audit.verificationStatus).toBe('verified');
    expect(result.brand?.audit.researcher).toBe('researcher-a');
    expect(result.brand?.audit.reviewer).toBe('reviewer-b');
    expect(result.brand?.cost.differenceFranchiseFeeTotalM).toBe(12.3);
    expect(result.brand?.cost.recurringCostBasis).toBe('official-disclosure');
    expect(result.brand?.sources.map((source) => source.type)).toEqual(['official-disclosure', 'public-data']);
    expect(result.brand?.audit.p0Checklist.every((item) => item.status === 'verified')).toBe(true);
    expect(result.brand ? getP0ChecklistGaps(result.brand) : ['missing']).toEqual([]);
  });

  it('formats and exposes the review-record gate as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-records'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 review records: BLOCKED');
    expect(output).toContain('Records complete: 0/10');
    expect(output).toContain('- hansot 한솥도시락: MISSING');

    expect(formatP0ReviewRecordReport(validateP0ReviewRecords(brands, []))).toContain('Missing records: 10');
  }, 15000);
});
