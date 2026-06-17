# Franchise Compare Dashboard Design

## 1. Product Goal

Build a Korean franchise comparison dashboard for prospective franchise owners.
The prototype focuses on a curated set of 10 franchise brands and helps users compare business attractiveness, risk, operating burden, and estimated profit before they decide whether a brand is worth deeper investigation.

The product should not present itself as financial, tax, legal, or investment advice. It should act as a decision-support tool that organizes public data, web reputation signals, and transparent assumptions into beginner-friendly analysis.

## 2. Prototype Scope

The first prototype covers only these 10 brands:

- 한솥도시락
- 이삭토스트
- 메가커피
- 맘스터치
- 요아정
- 본도시락
- 베스킨라빈스
- 컴포즈커피
- 교촌치킨
- 이디야커피

The initial experience is not a broad search platform. Users see the curated brands, compare them, and open detailed brand reports. Search, automatic brand discovery, and broader franchise coverage are later-stage features.

## 3. Target User

The primary user is a prospective franchise owner in Korea who may not understand franchise disclosure documents, cost structures, local trade areas, delivery economics, or operating risks.

The interface must explain business terms in plain Korean and make the most important signals visually obvious. The first screen must surface the uncomfortable questions that prospective owners actually worry about: "How much can I really take home?", "What hidden costs eat into profit?", "How likely is this to fail?", and "Is the average sales number misleading?" Users should be able to understand:

- Which brands look attractive at a glance.
- Why a brand received a given score.
- What risks must be checked before contacting the franchisor.
- How profit can change depending on rent, delivery ratio, owner labor, required-purchase margins, and trade-area type.
- Whether average sales are distorted by high-performing stores.
- Whether the brand has closure, renewal, or trend-risk signals that require caution.

## 4. Product Positioning

The dashboard should feel like a clear franchise consultant, not a raw data table.

The product tone should be direct but evidence-based:

- Use judgment labels such as "초보자 적합도: 조건부" instead of investment-style recommendation language.
- Always show the data, assumptions, and confidence level behind the statement.
- Avoid unsupported claims such as guaranteed profit, guaranteed payback, or definitive investment recommendations.
- Prefer "적합도", "주의", "추가 확인 필요", and "조건부" labels over "추천" or "비추천" when the wording could sound like investment advice.

## 5. Core User Flows

### 5.1 Dashboard Home

The home dashboard shows all 10 brands with beginner-friendly summary cards.

Each brand card includes:

- Benchmark-relative startup suitability grade.
- Beginner-owner fit label.
- Main business category.
- Estimated startup burden label.
- Closure-risk label.
- Sales-distribution warning when average sales may be misleading.
- Estimated cash-left range after owner labor, loan repayment, and tax/social-insurance reserve.
- Main risk badges.
- Data freshness badge.
- Short consultant-style summary.
- Link to detailed report.

The home page supports category filtering, for example:

- Coffee
- Lunchbox
- Chicken
- Dessert
- Toast/Burger

Same-category comparison is the primary mode. Cross-category scores can be shown for exploration, but they must be labeled as reference-only because coffee, chicken, lunchbox, dessert, and toast/burger businesses have different economics and operating constraints.

Because the prototype brand set is intentionally curated and uneven across categories, the product must not depend on having 3 or more brands in each category. Category grades should use official/public category benchmarks first and the other prototype brands only as secondary context.

### 5.2 Brand Comparison

Users can select 2 to 4 brands and compare them side by side.

The comparison flow should guide users through category selection before brand selection:

1. Choose a category or choose "전체 참고 비교".
2. Show same-category brands first.
3. If the user mixes categories, keep the comparison available but show a persistent "업종이 달라 참고용 비교" label.

The comparison view includes:

- Benchmark-relative suitability grade.
- Cross-category reference score with a clear caution label when different categories are compared.
- Stability score.
- Profitability score.
- Growth score.
- Risk score.
- Startup burden score.
- Operating difficulty score.
- Reputation and demand signal score.
- Estimated monthly net profit range.
- Estimated monthly cash-left range after owner labor, loan repayment, and tax/social-insurance reserve.
- Average sales, regional sales spread, conservative sales scenario, and average-sales caveat.
- Closure rate, contract termination/expiration signals, and average store survival signal when available.
- Estimated startup cost.
- Required-purchase item burden and estimated margin/markup burden.
- Renewal, remodeling, and equipment-replacement reserve.
- Payback-period estimate.
- Key risk summary.

The comparison view should highlight practical takeaways, such as:

