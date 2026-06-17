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

  return (
    fixtures.find((fixture) => {
      return normalize(fixture.label) === normalized || fixture.aliases.some((alias) => normalize(alias) === normalized);
    }) ?? null
  );
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
    limitation:
      '현재 결과는 예시 상권 데이터와 공개 평균값을 이용한 사전 계산입니다. 실제 계약 전에는 공공데이터와 현장 조사를 함께 확인해야 합니다.',
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
  return '기대매출이 손익분기점에 가깝습니다. 임대료 협상, 인건비 구조, 경쟁점포 피크타임을 추가로 확인하세요.';
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
