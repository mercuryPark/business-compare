import { describe, expect, it } from 'vitest';
import type { Brand } from '../types';
import { analyzeCandidateLocation, findTradeAreaFixture, type TradeAreaFixture } from '../locationAnalysis';
import { tradeAreaFixtures } from '../locationAnalysisFixtures';

const brand = {
  id: 'hansot',
  name: '한솥도시락',
  category: 'lunchbox',
  categoryLabel: '도시락',
  trendDriven: false,
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
  aliases: ['강남', '강남역', '서울 강남'],
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
    {
      id: 'a',
      name: '한솥도시락 강남점',
      brandName: '한솥도시락',
      category: 'lunchbox',
      latitude: 37.4979,
      longitude: 127.0276,
    },
    { id: 'b', name: '도시락집', category: 'lunchbox', latitude: 37.498, longitude: 127.028 },
    { id: 'c', name: '김밥집', category: 'restaurant', latitude: 37.4981, longitude: 127.0281 },
    { id: 'd', name: '멀리 있는 도시락', category: 'lunchbox', latitude: 37.5028, longitude: 127.0326 },
  ],
};

describe('candidate location analysis', () => {
  it('ships sample areas that can power the first MVP without API keys', () => {
    expect(tradeAreaFixtures.length).toBeGreaterThanOrEqual(3);
    expect(tradeAreaFixtures.some((item) => item.aliases.includes('강남'))).toBe(true);
    expect(tradeAreaFixtures.some((item) => item.aliases.includes('홍대'))).toBe(true);
    expect(tradeAreaFixtures.some((item) => item.aliases.includes('성수'))).toBe(true);
    expect(tradeAreaFixtures.every((item) => item.stores.length >= 5)).toBe(true);
    expect(tradeAreaFixtures.every((item) => item.salesPotentialIndex > 0)).toBe(true);
    expect(tradeAreaFixtures.every((item) => item.categoryDensityRatios.lunchbox[500] > 0)).toBe(true);
  });

  it('matches fixture aliases without falling back to another area', () => {
    expect(findTradeAreaFixture('강남역', [fixture])?.id).toBe('gangnam');
    expect(findTradeAreaFixture('강남', [fixture])?.id).toBe('gangnam');
    expect(findTradeAreaFixture('부산 서면', [fixture])).toBeNull();
  });

  it('counts competitors and compares candidate expected sales against break-even sales', () => {
    const result = analyzeCandidateLocation(
      brand,
      {
        query: '강남역',
        radiusM: 500,
        monthlyRentM: 5.2,
      },
      [fixture],
    );

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
    const result = analyzeCandidateLocation(
      brand,
      {
        query: '부산 서면',
        radiusM: 500,
        monthlyRentM: 5.2,
      },
      [fixture],
    );

    expect(result.status).toBe('no-data');
    if (result.status !== 'no-data') throw new Error('expected no-data analysis');
    expect(result.message).toContain('해당 상권 데이터 없음');
    expect(result.availableAreaLabels).toEqual(['서울 강남역']);
  });

  it('changes visible sample competitor counts when the radius changes', () => {
    const near = analyzeCandidateLocation(
      brand,
      {
        query: '강남역',
        radiusM: 300,
        monthlyRentM: 5.2,
      },
      [fixture],
    );
    const wide = analyzeCandidateLocation(
      brand,
      {
        query: '강남역',
        radiusM: 1000,
        monthlyRentM: 5.2,
      },
      [fixture],
    );

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

    const gangnam = analyzeCandidateLocation(
      brand,
      {
        query: '강남역',
        radiusM: 500,
        monthlyRentM: 5,
      },
      [fixture, localFixture],
    );
    const local = analyzeCandidateLocation(
      brand,
      {
        query: '외곽',
        radiusM: 500,
        monthlyRentM: 3,
      },
      [fixture, localFixture],
    );

    if (gangnam.status !== 'ready' || local.status !== 'ready') throw new Error('expected ready analyses');
    expect(gangnam.expectedCandidateMonthlySalesM).toBeGreaterThan(local.expectedCandidateMonthlySalesM);
  });
});