- Most stable brand among selected brands.
- Brand with the highest startup burden.
- Brand with the strongest delivery-cost sensitivity.
- Brand with the strongest required-purchase margin sensitivity.
- Brand with the largest average-sales distortion warning.
- Brand with the highest closure-risk signal.
- Brand that needs the most caution for beginners.

### 5.3 Brand Detail Report

Each brand detail page includes:

1. Conclusion card
   - One-line judgment.
   - Beginner-owner fit.
   - Who this brand is suitable for.
   - Who should be cautious.
   - Closure-risk headline.
   - Average-sales caveat.
   - Data freshness notice.

2. Score summary
   - Overall score.
   - Stability.
   - Profitability.
   - Startup burden.
   - Operating difficulty.
   - Growth potential.
   - Risk.
   - Reputation and demand.

3. Net profit simulator
   - Beginner-friendly preset scenarios.
   - Simple adjustable inputs.
   - Owner operation mode.
   - Estimated monthly net profit.
   - Estimated cash left after owner labor, loan repayment, and tax/social-insurance reserve.
   - Estimated net margin.
   - Break-even monthly sales.
   - Estimated payback period.
   - Top cost drivers.
   - Scenario-specific warning.

4. Research report
   - Official disclosure data.
   - Startup-cost details.
   - Sales and profitability assumptions.
   - Sales distribution and average-sales caveat.
   - Store count trend.
   - Closure rate, contract-termination signals, contract-expiration signals, and survival-period notes.
   - Required-purchase items, supply-price restrictions, and estimated margin/markup burden.
   - Renewal, remodeling, equipment-replacement, and other reinvestment obligations.
   - Suitable and unsuitable trade-area patterns.
   - News and dispute signals.
   - Trend-peak risk for highly trend-driven brands.
   - Consumer reputation summary.

5. Before-you-start checklist
   - Questions users should ask the franchisor.
   - Required-purchase and supply-price questions.
   - Owner-labor and staffing questions.
   - Trade-area checks.
   - Cost checks.
   - Contract checks.
   - Renewal/remodeling checks.
   - Operation checks.
   - Information-disclosure-document original link and print/export action.

6. Source and confidence section
   - Source URLs.
   - Reference year.
   - Research date.
   - Confidence level.
   - Human interpretation notes.

## 6. Evaluation Model

The prototype should not imply false precision. Internal calculations can use 0-100 normalized scores, but the user-facing display should emphasize grades, labels, ranges, and evidence.

Primary user-facing formats:

- Benchmark-relative grade: A, B, C, D, or E against available public/category benchmarks.
- Judgment label: "양호", "보통", "주의", "고위험", or "자료 부족".
- Numeric score only as a secondary reference with a tooltip explaining the normalization.

Same-category comparisons are the main decision unit. Cross-category comparisons can be shown, but the UI must label them as "업종이 달라 참고용 비교" because the economics of coffee, chicken, lunchbox, dessert, and toast/burger brands differ.

Scores should be explainable and accompanied by source data, reference year, data freshness, and confidence labels.

### 6.1 Overall Startup Suitability

A composite score that summarizes whether the brand is attractive for a prospective owner.

It should combine:

- Stability.
- Profitability.
- Closure and survival risk.
- Startup burden.
- Operating difficulty.
- Risk.

The first prototype uses these default weights:

- Profitability: 30%.
- Closure and survival risk: 20%.
- Stability: 15%.
- Risk: 15%.
- Startup burden: 10%.
- Operating difficulty: 10%.

Growth potential and reputation/demand are shown as separate context indicators, not default composite-score inputs. In the prototype, these signals can be volatile, unevenly sourced, or misleading for trend-driven brands. They can raise or lower caution labels, but they should not make an otherwise risky brand look attractive through a small positive score contribution.

These weights reflect the product goal: prospective owners care most about actual take-home profit and failure risk. The score must also penalize unstable, risky, costly, or overly difficult businesses. The interface should still show all individual dimension scores clearly so users do not rely only on the composite number.

For the prototype, grades are calibrated in this order:

1. Use official disclosure data and public/category benchmarks when available.
2. Use disclosed regional averages and store-count trends as benchmark substitutes when distribution data is unavailable.
3. Use same-category prototype brands as secondary context, not as the sole grading basis.
4. If neither official data nor credible benchmark substitutes are available, show "자료 부족" instead of a precise grade.

The product must never imply that a 10-brand sample is enough to produce a universal absolute score for the entire Korean franchise market. It must also avoid making the grade system work only for categories with 3 prototype brands.

### 6.1.1 Model QA And Calibration

The scoring model must be validated after all 10 prototype brands have P0 data entered.

Required model QA loop:

