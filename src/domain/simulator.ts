import type { Brand, LaborModel, SimulatorDefaults } from './types';

export interface SimulationResult {
  operatingProfitBeforeOwnerLaborM: number;
  operatingProfitAfterOwnerLaborM: number;
  cashLeftM: number;
  netMargin: number;
  breakEvenSalesM: number;
  paybackMonths: number | null;
  topCostDrivers: Array<{ label: string; valueM: number }>;
  warnings: string[];
}

// 인건비는 고정 운영 인력(baseM)에 매출 연동 인력(salesRate)을 더해 추정한다.
// 매출이 늘면 필요 인력도 늘어, 매출만 올렸을 때 순익이 비현실적으로 폭증하는 착시를 막는다.
export function estimateLaborCostM(monthlySalesM: number, model: LaborModel): number {
  const sales = Math.max(0, monthlySalesM);
  const estimate = model.baseM + sales * model.salesRate;
  return Math.round(estimate * 100) / 100;
}

// 배달 비중을 높이면 새 수요가 유입돼 총매출도 일부 늘어난다(수수료만 느는 게 아니다).
// 배달 의존도가 본래 높은 업종(치킨 등)일수록 배달 확대의 매출 기여가 크도록,
// 기준 배달비중을 탄력계수로 사용한다. 비중을 낮추면 대칭으로 매출도 소폭 줄어든다.
export function estimateDeliveryAdjustedSalesM(
  currentSalesM: number,
  newDeliveryRatio: number,
  previousDeliveryRatio: number,
  baseDeliveryRatio: number,
): number {
  const delta = newDeliveryRatio - previousDeliveryRatio;
  const adjusted = currentSalesM * (1 + delta * baseDeliveryRatio);
  return Math.max(0, Math.round(adjusted * 100) / 100);
}

// 임대료가 높은 자리는 대체로 유동인구가 많아 기대매출도 높다(임대료가 순수 비용만은 아니다).
// 단 상승분이 전부 매출로 돌아오진 않아(탄력 < 1) 무작정 비싼 자리가 정답은 아니다.
// 배달 의존이 낮은 업종일수록 홀/유동인구가 중요하므로 입지 매출 탄력을 크게 둔다.
export function estimateRentAdjustedSalesM(
  currentSalesM: number,
  newRentM: number,
  previousRentM: number,
  baseRentM: number,
  baseDeliveryRatio: number,
): number {
  if (baseRentM <= 0) return currentSalesM;
  const rentDeltaRatio = (newRentM - previousRentM) / baseRentM;
  const elasticity = 0.5 * (1 - baseDeliveryRatio);
  const adjusted = currentSalesM * (1 + rentDeltaRatio * elasticity);
  return Math.max(0, Math.round(adjusted * 100) / 100);
}

export function calculateMonthlyLoanPaymentM(principalM: number, annualRate: number, years: number): number {
  if (principalM <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  if (monthlyRate === 0) return principalM / months;
  return (principalM * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export function runSimulation(brand: Brand, input: SimulatorDefaults): SimulationResult {
  const deliverySalesM = input.monthlySalesM * input.deliveryRatio;
  const cogsM = input.monthlySalesM * input.cogsRate;
  const requiredPurchaseM = input.monthlySalesM * brand.cost.requiredPurchaseBurdenRate;
  const deliveryFeesM = deliverySalesM * (input.deliveryCommissionRate + input.deliveryAgencyRate + input.packagingRate);
  const cardFeesM = input.monthlySalesM * input.cardFeeRate;
  const royaltyM = input.monthlySalesM * brand.cost.recurringRoyaltyRate;
  const adFeeM = input.monthlySalesM * brand.cost.adFeeRate;
  const reserveM = brand.cost.renewalReserveM;
  const loanPaymentM = calculateMonthlyLoanPaymentM(input.loanPrincipalM, input.annualInterestRate, input.loanYears);

  const operatingCostsBeforeOwnerLaborM =
    cogsM +
    requiredPurchaseM +
    deliveryFeesM +
    cardFeesM +
    royaltyM +
    adFeeM +
    input.monthlyRentM +
    input.laborCostM +
    input.utilitiesM +
    input.otherOpexM +
    reserveM;

  const operatingProfitBeforeOwnerLaborM = input.monthlySalesM - operatingCostsBeforeOwnerLaborM;
  const operatingProfitAfterOwnerLaborM = operatingProfitBeforeOwnerLaborM - input.ownerLaborM;
  const taxReserveM = Math.max(0, operatingProfitAfterOwnerLaborM * input.taxReserveRate);
  const cashLeftM = operatingProfitAfterOwnerLaborM - loanPaymentM - taxReserveM;
  const fixedMonthlyM =
    input.monthlyRentM + input.laborCostM + input.utilitiesM + input.otherOpexM + reserveM + input.ownerLaborM;
  // 손익분기점에서도 대출 원리금은 매달 나가므로 고정비에 포함한다.
  // 분기점 부근 이익에 매겨지는 세금까지 반영하려면 상환액을 (1 - 세금유보율)로 환산한다.
  const taxAdjustedLoanM = loanPaymentM > 0 ? loanPaymentM / Math.max(0.05, 1 - input.taxReserveRate) : 0;
  const breakEvenFixedM = fixedMonthlyM + taxAdjustedLoanM;
  const variableRate =
    input.cogsRate +
    brand.cost.requiredPurchaseBurdenRate +
    input.cardFeeRate +
    brand.cost.recurringRoyaltyRate +
    brand.cost.adFeeRate +
    input.deliveryRatio * (input.deliveryCommissionRate + input.deliveryAgencyRate + input.packagingRate);
  // 대출을 뺀 자기자본만 매월 현금흐름으로 회수한다(대출 상환은 이미 cashLeft에서 빠짐).
  const equityToRecoverM = Math.max(0, brand.cost.startupTotalM - input.loanPrincipalM);

  return {
    operatingProfitBeforeOwnerLaborM: round(operatingProfitBeforeOwnerLaborM),
    operatingProfitAfterOwnerLaborM: round(operatingProfitAfterOwnerLaborM),
    cashLeftM: round(cashLeftM),
    netMargin: round(cashLeftM / input.monthlySalesM),
    breakEvenSalesM: round(breakEvenFixedM / Math.max(0.05, 1 - variableRate)),
    paybackMonths: cashLeftM > 0 ? Math.ceil(equityToRecoverM / cashLeftM) : null,
    topCostDrivers: [
      { label: '원가/필수구매', valueM: round(cogsM + requiredPurchaseM) },
      { label: '인건비/사장노동', valueM: round(input.laborCostM + input.ownerLaborM) },
      { label: '배달/포장 수수료', valueM: round(deliveryFeesM) },
    ].sort((a, b) => b.valueM - a.valueM),
    warnings: buildWarnings(input.deliveryRatio, brand.cost.requiredPurchaseBurdenRate),
  };
}

function buildWarnings(deliveryRatio: number, requiredPurchaseRate: number): string[] {
  const warnings = [
    '이 계산은 공개자료와 업종 평균 가정을 바탕으로 한 예비 시뮬레이션입니다.',
    '사장 직접 근무에도 노동시간 비용을 반영합니다.',
  ];

  if (deliveryRatio >= 0.5) {
    warnings.push('배달 비중이 높아 수수료와 포장비가 순이익률을 낮출 수 있습니다.');
  }

  if (requiredPurchaseRate >= 0.08) {
    warnings.push('필수구매품목 평균 부담은 실제 점포별 부담과 다를 수 있습니다.');
  }

  return warnings;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
