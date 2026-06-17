import type { Brand } from './types';

export interface P0GyeonggiSourceSnapshot {
  brandId: string;
  frnchsNo: string;
  registeredBrandName: string;
  referenceYear: number;
  capturedAt: string;
  costThousandKrw: {
    franchiseFee: number;
    trainingFee: number;
    deposit: number;
    otherStartup: number;
    startupTotal: number;
  };
  salesThousandKrw: {
    averageAnnualSales: number;
    salesPerArea: number;
  };
  stability: {
    currentStores: number;
    directStores: number;
    storeChange3y: number;
    openings3y: number;
    contractEnds3y: number;
    terminations3y: number;
    ownershipTransfers3y: number;
  };
}

export interface SourcedDisclosurePatch {
  frnchsNo: string;
  cost: {
    franchiseFeeM: number;
    trainingFeeM: number;
    depositM: number;
    otherStartupM: number;
    startupTotalM: number;
  };
  sales: {
    averageAnnualSalesM: number;
    salesPerAreaM: number;
  };
  stability: {
    currentStores: number;
    directStores: number;
    storeChange3y: number;
    openings3y: number;
    contractEnds3y: number;
    terminations3y: number;
    ownershipTransfers3y: number;
  };
}

export interface P0SourceSnapshotMismatch {
  brandId: string;
  field: string;
  expected: string | number;
  actual: string | number | null;
}

const capturedAt = '2026-06-16';