1. Calculate raw dimension scores and benchmark-relative grades for all 10 brands.
2. Produce a model QA table showing each brand's rank, grade, strongest driver, weakest driver, and confidence.
3. Run a domain-sense review with at least one reviewer who understands franchise economics.
4. Flag surprising results, for example a high-risk trend brand receiving an A grade or a mature stable brand receiving an E grade.
5. Investigate each surprising result in this order: source error, unit conversion error, formula error, missing P0 field, benchmark mismatch, then weight issue.
6. Adjust weights or thresholds only after source and formula issues are ruled out.
7. Record every weight or threshold change with the reason and before/after result.
8. Freeze the model version used for the public prototype and show the model version in the source/confidence section.

The model should be calibrated against plausible business judgment, but the product must not manually force a brand into a desired grade without a documented data or model reason.

### 6.2 Stability

Measures whether the brand appears operationally stable.

Inputs include:

- Brand age.
- Franchise-business age.
- Current franchise store count.
- Direct store count.
- Store-count trend over the last 3 years.
- New openings.
- Ownership-transfer count.
- Headquarters continuity and financial notes when available.

### 6.3 Closure And Survival Risk

Measures the direct failure-risk signals prospective owners care about most.

This dimension must be shown on the brand card and comparison screen, not hidden inside a broader stability score.

Inputs include:

- Closure rate.
- Contract termination rate.
- Contract expiration/non-renewal signal.
- Store-count decline signal.
- Ownership-transfer count and interpretation.
- Average store operating period or survival-period signal when available.
- Ratio of closures to new openings.
- Multi-year trend, not a single-year snapshot.
- Confidence warning when disclosure data is old or incomplete.

### 6.4 Profitability

Measures whether a store can plausibly produce attractive owner earnings after major costs.

Inputs include:

- Average annual sales.
- Monthly sales conversion.
- Sales distribution, not only average sales.
- Regional average-sales spread from disclosure data when available.
- Conservative sales scenario based on regional averages, disclosed lower values, or manual benchmark assumptions.
- Median-like or lower-quartile benchmark only when a credible source exists.
- Average-sales caveat when only average sales are available.
- Sales per area.
- Estimated cost of goods sold.
- Required-purchase items.
- Average required-purchase margin burden or indirect franchise-fee burden from disclosure data when available.
- Item-level supply-price range only when available; do not imply exact item-level margin if the source does not provide it.
- Estimated labor burden.
- Owner-labor cost or opportunity cost.
- Loan-principal and interest payment scenario.
- Tax/social-insurance reserve scenario.
- Rent sensitivity.
- Delivery platform and delivery-agency costs.
- Royalty and advertising fee burden.
- Renewal, remodeling, equipment-replacement, and maintenance reserve.
- Estimated monthly net profit range.
- Estimated cash-left range after owner-labor, debt-service, and tax/social-insurance assumptions.
- Estimated payback period.

### 6.5 Startup Burden

Measures how difficult the initial investment is for a new owner.

Inputs include:

- Franchise fee.
- Training fee.
- Deposit.
- Interior cost.
- Equipment and fixtures.
- Other required startup costs.
- Total estimated startup cost.
- Reference store size.
- Excluded costs such as lease deposit, key money, HVAC, electrical upgrade, and special construction.
- Required initial purchase package.
- Equipment lease or replacement obligations.

### 6.6 Operating Difficulty

Measures how hard the business is to run day to day.

Inputs include:

- Cooking or preparation complexity.
- Required staff level.
- Beginner operation difficulty.
- Delivery dependence.
- Peak-hour concentration.
- Seasonality.
- Inventory-management difficulty.
- Headquarters training and support.
- Difference between owner-operated and manager-operated operation.

### 6.7 Growth Potential

Measures whether the brand and category appear to have room to grow.

Inputs include:

- Recent store-opening trend.
- Category trend.
- Brand-awareness trend.
- Menu expansion potential.
- Market saturation risk.
- Trend-peak risk for brands whose demand may be driven by short-lived consumer trends.

### 6.8 Risk

Measures negative signals that may affect owners.

Inputs include:

- Franchise disputes.
- Litigation.
- Fair Trade Commission sanctions or relevant issues.
- Negative news.
- Consumer complaint patterns.
- Category saturation.
- Trend dependence.
- Raw-material price sensitivity.
- Headquarters operating or financial concerns.
- Required-purchase price-change risk.
- Contract renewal and remodeling-cost risk.
- Data freshness risk.

### 6.9 Reputation And Demand

Measures consumer-facing demand and sentiment.

Inputs include:

- Brand awareness.
- Search-interest signal.
- Review sentiment.
- Social/community mentions.
- Main customer segment.
- Repeat-purchase potential.
- Price competitiveness.
- Menu competitiveness.

