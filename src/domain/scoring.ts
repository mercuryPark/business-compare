import type { Brand, Confidence, Grade, RiskLevel } from './types';

export interface BrandScore {
  grade: Grade;
  score: number | null;
  confidence: Confidence;
  closureRisk: RiskLevel;
  drivers: string[];
}

export const GRADE_THRESHOLDS = {
  A: 85,
  B: 70,
  C: 55,
  D: 40,
} as const;

export const CLOSURE_RISK_THRESHOLDS = {
  high: 0.12,
  watch: 0.07,
} as const;

export const MODEL_WEIGHTS = {
  profit: 0.3,
  closure: 0.2,
  stability: 0.15,
  risk: 0.15,
  startup: 0.1,
  operation: 0.1,
} as const;

export const CATEGORY_GRADE_MIN_VERIFIED_PEERS = 3;

export interface ScoringContext {
  benchmarkBrands?: Brand[];
}

export const MODEL_COEFFICIENTS = {
  purchaseBurdenPenalty: 180,
  startupProfitPenalty: 0.15,
  closurePenalty: 650,
  stabilityBase: 55,
  stabilityYearCap: 20,
  stabilityYearBonus: 2,
  trendDrivenRiskScore: 58,
  durableRiskScore: 74,
  startupPenalty: 0.25,
  operationBase: 78,
  deliveryRatioPenalty: 25,
} as const;

export function gradeFromScore(score: number): Exclude<Grade, 'insufficient-data'> {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  if (score >= GRADE_THRESHOLDS.D) return 'D';
  return 'E';
}

export function calculateClosureRate(brand: Brand): number | null {
  if (!isPositiveFinite(brand.stability.currentStores) || !isNonNegativeFinite(brand.stability.closures3y)) {
    return null;
  }

  return brand.stability.closures3y / brand.stability.currentStores;
}

export function calculateBrandScore(brand: Brand, context: ScoringContext = {}): BrandScore {
  if (!brand.audit.p0Verified) {
    return {
      grade: 'insufficient-data',
      score: null,
      confidence: 'low',
      closureRisk: 'insufficient-data',
      drivers: ['P0 데이터 검증 전'],
    };
  }

  if (!hasEnoughCategoryBenchmarks(brand, context.benchmarkBrands)) {
    return insufficientBenchmarkData();
  }

  const closureRate = calculateClosureRate(brand);
  if (hasInvalidVerifiedNumericInput(brand) || closureRate === null) {
    return insufficientVerifiedNumericData();
  }

  const profitScore = clamp(
    100 -
      brand.cost.requiredPurchaseBurdenRate * MODEL_COEFFICIENTS.purchaseBurdenPenalty -
      brand.cost.startupTotalM * MODEL_COEFFICIENTS.startupProfitPenalty,
  );
  const closureScore = clamp(100 - closureRate * MODEL_COEFFICIENTS.closurePenalty);
  const stabilityScore = clamp(
    MODEL_COEFFICIENTS.stabilityBase +
      Math.min(brand.stability.averageOperatingYears ?? 0, MODEL_COEFFICIENTS.stabilityYearCap) *
        MODEL_COEFFICIENTS.stabilityYearBonus,
  );
  const riskScore = brand.trendDriven ? MODEL_COEFFICIENTS.trendDrivenRiskScore : MODEL_COEFFICIENTS.durableRiskScore;
  const startupScore = clamp(100 - brand.cost.startupTotalM * MODEL_COEFFICIENTS.startupPenalty);
  const operationScore = clamp(
    MODEL_COEFFICIENTS.operationBase - brand.simulatorDefaults.deliveryRatio * MODEL_COEFFICIENTS.deliveryRatioPenalty,
  );

  const score =
    profitScore * MODEL_WEIGHTS.profit +
    closureScore * MODEL_WEIGHTS.closure +
    stabilityScore * MODEL_WEIGHTS.stability +
    riskScore * MODEL_WEIGHTS.risk +
    startupScore * MODEL_WEIGHTS.startup +
    operationScore * MODEL_WEIGHTS.operation;

  if (!Number.isFinite(score)) {
    return insufficientVerifiedNumericData();
  }

  return {
    grade: gradeFromScore(score),
    score: Math.round(score),
    confidence: 'medium',
    closureRisk:
      closureRate >= CLOSURE_RISK_THRESHOLDS.high
        ? 'high'
        : closureRate >= CLOSURE_RISK_THRESHOLDS.watch
          ? 'watch'
          : 'normal',
    drivers: [
      `폐점률 추정 ${(closureRate * 100).toFixed(1)}%`,
      `필수구매 부담 ${(brand.cost.requiredPurchaseBurdenRate * 100).toFixed(1)}%`,
    ],
  };
}

function insufficientVerifiedNumericData(): BrandScore {
  return {
    grade: 'insufficient-data',
    score: null,
    confidence: 'low',
    closureRisk: 'insufficient-data',
    drivers: ['P0 수치 검증 필요'],
  };
}

function insufficientBenchmarkData(): BrandScore {
  return {
    grade: 'insufficient-data',
    score: null,
    confidence: 'low',
    closureRisk: 'insufficient-data',
    drivers: ['업종 표본 부족으로 참고용'],
  };
}

function hasEnoughCategoryBenchmarks(brand: Brand, benchmarkBrands?: Brand[]): boolean {
  if (!benchmarkBrands) {
    return true;
  }

  const verifiedPeerCount = benchmarkBrands.filter(
    (peer) => peer.category === brand.category && peer.audit.p0Verified,
  ).length;

  return verifiedPeerCount >= CATEGORY_GRADE_MIN_VERIFIED_PEERS;
}

function hasInvalidVerifiedNumericInput(brand: Brand): boolean {
  return (
    !isPositiveFinite(brand.stability.currentStores) ||
    !isNonNegativeFinite(brand.stability.closures3y) ||
    !isNonNegativeFinite(brand.cost.startupTotalM) ||
    !isUnitRate(brand.cost.requiredPurchaseBurdenRate) ||
    !isUnitRate(brand.simulatorDefaults.deliveryRatio) ||
    !isOptionalNonNegativeFinite(brand.stability.averageOperatingYears)
  );
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegativeFinite(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function isOptionalNonNegativeFinite(value: number | undefined): boolean {
  return value === undefined || isNonNegativeFinite(value);
}

function isUnitRate(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
