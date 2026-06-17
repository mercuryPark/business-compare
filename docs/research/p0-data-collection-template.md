# P0 Franchise Data Collection Template

## Source Priority

1. FTC franchise disclosure original record or FTC public-data API.
2. Franchisor official startup-cost page only for fields not available in the disclosure.
3. Credible news or trade publication only as cross-check context.

Do not mark a brand `p0Verified: true` unless every required P0 metric below has been checked against the original disclosure source.

## Official API Source

- Public data page: https://www.data.go.kr/data/15110241/openapi.do
- Gateway host: `https://apis.data.go.kr/1130000/FftcBrandFrcsStatsService`
- Operation: `GET /getBrandFrcsStats`
- Required params: `serviceKey`, `pageNo`, `numOfRows`, `yr`
- Optional params: `resultType=json`

The API metadata was captured on 2026-06-16. Direct calls require a valid public-data service key.

## Official Disclosure List Source

- Public data page: https://www.data.go.kr/data/15125569/openapi.do
- Linked guide: https://franchise.ftc.go.kr/openApi/guide.do
- List request: `GET https://franchise.ftc.go.kr/api/search.do?type=list`
- Title request template: `GET https://franchise.ftc.go.kr/api/search.do?type=title&jngIfrmpSn={jngIfrmpSn}`
- Content request template: `GET https://franchise.ftc.go.kr/api/search.do?type=content&jngIfrmpSn={jngIfrmpSn}`
- Viewer request template: `GET https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn={jngIfrmpSn}`
- Required params: `serviceKey`; list also requires `yr`
- Purpose: find registered public disclosure documents from the FTC franchise information system before entering original-disclosure review records.

This source was rechecked on 2026-06-16. Treat it as the locator for original disclosure documents, not as a substitute for reviewing the disclosure values themselves.

## Official Fee API Sources

The fee APIs were identified from public-data Swagger metadata on 2026-06-16. They require `serviceKey`; unauthenticated calls return `Unauthorized`.

- Franchise-fee API page: https://www.data.go.kr/data/15125476/openapi.do
- Gateway host: `https://apis.data.go.kr/1130000/FftcbrandfrcsjnntinfoService`
- Operation: `GET /getbrandFrcsJnntinfo`
- Required params: `serviceKey`, `pageNo`, `numOfRows`, `resultType`, `jngBizCrtraYr`, `brandMnno`
- Key response fields: `jngAmtSeNm`, `jngAmtScopeVal`, `jngAmtGiveDdlnDateCn`, `jngAmtGvbkCndCn`

- Other-cost API page: https://www.data.go.kr/data/15125478/openapi.do
- Gateway host: `https://apis.data.go.kr/1130000/FftcbrandfrcsbzmnothctinfoService`
- Operation: `GET /getbrandFrcsBzmnOthctinfo`
- Required params: `serviceKey`, `pageNo`, `numOfRows`, `resultType`, `jngBizCrtraYr`, `brandMnno`
- Key response fields: `othctSeNm`, `ctGiveTrgtNm`, `giveAmtCn`, `crtraArAmtScopeVal`, `ctGiveDdlnDateCn`
- Brand-management number convention observed in API examples: `BRD_{frnchsNo}`; verify against the original disclosure/API result before marking a brand verified.

## Cross-Check Source

- Gyeonggi franchise info page: `https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo={frnchsNo}`
- Detail endpoint: `POST https://fair.gg.go.kr/fran/selectBrandInfo.ajax`
- Required form params: `frnchsNo`, `brandYear`
- Header used during verification: `AJAX: true`

This endpoint mirrors disclosure-based fields and was confirmed on 2026-06-16. Treat it as a structured cross-check source, not as a substitute for original FTC disclosure review.

## API Field Mapping

