import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

import { brands, categories } from './brands';
import { getP0Limitations } from './qa';
import { validateP0SourceSnapshotAlignment } from './p0SourceSnapshots';

const brandsSource = readFileSync(join(process.cwd(), 'src/domain/brands.ts'), 'utf8');

describe('brands seed data', () => {
  it('keeps the prototype seed data as statically typed values', () => {
    expect(brandsSource).not.toContain('type BrandSeed = [');
    expect(brandsSource).not.toContain('String(');
    expect(brandsSource).not.toContain('Number(');
  });

  it('keeps every sourced brand unfinalized until original disclosure review passes', () => {
    expect(brands).toHaveLength(10);
    expect(categories).toEqual(Array.from(new Set(brands.map((brand) => brand.category))));

    for (const brand of brands) {
      expect(brand.sources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'public-data',
            capturedAt: '2026-06-16',
            confidence: 'medium',
            referenceYear: 2024,
          }),
        ]),
      );
      expect(brand.sources.some((source) => source.type === 'manual-assumption')).toBe(false);
      expect(brand.cost.differenceFranchiseFeeTotalM).toBeNull();
      expect(brand.cost.recurringCostBasis).toBe('manual-assumption');
      expect(brand.cost.recurringCostNote).toContain('시뮬레이터');
      expect(getP0Limitations(brand)).toContain('반복 비용 가정 포함');
      expect(brand.audit.p0Verified).toBe(false);
      expect(brand.audit.verificationStatus).toBe('partial');
      expect(brand.freshness).toBe('current');
      expect(brand.trendDriven).toBe(brand.id === 'yoajung');
    }
  });

  it('keeps trade-area scenarios explicit and marked as structural placeholders', () => {
    for (const brand of brands) {
      expect(brand.tradeAreaScenarios.length).toBeGreaterThanOrEqual(3);
      expect(brand.tradeAreaScenarios.map((scenario) => scenario.label)).toEqual(
        expect.arrayContaining(['역세권', '주거지형', '고임대 특수상권']),
      );

      for (const scenario of brand.tradeAreaScenarios) {
        expect(scenario.status).toBe('structural-only');
        expect(scenario.monthlyRentM).toBeNull();
        expect(scenario.deliveryRatio).toBeNull();
        expect(scenario.note).toContain('지역/상권 데이터 연동 전');
      }
    }
  });

  it('applies sourced partial P0 values for the disclosure-backed batch', () => {
    const expected = new Map([
      ['isaac', { stores: 894, openings3y: 113, closures3y: 76, terminations3y: 75, salesM: 221.902, startupM: 79.59 }],
      ['mega', { stores: 3325, openings3y: 1196, closures3y: 27, terminations3y: 27, salesM: 388.443, startupM: 78.474 }],
      ['momstouch', { stores: 1444, openings3y: 123, closures3y: 71, terminations3y: 71, salesM: 544.997, startupM: 108.961 }],
      ['yoajung', { stores: 372, openings3y: 368, closures3y: 1, terminations3y: 0, salesM: 623.918, startupM: 53.3 }],
      ['bondosirak', { stores: 405, openings3y: 62, closures3y: 80, terminations3y: 80, salesM: 294.382, startupM: 86.097 }],
      ['compose', { stores: 2649, openings3y: 1421, closures3y: 57, terminations3y: 52, salesM: 271.883, startupM: 83.482 }],
      ['kyochon', { stores: 1361, openings3y: 64, closures3y: 40, terminations3y: 40, salesM: 727.264, startupM: 130.491 }],
      ['ediya', { stores: 2562, openings3y: 269, closures3y: 712, terminations3y: 712, salesM: 194.818, startupM: 132.32 }],
      ['hansot', { stores: 811, openings3y: 150, closures3y: 86, terminations3y: 81, salesM: 408.402, startupM: 100.259 }],
      ['baskin', { stores: 1706, openings3y: 91, closures3y: 38, terminations3y: 33, salesM: 526.025, startupM: 278.95 }],
    ]);

    for (const [brandId, values] of expected) {
      const brand = brands.find((item) => item.id === brandId);
      expect(brand).toBeDefined();
      expect(brand?.stability.currentStores).toBe(values.stores);
      expect(brand?.stability.openings3y).toBe(values.openings3y);
      expect(brand?.stability.closures3y).toBe(values.closures3y);
      expect(brand?.stability.terminations3y).toBe(values.terminations3y);
      expect(brand?.sales.averageAnnualSalesM).toBeCloseTo(values.salesM);
      expect(brand?.cost.startupTotalM).toBeCloseTo(values.startupM);
      expect(brand?.audit.verificationStatus).toBe('partial');
      expect(brand?.audit.p0Verified).toBe(false);
      expect(brand?.sources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'public-data',
            referenceYear: 2024,
            confidence: 'medium',
          }),
        ]),
      );
    }
  });

  it('keeps app values aligned with the captured Gyeonggi source snapshot', () => {
    expect(validateP0SourceSnapshotAlignment(brands)).toEqual([]);
  });

  it('exposes source snapshot alignment as an npm preflight command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'check:p0:sources'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('P0 source snapshot alignment: OK');
    expect(result.stdout).toContain('Brands checked: 10');
  }, 15000);
});
