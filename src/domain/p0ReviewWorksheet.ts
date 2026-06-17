import type { Brand, VerificationStatus } from './types';
import { getP0MetricLabel } from './qa';

const officialDisclosureLookupUrl = 'https://franchise.ftc.go.kr/';

export interface P0ReviewWorksheetRow {
  brandId: string;
  brandName: string;
  verificationStatus: VerificationStatus;
  currentSourceUrl: string;
  officialDisclosureLookupUrl: string;
  unresolvedMetrics: string[];
  originalDisclosureReviewRequired: boolean;
  reviewActions: string[];
}

export interface P0ReviewWorksheet {
  summary: {
    totalBrands: number;
    rowsRequiringOriginalDisclosureReview: number;
    rowsMissingFeeFields: number;
  };
  rows: P0ReviewWorksheetRow[];
}

export function createP0ReviewWorksheet(brands: Brand[]): P0ReviewWorksheet {
  const rows = brands.map(createP0ReviewWorksheetRow);

  return {
    summary: {
      totalBrands: rows.length,
      rowsRequiringOriginalDisclosureReview: rows.filter((row) => row.originalDisclosureReviewRequired).length,
      rowsMissingFeeFields: rows.filter((row) =>
        row.unresolvedMetrics.includes('차액가맹금 총액') || row.unresolvedMetrics.includes('로열티/광고비/필수비용'),
      ).length,
    },
    rows,
  };
}

export function formatP0ReviewWorksheet(worksheet: P0ReviewWorksheet): string {
  const lines = [
    '# P0 Original Disclosure Review Worksheet',
    '',
    `Brands requiring original disclosure review: ${worksheet.summary.rowsRequiringOriginalDisclosureReview}/${worksheet.summary.totalBrands}`,
    `Brands missing fee fields: ${worksheet.summary.rowsMissingFeeFields}/${worksheet.summary.totalBrands}`,
    '',
    '| Brand ID | Brand | Status | Unresolved P0 metrics | Required actions | Current source | FTC lookup |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const row of worksheet.rows) {
    lines.push(
      `| ${row.brandId} | ${row.brandName} | ${row.verificationStatus} | ${row.unresolvedMetrics.join(', ')} | ${row.reviewActions.join(', ')} | ${row.currentSourceUrl} | ${row.officialDisclosureLookupUrl} |`,
    );
  }

  return lines.join('\n');
}

function createP0ReviewWorksheetRow(brand: Brand): P0ReviewWorksheetRow {
  const unresolvedChecklist = brand.audit.p0Checklist.filter(
    (item) => item.status !== 'verified' || !item.originalDisclosureChecked || !item.crossChecked,
  );
  const unresolvedMetrics = unresolvedChecklist.map((item) => getP0MetricLabel(item.metric));
  const originalDisclosureReviewRequired = brand.audit.p0Checklist.some((item) => !item.originalDisclosureChecked);
  const currentSourceUrl = brand.sources.find((source) => source.url)?.url ?? '출처 URL 미확보';
  const reviewActions = new Set<string>();

  if (originalDisclosureReviewRequired) {
    reviewActions.add('FTC 정보공개서 원문 대조');
  }

  if (brand.cost.differenceFranchiseFeeTotalM === null || brand.cost.recurringCostBasis === 'manual-assumption') {
    reviewActions.add('차액가맹금/반복비용 수치 확보');
  }

  if (brand.audit.p0Checklist.some((item) => !item.crossChecked)) {
    reviewActions.add('2차 출처 교차확인');
  }

  return {
    brandId: brand.id,
    brandName: brand.name,
    verificationStatus: brand.audit.verificationStatus,
    currentSourceUrl,
    officialDisclosureLookupUrl,
    unresolvedMetrics,
    originalDisclosureReviewRequired,
    reviewActions: [...reviewActions],
  };
}
