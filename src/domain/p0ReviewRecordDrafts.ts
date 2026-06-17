import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { buildGyeonggiSourceUrl, toSourcedDisclosurePatch } from './p0SourceSnapshots';
import type { P0ManualReviewRecord, P0ReviewMetricRecord } from './p0ReviewRecords';

const pendingMetric = (rawValue: string, appValueNote: string): P0ReviewMetricRecord => ({
  status: 'partial',
  rawValue,
  appValueNote,
  originalDisclosureChecked: false,
  crossChecked: true,
});

const unverifiedMetric = (rawValue: string, appValueNote: string): P0ReviewMetricRecord => ({
  status: 'unverified',
  rawValue,
  appValueNote,
  originalDisclosureChecked: false,
  crossChecked: false,
});

export function createP0ReviewRecordDrafts(
  snapshots: P0GyeonggiSourceSnapshot[],
): P0ManualReviewRecord[] {
  return snapshots.map(createP0ReviewRecordDraft);
}

export function formatP0ReviewRecordDrafts(drafts: P0ManualReviewRecord[]): string {
  const lines = [
    '// P0 manual review record drafts',
    '// Drafts are not promotion-ready. Replace FTC placeholders and fee values after original disclosure review.',
    'export const p0ManualReviewRecordDrafts = [',
  ];

  for (const draft of drafts) {
    lines.push(formatDraft(draft));
  }

  lines.push('];');

  return lines.join('\n');
}

function createP0ReviewRecordDraft(snapshot: P0GyeonggiSourceSnapshot): P0ManualReviewRecord {
  const patch = toSourcedDisclosurePatch(snapshot);
  const closures3y = snapshot.stability.contractEnds3y + snapshot.stability.terminations3y;

  return {
    brandId: snapshot.brandId,
    disclosureReferenceYear: snapshot.referenceYear,
    disclosureSourceUrl: 'FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED',
    crossCheckSourceUrl: buildGyeonggiSourceUrl(snapshot),
    capturedAt: snapshot.capturedAt,
    researcher: 'codex-gyeonggi-draft',
    reviewer: 'REVIEWER_REQUIRED',
    reviewedAppValues: {
      cost: {
        startupTotalM: patch.cost.startupTotalM,
        franchiseFeeM: patch.cost.franchiseFeeM,
        trainingFeeM: patch.cost.trainingFeeM,
        depositM: patch.cost.depositM,
        interiorM: 0,
        equipmentM: 0,
        otherStartupM: patch.cost.otherStartupM,
        recurringRoyaltyRate: 0,
        adFeeRate: 0,
        requiredPurchaseBurdenRate: 0,
        differenceFranchiseFeeTotalM: 0,
        recurringCostNote: 'FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED',
      },
      sales: {
        averageAnnualSalesM: patch.sales.averageAnnualSalesM,
        salesPerAreaM: patch.sales.salesPerAreaM,
      },
      stability: {
        currentStores: patch.stability.currentStores,
        directStores: patch.stability.directStores,
        storeChange3y: patch.stability.storeChange3y,
        openings3y: patch.stability.openings3y,
        closures3y,
        terminations3y: patch.stability.terminations3y,
        expirations3y: patch.stability.contractEnds3y,
        ownershipTransfers3y: patch.stability.ownershipTransfers3y,
      },
    },
    metrics: {
      'startup-cost': pendingMetric(
        `franchiseFee=${snapshot.costThousandKrw.franchiseFee}천원, trainingFee=${snapshot.costThousandKrw.trainingFee}천원, deposit=${snapshot.costThousandKrw.deposit}천원, otherStartup=${snapshot.costThousandKrw.otherStartup}천원, startupTotal=${snapshot.costThousandKrw.startupTotal}천원`,
        '경기도 구조화 값: 천원 / 1000 = 백만원. FTC 원문 대조 필요.',
      ),
      'store-count-trend': pendingMetric(
        `currentStores=${snapshot.stability.currentStores}, directStores=${snapshot.stability.directStores}, openings3y=${snapshot.stability.openings3y}, storeChange3y=${snapshot.stability.storeChange3y}`,
        '경기도 구조화 값: 건수 그대로 반영. FTC 원문 대조 필요.',
      ),
      'average-sales': pendingMetric(
        `averageAnnualSales=${snapshot.salesThousandKrw.averageAnnualSales}천원, salesPerArea=${snapshot.salesThousandKrw.salesPerArea}천원`,
        '경기도 구조화 값: 천원 / 1000 = 백만원. FTC 원문 대조 필요.',
      ),
      'closure-contract': pendingMetric(
        `contractEnds3y=${snapshot.stability.contractEnds3y}, terminations3y=${snapshot.stability.terminations3y}, ownershipTransfers3y=${snapshot.stability.ownershipTransfers3y}`,
        '경기도 구조화 값: closures3y는 계약종료+계약해지 대리값. FTC 원문 대조 필요.',
      ),
      'margin-fee-total': unverifiedMetric(
        'FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED',
        '차액가맹금 총액은 FTC 원문/가맹금 API 확인 후 백만원 단위로 입력.',
      ),
      'royalty-ad-required-cost': unverifiedMetric(
        'FTC_ORIGINAL_DISCLOSURE_RECURRING_COSTS_REQUIRED',
        '로열티/광고비/필수비용은 FTC 원문/기타비용 API 확인 후 0-1 요율 또는 근거 메모 입력.',
      ),
      'disclosure-source': pendingMetric(
        `referenceYear=${snapshot.referenceYear}, crossCheckSource=${buildGyeonggiSourceUrl(snapshot)}`,
        'FTC 정보공개서 원문 URL과 공개본 목록/API 대조 필요.',
      ),
    },
  };
}

function formatDraft(draft: P0ManualReviewRecord): string {
  return `  ${JSON.stringify(draft, null, 2)
    .replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, '$1:')
    .replace(/"/g, "'")},`;
}
