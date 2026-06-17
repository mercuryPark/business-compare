import type { Brand, BrandCategory, SimulatorDefaults, TradeAreaScenario } from './types';
import { createP0Checklist, createPartialP0Checklist } from './qa';
import { sourcedDisclosurePatches } from './p0SourceSnapshots';
import { estimateLaborCostM } from './simulator';

const capturedAt = '2026-06-15';
const prototypeSource = {
  type: 'manual-assumption' as const,
  title: 'Prototype sample data for UI and model validation',
  capturedAt,
  confidence: 'low' as const,
};

const sourcedCapturedAt = '2026-06-16';

function createTradeAreaScenarios(): TradeAreaScenario[] {
  return [
    {
      id: 'station',
      label: '역세권',
      fitLabel: '조건부',
      status: 'structural-only',
      expectedNetProfitM: null,
      monthlyRentM: null,
      deliveryRatio: null,
      note: '지역/상권 데이터 연동 전 구조 준비 항목입니다. 유동인구와 임대료 검증 전까지 참고 라벨로만 봅니다.',
    },
    {
      id: 'residential',
      label: '주거지형',
      fitLabel: '조건부',
      status: 'structural-only',
      expectedNetProfitM: null,
      monthlyRentM: null,
      deliveryRatio: null,
      note: '지역/상권 데이터 연동 전 구조 준비 항목입니다. 배후세대와 평일/주말 수요 검증 전까지 참고 라벨로만 봅니다.',
    },
    {
      id: 'high-rent-special',
      label: '고임대 특수상권',
      fitLabel: '주의',
      status: 'structural-only',
      expectedNetProfitM: null,
      monthlyRentM: null,
      deliveryRatio: null,
      note: '지역/상권 데이터 연동 전 구조 준비 항목입니다. 임대료와 최소 필요 매출 검증 전까지 수익성 판단에 쓰지 않습니다.',
    },
  ];
}

const partialP0Metrics = [
  'startup-cost',
  'store-count-trend',
  'average-sales',
  'closure-contract',
  'disclosure-source',
] as const;

type BrandSeed = {
  id: Brand['id'];
  name: Brand['name'];
  operator: Brand['operator'];
  category: Brand['category'];
  categoryLabel: Brand['categoryLabel'];
  launchYear: Brand['launchYear'];
  franchiseStartYear: Brand['franchiseStartYear'];
  stores: Brand['stability']['currentStores'];
  averageOperatingYears: NonNullable<Brand['stability']['averageOperatingYears']>;
};

type OperatingAssumptions = Pick<
  SimulatorDefaults,
  'monthlyRentM' | 'deliveryRatio' | 'ownerLaborM' | 'cogsRate' | 'utilitiesM' | 'otherOpexM'
> & {
  laborBaseM: number;
  laborSalesRate: number;
  recurringRoyaltyRate: number;
  adFeeRate: number;
  requiredPurchaseBurdenRate: number;
  renewalReserveM: number;
};