## 7. Net Profit Simulator

The net profit simulator is a core prototype feature because prospective owners often care most about actual take-home earnings, not only sales.

### 7.1 Simulator Scope

The first version uses a preset-first calculator. It should feel simple even though the model contains many assumptions.

The simulator follows progressive disclosure: show a useful result first, then let users open advanced assumptions only when they want to inspect or change them.

The default state must be fully populated from scenario and trade-area presets so a beginner can read useful results without typing any numbers.

Primary visible inputs:

- Scenario preset.
- Trade-area type.
- Expected monthly sales.
- Monthly rent.
- Delivery sales ratio.
- Owner operation mode: owner-operated, mixed, or manager-operated.

Secondary inputs are hidden behind "상세 비용 조정" by default:

- Staff count or labor-cost level.
- Owner monthly labor-cost assumption when the owner works in the store.
- Startup loan amount, interest rate, and repayment period.
- Tax/social-insurance reserve mode: off, simple reserve, or custom monthly amount.
- Required-purchase burden override.
- Renewal/remodeling reserve override.

The calculator should never require more than the primary visible inputs before showing a result.

The system fills the remaining assumptions using brand/category defaults:

- Cost of goods sold rate.
- Required-purchase item ratio.
- Required-purchase margin/markup burden or indirect franchise-fee burden.
- Delivery-app commission.
- Delivery-agency cost.
- Packaging cost.
- Card fee.
- Royalty.
- Advertising fee.
- Renewal, remodeling, equipment-replacement, and maintenance reserve.
- Monthly loan-principal and interest payment.
- Tax/social-insurance reserve.
- Utilities and maintenance.
- Other operating expenses.

### 7.2 Preset Scenarios

Users who do not have their own numbers can start from example data.

Scenario presets:

- Conservative scenario: lower sales, higher rent burden, higher delivery ratio.
- Average scenario: typical sales and typical cost assumptions.
- Optimistic scenario: stronger sales, controlled rent, better operating efficiency.

Trade-area presets:

- Residential.
- Office.
- University area.
- Station-area.
- Delivery-focused.
- Special commercial area.

Each preset modifies sales, rent, labor, delivery ratio, and risk notes.

Each preset must state whether the displayed profit is before or after owner-labor cost. The default display should be after owner-labor cost so the calculator does not overstate take-home profit for owner-operated stores.

### 7.3 Simulator Outputs

The calculator shows:

- Estimated operating profit before owner-labor cost.
- Estimated operating profit after owner-labor cost.
- Estimated cash left after owner-labor cost, loan repayment, and tax/social-insurance reserve.
- Estimated net margin.
- Break-even monthly sales.
- Estimated payback period.
- Top 3 cost drivers.
- Required-purchase and indirect-fee burden.
- Owner-labor cost impact.
- Loan repayment impact.
- Tax/social-insurance reserve impact.
- Renewal/remodeling reserve impact.
- Profit sensitivity warning.

Example warning:

"배달 비중이 높아질수록 매출은 커질 수 있지만, 플랫폼 수수료와 포장비 때문에 순이익률이 낮아질 수 있습니다. 이 조건에서는 객단가와 재주문율 확인이 중요합니다."

Additional required warning:

"사장이 직접 근무하는 경우에도 노동시간에는 비용이 있습니다. 본인 인건비를 0원으로 보면 실제 가져가는 돈이 과대평가될 수 있습니다."

Additional required warning:

"대출 원리금 상환과 세금/4대보험 적립액을 빼기 전 금액은 실제 생활비로 가져갈 수 있는 돈과 다를 수 있습니다. 이 계산기는 세무 자문이 아니므로 정확한 세후 금액은 세무 전문가와 확인해야 합니다."

Additional required warning:

"필수구매품목과 공급가격 구조에 따라 로열티가 낮아 보여도 실제 원가 부담이 커질 수 있습니다. 정보공개서와 가맹계약서의 필수품목, 공급가격 산정방식, 차액가맹금 관련 내용을 반드시 확인해야 합니다."

### 7.4 Simulator Disclaimer

Every simulator result must clearly state that it is an estimate based on public data and assumptions.

Required notice:

"이 계산은 공개 자료와 업종 평균 가정을 바탕으로 한 예비 시뮬레이션이며, 실제 수익은 점포 위치, 임대료, 인건비, 운영 방식에 따라 달라질 수 있습니다."

### 7.5 Profit Definitions

The simulator must label profit definitions clearly:

- Operating profit before owner labor: sales minus estimated store operating costs, before valuing the owner's working time.
- Operating profit after owner labor: operating profit after subtracting the owner's labor opportunity cost.
- Cash after financing reserve: operating profit after owner labor, loan-principal/interest payment, and tax/social-insurance reserve.

