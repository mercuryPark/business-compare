import type { Brand } from './types';
import { formatKoreanMoneyFromMillion } from './formatters';

export function getMonthlySalesM(brand: Brand): number {
  return brand.sales.averageAnnualSalesM / 12;
}

export function getContractChangeCount(brand: Brand): number {
  return brand.stability.closures3y;
}

export function getFounderSummary(brand: Brand): string {
  const startup = brand.cost.startupTotalM;
  const monthlySales = getMonthlySalesM(brand);
  const contractChanges = getContractChangeCount(brand);

  if (startup >= 150) {
    return `초기 비용이 큰 대신 월매출 규모도 큰 ${brand.categoryLabel} 브랜드입니다.`;
  }

  if (monthlySales >= 45) {
    return `매출 규모가 커 보이지만 인건비와 임대료를 함께 계산해야 하는 브랜드입니다.`;
  }

  if (contractChanges <= Math.max(12, brand.stability.currentStores * 0.03)) {
    return `점포 변동이 비교적 낮아 처음 비교 대상으로 보기 좋은 브랜드입니다.`;
  }

  return `비용과 매출이 중간대라 상권 조건을 맞춰 비교하기 좋은 브랜드입니다.`;
}

export function getFounderFitLabel(brand: Brand): string {
  if (brand.cost.startupTotalM <= 110 && getMonthlySalesM(brand) >= 25) {
    return '처음 비교하기 좋음';
  }

  if (brand.cost.startupTotalM >= 150) {
    return '자본 여유가 있을 때';
  }

  if (brand.trendDriven) {
    return '유행 지속성 확인';
  }

  return '조건 맞으면 검토';
}

export function getGoodPoint(brand: Brand): string {
  if (brand.stability.averageOperatingYears && brand.stability.averageOperatingYears >= 10) {
    return `운영 연수가 길어 브랜드 인지도를 설명하기 쉽습니다.`;
  }

  if (brand.stability.storeChange3y > 0) {
    return `최근 3년 점포가 늘어 시장 반응을 비교해볼 수 있습니다.`;
  }

  return `비용 구조가 단순해 첫 비교 대상으로 읽기 쉽습니다.`;
}

export function getWatchPoint(brand: Brand): string {
  if (brand.cost.startupTotalM >= 150) {
    return `초기 투자금이 커서 대출 상환액까지 계산해야 합니다.`;
  }

  if (brand.simulatorDefaults.deliveryRatio >= 0.5) {
    return `배달 비중이 높으면 수수료가 남는 돈을 줄일 수 있습니다.`;
  }

  if (brand.trendDriven) {
    return `빠르게 커진 브랜드는 유행이 꺾였을 때 매출 변화를 봐야 합니다.`;
  }

  return `평균매출만 보지 말고 내 후보 상권의 임대료를 넣어봐야 합니다.`;
}

export function getOperationLoadLabel(brand: Brand): string {
  if (brand.simulatorDefaults.deliveryRatio >= 0.5) return '배달 운영 비중 높음';
  if (brand.category === 'coffee' || brand.category === 'dessert') return '회전율과 입지 영향 큼';
  if (brand.category === 'chicken') return '야간·배달 운영 부담 큼';
  return '식사 시간 집중형 운영';
}

export function getStartupScaleLabel(brand: Brand): string {
  if (brand.cost.startupTotalM >= 150) return '높은 투자';
  if (brand.cost.startupTotalM >= 110) return '중간 이상';
  return '낮은 편';
}

export function getSalesScaleLabel(brand: Brand): string {
  const monthlySales = getMonthlySalesM(brand);
  if (monthlySales >= 50) return '큰 매출권';
  if (monthlySales >= 30) return '중간 이상';
  return '낮은 편';
}

export function getTrendLabel(brand: Brand): string {
  const change = brand.stability.storeChange3y;
  if (change > 0) return `3년간 ${change.toLocaleString('ko-KR')}개 순증`;
  if (change < 0) return `3년간 ${Math.abs(change).toLocaleString('ko-KR')}개 감소`;
  return '3년간 큰 변동 없음';
}

export function getContractChangeLabel(brand: Brand): string {
  const count = getContractChangeCount(brand);
  const rate = brand.stability.currentStores > 0 ? count / brand.stability.currentStores : 0;

  if (rate >= 0.12) return `${count.toLocaleString('ko-KR')}건, 꽤 자주 바뀜`;
  if (rate >= 0.06) return `${count.toLocaleString('ko-KR')}건, 중간 수준`;
  return `${count.toLocaleString('ko-KR')}건, 낮은 편`;
}

export function getDataBasisSummary(brand: Brand): string {
  const source = brand.sources.find((item) => item.referenceYear || item.url) ?? brand.sources[0];
  if (!source) return '화면 표시는 공개된 구조화 자료와 계산 가정을 분리해서 보여줍니다.';

  const year = source.referenceYear ? `${source.referenceYear}년` : '최근 수집';
  return `${year} 기준 자료를 바탕으로 비용, 매출, 점포 변동을 사람이 읽는 단위로 다시 계산했습니다.`;
}

export function getCounselingQuestions(brand: Brand): string[] {
  return [
    `${formatKoreanMoneyFromMillion(brand.cost.startupTotalM)} 외에 별도 공사비나 초도 물류비가 얼마나 필요한가요?`,
    `월매출 ${formatKoreanMoneyFromMillion(getMonthlySalesM(brand))} 수준에서 임대료가 얼마까지 버틸 수 있나요?`,
    `최근 폐점이나 계약 종료가 생긴 주된 이유는 무엇인가요?`,
  ];
}