function getOperatingAssumptions(id: Brand['id'], category: BrandCategory): OperatingAssumptions {
  if (id === 'isaac') {
    return {
      monthlyRentM: 2.8,
      deliveryRatio: 0.1,
      laborBaseM: 0.5,
      laborSalesRate: 0.09,
      ownerLaborM: 2.8,
      cogsRate: 0.37,
      utilitiesM: 0.65,
      otherOpexM: 0.65,
      recurringRoyaltyRate: 0.005,
      adFeeRate: 0.003,
      requiredPurchaseBurdenRate: 0.01,
      renewalReserveM: 0.35,
    };
  }

  if (id === 'momstouch') {
    return {
      monthlyRentM: 6.5,
      deliveryRatio: 0.32,
      laborBaseM: 1.5,
      laborSalesRate: 0.14,
      ownerLaborM: 3,
      cogsRate: 0.4,
      utilitiesM: 1.4,
      otherOpexM: 1.4,
      recurringRoyaltyRate: 0.012,
      adFeeRate: 0.006,
      requiredPurchaseBurdenRate: 0.02,
      renewalReserveM: 0.8,
    };
  }

  if (category === 'lunchbox') {
    return {
      monthlyRentM: 4.2,
      deliveryRatio: 0.25,
      laborBaseM: 1.2,
      laborSalesRate: 0.09,
      ownerLaborM: 2.8,
      cogsRate: 0.4,
      utilitiesM: 0.9,
      otherOpexM: 0.8,
      recurringRoyaltyRate: 0.01,
      adFeeRate: 0.005,
      requiredPurchaseBurdenRate: 0.02,
      renewalReserveM: 0.5,
    };
  }

  if (category === 'coffee') {
    return {
      monthlyRentM: id === 'ediya' ? 3.3 : 3.8,
      deliveryRatio: 0.05,
      laborBaseM: 0.8,
      laborSalesRate: 0.05,
      ownerLaborM: 2.6,
      cogsRate: 0.34,
      utilitiesM: 0.75,
      otherOpexM: 0.65,
      recurringRoyaltyRate: 0.01,
      adFeeRate: 0.005,
      requiredPurchaseBurdenRate: 0.015,
      renewalReserveM: 0.4,
    };
  }

  if (category === 'chicken') {
    return {
      monthlyRentM: 6.2,
      deliveryRatio: 0.55,
      laborBaseM: 1.5,
      laborSalesRate: 0.1,
      ownerLaborM: 3,
      cogsRate: 0.42,
      utilitiesM: 1.5,
      otherOpexM: 1.6,
      recurringRoyaltyRate: 0.01,
      adFeeRate: 0.006,
      requiredPurchaseBurdenRate: 0.025,
      renewalReserveM: 0.9,
    };
  }

  return {
    monthlyRentM: 5,
    deliveryRatio: 0.18,
    laborBaseM: 1.2,
    laborSalesRate: 0.08,
    ownerLaborM: 2.8,
    cogsRate: 0.36,
    utilitiesM: 1,
    otherOpexM: 1,
    recurringRoyaltyRate: 0.01,
    adFeeRate: 0.005,
    requiredPurchaseBurdenRate: 0.02,
    renewalReserveM: 0.7,
  };
}

const brandSeeds = [
  {
    id: 'hansot',
    name: '한솥도시락',
    operator: '한솥',
    category: 'lunchbox',
    categoryLabel: '도시락',
    launchYear: 1993,
    franchiseStartYear: 1993,
    stores: 850,
    averageOperatingYears: 12,
  },
  {
    id: 'isaac',
    name: '이삭토스트',
    operator: '이삭',
    category: 'toast-burger',
    categoryLabel: '토스트/버거',
    launchYear: 1995,
    franchiseStartYear: 2003,
    stores: 900,
    averageOperatingYears: 11,
  },
  {
    id: 'mega',
    name: '메가커피',
    operator: '앤하우스',
    category: 'coffee',
    categoryLabel: '커피',
    launchYear: 2015,
    franchiseStartYear: 2016,
    stores: 3000,
    averageOperatingYears: 9,
  },
  {
    id: 'momstouch',
    name: '맘스터치',
    operator: '맘스터치앤컴퍼니',
    category: 'toast-burger',
    categoryLabel: '토스트/버거',
    launchYear: 2004,
    franchiseStartYear: 2004,
    stores: 1400,
    averageOperatingYears: 8,
  },
  {
    id: 'yoajung',
    name: '요아정',
    operator: '요아정',
    category: 'dessert',
    categoryLabel: '디저트',
    launchYear: 2021,
    franchiseStartYear: 2022,
    stores: 350,
    averageOperatingYears: 3,
  },
  {
    id: 'bondosirak',
    name: '본도시락',
    operator: '본아이에프',
    category: 'lunchbox',
    categoryLabel: '도시락',
    launchYear: 2012,
    franchiseStartYear: 2012,
    stores: 420,
    averageOperatingYears: 8,
  },
  {
    id: 'baskin',
    name: '베스킨라빈스',
    operator: '비알코리아',
    category: 'dessert',
    categoryLabel: '디저트',
    launchYear: 1985,
    franchiseStartYear: 1985,
    stores: 1700,
    averageOperatingYears: 20,
  },
  {
    id: 'compose',
    name: '컴포즈커피',
    operator: '컴포즈커피',
    category: 'coffee',
    categoryLabel: '커피',
    launchYear: 2014,
    franchiseStartYear: 2014,
    stores: 2500,
    averageOperatingYears: 8,
  },
  {
    id: 'kyochon',
    name: '교촌치킨',
    operator: '교촌에프앤비',
    category: 'chicken',
    categoryLabel: '치킨',
    launchYear: 1991,
    franchiseStartYear: 1991,
    stores: 1350,
    averageOperatingYears: 22,
  },
  {
    id: 'ediya',
    name: '이디야커피',
    operator: '이디야',
    category: 'coffee',
    categoryLabel: '커피',
    launchYear: 2001,
    franchiseStartYear: 2001,
    stores: 3000,
    averageOperatingYears: 18,
  },
] satisfies BrandSeed[];