The product should use "실수령 추정" only for the third definition and should always show the assumptions beside the number.

## 8. Research Data Template

Each brand should be researched using the same structured fields.

Each field must be tagged as P0, P1, or P2:

- P0: Required for prototype trust. If missing, the brand card and detail page must show a visible limitation.
- P1: Important supporting data. Use when available, but do not block the prototype.
- P2: Nice-to-have enrichment. Do not let missing P2 data create noisy "자료 부족" blocks.

### 8.0 Prototype Data Priority

P0 fields:

- Official disclosure-document reference year.
- Headquarters/operator name.
- Category.
- Current franchise store count.
- Store-count change over the last 3 years.
- New openings, closures, contract expirations, and terminations where disclosed.
- Closure-rate or closure-risk proxy.
- Average annual sales and monthly conversion.
- Regional average-sales spread or regional sales table when available.
- Sales per area.
- Franchise fee, training fee, deposit, interior, equipment, other initial cost, and total estimated startup cost.
- Average required-purchase margin burden or indirect franchise-fee burden when disclosed.
- Required-purchase item existence and supply-price structure notes.
- Royalty, advertising fee, and other recurring franchisor fees.
- Owner-labor assumption.
- Loan repayment assumption.
- Tax/social-insurance reserve assumption.
- Data freshness label.

P1 fields:

- Average store operating period or survival-period signal.
- Ownership transfers.
- Headquarters financial stability notes.
- Conservative sales scenario derived from regional averages or credible external benchmarks.
- Delivery-cost assumptions.
- Renewal, remodeling, equipment replacement, and maintenance reserve.
- Trend-peak risk.
- Suitable and unsuitable trade-area patterns.
- News, dispute, and sanctions signals.

P2 fields:

- Median sales.
- Bottom-quartile sales.
- Item-level required-purchase margin.
- Detailed item-level supply-price analysis.
- Review sentiment scoring.
- Search-interest score.
- Social/community sentiment score.

If a P2 field is missing, the UI should not display a prominent missing-data warning. It should simply omit the enrichment or mention it in the source section.

Required-purchase and indirect-fee caveat:

- Public disclosure may show average burden or ratio, not the exact item-level margin a specific store will experience.
- The disclosed average can understate or overstate a specific store's actual burden depending on sales mix, supplier terms, store size, and excluded/self-manufactured items.
- The UI should treat this as a required-purchase burden signal, not a precise cost guarantee.
- The before-you-start checklist must ask users to verify required items, supply-price calculation method, price-change rules, and recent supply-price changes directly with the franchisor.

### 8.1 Basic Brand Data

- Brand name.
- Headquarters/operator name.
- Category.
- Brand launch year.
- Franchise-business start year.
- Current franchise store count.
- Direct store count.
- Store-count change over the last 3 years.
- Official website.
- Reference year.

### 8.2 Startup Cost Data

- Franchise fee.
- Training fee.
- Deposit.
- Interior cost.
- Equipment and fixtures.
- Other initial costs.
- Total estimated startup cost.
- Reference area.
- Excluded costs and notes.
- Required initial inventory and required initial purchase package.
- Initial equipment lease, rental, or maintenance obligations.
- Expected renewal, remodeling, signboard, equipment-replacement, and facility-maintenance obligations.
- Contract-renewal cost notes.

### 8.3 Sales And Profitability Data

- Average annual sales.
- Monthly sales conversion.
- Regional average-sales spread from disclosure data when available.
- Conservative sales scenario derived from regional averages or credible external benchmarks.
- Median sales or lower-store sales benchmark only when a credible source exists.
- Sales-distribution note.
- Average-sales distortion warning.
- Sales per area.
- Estimated cost of goods sold.
- Required-purchase item list.
- Average required-purchase burden or monthly estimate.
- Average required-purchase margin/markup or indirect-franchise-fee estimate.
- Sales-to-required-purchase-burden ratio when disclosed.
- Supply-price restriction and price-change notes.
- Estimated labor burden.
- Owner-labor assumption.
- Owner-labor opportunity-cost amount.
- Owner-operated versus manager-operated scenario.
- Startup loan amount, interest, repayment period, and monthly payment assumption.
- Tax/social-insurance reserve assumption.
- Estimated rent burden.
- Estimated delivery-cost burden.
- Estimated operating-expense burden.
- Renewal/remodeling/equipment reserve.
- Estimated net margin range.
- Estimated cash-left range after owner labor, loan repayment, and tax/social-insurance reserve.
- Estimated payback memo.

### 8.4 Stability Data

