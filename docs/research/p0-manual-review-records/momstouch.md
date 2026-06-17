# momstouch 맘스터치 P0 원문 대조 기록

## 입력 상태

- disclosureReferenceYear: 2024
- disclosureSourceUrl: FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED
- crossCheckSourceUrl: https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100157
- capturedAt: 2026-06-16
- researcher: codex-gyeonggi-draft
- reviewer: REVIEWER_REQUIRED

## 앱 반영 후보값

- startupTotalM: 108.961
- franchiseFeeM: 5.5
- trainingFeeM: 0
- depositM: 2
- interiorM: 0
- equipmentM: 0
- otherStartupM: 101.461
- recurringRoyaltyRate: FTC_ORIGINAL_DISCLOSURE_ROYALTY_RATE_REQUIRED
- adFeeRate: FTC_ORIGINAL_DISCLOSURE_AD_FEE_RATE_REQUIRED
- requiredPurchaseBurdenRate: FTC_ORIGINAL_DISCLOSURE_REQUIRED_PURCHASE_RATE_REQUIRED
- differenceFranchiseFeeTotalM: FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED
- recurringCostNote: FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED
- averageAnnualSalesM: 544.997
- salesPerAreaM: 19.499
- currentStores: 1444
- directStores: 11
- storeChange3y: 35
- openings3y: 123
- closures3y: 71
- terminations3y: 71
- expirations3y: 0
- ownershipTransfers3y: 304

## P0 지표별 원문 대조 체크

| P0 지표 | 현재 후보값/원자료 | FTC 원문 확인 | 2차 출처 교차확인 | 검토 메모 |
| --- | --- | --- | --- | --- |
| 초기비용 | franchiseFee=5500천원, trainingFee=0천원, deposit=2000천원, otherStartup=101461천원, startupTotal=108961천원 | [ ] | [x] | 천원 / 1000 = 백만원. FTC 원문 대조 필요. |
| 가맹점 수 추이 | currentStores=1444, directStores=11, openings3y=123, storeChange3y=35 | [ ] | [x] | FTC 원문 대조 필요. |
| 평균매출 | averageAnnualSales=544997천원, salesPerArea=19499천원 | [ ] | [x] | 천원 / 1000 = 백만원. FTC 원문 대조 필요. |
| 폐점/계약해지 지표 | contractEnds3y=0, terminations3y=71, ownershipTransfers3y=304 | [ ] | [x] | closures3y는 계약종료+계약해지 대리값. FTC 원문 대조 필요. |
| 차액가맹금 총액 | FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED | [ ] | [ ] | 백만원 단위로 입력. |
| 로열티/광고비/필수비용 | FTC_ORIGINAL_DISCLOSURE_RECURRING_COSTS_REQUIRED | [ ] | [ ] | 0-1 요율 또는 근거 메모 입력. |
| 정보공개서 기준연도/출처 | referenceYear=2024, crossCheckSource=https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100157 | [ ] | [x] | FTC 원문 URL 필수. |

## 승격 전 차단 조건

- FTC 원문 URL이 FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED이면 승격 금지
- reviewer가 REVIEWER_REQUIRED이면 승격 금지
- 차액가맹금 총액과 로열티/광고비/필수비용 중 하나라도 placeholder이면 승격 금지
- 모든 P0 지표는 원문 대조와 2차 출처 교차확인 결과가 기록되어야 함