| App field | API/disclosure field | Unit rule |
| --- | --- | --- |
| `stability.currentStores` | `frcsCnt` | count |
| `stability.directStores` | Gyeonggi `droperCo` | count; this is direct-store count, not closure count |
| `stability.openings3y` | `newFrcsRgsCnt` summed over 3 years | count |
| `stability.closures3y` | contract-end + contract-termination proxy until original closure field is checked | count |
| `stability.terminations3y` | `ctrtCncltnCnt` summed over 3 years | count |
| `stability.expirations3y` | `ctrtEndCnt` summed over 3 years | count |
| `stability.ownershipTransfers3y` | `nmChgCnt` summed over 3 years | count |
| `sales.averageAnnualSalesM` | `avrgSlsAmt` | thousand KRW / 1000 = million KRW |
| `sales.salesPerAreaM` | `arUnitAvrgSlsAmt` | thousand KRW / 1000 = million KRW per 3.3m2 |
| `cost.differenceFranchiseFeeTotalM` | fee API and/or original disclosure margin/difference franchise-fee total | null until original amount is found |
| `cost.recurringRoyaltyRate` | recurring fee/disclosure or simulator assumption | unit rate; mark `cost.recurringCostBasis` |
| `cost.adFeeRate` | ad/promotion fee disclosure or simulator assumption | unit rate; mark `cost.recurringCostBasis` |
| `cost.requiredPurchaseBurdenRate` | required purchase/disclosure or simulator assumption | unit rate; mark `cost.recurringCostBasis` |

## Required P0 Metrics

Use the same order as `P0_REQUIRED_METRICS` in `src/domain/qa.ts`.

| Metric | What to record | Verification rule |
| --- | --- | --- |
| `startup-cost` | initial cost, franchise fee, training fee, deposit, interior, equipment, other startup cost | Original disclosure checked |
| `store-count-trend` | current stores, direct stores, 3-year openings | Original disclosure checked |
| `average-sales` | average annual sales, area-unit average sales, regional low/high when available | Original disclosure checked |
| `closure-contract` | closures, terminations, expirations, ownership transfers | Original disclosure checked |
| `margin-fee-total` | total disclosed margin franchise fee / difference franchise fee | Original disclosure checked |
| `royalty-ad-required-cost` | royalty, ad fee, required purchase burden, other recurring mandatory costs | Original disclosure checked |
| `disclosure-source` | disclosure reference year, captured date, exact source URL, source confidence | Original disclosure checked |

## Review Rules

- Enter source numbers in original units first in research notes, then convert into app units.
- Every converted number must include a nearby note with the conversion rule.
- Run numeric guardrails before promoting status: startup components must sum to total within 0.2 million KRW, rates must stay between 0 and 1, annual sales should remain below 2,000 million KRW unless the original disclosure confirms an outlier, and store counts must be positive.
- Run `npm run check:p0` before any automated import or crawler output is promoted into `src/domain/brands.ts`.
- Treat `check:p0` as a preflight gate, not as proof of verification. The command must keep unresolved brands blocked until the original disclosure, fee fields, cross-checks, and reviewer sign-off are complete.
- A second reviewer must compare the app value against the original disclosure before status becomes `verified`.
- If two sources disagree, keep the official disclosure value, add the conflicting source, and lower confidence to `medium` or `low`.
- Negative labels such as high closure risk must come only from mechanical rules in the scoring/QA layer.
- Benchmark-relative grades require at least 3 verified records in the same category. Categories below that threshold stay reference-only.

## Automation Gate

Automated collection can be added only after the P0 manual review shape is stable. Until then, crawler/API output must be treated as candidate input and stopped by the readiness gate when any P0 blocker remains.

Current preflight command:

```bash
npm run check:p0
npm run check:p0:sources
npm run report:p0-workflow
npm run report:p0-review
npm run report:p0-review-todos
npm run report:p0-drafts
npm run report:p0-disclosure-api
npm run fetch:p0-disclosure-api
npm run generate:p0-disclosure-candidates
npm run report:p0-fee-api
npm run report:p0-fee-evidence-sample
npm run fetch:p0-fee-api
npm run fetch:p0-fee-evidence
npm run generate:p0-fee-evidence
npm run report:p0-template-suggestions
npm run generate:p0-template-preview
npm run report:p0-template-import
npm run report:p0-gaps
npm run report:p0-records
npm run report:p0-promotion
npm run report:p0
npm run report:score
npm run report:trade-area
npm run report:automation-policy
```

The repository has two automation gate layers:

- `evaluateP0AutomationReadiness(brands)`: checks whether the current app dataset is ready for automated promotion workflows.
- `evaluateP0CandidateIntake(candidate)`: checks one crawled/API candidate and returns `promote` only when every P0 blocker is cleared; otherwise the candidate remains `quarantine`.

The gates evaluate:

- full P0 checklist coverage and verification status,
- original disclosure and cross-check flags,
- source URL and disclosure reference year,
- numeric guardrails from `src/domain/qa.ts`,
- app values aligned with the captured Gyeonggi source snapshot in `src/domain/p0SourceSnapshots.ts`,
- manual recurring-cost assumptions,
- missing `cost.differenceFranchiseFeeTotalM`.