- New openings over the last 3 years.
- Contract expirations and terminations over the last 3 years.
- Ownership transfers.
- Closure count and closure rate.
- Termination rate.
- Contract-expiration/non-renewal signal.
- Average store operating period or survival-period signal when available.
- Closure-to-opening ratio.
- Store-count trend.
- Brand age.
- Headquarters stability notes.

### 8.5 Risk Data

- Franchise disputes or litigation.
- Fair Trade Commission issues.
- Recent negative news.
- Consumer complaint patterns.
- Category saturation risk.
- Trend-dependence risk.
- Trend-peak risk.
- Raw-material price sensitivity.
- Required-purchase price-change risk.
- Renewal/remodeling cost risk.
- Data freshness risk.

### 8.6 Operating Data

- Preparation complexity.
- Required staffing.
- Beginner difficulty.
- Delivery dependence.
- Peak-time concentration.
- Seasonality.
- Inventory-management difficulty.
- Headquarters training and support.

### 8.7 Reputation And Demand Data

- Brand awareness.
- Search-interest signal.
- Review sentiment.
- Social/community signal.
- Main customer segment.
- Repeat-purchase signal.
- Price competitiveness.
- Menu competitiveness.

### 8.8 Owner Fit Data

- Beginner-owner fit.
- Small-capital fit.
- Couple/family operation fit.
- One-person operation possibility.
- Multi-store expansion fit.
- Recommended trade-area types.
- Trade-area types to avoid.
- Reason each trade-area type is suitable or unsuitable.
- Minimum local checks before site selection.

### 8.9 Data Freshness

Each brand should show freshness visibly on cards and detail pages.

- Latest disclosure-document reference year.
- Latest news-review period.
- Research date.
- Staleness label: current, needs update, or outdated.
- User-facing warning when official data is 1 or more years old.

### 8.10 Source Management

Every important field should store:

- Source type.
- Source URL or document reference.
- Reference year.
- Research date.
- Confidence level: high, medium, or low.
- Human interpretation note.

### 8.11 Data QA Workflow

Manual research must go through a verification workflow before it appears in the public prototype.

Required steps:

1. Primary entry: researcher records the value, source URL/document, page/section reference, reference year, unit, and capture date.
2. Unit normalization: amounts, areas, monthly/annual values, VAT inclusion, and store-count periods are normalized into the product's standard format.
3. Independent check: a second reviewer compares every P0 value against the original source before release.
4. Formula check: derived values such as monthly sales, closure rate, required-purchase burden ratio, cash-left estimate, and payback period are recalculated from stored inputs.
5. Outlier check: values that differ sharply from category norms or prior-year values are flagged and rechecked.
6. Source conflict check: if official disclosure data and franchisor marketing pages differ, official disclosure is preferred and the conflict is noted.
7. Release sign-off: a brand report cannot be marked public until all P0 values are checked or explicitly marked as unavailable.

Every public brand report should keep an internal audit trail:

- Researcher.
- Reviewer.
- Last verification date.
- Changed fields.
- Source version or capture reference.
- Reason for confidence changes.

Critical numeric fields need stricter review:

- Total startup cost.
- Average annual sales.
- Regional average-sales table.
- Store-count change.
- Closure, termination, and expiration counts.
- Required-purchase or indirect-fee burden.
- Loan and tax reserve assumptions.

### 8.12 Data Refresh Operations

The prototype needs an explicit refresh rhythm so freshness badges do not become decorative.

Refresh rules:

- Official disclosure data: review at least annually, and sooner when a new disclosure document is registered or discovered.
- News, disputes, and sanctions: review monthly during prototype operation.
- Trend-driven brand signals: review biweekly while the brand is marked trend-driven.
- Simulator assumptions: review quarterly or when fee/rate assumptions materially change.
- Manual correction requests: triage within 5 business days.

Each report should show:

- Last research date.
- Last P0 verification date.
- Next scheduled review month.
- Whether the report is current, needs update, or outdated.

## 9. Visual Design Principles

The dashboard should be mobile-first, clear, dense, and decision-oriented. Mobile users must see the most important decision signals before detailed charts.

Mobile-first priority order:

1. Suitability label and confidence.
2. Estimated cash left after owner labor, loan repayment, and tax/social-insurance reserve.
3. Closure-risk label.
4. Required-purchase/indirect-fee burden.
5. Average-sales caveat.
6. Startup cost.
7. Key risk badges.
8. Expandable detailed charts and source tables.

Use:

