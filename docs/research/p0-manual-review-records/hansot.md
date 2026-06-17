# hansot 한솥도시락 P0 원문 대조 기록

## 입력 상태

- disclosureReferenceYear: 2024
- disclosureSourceUrl: FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED
- crossCheckSourceUrl: https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100308
- capturedAt: 2026-06-16
- researcher: codex-gyeonggi-draft
- reviewer: REVIEWER_REQUIRED

## 앱 반영 후보값

- startupTotalM: 100.259
- franchiseFeeM: 6.6
- trainingFeeM: 5.5
- depositM: 4
- interiorM: 0
- equipmentM: 0
- otherStartupM: 84.159
- recurringRoyaltyRate: FTC_ORIGINAL_DISCLOSURE_ROYALTY_RATE_REQUIRED
- adFeeRate: FTC_ORIGINAL_DISCLOSURE_AD_FEE_RATE_REQUIRED
- requiredPurchaseBurdenRate: FTC_ORIGINAL_DISCLOSURE_REQUIRED_PURCHASE_RATE_REQUIRED
- differenceFranchiseFeeTotalM: FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED
- recurringCostNote: FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED
- averageAnnualSalesM: 408.402
- salesPerAreaM: 27.289
- currentStores: 811
- directStores: 1
- storeChange3y: 44
- openings3y: 150
- closures3y: 86
- terminations3y: 81
- expirations3y: 5
- ownershipTransfers3y: 167

## P0 지표별 원문 대조 체크

| P0 지표 | 현재 후보값/원자료 | FTC 원문 확인 | 2차 출처 교차확인 | 검토 메모 |
| --- | --- | --- | --- | --- |
| 초기비용 | franchiseFee=6600천원, trainingFee=5500천원, deposit=4000천원, otherStartup=84159천원, startupTotal=100259천원 | [ ] | [x] | 천원 / 1000 = 백만원. FTC 원문 대조 필요. |
| 가맹점 수 추이 | currentStores=811, directStores=1, openings3y=150, storeChange3y=44 | [ ] | [x] | FTC 원문 대조 필요. |
| 평균매출 | averageAnnualSales=408402천원, salesPerArea=27289천원 | [ ] | [x] | 천원 / 1000 = 백만원. FTC 원문 대조 필요. |
| 폐점/계약해지 지표 | contractEnds3y=5, terminations3y=81, ownershipTransfers3y=167 | [ ] | [x] | closures3y는 계약종료+계약해지 대리값. FTC 원문 대조 필요. |
| 차액가맹금 총액 | FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED | [ ] | [ ] | 백만원 단위로 입력. |
| 로열티/광고비/필수비용 | FTC_ORIGINAL_DISCLOSURE_RECURRING_COSTS_REQUIRED | [ ] | [ ] | 0-1 요율 또는 근거 메모 입력. |
| 정보공개서 기준연도/출처 | referenceYear=2024, crossCheckSource=https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100308 | [ ] | [x] | FTC 원문 URL 필수. |

## 승격 전 차단 조건

- FTC 원문 URL이 FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED이면 승격 금지
- reviewer가 REVIEWER_REQUIRED이면 승격 금지
- 차액가맹금 총액과 로열티/광고비/필수비용 중 하나라도 placeholder이면 승격 금지
- 모든 P0 지표는 원문 대조와 2차 출처 교차확인 결과가 기록되어야 함
