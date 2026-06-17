import type { Brand, SimulatorDefaults } from './types';

export type SimulatorScenarioId = 'base' | 'conservative' | 'improved';

export const simulatorScenarioOptions: Array<{
  id: SimulatorScenarioId;
  label: string;
  description: string;
}> = [
  {
    id: 'base',
    label: '기준형',
    description: '평균매출을 기준으로, 대출과 사장 인건비를 따로 비교합니다.',
  },
  {
    id: 'conservative',
    label: '보수형',
    description: '임대료와 배달 비중이 높아졌을 때도 버틸 수 있는지 봅니다.',
  },
  {
    id: 'improved',
    label: '개선형',
    description: '임대료와 배달 비중을 낮춘 목표 조건입니다.',
  },
];

export function getSimulatorScenarioToggleDefaults(scenarioId: SimulatorScenarioId): {
  includeLoan: boolean;
  includeOwnerLabor: boolean;
} {
  if (scenarioId === 'conservative') return { includeLoan: true, includeOwnerLabor: true };
  return { includeLoan: false, includeOwnerLabor: false };
}

export function buildSimulatorScenarioInput(
  brand: Brand,
  scenarioId: SimulatorScenarioId,
  options: { includeLoan?: boolean; includeOwnerLabor?: boolean } = {},
): SimulatorDefaults {
  const scenarioToggleDefaults = getSimulatorScenarioToggleDefaults(scenarioId);
  const includeLoan = options.includeLoan ?? scenarioToggleDefaults.includeLoan;
  const includeOwnerLabor = options.includeOwnerLabor ?? scenarioToggleDefaults.includeOwnerLabor;
  const defaults = brand.simulatorDefaults;
  const next: SimulatorDefaults = { ...defaults };

  if (scenarioId === 'conservative') {
    next.monthlyRentM = defaults.monthlyRentM * 1.12;
    next.deliveryRatio = Math.min(0.9, defaults.deliveryRatio + 0.1);
    next.laborCostM = defaults.laborCostM * 1.08;
    next.utilitiesM = defaults.utilitiesM * 1.1;
    next.otherOpexM = defaults.otherOpexM * 1.1;
  }

  if (scenarioId === 'improved') {
    next.monthlyRentM = defaults.monthlyRentM * 0.82;
    next.deliveryRatio = Math.max(0, defaults.deliveryRatio - 0.1);
    next.laborCostM = defaults.laborCostM * 0.92;
    next.utilitiesM = defaults.utilitiesM * 0.95;
    next.otherOpexM = defaults.otherOpexM * 0.95;
  }

  next.loanPrincipalM = includeLoan ? brand.cost.startupTotalM * 0.5 : 0;
  next.ownerLaborM = includeOwnerLabor ? defaults.ownerLaborM : 0;

  return next;
}
