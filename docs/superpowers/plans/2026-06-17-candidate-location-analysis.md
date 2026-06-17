# Candidate Location Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a candidate-location analyzer that lets a prospective founder enter a candidate area, compare nearby competition, enter rent, and see whether the selected franchise can reach break-even at that location.

**Architecture:** Phase 1 uses local structured sample trade-area data plus user-entered rent, so the feature is useful without API keys. The domain layer computes displayed sample competitor counts, direct fixture density ratios, market sales potential, rent pressure, early-store adjusted candidate sales, break-even sales, expected monthly cash left, and a plain Korean recommendation by reusing the existing simulator and `estimateRentAdjustedSalesM`. Phase 2 swaps the sample provider for public-data adapters without changing the UI contract.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, existing `runSimulation` cash-flow model.

---

## Scope

### Phase 1: Buildable MVP

The first implementation should support:

- Select a brand from the current expanded brand report.
- Enter candidate area text such as `서울 강남역`, `서울 홍대입구`, `서울 성수동`.
- Choose radius: `300m`, `500m`, `1km`.
- Enter monthly rent in 만원.
- Show:
  - same-brand competitors
  - same-category competitors
  - adjacent-category competitors
  - rent compared with known sample area baseline
  - estimated competition density level for that area/category
  - market sales potential compared with a standard location
  - break-even monthly sales
  - candidate-location expected monthly sales compared with required break-even sales
  - expected monthly cash left at the candidate location
  - recommendation: `검토 가능`, `조건부 검토`, `재검토 권장`
- If the candidate area cannot be matched, show a clear `해당 상권 데이터 없음` state and do not produce numeric results.

### Phase 2: Public Data Integration

After MVP works, add adapters for:

- 소상공인시장진흥공단 상가(상권)정보 API: nearby store count and category density
- 지방행정 인허가 데이터: opening/closure signal by food-service category
- 한국부동산원 상업용부동산 임대동향: regional rent baseline
- Optional map/geocoding provider: Kakao or Naver address-to-coordinate conversion

---

## File Structure

### Create

- `src/domain/locationAnalysis.ts`
  - Pure types and calculation functions for candidate-location analysis.
  - No React dependency.
  - Reuses `runSimulation`, `estimateRentAdjustedSalesM`, and brand data.

- `src/domain/locationAnalysisFixtures.ts`
  - Local sample trade-area records for Phase 1.
  - Includes area name, aliases, rent baseline, coordinates, and store records.

- `src/domain/__tests__/locationAnalysis.test.ts`
  - Unit tests for area matching, no-data handling, competitor counting, radius-sensitive counts, rent pressure, candidate expected sales, break-even comparison, and recommendation labels.

- `src/components/CandidateLocationPanel.tsx`
  - UI panel inside the brand detail report.
  - Lets the user enter location, radius, rent, and view result cards.

- `src/components/CandidateLocationPanel.test.tsx`
  - Component tests for user input and result rendering.

### Modify

- `src/components/BrandDetail.tsx`
  - Import and render `CandidateLocationPanel` near the simulator.

- `src/App.test.tsx`
  - Add coverage that the default report exposes candidate-location analysis without internal review jargon.

- `tests/e2e/app.spec.ts`
  - Add Playwright flow for entering a candidate area and seeing break-even judgment.

- `src/domain/dataSources.ts`
  - Add explicit source note that Phase 1 location examples are sample fixtures and public API integration is the next data step.

---

## Data Model

`src/domain/locationAnalysis.ts` should define:

```ts
import type { Brand, BrandCategory } from './types';

export type CandidateRadiusM = 300 | 500 | 1000;
export type LocationRecommendation = '검토 가능' | '조건부 검토' | '재검토 권장';

export interface CandidateLocationInput {
  query: string;
  radiusM: CandidateRadiusM;
  monthlyRentM: number;
  deliveryRatio?: number;
}

export interface TradeAreaStore {
  id: string;
  name: string;
  brandName?: string;
  category: BrandCategory | 'convenience' | 'bakery' | 'restaurant' | 'unknown';
  latitude: number;
  longitude: number;
}

export interface TradeAreaFixture {
  id: string;
  label: string;
  aliases: string[];
  marketProfile: string;
  latitude: number;
  longitude: number;
  monthlyRentBaselineM: number;
  rentMemo: string;
  salesPotentialIndex: number;
  categoryDensityRatios: Record<BrandCategory, Record<CandidateRadiusM, number>>;
  stores: TradeAreaStore[];
}

export type CandidateLocationAnalysis = CandidateLocationReadyAnalysis | CandidateLocationNoDataAnalysis;

export interface CandidateLocationNoDataAnalysis {
  status: 'no-data';
  query: string;
  message: string;
  availableAreaLabels: string[];
}

export interface CandidateLocationReadyAnalysis {
  status: 'ready';
  matchedAreaLabel: string;
  sampleData: boolean;
  radiusM: CandidateRadiusM;
  sameBrandCompetitors: number;
  sameCategoryCompetitors: number;
  adjacentCompetitors: number;
  categoryDensityRatio: number;
  competitionSalesFactor: number;
  monthlyRentM: number;
  rentBaselineM: number;
  rentPressureRatio: number;
  salesPotentialIndex: number;
  brandAverageMonthlySalesM: number;
  earlyRampFactor: number;
  adjustedBaseMonthlySalesM: number;
  rentAdjustedMonthlySalesM: number;
  expectedCandidateMonthlySalesM: number;
  expectedCashLeftM: number;
  breakEvenSalesM: number;
  expectedToBreakEvenRatio: number;
  recommendation: LocationRecommendation;
  explanation: string;
  limitation: string;
  nextQuestions: string[];
}
```