export const P0_GYEONGGI_SOURCE_SNAPSHOTS: P0GyeonggiSourceSnapshot[] = [
  {
    brandId: 'hansot',
    frnchsNo: '20080100308',
    registeredBrandName: '한솥',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 6600, trainingFee: 5500, deposit: 4000, otherStartup: 84159, startupTotal: 100259 },
    salesThousandKrw: { averageAnnualSales: 408402, salesPerArea: 27289 },
    stability: { currentStores: 811, directStores: 1, storeChange3y: 44, openings3y: 150, contractEnds3y: 5, terminations3y: 81, ownershipTransfers3y: 167 },
  },
  {
    brandId: 'isaac',
    frnchsNo: '20080500031',
    registeredBrandName: '이삭토스트',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 0, trainingFee: 4400, deposit: 1000, otherStartup: 74190, startupTotal: 79590 },
    salesThousandKrw: { averageAnnualSales: 221902, salesPerArea: 20553 },
    stability: { currentStores: 894, directStores: 6, storeChange3y: -6, openings3y: 113, contractEnds3y: 1, terminations3y: 75, ownershipTransfers3y: 206 },
  },
  {
    brandId: 'mega',
    frnchsNo: '20160628',
    registeredBrandName: '메가엠지씨커피(MEGA MGC COFFEE)',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 11000, trainingFee: 5500, deposit: 2000, otherStartup: 59974, startupTotal: 78474 },
    salesThousandKrw: { averageAnnualSales: 388443, salesPerArea: 22410 },
    stability: { currentStores: 3325, directStores: 35, storeChange3y: 644, openings3y: 1196, contractEnds3y: 0, terminations3y: 27, ownershipTransfers3y: 774 },
  },
  {
    brandId: 'momstouch',
    frnchsNo: '20080100157',
    registeredBrandName: '맘스터치',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 5500, trainingFee: 0, deposit: 2000, otherStartup: 101461, startupTotal: 108961 },
    salesThousandKrw: { averageAnnualSales: 544997, salesPerArea: 19499 },
    stability: { currentStores: 1444, directStores: 11, storeChange3y: 35, openings3y: 123, contractEnds3y: 0, terminations3y: 71, ownershipTransfers3y: 304 },
  },
  {
    brandId: 'yoajung',
    frnchsNo: '20220572',
    registeredBrandName: '카페요아정',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 5500, trainingFee: 3300, deposit: 6000, otherStartup: 38500, startupTotal: 53300 },
    salesThousandKrw: { averageAnnualSales: 623918, salesPerArea: 52842 },
    stability: { currentStores: 372, directStores: 2, storeChange3y: 372, openings3y: 368, contractEnds3y: 1, terminations3y: 0, ownershipTransfers3y: 8 },
  },
  {
    brandId: 'bondosirak',
    frnchsNo: '20100100482',
    registeredBrandName: '본도시락',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 12100, trainingFee: 6600, deposit: 3000, otherStartup: 64397, startupTotal: 86097 },
    salesThousandKrw: { averageAnnualSales: 294382, salesPerArea: 21275 },
    stability: { currentStores: 405, directStores: 1, storeChange3y: -30, openings3y: 62, contractEnds3y: 0, terminations3y: 80, ownershipTransfers3y: 111 },
  },
  {
    brandId: 'baskin',
    frnchsNo: '20080500015',
    registeredBrandName: '배스킨라빈스',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 8800, trainingFee: 1650, deposit: 40000, otherStartup: 228500, startupTotal: 278950 },
    salesThousandKrw: { averageAnnualSales: 526025, salesPerArea: 24989 },
    stability: { currentStores: 1706, directStores: 41, storeChange3y: 19, openings3y: 91, contractEnds3y: 5, terminations3y: 33, ownershipTransfers3y: 170 },
  },
  {
    brandId: 'compose',
    frnchsNo: '20141250',
    registeredBrandName: '컴포즈커피(COMPOSE COFFEE)',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 5500, trainingFee: 2200, deposit: 5000, otherStartup: 70782, startupTotal: 83482 },
    salesThousandKrw: { averageAnnualSales: 271883, salesPerArea: 18030 },
    stability: { currentStores: 2649, directStores: 0, storeChange3y: 748, openings3y: 1421, contractEnds3y: 5, terminations3y: 52, ownershipTransfers3y: 944 },
  },
  {
    brandId: 'kyochon',
    frnchsNo: '20080600002',
    registeredBrandName: '교촌치킨',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 6765, trainingFee: 3550, deposit: 1000, otherStartup: 119176, startupTotal: 130491 },
    salesThousandKrw: { averageAnnualSales: 727264, salesPerArea: 33068 },
    stability: { currentStores: 1361, directStores: 1, storeChange3y: -4, openings3y: 64, contractEnds3y: 0, terminations3y: 40, ownershipTransfers3y: 384 },
  },
  {
    brandId: 'ediya',
    frnchsNo: '20080100014',
    registeredBrandName: '이디야커피',
    referenceYear: 2024,
    capturedAt,
    costThousandKrw: { franchiseFee: 9900, trainingFee: 3300, deposit: 5000, otherStartup: 114120, startupTotal: 132320 },
    salesThousandKrw: { averageAnnualSales: 194818, salesPerArea: 6330 },
    stability: { currentStores: 2562, directStores: 19, storeChange3y: -243, openings3y: 269, contractEnds3y: 0, terminations3y: 712, ownershipTransfers3y: 431 },
  },
];

export const sourcedDisclosurePatches: Partial<Record<string, SourcedDisclosurePatch>> = Object.fromEntries(
  P0_GYEONGGI_SOURCE_SNAPSHOTS.map((snapshot) => [snapshot.brandId, toSourcedDisclosurePatch(snapshot)]),
) as Partial<Record<string, SourcedDisclosurePatch>>;

export function buildGyeonggiSourceUrl(snapshot: P0GyeonggiSourceSnapshot): string {
  return `https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=${snapshot.referenceYear}&frnchsNo=${snapshot.frnchsNo}`;
}

export function toSourcedDisclosurePatch(snapshot: P0GyeonggiSourceSnapshot): SourcedDisclosurePatch {
  return {
    frnchsNo: snapshot.frnchsNo,
    cost: {
      franchiseFeeM: toMillionKrw(snapshot.costThousandKrw.franchiseFee),
      trainingFeeM: toMillionKrw(snapshot.costThousandKrw.trainingFee),
      depositM: toMillionKrw(snapshot.costThousandKrw.deposit),
      otherStartupM: toMillionKrw(snapshot.costThousandKrw.otherStartup),
      startupTotalM: toMillionKrw(snapshot.costThousandKrw.startupTotal),
    },
    sales: {
      averageAnnualSalesM: toMillionKrw(snapshot.salesThousandKrw.averageAnnualSales),
      salesPerAreaM: toMillionKrw(snapshot.salesThousandKrw.salesPerArea),
    },
    stability: { ...snapshot.stability },
  };
}