- Score gauges for overall suitability.
- Grade labels for benchmark-relative judgment.
- Horizontal bars for dimension scores.
- Closure-risk badges on brand cards.
- Data freshness badges on brand cards.
- Risk badges for urgent warnings.
- Cost breakdown charts for expense structure.
- Sales-distribution visuals that distinguish average, conservative, and high-performing scenarios.
- Scenario cards for profit simulation.
- Owner-operated versus manager-operated simulator toggle.
- Accordion sections for dense mobile content.
- Sticky compare action on mobile after a user selects a brand.
- Comparison tables only where structured comparison is necessary.
- Tooltips for business terms.

Avoid:

- A marketing landing page as the first screen.
- Decorative visuals that do not help decision-making.
- Long text blocks before the main conclusion.
- Unexplained financial jargon.
- Score-only rankings without supporting evidence.
- Cross-category ranking that looks more authoritative than the data supports.
- Wide desktop-style tables as the primary mobile layout.

## 10. Lightweight Personalization

The prototype can support a no-account assumption panel so users are not forced into a one-size-fits-all view.

Inputs:

- Available startup capital range.
- Full-time owner operation or manager-operated preference.
- Experience level.
- Preferred category.
- Preferred trade-area type.
- Delivery-heavy operation tolerance.

These inputs should filter, hide, or annotate the curated 10 brands only within the prototype. They must not recalculate the benchmark-relative grade itself.

Personalization can change:

- Which brands are highlighted.
- Which warnings are shown first.
- Whether a brand is marked "자본금 조건과 맞지 않음" or "오토 운영에는 주의".
- Which simulator preset is selected by default.

Personalization cannot change:

- Source data.
- Benchmark-relative grade.
- Closure-risk label.
- Required-purchase burden label.
- Data freshness or confidence label.

This keeps objective brand evaluation separate from user-specific fit.

## 11. Trade-Area Handling In Prototype

Full location-level commercial-area scoring is out of scope for the first prototype, but the product must not ignore location.

Each brand report should include:

- Trade-area types where the brand is likely to fit.
- Trade-area types where caution is needed.
- Why the brand may fit or fail in each trade-area type.
- A clear limitation notice that exact store performance requires address-level foot traffic, competitor density, rent, delivery coverage, and local demand analysis.

The simulator's trade-area presets are educational assumptions, not address-level forecasts.

## 12. Data Strategy

The prototype starts with manually researched data for the 10 brands.

The data model should be structured so that later versions can replace or supplement manual research with automated data sources:

- Franchise disclosure data.
- Fair Trade Commission franchise data.
- Statistics Korea or public commercial-area data.
- News articles.
- Reviews.
- Search-interest signals.
- Social/community signals.

Manual fields and automated fields should use the same source, date, confidence, and interpretation structure where possible.

### 12.1 Source Priority

Research should prioritize sources in this order:

1. Official franchise disclosure data and disclosure-document originals.
2. Fair Trade Commission materials and franchise-related public notices.
3. Franchisor official startup pages and contract/disclosure materials.
4. Public statistics and commercial-area datasets.
5. News articles.
6. Reviews, social, search-interest, and community signals.

Official disclosure and Fair Trade Commission sources are especially important for:

- Required-purchase items.
- Supply-price calculation method.
- Indirect franchise fees or required-purchase margin burden.
- Store-count changes.
- Closure, contract expiration, and termination signals.
- Average sales and disclosed sales basis.
- Legal violations, sanctions, and dispute signals.

When official data is old, the product must show the reference year visibly instead of treating the number as current.

### 12.2 Trend-Driven Brand Handling

For brands with rapid recent growth or strong social trend dependence, official disclosure data may lag behind current reality. These brands need a separate trend-data treatment.

Trend-driven brand analysis should:

- Keep official disclosure data as the legal/structural baseline.
- Increase the prominence of recent news, search-interest direction, social/community signals, store-opening velocity, and consumer-review changes.
- Show a "공식자료 시차 주의" badge when the disclosure year predates the brand's rapid growth period.
- Separate "recent demand heat" from "sustainable business quality".
- Treat strong recent growth as a volatility signal, not only a positive growth score.
- Avoid letting trend heat improve the composite grade unless profitability, closure risk, and operating burden are also credible.

This is especially relevant for fast-rising dessert or novelty-driven brands where the main risk is entering near the demand peak.

### 12.3 Public Brand Risk Controls

The prototype evaluates real named brands, so public wording must be designed for factual accuracy, traceability, and correction.

This section is an operational risk-control requirement, not legal advice. Before public launch, a qualified legal review should confirm the final wording, labels, and correction process.

Required controls:

1. Fact/opinion separation
   - Facts: numeric values, source excerpts, dates, and official-source references.
   - Model outputs: grades, labels, simulator results, and calculated ratios.
   - Human interpretation: plain-language explanation and caution notes.
   - The UI must visually separate these layers.