export const brands: Brand[] = brandSeeds.map(
  ({
    id,
    name,
    operator,
    category,
    categoryLabel,
    launchYear,
    franchiseStartYear,
    stores,
    averageOperatingYears,
  }) => {
    const storeCount = stores;
    const baseSales =
      category === 'coffee' ? 300 : category === 'chicken' ? 650 : category === 'dessert' ? 430 : 380;
    const startup = category === 'chicken' ? 160 : category === 'dessert' ? 140 : category === 'coffee' ? 110 : 95;
    const operating = getOperatingAssumptions(id, category);
    const laborModel = { baseM: operating.laborBaseM, salesRate: operating.laborSalesRate };
    const baseMonthlySalesM = baseSales / 12;

    const brand = {
      id,
      name,
      operator,
      category,
      categoryLabel,
      launchYear,
      franchiseStartYear,
      fitLabel: '자료 부족',
      oneLine: '프로토타입 데이터입니다. 실제 정보공개서 검증 전까지 판단 라벨은 제한적으로 표시합니다.',
      suitableFor: 'P0 검증 후 업데이트',
      cautionFor: '공개자료 검증 전 수익성 판단 금지',
      cost: {
        startupTotalM: startup,
        franchiseFeeM: 10,
        trainingFeeM: 5,
        depositM: 10,
        interiorM: startup * 0.42,
        equipmentM: startup * 0.28,
        otherStartupM: startup * 0.12,
        recurringRoyaltyRate: operating.recurringRoyaltyRate,
        adFeeRate: operating.adFeeRate,
        requiredPurchaseBurdenRate: operating.requiredPurchaseBurdenRate,
        differenceFranchiseFeeTotalM: null,
        recurringCostBasis: 'manual-assumption',
        recurringCostNote:
          '로열티·광고비·필수구매율은 시뮬레이터 가정입니다. 공공데이터포털 가맹금/기타비용 API 또는 정보공개서 원문 대조 전까지 수익성 판단에는 쓰지 않습니다.',
        renewalReserveM: operating.renewalReserveM,
      },
      sales: {
        averageAnnualSalesM: baseSales,
        salesPerAreaM: baseSales / 20,
        regionalLowAnnualSalesM: baseSales * 0.65,
        regionalHighAnnualSalesM: baseSales * 1.35,
        averageSalesCaveat: '평균 매출은 점포별 편차를 가릴 수 있어 지역별 편차와 보수 시나리오를 함께 봐야 합니다.',
      },
      stability: {
        currentStores: storeCount,
        directStores: 0,
        storeChange3y: Math.round(storeCount * 0.08),
        openings3y: Math.round(storeCount * 0.16),
        closures3y: Math.round(storeCount * 0.06),
        terminations3y: Math.round(storeCount * 0.015),
        expirations3y: Math.round(storeCount * 0.02),
        ownershipTransfers3y: Math.round(storeCount * 0.03),
        averageOperatingYears,
      },
      simulatorDefaults: {
        monthlySalesM: baseMonthlySalesM,
        monthlyRentM: operating.monthlyRentM,
        deliveryRatio: operating.deliveryRatio,
        laborCostM: estimateLaborCostM(baseMonthlySalesM, laborModel),
        ownerLaborM: operating.ownerLaborM,
        cogsRate: operating.cogsRate,
        deliveryCommissionRate: 0.09,
        deliveryAgencyRate: 0.07,
        packagingRate: 0.025,
        cardFeeRate: 0.018,
        loanPrincipalM: startup * 0.5,
        annualInterestRate: 0.055,
        loanYears: 5,
        taxReserveRate: 0.08,
        utilitiesM: operating.utilitiesM,
        otherOpexM: operating.otherOpexM,
      },
      laborModel,
      trendDriven: id === 'yoajung',
      tradeAreaFit: ['역세권', '주거지형'],
      tradeAreaAvoid: ['임대료가 과도한 특수상권'],
      tradeAreaScenarios: createTradeAreaScenarios(),
      keyRisks: ['P0 미검증', '평균 매출 착시 주의', '필수구매 부담 확인 필요'],
      sources: [prototypeSource],
      audit: {
        p0Verified: false,
        verificationStatus: 'unverified',
        p0Checklist: createP0Checklist(),
        researcher: 'prototype',
        nextReviewMonth: '2026-07',
        correctionStatus: 'none',
      },
      freshness: 'needs-update',
    } satisfies Brand;

    const patch = sourcedDisclosurePatches[id];
    if (!patch) {
      return brand;
    }

    const contractRelatedClosures = patch.stability.contractEnds3y + patch.stability.terminations3y;

    return {
      ...brand,
      oneLine: '경기도 가맹정보제공시스템의 정보공개서 기반 구조화 데이터를 일부 반영했습니다. 원문 대조 전까지 최종 판단은 보류합니다.',
      cost: {
        ...brand.cost,
        startupTotalM: patch.cost.startupTotalM,
        franchiseFeeM: patch.cost.franchiseFeeM,
        trainingFeeM: patch.cost.trainingFeeM,
        depositM: patch.cost.depositM,
        interiorM: 0,
        equipmentM: 0,
        otherStartupM: patch.cost.otherStartupM,
      },
      sales: {
        ...brand.sales,
        averageAnnualSalesM: patch.sales.averageAnnualSalesM,
        salesPerAreaM: patch.sales.salesPerAreaM,
        regionalLowAnnualSalesM: undefined,
        regionalHighAnnualSalesM: undefined,
        averageSalesCaveat:
          '2024년 정보공개서 기반 평균매출입니다. 지역별 분포와 원문 수치 대조 전까지 하한 추정과 함께 봐야 합니다.',
      },
      stability: {
        ...brand.stability,
        currentStores: patch.stability.currentStores,
        directStores: patch.stability.directStores,
        storeChange3y: patch.stability.storeChange3y,
        openings3y: patch.stability.openings3y,
        closures3y: contractRelatedClosures,
        terminations3y: patch.stability.terminations3y,
        expirations3y: patch.stability.contractEnds3y,
        ownershipTransfers3y: patch.stability.ownershipTransfers3y,
      },
      simulatorDefaults: {
        ...brand.simulatorDefaults,
        monthlySalesM: patch.sales.averageAnnualSalesM / 12,
        laborCostM: estimateLaborCostM(patch.sales.averageAnnualSalesM / 12, laborModel),
        loanPrincipalM: patch.cost.startupTotalM * 0.5,
      },
      keyRisks: ['P0 부분 검증', '정보공개서 원문 대조 필요', '차액가맹금/필수비용 추가 확인 필요'],
      sources: [
        {
          type: 'public-data',
          title: '경기도 가맹정보제공시스템 정보공개서 기반 데이터',
          url: `https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=${patch.frnchsNo}`,
          referenceYear: 2024,
          capturedAt: sourcedCapturedAt,
          confidence: 'medium',
        },
      ],
      audit: {
        ...brand.audit,
        verificationStatus: 'partial',
        p0Checklist: createPartialP0Checklist(
          [...partialP0Metrics],
          '경기도 가맹정보제공시스템 구조화 데이터 반영, 원문 대조 전',
        ),
        researcher: 'codex-gyeonggi-endpoint',
        lastVerifiedAt: sourcedCapturedAt,
      },
      freshness: 'current',
    } satisfies Brand;
  },
);

export const categories = Array.from(new Set(brands.map((brand) => brand.category)));