export function validateP0SourceSnapshotAlignment(
  brands: Brand[],
  snapshots: P0GyeonggiSourceSnapshot[] = P0_GYEONGGI_SOURCE_SNAPSHOTS,
): P0SourceSnapshotMismatch[] {
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const mismatches: P0SourceSnapshotMismatch[] = [];

  for (const snapshot of snapshots) {
    const brand = brandsById.get(snapshot.brandId);
    if (!brand) {
      mismatches.push({ brandId: snapshot.brandId, field: 'brand', expected: 'present', actual: null });
      continue;
    }

    const patch = toSourcedDisclosurePatch(snapshot);
    const source = brand.sources.find((item) => item.type === 'public-data');

    compareNumber(mismatches, brand.id, 'cost.franchiseFeeM', patch.cost.franchiseFeeM, brand.cost.franchiseFeeM);
    compareNumber(mismatches, brand.id, 'cost.trainingFeeM', patch.cost.trainingFeeM, brand.cost.trainingFeeM);
    compareNumber(mismatches, brand.id, 'cost.depositM', patch.cost.depositM, brand.cost.depositM);
    compareNumber(mismatches, brand.id, 'cost.otherStartupM', patch.cost.otherStartupM, brand.cost.otherStartupM);
    compareNumber(mismatches, brand.id, 'cost.startupTotalM', patch.cost.startupTotalM, brand.cost.startupTotalM);
    compareNumber(mismatches, brand.id, 'sales.averageAnnualSalesM', patch.sales.averageAnnualSalesM, brand.sales.averageAnnualSalesM);
    compareNumber(mismatches, brand.id, 'sales.salesPerAreaM', patch.sales.salesPerAreaM, brand.sales.salesPerAreaM);
    compareNumber(mismatches, brand.id, 'stability.currentStores', patch.stability.currentStores, brand.stability.currentStores);
    compareNumber(mismatches, brand.id, 'stability.directStores', patch.stability.directStores, brand.stability.directStores);
    compareNumber(mismatches, brand.id, 'stability.storeChange3y', patch.stability.storeChange3y, brand.stability.storeChange3y);
    compareNumber(mismatches, brand.id, 'stability.openings3y', patch.stability.openings3y, brand.stability.openings3y);
    compareNumber(mismatches, brand.id, 'stability.expirations3y', patch.stability.contractEnds3y, brand.stability.expirations3y);
    compareNumber(mismatches, brand.id, 'stability.terminations3y', patch.stability.terminations3y, brand.stability.terminations3y);
    compareNumber(
      mismatches,
      brand.id,
      'stability.closures3y',
      patch.stability.contractEnds3y + patch.stability.terminations3y,
      brand.stability.closures3y,
    );
    compareNumber(
      mismatches,
      brand.id,
      'stability.ownershipTransfers3y',
      patch.stability.ownershipTransfers3y,
      brand.stability.ownershipTransfers3y ?? null,
    );
    compareString(mismatches, brand.id, 'source.url', buildGyeonggiSourceUrl(snapshot), source?.url ?? null);
    compareNumber(mismatches, brand.id, 'source.referenceYear', snapshot.referenceYear, source?.referenceYear ?? null);
    compareString(mismatches, brand.id, 'source.capturedAt', snapshot.capturedAt, source?.capturedAt ?? null);
  }

  return mismatches;
}

function toMillionKrw(thousandKrw: number): number {
  return thousandKrw / 1000;
}

function compareNumber(
  mismatches: P0SourceSnapshotMismatch[],
  brandId: string,
  field: string,
  expected: number,
  actual: number | null,
): void {
  if (actual === null || Math.abs(expected - actual) > 0.001) {
    mismatches.push({ brandId, field, expected, actual });
  }
}

function compareString(
  mismatches: P0SourceSnapshotMismatch[],
  brandId: string,
  field: string,
  expected: string,
  actual: string | null,
): void {
  if (actual !== expected) {
    mismatches.push({ brandId, field, expected, actual });
  }
}