---

## Candidate Expected Sales Rules

The location analysis must compare **candidate-location expected sales** against **candidate-location break-even sales**.

Do not compare national brand average sales directly to break-even sales. That creates a false pattern where high-rent prime locations are always worse because rent rises but expected sales never rises.

Use this flow:

```ts
const matureStoreMonthlySalesM = round(brand.sales.averageAnnualSalesM / 12);
const earlyRampFactor = brand.trendDriven ? 0.9 : 0.7;
const adjustedBaseMonthlySalesM = round(matureStoreMonthlySalesM * earlyRampFactor * fixture.salesPotentialIndex);
const rentAdjustedMonthlySalesM = estimateRentAdjustedSalesM(
  adjustedBaseMonthlySalesM,
  input.monthlyRentM,
  fixture.monthlyRentBaselineM,
  fixture.monthlyRentBaselineM,
  brand.simulatorDefaults.deliveryRatio,
);
const categoryDensityRatio = fixture.categoryDensityRatios[brand.category][input.radiusM];
const competitionSalesFactor = calculateCompetitionSalesFactor(categoryDensityRatio, sameBrandCompetitors);
const expectedCandidateMonthlySalesM = round(rentAdjustedMonthlySalesM * competitionSalesFactor);
const expectedLaborCostM = estimateLaborCostM(expectedCandidateMonthlySalesM, brand.laborModel);
```

Competition adjustment:

```ts
function calculateCompetitionSalesFactor(categoryDensityRatio: number, sameBrandCompetitors: number): number {
  const densityPenalty = Math.max(0, categoryDensityRatio - 1) * 0.08;
  const lowDensityBonus = Math.max(0, 1 - categoryDensityRatio) * 0.04;
  const sameBrandPenalty = sameBrandCompetitors * 0.03;
  return clamp(1 + lowDensityBonus - densityPenalty - sameBrandPenalty, 0.75, 1.08);
}
```

This is still a transparent estimate, not a proof. The result panel must show an `예시 상권 데이터` badge and a short limitation copy until public data adapters are connected.

Important scale rule:

- `sameCategoryCompetitors` is a sample-store count from the local fixture and is only displayed to the user.
- `categoryDensityRatio` comes directly from the fixture in Phase 1 because both numerator and baseline would otherwise be hand-authored estimates.
- Do not divide sample-store counts by full-area baselines.

Startup realism rule:

- Candidate expected sales must start from an early-ramp adjusted base, not the mature national average directly.
- Use `earlyRampFactor = 0.7` for ordinary brands and `0.9` for trend-driven brands in Phase 1.
- The UI must say this is `신규점 보정 포함` or equivalent plain Korean.

Market potential rule:

- Use `fixture.salesPotentialIndex` to express that Gangnam/Hongdae-like areas can have higher sales potential than lower-rent local areas even when the candidate rent equals each area's local baseline.
- Example: standard local area `1.0`, strong downtown `1.18`, lower-footfall residential `0.88`.
- Do not rely only on `monthlyRentBaselineM` to represent market potential.

---

## Recommendation Rules

Use transparent thresholds so a founder can understand the result:

- `검토 가능`
  - candidate expected monthly sales is at least `115%` of break-even sales
  - category density ratio is `1.1` or lower
  - rent pressure ratio is `1.1` or lower

- `조건부 검토`
  - candidate expected monthly sales is at least `95%` of break-even sales
  - or competition/rent pressure is high but not extreme

- `재검토 권장`
  - candidate expected monthly sales is below `95%` of break-even sales
  - or category density ratio is `1.6` or higher
  - or rent pressure ratio is `1.35` or higher

Do not use a universal absolute competitor-count cutoff. Coffee in Gangnam and lunchbox in a residential area have different normal densities, so competition must be judged through `fixture.categoryDensityRatios`.

The copy must not say “창업하지 마세요.” It should say what to adjust:

```text
이 후보지는 기대매출이 손익분기점에 가깝습니다. 임대료를 낮추거나, 같은 반경의 경쟁점포가 적은 후보지를 하나 더 비교하세요.
```

---

## Task 1: Domain Calculation

**Files:**
- Create: `src/domain/locationAnalysis.ts`
- Create: `src/domain/__tests__/locationAnalysis.test.ts`

- [ ] **Step 1: Write failing tests**

Test cases:

