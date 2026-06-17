import type { Brand } from './types';
import { getP0ChecklistGaps, getP0MetricLabel, getUnverifiedP0ChecklistItems } from './qa';
import type { P0ManualReviewRecord } from './p0ReviewRecords';
import { promoteP0ReviewRecordToBrand } from './p0ReviewRecords';

export interface P0DataReplacementGapBrand {
  brandId: string;
  brandName: string;
  status: 'replaceable' | 'blocked';
  unverifiedMetrics: string[];
  blockers: string[];
  nextAction: string;
}

export interface P0DataReplacementGapReport {
  readyForReplacement: boolean;
  summary: {
    totalBrands: number;
    replaceableBrands: number;
    blockedBrands: number;
    missingManualReviewRecords: number;
  };
  brands: P0DataReplacementGapBrand[];
}

export function evaluateP0DataReplacementGaps(
  brands: Brand[],
  records: P0ManualReviewRecord[],
): P0DataReplacementGapReport {
  const rows = brands.map((brand) => evaluateBrandGap(brand, records));
  const replaceableBrands = rows.filter((row) => row.status === 'replaceable').length;
  const missingManualReviewRecords = rows.filter((row) => row.blockers.includes('수동 원문 대조 기록 없음')).length;

  return {
    readyForReplacement: replaceableBrands === rows.length,
    summary: {
      totalBrands: rows.length,
      replaceableBrands,
      blockedBrands: rows.length - replaceableBrands,
      missingManualReviewRecords,
    },
    brands: rows,
  };
}

export function formatP0DataReplacementGapReport(report: P0DataReplacementGapReport): string {
  const lines = [
    `P0 data replacement gaps: ${report.readyForReplacement ? 'READY' : 'BLOCKED'}`,
    `Replaceable brands: ${report.summary.replaceableBrands}/${report.summary.totalBrands}`,
    `Missing manual review records: ${report.summary.missingManualReviewRecords}`,
    '',
  ];

  for (const brand of report.brands) {
    lines.push(`- ${brand.brandId} ${brand.brandName}: ${brand.status.toUpperCase()}`);
    if (brand.unverifiedMetrics.length > 0) {
      lines.push(`  Unverified metrics: ${brand.unverifiedMetrics.join(', ')}`);
    }
    if (brand.blockers.length > 0) {
      lines.push(`  Blockers: ${brand.blockers.join(', ')}`);
    }
    lines.push(`  Next: ${brand.nextAction}`);
  }

  return lines.join('\n');
}

function evaluateBrandGap(brand: Brand, records: P0ManualReviewRecord[]): P0DataReplacementGapBrand {
  const record = records.find((item) => item.brandId === brand.id);
  const blockers = new Set<string>();

  if (!record) {
    blockers.add('수동 원문 대조 기록 없음');
    for (const blocker of getP0ChecklistGaps(brand)) {
      blockers.add(blocker);
    }
    if (brand.cost.differenceFranchiseFeeTotalM === null) {
      blockers.add('차액가맹금 수치 미확보');
    }
  } else {
    const promotion = promoteP0ReviewRecordToBrand(brand, record);
    for (const blocker of promotion.blockers) {
      blockers.add(blocker);
    }
  }

  return {
    brandId: brand.id,
    brandName: brand.name,
    status: blockers.size === 0 ? 'replaceable' : 'blocked',
    unverifiedMetrics: getUnverifiedP0ChecklistItems(brand).map((item) => getP0MetricLabel(item.metric)),
    blockers: [...blockers],
    nextAction: getNextAction([...blockers]),
  };
}

function getNextAction(blockers: string[]): string {
  if (blockers.includes('수동 원문 대조 기록 없음')) {
    return 'FTC 원문 대조 기록 작성 후 차액가맹금/반복비용까지 검토자 2차 확인';
  }

  if (blockers.length > 0) {
    return '수동 검증 기록의 차단 사유 수정 후 승격 게이트 재실행';
  }

  return '검증 데이터로 브랜드 파일 교체 가능';
}