Expected current state: the command succeeds as a test harness, but the readiness report remains `BLOCKED` for all brands until fee fields and original disclosure review are completed.

`npm run check:p0:sources` only verifies that the app values match the captured Gyeonggi structured source snapshot and source URL metadata. It does not prove FTC original-disclosure review, fee API review, or second-review completion.

`npm run report:p0-workflow` prints the current operator run order: service key setup, official disclosure lookup, official disclosure candidate fetch and handoff, fee evidence fetch, template preview generation, manual template completion, and promotion. Use it as the first status command before continuing P0 replacement work.

`npm run report:p0-review` prints a markdown worksheet for manual reviewers. Use it to work through each brand's FTC original disclosure lookup, fee fields, and second-source cross-check before changing any checklist item to `verified`.

`npm run report:p0-review-todos` prints the exact remaining Markdown-template fields and metric checkboxes per brand. It is the fastest way to see which FTC URL, reviewer, fee value, and original-disclosure check tasks still block template import.

`npm run report:p0-drafts` prints TypeScript-shaped draft records prefilled from the captured Gyeonggi structured source snapshot. These drafts are deliberately not promotion-ready: they keep FTC disclosure URLs, 차액가맹금, recurring-cost fields, and reviewer sign-off as required placeholders.

`npm run report:p0-disclosure-api` prints the official FTC disclosure list URL for each reference year plus title, content, and viewer URL templates that require the `jngIfrmpSn` found in the list response. Use the brand's `lookupKeyword` to match the returned public disclosure row before filling `disclosureSourceUrl` or checking original-disclosure boxes.

`npm run fetch:p0-disclosure-api` fetches the official disclosure list XML, follows `totalCount` pagination for each reference year, and filters returned rows by registered brand name. It prints candidate `jngIfrmpSn` and viewer URLs only; reviewers must still open the viewer/content response, confirm the brand and reference year, and manually fill `disclosureSourceUrl` plus original-disclosure checkboxes.

`npm run generate:p0-disclosure-candidates` writes the fetched official disclosure candidate rows to `docs/research/p0-disclosure-api-candidates/` for reviewer handoff. It requires `DATA_GO_KR_SERVICE_KEY` and still leaves all rows blocked until a reviewer opens the viewer URL and confirms the FTC original disclosure values.

`npm run report:p0-fee-api` prints the official fee and other-cost API request URLs for each brand using the first-candidate `brandMnno = BRD_{frnchsNo}` convention. Set `DATA_GO_KR_SERVICE_KEY` locally before using the URLs. Even with a service key, returned data must be matched back to the brand name and original disclosure before fee values are copied into review records.

`npm run report:p0-fee-evidence-sample` shows how raw fee API fields are normalized into margin-fee and recurring-cost evidence rows. Evidence rows preserve source field names and amount text; they are not verified values until a reviewer compares them against the returned brand and original disclosure.

`npm run fetch:p0-fee-api` uses `DATA_GO_KR_SERVICE_KEY` to fetch the official fee and other-cost API responses and prints only item counts plus blockers. It does not write values into `brands.ts` or `p0ManualReviewRecords`; returned rows still require brand-name confirmation, original disclosure review, and manual review-record entry.

`npm run fetch:p0-fee-evidence` fetches the same official fee and other-cost API responses and normalizes returned rows into margin-fee and recurring-cost evidence candidates. Use this output as the working material for manual review records, not as verified app data.

`npm run generate:p0-fee-evidence` writes the fetched fee evidence candidates to `docs/research/p0-fee-api-evidence/` for reviewer handoff. It requires `DATA_GO_KR_SERVICE_KEY` and still leaves all values blocked until a reviewer confirms the returned brand and original disclosure.

`npm run report:p0-template-suggestions` converts explicit fee API candidate text into suggested manual-template field values where the unit is unambiguous. Suggestions are candidate input only; they do not fill FTC source URLs, reviewer names, or verification checkboxes.

`npm run generate:p0-template-preview` writes preview Markdown files under `docs/research/p0-manual-review-preview/` with fee suggestions and single-match official disclosure viewer URLs applied. Reviewers may use these previews to reduce copy errors, but the canonical templates in `docs/research/p0-manual-review-records/` must still be completed and audited.

`npm run report:p0-template-import` dry-runs the canonical Markdown templates and reports how many are importable as structured manual review records. It remains blocked while FTC URL, reviewer, fee placeholders, or P0 metric checkboxes are incomplete.