```ts
import { describe, expect, it } from 'vitest';
import type { Brand } from '../types';
import {
  analyzeCandidateLocation,
  findTradeAreaFixture,
  type TradeAreaFixture,
} from '../locationAnalysis';

const brand = {
  id: 'hansot',
  name: '한솥도시락',
  category: 'lunchbox',
  categoryLabel: '도시락',
  sales: { averageAnnualSalesM: 408.36 },
  simulatorDefaults: {
    monthlySalesM: 34.03,
    monthlyRentM: 4.2,
    deliveryRatio: 0.25,
    laborCostM: 4.26,
    ownerLaborM: 2.8,
    cogsRate: 0.4,
    deliveryCommissionRate: 0.09,
    deliveryAgencyRate: 0.07,
    packagingRate: 0.025,
    cardFeeRate: 0.018,
    loanPrincipalM: 50,
    annualInterestRate: 0.055,
    loanYears: 5,
    taxReserveRate: 0.08,
    utilitiesM: 0.9,
    otherOpexM: 0.8,
  },
  cost: {
    startupTotalM: 100,
    requiredPurchaseBurdenRate: 0.02,
    recurringRoyaltyRate: 0.01,
    adFeeRate: 0.005,
    renewalReserveM: 0.5,
  },
  laborModel: {
    baseM: 1.2,
    salesRate: 0.09,
  },
} as Brand;

const fixture: TradeAreaFixture = {
  id: 'gangnam',
  label: '서울 강남역',
  aliases: ['강남역', '서울 강남'],
  marketProfile: '업무·상업 유동인구가 많은 고밀도 상권',
  latitude: 37.4979,
  longitude: 127.0276,
  monthlyRentBaselineM: 5,
  rentMemo: '강남역 샘플 기준 임대료',
  salesPotentialIndex: 1.18,
  categoryDensityRatios: {
    coffee: { 300: 1.0, 500: 1.27, 1000: 1.29 },
    lunchbox: { 300: 1.33, 500: 1.5, 1000: 1.5 },
    chicken: { 300: 1.25, 500: 1.38, 1000: 1.39 },
    dessert: { 300: 1.13, 500: 1.38, 1000: 1.35 },
    'toast-burger': { 300: 1.2, 500: 1.4, 1000: 1.29 },
  },
  stores: [
    { id: 'a', name: '한솥도시락 강남점', brandName: '한솥도시락', category: 'lunchbox', latitude: 37.4979, longitude: 127.0276 },
    { id: 'b', name: '도시락집', category: 'lunchbox', latitude: 37.498, longitude: 127.028 },
    { id: 'c', name: '김밥집', category: 'restaurant', latitude: 37.4981, longitude: 127.0281 },
    { id: 'd', name: '멀리 있는 도시락', category: 'lunchbox', latitude: 37.5028, longitude: 127.0326 },
  ],
};

describe('candidate location analysis', () => {
  it('matches fixture aliases', () => {
    expect(findTradeAreaFixture('강남역', [fixture])?.id).toBe('gangnam');
    expect(findTradeAreaFixture('부산 서면', [fixture])).toBeNull();
  });

  it('counts competitors and compares candidate expected sales against break-even sales', () => {
    const result = analyzeCandidateLocation(brand, {
      query: '강남역',
      radiusM: 500,
      monthlyRentM: 5.2,
    }, [fixture]);

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') throw new Error('expected ready analysis');
    expect(result.matchedAreaLabel).toBe('서울 강남역');
    expect(result.sameBrandCompetitors).toBe(1);
    expect(result.sameCategoryCompetitors).toBe(2);
    expect(result.adjacentCompetitors).toBe(1);
    expect(result.salesPotentialIndex).toBe(1.18);
    expect(result.earlyRampFactor).toBe(0.7);
    expect(result.adjustedBaseMonthlySalesM).toBeCloseTo(28.11);
    expect(result.categoryDensityRatio).toBeCloseTo(1.5);
    expect(result.rentAdjustedMonthlySalesM).not.toBe(result.brandAverageMonthlySalesM);
    expect(result.expectedCandidateMonthlySalesM).toBeGreaterThan(0);
    expect(result.expectedCashLeftM).toEqual(expect.any(Number));
    expect(result.breakEvenSalesM).toBeGreaterThan(0);
    expect(result.brandAverageMonthlySalesM).toBe(34.03);
    expect(result.expectedToBreakEvenRatio).toBe(
      Math.round((result.expectedCandidateMonthlySalesM / result.breakEvenSalesM) * 100) / 100,
    );
    expect(['검토 가능', '조건부 검토', '재검토 권장']).toContain(result.recommendation);
  });

  it('does not produce fake numbers when the candidate area is unknown', () => {
    const result = analyzeCandidateLocation(brand, {
      query: '부산 서면',
      radiusM: 500,
      monthlyRentM: 5.2,
    }, [fixture]);

    expect(result.status).toBe('no-data');
    if (result.status !== 'no-data') throw new Error('expected no-data analysis');
    expect(result.message).toContain('해당 상권 데이터 없음');
    expect(result.availableAreaLabels).toEqual(['서울 강남역']);
  });

  it('changes competitor counts when the radius changes', () => {
    const near = analyzeCandidateLocation(brand, {
      query: '강남역',
      radiusM: 300,
      monthlyRentM: 5.2,
    }, [fixture]);
    const wide = analyzeCandidateLocation(brand, {
      query: '강남역',
      radiusM: 1000,
      monthlyRentM: 5.2,
    }, [fixture]);

    if (near.status !== 'ready' || wide.status !== 'ready') throw new Error('expected ready analyses');
    expect(wide.sameCategoryCompetitors).toBeGreaterThan(near.sameCategoryCompetitors);
  });

  it('raises expected sales for a stronger market even when each area uses its own baseline rent', () => {
    const localFixture: TradeAreaFixture = {
      ...fixture,
      id: 'local',
      label: '외곽 주거상권',
      aliases: ['외곽'],
      monthlyRentBaselineM: 3,
      salesPotentialIndex: 0.88,
      categoryDensityRatios: {
        ...fixture.categoryDensityRatios,
        lunchbox: { 300: 0.8, 500: 0.9, 1000: 1.0 },
      },
    };

    const gangnam = analyzeCandidateLocation(brand, {
      query: '강남역',
      radiusM: 500,
      monthlyRentM: 5,
    }, [fixture, localFixture]);
    const local = analyzeCandidateLocation(brand, {
      query: '외곽',
      radiusM: 500,
      monthlyRentM: 3,
    }, [fixture, localFixture]);

    if (gangnam.status !== 'ready' || local.status !== 'ready') throw new Error('expected ready analyses');
    expect(gangnam.expectedCandidateMonthlySalesM).toBeGreaterThan(local.expectedCandidateMonthlySalesM);
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run:

```bash
npm test -- src/domain/__tests__/locationAnalysis.test.ts
```

Expected:

```text
FAIL src/domain/__tests__/locationAnalysis.test.ts
Cannot find module '../locationAnalysis'
```

- [ ] **Step 3: Implement pure calculation**

Implement:

```ts
import { estimateLaborCostM, estimateRentAdjustedSalesM, runSimulation } from './simulator';
import type { Brand, BrandCategory } from './types';