2. Negative labels must be source-driven
   - Labels such as "고위험", "폐점 리스크 주의", or "자료 시차 주의" must come from documented thresholds or missing-data rules.
   - A human note may explain the label, but it must not create a negative label without source data or a documented model rule.

3. Avoid unsupported wording
   - Do not say a brand is "bad", "failing", "unsafe", "scam", or "not recommended".
   - Prefer "공개자료 기준 폐점 리스크 주의", "공식자료 시차 주의", "추가 확인 필요", or "조건부 적합".
   - When a label is based on incomplete data, state the limitation beside the label.

4. Correction request path
   - Every report should include a "자료 정정 요청" path.
   - Correction requests should capture the disputed field, claimant, evidence, and requested correction.
   - P0 disputes should be triaged within 5 business days.
   - During review, the affected field can show "정정 요청 검토 중" if the dispute is material.

5. Publication gate
   - A report cannot be publicly published if it has unchecked P0 negative labels.
   - High-impact negative labels must show the exact source basis or model rule.
   - Human interpretation notes must be reviewed for tone before publication.

This matters because Korean defamation risk can arise around public statements of fact as well as false factual statements online; the product should therefore keep source basis, public-interest framing, and correction process explicit.

## 13. Error Handling And Trust

The product must handle incomplete or uncertain data visibly.

If data is missing:

- Show "자료 부족" rather than hiding the field.
- Do not calculate a misleading precise score.
- Show lower confidence.
- Explain what information should be checked directly with the franchisor.
- Avoid replacing missing sales distribution, required-purchase burden, or closure data with optimistic assumptions.
- Distinguish P0 missing data from P1/P2 missing data so the interface does not overwhelm users with low-value warnings.
- If a P0 field is missing, show a concise limitation on the relevant card.
- If a P2 field is missing, omit it from the main UI and mention it only in the source/limitations area if useful.

If sources conflict:

- Show the preferred source.
- Note the conflict.
- Lower the confidence level.

If a simulator input creates unrealistic results:

- Warn the user.
- Keep the calculation visible.
- Explain which assumption is causing the issue.

If only average sales are available:

- Show the average-sales caveat beside the number.
- Prefer scenario ranges over a single take-home profit.
- Use disclosed regional average-sales spread as the first distribution substitute when available.
- Label regional spread as a proxy, not true store-level distribution.
- Encourage the user to ask the franchisor for distribution or comparable-store data.

## 14. Post-Comparison Actions

After comparing brands or reading a report, users should have clear next actions:

- Open the original disclosure-document source when available.
- Print or export the before-you-start checklist.
- Save or copy simulator assumptions.
- View questions to ask the franchisor about required purchases, supply prices, owner labor, closure data, and renewal costs.
- Mark unresolved items as "must verify before contract".

## 15. Success Criteria

The prototype is successful if a user can:

- Understand the relative strengths and risks of the 10 brands within a few minutes.
- Compare 2 to 4 brands without knowing franchise terminology.
- Use the simulator from presets without completing advanced inputs.
- See how estimated net profit changes by trade area and delivery ratio.
- See how estimated net profit changes when owner labor, required-purchase burden, and renewal reserves are included.
- See how estimated cash left changes when loan repayment and tax/social-insurance reserve are included.
- Understand closure-rate and survival-risk signals without digging into the detail page.
- Recognize when average sales may be misleading.
- Understand when regional sales spread is only a proxy for true store-level distribution.
- See P0 data limitations without the screen being flooded by missing P1/P2 enrichment data.
- Identify the biggest cost drivers before contacting a franchisor.
- Understand the confidence and source basis behind each major claim.
- Leave with a clear checklist of what to verify before making a startup decision.
- See whether the data has passed P0 verification and when it was last reviewed.
- See how to request correction for disputed brand data.
- Trust that negative labels are source-driven and separated from human interpretation.

Internal release success criteria:

- All public P0 values have passed independent review or are explicitly marked unavailable.
- The 10-brand model QA table has been reviewed and surprising grades have been resolved or documented.
- Every public negative label has a source basis or model-rule basis.
- The correction request flow exists before public launch.

## 16. Out Of Scope For First Prototype

The first prototype does not include:

- Nationwide franchise search.
- User accounts.
- Paid reports.
- Real-time crawling.
- Automatic market-wide brand selection across all Korean franchises.
- Legal, tax, or accounting advice.
- Location-level commercial-area scoring.

Location-level commercial-area analysis is planned for a later phase after the brand comparison model is validated.

Legal review of final wording is required before public launch, but this product spec does not replace advice from a qualified legal professional.
