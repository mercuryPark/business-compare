import type { Brand } from './types';
import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { buildGyeonggiSourceUrl, toSourcedDisclosurePatch } from './p0SourceSnapshots';

const outputDir = 'docs/research/p0-manual-review-records';

export interface P0ManualReviewTemplateFile {
  path: string;
  content: string;
}

export function buildP0ManualReviewTemplateFiles(
  snapshots: P0GyeonggiSourceSnapshot[],
  brands: Brand[],
): P0ManualReviewTemplateFile[] {
  const brandFiles = snapshots.map((snapshot) => buildBrandTemplateFile(snapshot, getBrandName(snapshot, brands)));

  return [
    {
      path: `${outputDir}/README.md`,
      content: buildIndexContent(snapshots, brands),
    },
    ...brandFiles,
  ];
}

function buildIndexContent(snapshots: P0GyeonggiSourceSnapshot[], brands: Brand[]): string {
  const lines = [
    '# P0 수동 원문 대조 입력 템플릿',
    '',
    '각 파일은 FTC 정보공개서 원문 대조 후 `src/domain/p0ReviewRecords.ts`의 수동 검증 기록으로 옮기기 위한 입력지입니다.',
    '자동 승격 대상이 아니며, FTC 원문 URL·검토자·차액가맹금·반복비용 항목이 채워질 때까지 BLOCKED 상태로 봅니다.',
    '',
    '## 브랜드 파일',
    '',
  ];

  for (const snapshot of snapshots) {
    lines.push(`- [${snapshot.brandId} ${getBrandName(snapshot, brands)}](./${snapshot.brandId}.md)`);
  }

  return `${lines.join('\n')}\n`;
}

function buildBrandTemplateFile(snapshot: P0GyeonggiSourceSnapshot, brandName: string): P0ManualReviewTemplateFile {
  return {
    path: `${outputDir}/${snapshot.brandId}.md`,
    content: buildBrandTemplateContent(snapshot, brandName),
  };
}

function buildBrandTemplateContent(snapshot: P0GyeonggiSourceSnapshot, brandName: string): string {
  const patch = toSourcedDisclosurePatch(snapshot);
  const crossCheckSourceUrl = buildGyeonggiSourceUrl(snapshot);
  const closures3y = snapshot.stability.contractEnds3y + snapshot.stability.terminations3y;

  return `# ${snapshot.brandId} ${brandName} P0 원문 대조 기록

## 입력 상태

- disclosureReferenceYear: ${snapshot.referenceYear}
- disclosureSourceUrl: FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED
- crossCheckSourceUrl: ${crossCheckSourceUrl}
- capturedAt: ${snapshot.capturedAt}
- researcher: codex-gyeonggi-draft
- reviewer: REVIEWER_REQUIRED

## 앱 반영 후보값

- startupTotalM: ${patch.cost.startupTotalM}
- franchiseFeeM: ${patch.cost.franchiseFeeM}
- trainingFeeM: ${patch.cost.trainingFeeM}
- depositM: ${patch.cost.depositM}
- interiorM: 0
- equipmentM: 0
- otherStartupM: ${patch.cost.otherStartupM}
- recurringRoyaltyRate: FTC_ORIGINAL_DISCLOSURE_ROYALTY_RATE_REQUIRED
- adFeeRate: FTC_ORIGINAL_DISCLOSURE_AD_FEE_RATE_REQUIRED
- requiredPurchaseBurdenRate: FTC_ORIGINAL_DISCLOSURE_REQUIRED_PURCHASE_RATE_REQUIRED
- differenceFranchiseFeeTotalM: FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED
- recurringCostNote: FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED
- averageAnnualSalesM: ${patch.sales.averageAnnualSalesM}
- salesPerAreaM: ${patch.sales.salesPerAreaM}
- currentStores: ${patch.stability.currentStores}
- directStores: ${patch.stability.directStores}
- storeChange3y: ${patch.stability.storeChange3y}
- openings3y: ${patch.stability.openings3y}
- closures3y: ${closures3y}
- terminations3y: ${patch.stability.terminations3y}
- expirations3y: ${patch.stability.contractEnds3y}
- ownershipTransfers3y: ${patch.stability.ownershipTransfers3y}

## P0 지표별 원문 대조 체크

| P0 지표 | 현재 후보값/원자료 | FTC 원문 확인 | 2차 출처 교차확인 | 검토 메모 |
| --- | --- | --- | --- | --- |
| 초기비용 | franchiseFee=${snapshot.costThousandKrw.franchiseFee}천원, trainingFee=${snapshot.costThousandKrw.trainingFee}천원, deposit=${snapshot.costThousandKrw.deposit}천원, otherStartup=${snapshot.costThousandKrw.otherStartup}천원, startupTotal=${snapshot.costThousandKrw.startupTotal}천원 | [ ] | [x] | 천원 / 1000 = 백만원. FTC 원문 대조 필요. |
| 가맹점 수 추이 | currentStores=${snapshot.stability.currentStores}, directStores=${snapshot.stability.directStores}, openings3y=${snapshot.stability.openings3y}, storeChange3y=${snapshot.stability.storeChange3y} | [ ] | [x] | FTC 원문 대조 필요. |
| 평균매출 | averageAnnualSales=${snapshot.salesThousandKrw.averageAnnualSales}천원, salesPerArea=${snapshot.salesThousandKrw.salesPerArea}천원 | [ ] | [x] | 천원 / 1000 = 백만원. FTC 원문 대조 필요. |
| 폐점/계약해지 지표 | contractEnds3y=${snapshot.stability.contractEnds3y}, terminations3y=${snapshot.stability.terminations3y}, ownershipTransfers3y=${snapshot.stability.ownershipTransfers3y} | [ ] | [x] | closures3y는 계약종료+계약해지 대리값. FTC 원문 대조 필요. |
| 차액가맹금 총액 | FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED | [ ] | [ ] | 백만원 단위로 입력. |
| 로열티/광고비/필수비용 | FTC_ORIGINAL_DISCLOSURE_RECURRING_COSTS_REQUIRED | [ ] | [ ] | 0-1 요율 또는 근거 메모 입력. |
| 정보공개서 기준연도/출처 | referenceYear=${snapshot.referenceYear}, crossCheckSource=${crossCheckSourceUrl} | [ ] | [x] | FTC 원문 URL 필수. |

## 승격 전 차단 조건

- FTC 원문 URL이 FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED이면 승격 금지
- reviewer가 REVIEWER_REQUIRED이면 승격 금지
- 차액가맹금 총액과 로열티/광고비/필수비용 중 하나라도 placeholder이면 승격 금지
- 모든 P0 지표는 원문 대조와 2차 출처 교차확인 결과가 기록되어야 함
`;
}

function getBrandName(snapshot: P0GyeonggiSourceSnapshot, brands: Brand[]): string {
  return brands.find((brand) => brand.id === snapshot.brandId)?.name ?? snapshot.registeredBrandName;
}