export type CandidateRadiusM = 300 | 500 | 1000;
export type LocationRecommendation = '검토 가능' | '조건부 검토' | '재검토 권장';

export interface CandidateLocationInput {
  query: string;
  radiusM: CandidateRadiusM;
  monthlyRentM: number;
  deliveryRatio?: number;
}

export interface TradeAreaStore {
  id: string;
  name: string;
  brandName?: string;
  category: BrandCategory | 'convenience' | 'bakery' | 'restaurant' | 'unknown';
  latitude: number;
  longitude: number;
}

export interface TradeAreaFixture {
  id: string;
  label: string;
  aliases: string[];
  marketProfile: string;
  latitude: number;
  longitude: number;
  monthlyRentBaselineM: number;
  rentMemo: string;
  salesPotentialIndex: number;
  categoryDensityRatios: Record<BrandCategory, Record<CandidateRadiusM, number>>;
  stores: TradeAreaStore[];
}

export type CandidateLocationAnalysis = CandidateLocationReadyAnalysis | CandidateLocationNoDataAnalysis;

export interface CandidateLocationNoDataAnalysis {
  status: 'no-data';
  query: string;
  message: string;
  availableAreaLabels: string[];
}

export interface CandidateLocationReadyAnalysis {
  status: 'ready';
  matchedAreaLabel: string;
  sampleData: boolean;
  radiusM: CandidateRadiusM;
  sameBrandCompetitors: number;
  sameCategoryCompetitors: number;
  adjacentCompetitors: number;
  categoryDensityRatio: number;
  competitionSalesFactor: number;
  monthlyRentM: number;
  rentBaselineM: number;
  rentPressureRatio: number;
  salesPotentialIndex: number;
  brandAverageMonthlySalesM: number;
  earlyRampFactor: number;
  adjustedBaseMonthlySalesM: number;
  rentAdjustedMonthlySalesM: number;
  expectedCandidateMonthlySalesM: number;
  expectedCashLeftM: number;
  breakEvenSalesM: number;
  expectedToBreakEvenRatio: number;
  recommendation: LocationRecommendation;
  explanation: string;
  limitation: string;
  nextQuestions: string[];
}

export function findTradeAreaFixture(query: string, fixtures: TradeAreaFixture[]): TradeAreaFixture | null {
  const normalized = normalize(query);
  if (normalized.length < 2) return null;
  return fixtures.find((fixture) => {
    return normalize(fixture.label) === normalized || fixture.aliases.some((alias) => normalize(alias) === normalized);
  }) ?? null;
}

