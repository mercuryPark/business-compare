import { describe, expect, it } from 'vitest';

import type { Brand } from '../types';
import { brands } from '../brands';
import {
  CATEGORY_GRADE_MIN_VERIFIED_PEERS,
  MODEL_WEIGHTS,
  calculateBrandScore,
  calculateClosureRate,
  gradeFromScore,
} from '../scoring';

function verifiedBrand(): Brand {
  const brand = structuredClone(brands[0]);
  brand.audit.p0Verified = true;
  brand.audit.reviewer = 'qa';
  brand.audit.lastVerifiedAt = '2026-06-15';
  return brand;
}

function verifiedCoffeeBrands(count = CATEGORY_GRADE_MIN_VERIFIED_PEERS): Brand[] {
  return brands
    .filter((brand) => brand.category === 'coffee')
    .slice(0, count)
    .map((brand) => {
      const verified = structuredClone(brand);
      verified.audit.p0Verified = true;
      verified.audit.reviewer = 'qa';
      verified.audit.lastVerifiedAt = '2026-06-15';
      return verified;
    });
}

describe('scoring', () => {
  it('returns insufficient-data score metadata when P0 is not verified', () => {
    const result = calculateBrandScore(brands[0]);
    expect(result.grade).toBe('insufficient-data');
    expect(result.score).toBeNull();
    expect(result.confidence).toBe('low');
    expect(result.closureRisk).toBe('insufficient-data');
    expect(result.drivers).toContain('P0 데이터 검증 전');
  });

  it('returns a finite benchmark score for a verified brand', () => {
    const result = calculateBrandScore(verifiedBrand());
    expect(result.grade).not.toBe('insufficient-data');
    expect(result.score).not.toBeNull();
    expect(Number.isFinite(result.score)).toBe(true);
  });

  it('keeps verified brands reference-only when same-category verified benchmarks are too thin', () => {
    const brand = verifiedBrand();

    const result = calculateBrandScore(brand, { benchmarkBrands: [brand] });

    expect(result.grade).toBe('insufficient-data');
    expect(result.score).toBeNull();
    expect(result.confidence).toBe('low');
    expect(result.drivers).toContain('업종 표본 부족으로 참고용');
  });

  it('scores verified coffee brands only after the category has enough verified peers', () => {
    const coffeePeers = verifiedCoffeeBrands();

    const result = calculateBrandScore(coffeePeers[0], { benchmarkBrands: coffeePeers });

    expect(coffeePeers).toHaveLength(CATEGORY_GRADE_MIN_VERIFIED_PEERS);
    expect(result.grade).not.toBe('insufficient-data');
    expect(result.score).not.toBeNull();
  });

  it('returns insufficient-data when verified numeric inputs need validation', () => {
    const noCurrentStores = verifiedBrand();
    noCurrentStores.stability.currentStores = 0;

    const invalidPurchaseBurden = verifiedBrand();
    invalidPurchaseBurden.cost.requiredPurchaseBurdenRate = Number.NaN;

    for (const brand of [noCurrentStores, invalidPurchaseBurden]) {
      const result = calculateBrandScore(brand);
      expect(result.grade).toBe('insufficient-data');
      expect(result.score).toBeNull();
      expect(result.confidence).toBe('low');
      expect(result.closureRisk).toBe('insufficient-data');
      expect(result.drivers).toContain('P0 수치 검증 필요');
    }
  });

  it('returns null closure rate when current store denominator is invalid', () => {
    const brand = verifiedBrand();
    brand.stability.currentStores = 0;
    expect(calculateClosureRate(brand)).toBeNull();
  });

  it('maps closure-risk thresholds from closure rate', () => {
    const normal = verifiedBrand();
    normal.stability.currentStores = 100;
    normal.stability.closures3y = 6;

    const watch = verifiedBrand();
    watch.stability.currentStores = 100;
    watch.stability.closures3y = 7;

    const high = verifiedBrand();
    high.stability.currentStores = 100;
    high.stability.closures3y = 12;

    expect(calculateBrandScore(normal).closureRisk).toBe('normal');
    expect(calculateBrandScore(watch).closureRisk).toBe('watch');
    expect(calculateBrandScore(high).closureRisk).toBe('high');
  });

  it('keeps model weights normalized', () => {
    const totalWeight = Object.values(MODEL_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    expect(totalWeight).toBeCloseTo(1);
  });

  it('maps score ranges to benchmark-relative grades', () => {
    expect(gradeFromScore(92)).toBe('A');
    expect(gradeFromScore(78)).toBe('B');
    expect(gradeFromScore(63)).toBe('C');
    expect(gradeFromScore(48)).toBe('D');
    expect(gradeFromScore(24)).toBe('E');
  });
});