`npm run report:p0-gaps` compares current app brands with completed manual review records and reports which brands can be replaced by verified data. It should remain `BLOCKED` until every P0 manual review record is complete and promotion-ready.

`npm run report:p0-records` validates the structured manual review records that will later be used to promote app data. A record is blocked unless it has an FTC disclosure URL, a different second-source URL, separate researcher and reviewer names, and every P0 metric marked as original-disclosure checked and cross-checked with raw-value and conversion notes.

`npm run report:p0-promotion` checks whether the current manual review records can create verified brand-data candidates. Promotion is blocked unless each record also contains the app-ready numeric values for startup cost, sales, stability, 차액가맹금, and recurring fee rates. Do not fill missing fee values from assumptions; use the FTC disclosure, the fee API, or the other-cost API.

`npm run report:p0` prints the operator-facing readiness report and exits with code `1` while blockers remain. This is expected for the current dataset and is useful for CI or crawler jobs that must stop before promoting unverified candidate data.

`npm run report:score` prints the score-readiness audit and exits with code `1` while any brand remains reference-only. This should stay blocked until P0 verification is complete and each category has enough verified same-category records to avoid displaying absolute-looking grades.

`npm run report:trade-area` prints the trade-area readiness audit and exits with code `1` while scenario rent, delivery ratio, expected net profit, and regional data linkage are missing. This should stay blocked until the app integrates a real local trade-area dataset.

`npm run report:automation-policy` combines the P0, score, and trade-area gates. Use it as the final crawler/API promotion gate: crawler output can be collected as candidate input, but it must not be promoted into `src/domain/brands.ts` while this command reports `BLOCKED`.

## Trade-Area Data Candidates

Use these as candidate sources for the next trade-area integration step. Do not populate `expectedNetProfitM`, `monthlyRentM`, or `deliveryRatio` from assumptions.

| Source | Candidate use | Current integration status |
| --- | --- | --- |
| 소상공인시장진흥공단_상가(상권)정보 API, https://www.data.go.kr/data/15012005/openapi.do | Store density, industry code, competitor distribution, address/geocode basis | Candidate only |
| 소상공인시장진흥공단_상가(상권)정보 file data, https://www.data.go.kr/data/15083033/fileData.do | Quarterly nationwide store location snapshot for offline preprocessing | Candidate only |
| 서울시 상권분석서비스 추정매출-상권, https://data.seoul.go.kr/dataList/OA-15572/S/1/datasetView.do | Seoul trade-area sales benchmark by quarter/area | Candidate only |
| 서울시 우리마을가게 상권분석서비스 생활인구, https://www.data.go.kr/data/15094719/fileData.do | Seoul floating/living population by quarter/area/time segment | Candidate only |
| 경기도 상권분석지원 서비스, https://sbiz.gmr.or.kr/map/trdArea.do | Gyeonggi estimated sales and population signals | Candidate only |

Minimum fields before a scenario can move from `structural-only` to `estimated`:

- geographic key: address, coordinates, or official trade-area code,
- comparable industry code and category mapping,
- rent or rent proxy with source and reference period,
- demand proxy such as sales, floating population, or living population,
- delivery ratio or delivery suitability proxy,
- formula note explaining expected-net-profit conversion.

## Brand Research Row

```md
### Brand

- Brand ID:
- Brand name:
- Operator:
- Disclosure reference year:
- Disclosure source URL:
- Captured at:
- Researcher:
- Reviewer:
- Verification status: unverified | partial | verified
- Confidence: low | medium | high

#### Raw P0 Values

| Metric | Raw value | Unit | Source | Cross-check source | Status | Notes |
| --- | ---: | --- | --- | --- | --- | --- |
| Initial cost |  |  |  |  |  |  |
| Current stores |  |  |  |  |  |  |
| 3-year openings |  |  |  |  |  |  |
| Average annual sales |  |  |  |  |  |  |
| Closures/contract termination |  |  |  |  |  |  |
| Difference franchise fee total |  |  |  |  |  |  |
| Royalty/ad/required costs |  |  |  |  |  |  |

#### App Values

| App field | Value | Conversion/check |
| --- | ---: | --- |
| `cost.startupTotalM` |  |  |
| `sales.averageAnnualSalesM` |  |  |
| `sales.salesPerAreaM` |  |  |
| `stability.currentStores` |  |  |
| `stability.openings3y` |  |  |
| `stability.closures3y` |  |  |
| `stability.terminations3y` |  |  |
| `stability.expirations3y` |  |  |
| `stability.ownershipTransfers3y` |  |  |
```