export function analyzeCandidateLocation(
  brand: Brand,
  input: CandidateLocationInput,
  fixtures: TradeAreaFixture[],
): CandidateLocationAnalysis {
  const fixture = findTradeAreaFixture(input.query, fixtures);
  if (!fixture) {
    return {
      status: 'no-data',
      query: input.query,
      message: '해당 상권 데이터 없음: 현재 예시 데이터에 있는 후보지만 계산할 수 있습니다.',
      availableAreaLabels: fixtures.map((item) => item.label),
    };
  }

  const storesInRadius = fixture.stores.filter((store) => {
    return distanceMeters(fixture.latitude, fixture.longitude, store.latitude, store.longitude) <= input.radiusM;
  });
  const sameBrandCompetitors = storesInRadius.filter((store) => store.brandName === brand.name).length;
  const sameCategoryCompetitors = storesInRadius.filter((store) => store.category === brand.category).length;
  const adjacentCompetitors = storesInRadius.filter((store) => isAdjacentCategory(brand.category, store.category)).length;
  const brandAverageMonthlySalesM = round(brand.sales.averageAnnualSalesM / 12);
  const earlyRampFactor = brand.trendDriven ? 0.9 : 0.7;
  const adjustedBaseMonthlySalesM = round(brandAverageMonthlySalesM * earlyRampFactor * fixture.salesPotentialIndex);
  const rentAdjustedMonthlySalesM = estimateRentAdjustedSalesM(
    adjustedBaseMonthlySalesM,
    input.monthlyRentM,
    fixture.monthlyRentBaselineM,
    fixture.monthlyRentBaselineM,
    brand.simulatorDefaults.deliveryRatio,
  );
  const categoryDensityRatio = fixture.categoryDensityRatios[brand.category][input.radiusM];
  const competitionSalesFactor = calculateCompetitionSalesFactor(categoryDensityRatio, sameBrandCompetitors);
  const expectedCandidateMonthlySalesM = round(rentAdjustedMonthlySalesM * competitionSalesFactor);
  const expectedLaborCostM = estimateLaborCostM(expectedCandidateMonthlySalesM, brand.laborModel);
  const simulation = runSimulation(brand, {
    ...brand.simulatorDefaults,
    monthlySalesM: expectedCandidateMonthlySalesM,
    laborCostM: expectedLaborCostM,
    monthlyRentM: input.monthlyRentM,
    deliveryRatio: input.deliveryRatio ?? brand.simulatorDefaults.deliveryRatio,
  });
  const expectedToBreakEvenRatio = round(expectedCandidateMonthlySalesM / Math.max(0.01, simulation.breakEvenSalesM));
  const rentPressureRatio = round(input.monthlyRentM / Math.max(0.01, fixture.monthlyRentBaselineM));
  const recommendation = recommend(expectedToBreakEvenRatio, categoryDensityRatio, rentPressureRatio);

  return {
    status: 'ready',
    matchedAreaLabel: fixture.label,
    sampleData: true,
    radiusM: input.radiusM,
    sameBrandCompetitors,
    sameCategoryCompetitors,
    adjacentCompetitors,
    categoryDensityRatio,
    competitionSalesFactor,
    monthlyRentM: input.monthlyRentM,
    rentBaselineM: fixture.monthlyRentBaselineM,
    rentPressureRatio,
    salesPotentialIndex: fixture.salesPotentialIndex,
    brandAverageMonthlySalesM,
    earlyRampFactor,
    adjustedBaseMonthlySalesM,
    rentAdjustedMonthlySalesM,
    expectedCandidateMonthlySalesM,
    expectedCashLeftM: simulation.cashLeftM,
    breakEvenSalesM: simulation.breakEvenSalesM,
    expectedToBreakEvenRatio,
    recommendation,
    explanation: buildExplanation(recommendation, expectedToBreakEvenRatio, categoryDensityRatio, rentPressureRatio),
    limitation: '현재 결과는 예시 상권 데이터와 공개 평균값을 이용한 사전 계산입니다. 실제 계약 전에는 공공데이터와 현장 조사를 함께 확인해야 합니다.',
    nextQuestions: [
      '이 임대료에 관리비와 부가세가 포함되는지 확인하세요.',
      '반경 안 같은 가격대 경쟁점포의 점심/저녁 피크를 직접 세어보세요.',
      '본사가 같은 상권에 추가 출점 제한을 보장하는지 물어보세요.',
    ],
  };
}

function normalize(value: string): string {
  return value.replace(/\s/g, '').toLowerCase();
}

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusM = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return earthRadiusM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isAdjacentCategory(brandCategory: BrandCategory, storeCategory: TradeAreaStore['category']): boolean {
  if (brandCategory === 'lunchbox') return storeCategory === 'restaurant' || storeCategory === 'convenience';
  if (brandCategory === 'coffee') return storeCategory === 'dessert' || storeCategory === 'bakery';
  if (brandCategory === 'dessert') return storeCategory === 'coffee' || storeCategory === 'bakery';
  if (brandCategory === 'toast-burger') return storeCategory === 'restaurant' || storeCategory === 'bakery';
  if (brandCategory === 'chicken') return storeCategory === 'restaurant';
  return false;
}

function calculateCompetitionSalesFactor(categoryDensityRatio: number, sameBrandCompetitors: number): number {
  const densityPenalty = Math.max(0, categoryDensityRatio - 1) * 0.08;
  const lowDensityBonus = Math.max(0, 1 - categoryDensityRatio) * 0.04;
  const sameBrandPenalty = sameBrandCompetitors * 0.03;
  return clamp(1 + lowDensityBonus - densityPenalty - sameBrandPenalty, 0.75, 1.08);
}

function recommend(
  expectedToBreakEvenRatio: number,
  categoryDensityRatio: number,
  rentPressureRatio: number,
): LocationRecommendation {
  if (expectedToBreakEvenRatio < 0.95 || categoryDensityRatio >= 1.6 || rentPressureRatio >= 1.35) {
    return '재검토 권장';
  }
  if (expectedToBreakEvenRatio >= 1.15 && categoryDensityRatio <= 1.1 && rentPressureRatio <= 1.1) {
    return '검토 가능';
  }
  return '조건부 검토';
}

function buildExplanation(
  recommendation: LocationRecommendation,
  expectedToBreakEvenRatio: number,
  categoryDensityRatio: number,
  rentPressureRatio: number,
): string {
  if (recommendation === '검토 가능') {
    return `후보지 기대매출이 손익분기점의 ${Math.round(expectedToBreakEvenRatio * 100)}% 수준이고 경쟁 밀도와 임대료 부담이 과하지 않습니다.`;
  }
  if (recommendation === '재검토 권장') {
    return `후보지 기대매출 대비 필요한 매출, 상권 대비 경쟁밀도 ${Math.round(categoryDensityRatio * 100)}%, 임대료 부담 ${Math.round(rentPressureRatio * 100)}%를 함께 보면 다른 후보지도 비교하는 편이 좋습니다.`;
  }
  return `기대매출이 손익분기점에 가깝습니다. 임대료 협상, 인건비 구조, 경쟁점포 피크타임을 추가로 확인하세요.`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
```

- [ ] **Step 4: Run the test and confirm GREEN**

Run:

```bash
npm test -- src/domain/__tests__/locationAnalysis.test.ts
```

Expected:

```text
PASS src/domain/__tests__/locationAnalysis.test.ts
```

---

## Task 2: Local Trade-Area Fixtures

**Files:**
- Create: `src/domain/locationAnalysisFixtures.ts`
- Modify: `src/domain/__tests__/locationAnalysis.test.ts`

- [ ] **Step 1: Add fixture tests**

Add:

```ts
import { tradeAreaFixtures } from '../locationAnalysisFixtures';

it('ships sample areas that can power the first MVP without API keys', () => {
  expect(tradeAreaFixtures.length).toBeGreaterThanOrEqual(3);
  expect(tradeAreaFixtures.some((fixture) => fixture.aliases.includes('강남역'))).toBe(true);
  expect(tradeAreaFixtures.every((fixture) => fixture.stores.length >= 5)).toBe(true);
});
```

- [ ] **Step 2: Run test and confirm RED**

Run:

```bash
npm test -- src/domain/__tests__/locationAnalysis.test.ts
```

Expected:

```text
FAIL Cannot find module '../locationAnalysisFixtures'
```

- [ ] **Step 3: Add fixtures**

Create three sample areas:

- `서울 강남역`
- `서울 홍대입구`
- `서울 성수동`

Each fixture must include:

- `marketProfile`
- `monthlyRentBaselineM`
- `salesPotentialIndex`
- `categoryDensityRatios` for every `BrandCategory` and radius
- at least 5 stores
- mixed categories
- some stores within 300m and some outside 300m but inside 500m/1000m
- enough coordinate spread for `300m`, `500m`, and `1km` results to differ in tests
- `categoryDensityRatios` are direct Phase 1 estimates. The sample `stores` array is only for visible examples and radius interaction, not density math.
- Aliases must include short natural inputs such as `강남`, `강남역`, `서울 강남`, `홍대`, `홍대입구`, `성수`, `성수동`.

- [ ] **Step 4: Run test and confirm GREEN**

Run:

```bash
npm test -- src/domain/__tests__/locationAnalysis.test.ts
```

Expected:

```text
PASS src/domain/__tests__/locationAnalysis.test.ts
```

---

## Task 3: Candidate Location Panel UI

**Files:**
- Create: `src/components/CandidateLocationPanel.tsx`
- Create: `src/components/CandidateLocationPanel.test.tsx`

- [ ] **Step 1: Write failing component test**

Test behavior:

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { brands } from '../domain/brands';
import { CandidateLocationPanel } from './CandidateLocationPanel';

describe('CandidateLocationPanel', () => {
  it('lets a founder compare a candidate area against break-even sales', async () => {
    const user = userEvent.setup();
    render(<CandidateLocationPanel brand={brands[0]} />);

    expect(screen.getByRole('heading', { name: '내 후보지로 계산' })).toBeTruthy();

    await user.clear(screen.getByLabelText('후보지'));
    await user.type(screen.getByLabelText('후보지'), '강남역');
    await user.clear(screen.getByLabelText('월 임대료'));
    await user.type(screen.getByLabelText('월 임대료'), '520');

    expect(screen.getByText('서울 강남역')).toBeTruthy();
    expect(screen.getByText('예시 상권 데이터')).toBeTruthy();
    expect(screen.getByText('반경 500m 경쟁 현황')).toBeTruthy();
    expect(screen.getByText('후보지 기대 월매출')).toBeTruthy();
    expect(screen.getByText('월 예상 잔여금')).toBeTruthy();
    expect(screen.getByText('손익분기 월매출')).toBeTruthy();
    expect(screen.getByText('신규점 보정 포함')).toBeTruthy();
    expect(screen.getByText('사장 인건비·대출 포함 기준')).toBeTruthy();
    expect(screen.getByText('계약 전 확인 질문')).toBeTruthy();
  });

  it('shows a no-data state instead of fake numbers for an unknown area', async () => {
    const user = userEvent.setup();
    render(<CandidateLocationPanel brand={brands[0]} />);

    await user.clear(screen.getByLabelText('후보지'));
    await user.type(screen.getByLabelText('후보지'), '부산 서면');

    expect(screen.getByText('해당 상권 데이터 없음')).toBeTruthy();
    expect(screen.queryByText('손익분기 월매출')).toBeNull();
  });
});
```

- [ ] **Step 2: Run and confirm RED**

Run:

```bash
npm test -- src/components/CandidateLocationPanel.test.tsx
```

Expected:

```text
FAIL Cannot find module './CandidateLocationPanel'
```

- [ ] **Step 3: Implement component**

UI requirements:

- Heading: `내 후보지로 계산`
- Inputs:
  - `후보지`
  - radius segmented buttons: `300m`, `500m`, `1km`
  - `월 임대료`
- Result cards:
  - `같은 브랜드`
  - `같은 업종`
  - `인접 경쟁`
  - `후보지 기대 월매출`
  - `월 예상 잔여금`
  - `손익분기 월매출`
  - `브랜드 평균 월매출`
  - `상권 예상 경쟁밀도`
  - recommendation badge
- Explain the count/density difference:
  - `표시 점포 수는 예시 데이터이고, 경쟁밀도는 상권 추정값으로 계산합니다.`
- Negative cash formatting:
  - If `expectedCashLeftM < 0`, display `월 예상 부족액` and the absolute amount in danger color.
  - If `expectedCashLeftM >= 0`, display `월 예상 잔여금`.
- Top-of-result badge:
  - `예시 상권 데이터`
  - `신규점 보정 포함`
  - `사장 인건비·대출 포함 기준`
  - Short limitation copy: `현재 결과는 예시 상권 데이터와 공개 평균값을 이용한 사전 계산입니다.`
- No-data state:
  - Heading or message: `해당 상권 데이터 없음`
  - Show available sample areas.
  - Show input hint: `예: 강남, 홍대, 성수`
  - Do not show numeric recommendation cards when `analysis.status === 'no-data'`.
- Copy must be beginner-friendly and avoid `P0`, `검증 전`, `경고`, `백만원`.

- [ ] **Step 4: Run and confirm GREEN**

Run:

```bash
npm test -- src/components/CandidateLocationPanel.test.tsx
```

Expected:

```text
PASS src/components/CandidateLocationPanel.test.tsx
```

---

## Task 4: Integrate Into Brand Detail

**Files:**
- Modify: `src/components/BrandDetail.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add failing app test**

Add to `src/App.test.tsx`:

```ts
it('shows candidate-location analysis in the active brand report', () => {
  render(<App />);

  const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
  expect(within(report).getByRole('heading', { name: '내 후보지로 계산' })).toBeTruthy();
  expect(within(report).getByLabelText('후보지')).toBeTruthy();
  expect(within(report).getByLabelText('월 임대료')).toBeTruthy();
  expect(within(report).getByText('예시 상권 데이터')).toBeTruthy();
  expect(within(report).getByText('후보지 기대 월매출')).toBeTruthy();
  expect(within(report).getByText('월 예상 잔여금')).toBeTruthy();
  expect(within(report).getByText('손익분기 월매출')).toBeTruthy();
  expect(within(report).getByText('사장 인건비·대출 포함 기준')).toBeTruthy();
});
```

- [ ] **Step 2: Run and confirm RED**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected:

```text
FAIL Unable to find heading "내 후보지로 계산"
```

- [ ] **Step 3: Render panel**

In `BrandDetail.tsx`, import:

```ts
import { CandidateLocationPanel } from './CandidateLocationPanel';
```

Render inside the expanded detail body near the simulator:

```tsx
<CandidateLocationPanel brand={brand} />
```

- [ ] **Step 4: Run and confirm GREEN**

Run:

```bash
npm test -- src/App.test.tsx src/components/CandidateLocationPanel.test.tsx
```

Expected:

```text
PASS
```

---

## Task 5: Data Source Copy

**Files:**
- Modify: `src/domain/dataSources.ts`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add test expectation**

Add assertion that footer includes:

```ts
expect(within(footer).getByText('후보지 분석 샘플 상권 데이터')).toBeTruthy();
expect(within(footer).getByText('소상공인시장진흥공단 상가(상권)정보')).toBeTruthy();
```

- [ ] **Step 2: Run and confirm RED**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected:

```text
FAIL Unable to find text "후보지 분석 샘플 상권 데이터"
```

- [ ] **Step 3: Add source entry**

Add current source:

```ts
{
  title: '후보지 분석 샘플 상권 데이터',
  status: '예시 계산용',
  description: '후보지 입력 흐름과 손익분기 계산을 검증하기 위한 샘플 상권 데이터입니다. 실제 상권 점포 수는 공공데이터 API 연동 뒤 대체합니다.',
}
```

- [ ] **Step 4: Run and confirm GREEN**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected:

```text
PASS
```

---

## Task 6: E2E Flow

**Files:**
- Modify: `tests/e2e/app.spec.ts`

- [ ] **Step 1: Add failing e2e test**

Add:

```ts
test('analyzes a candidate location against break-even sales', async ({ page }) => {
  await page.goto('/');

  const report = page.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
  await report.getByLabel('후보지').fill('강남역');
  await report.getByLabel('월 임대료').fill('520');

  await expect(report.getByText('서울 강남역')).toBeVisible();
  await expect(report.getByText('예시 상권 데이터')).toBeVisible();
  await expect(report.getByText('반경 500m 경쟁 현황')).toBeVisible();
  await expect(report.getByText('후보지 기대 월매출')).toBeVisible();
  await expect(report.getByText('월 예상 잔여금')).toBeVisible();
  await expect(report.getByText('손익분기 월매출')).toBeVisible();
  await expect(report.getByText('사장 인건비·대출 포함 기준')).toBeVisible();
});

test('does not analyze an unknown candidate area with a fallback fixture', async ({ page }) => {
  await page.goto('/');

  const report = page.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
  await report.getByLabel('후보지').fill('부산 서면');

  await expect(report.getByText('해당 상권 데이터 없음')).toBeVisible();
  await expect(report.getByText('손익분기 월매출')).toHaveCount(0);
});
```

- [ ] **Step 2: Run e2e**

Run:

```bash
PATH=/Users/hoyeon/.nvm/versions/node/v20.19.6/bin:$PATH npm run e2e
```

Expected:

```text
8 or more tests passed
```

---

## Task 7: Full Verification

**Files:**
- No file changes.

- [ ] **Step 1: Run unit and component tests**

Run:

```bash
npm test
```

Expected:

```text
All tests pass
```

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected:

```text
✓ built
```

- [ ] **Step 3: Run e2e**

Run:

```bash
PATH=/Users/hoyeon/.nvm/versions/node/v20.19.6/bin:$PATH npm run e2e
```

Expected:

```text
All Playwright tests pass
```

- [ ] **Step 4: Visual check**

Use Playwright screenshot checks for:

- desktop `1440x1600`
- mobile `390x1400`

Confirm:

- no document-level horizontal overflow
- candidate-location panel appears in the report
- input text and result cards do not overlap
- recommendation copy is visible and not alarmist

---

## Phase 2 Plan: Public Data Adapters

Do this only after Phase 1 is merged and verified.

### Create

- `src/domain/tradeAreaProviders.ts`
  - Interface:

```ts
export interface TradeAreaProvider {
  findArea(query: string): Promise<TradeAreaFixture | null>;
}
```

- `src/domain/publicStoreProvider.ts`
  - Adapter for 소상공인시장진흥공단 상가정보 API.

- `src/domain/localPermitProvider.ts`
  - Adapter for 지방행정 인허가 데이터.

- `src/domain/rentBaselineProvider.ts`
  - Adapter for 한국부동산원 or manually imported rent baseline data.

### Important Constraint

Do not block Phase 1 on public API keys. Keep Phase 1 useful with sample areas and user-entered rent, then replace the provider behind the same domain interface.

---

## Self-Review

- The plan covers domain calculation, local data, UI, integration, source copy, e2e, and final verification.
- The first version produces working software without API keys.
- Candidate-location judgment now compares candidate expected sales against candidate break-even sales, not national brand average sales against break-even sales.
- Market sales potential affects expected sales through `fixture.salesPotentialIndex`; high-potential markets can have higher expected sales even when candidate rent equals each area's local baseline.
- Rent pressure affects both break-even cost and candidate-unit sales through `estimateRentAdjustedSalesM`, using the fixture rent baseline as both previous rent and normalization base.
- Competition affects expected sales through direct fixture `categoryDensityRatios` in Phase 1.
- Sample `stores` counts are displayed as visible examples only; they are not divided by full-area baselines.
- Candidate sales start from a 신규점 보정 base using `earlyRampFactor = 0.7` for ordinary brands and `0.9` for trend-driven brands, not the mature national average directly.
- The result includes expected monthly cash left from `simulation.cashLeftM`.
- UI must distinguish example visible store counts from estimated density and must render negative cash left as a shortage, not as an ordinary remaining-money value.
- Unknown areas return an explicit `no-data` result and never fall back to the first fixture.
- The result UI must show `예시 상권 데이터`, `신규점 보정 포함`, and `사장 인건비·대출 포함 기준` badges plus limitation copy.
- The UI copy avoids internal review jargon.
- Phase 2 data adapters are isolated from Phase 1 UI and calculations.
- Existing simulator logic is reused instead of creating a second cash-flow model.
