import { describe, expect, it } from 'vitest';
import { brands } from '../brands';
import {
  calculateMonthlyLoanPaymentM,
  estimateDeliveryAdjustedSalesM,
  estimateLaborCostM,
  estimateRentAdjustedSalesM,
  runSimulation,
} from '../simulator';
import { buildSimulatorScenarioInput } from '../simulatorScenarios';

describe('simulator', () => {
  it('calculates monthly loan payment in million KRW', () => {
    const payment = calculateMonthlyLoanPaymentM(60, 0.06, 5);
    expect(payment).toBeGreaterThan(1);
    expect(payment).toBeLessThan(1.3);
  });

  it('subtracts owner labor, loan payment, and tax reserve from cash left', () => {
    const input = { ...brands[2].simulatorDefaults, monthlySalesM: 60 };
    const result = runSimulation(brands[2], input);
    const loanPaymentM = calculateMonthlyLoanPaymentM(input.loanPrincipalM, input.annualInterestRate, input.loanYears);
    const taxReserveM = Math.max(0, result.operatingProfitAfterOwnerLaborM * input.taxReserveRate);
    const expectedCashLeftM = Math.round((result.operatingProfitAfterOwnerLaborM - loanPaymentM - taxReserveM) * 100) / 100;

    expect(result.operatingProfitBeforeOwnerLaborM).toBeGreaterThan(result.operatingProfitAfterOwnerLaborM);
    expect(loanPaymentM).toBeGreaterThan(0);
    expect(taxReserveM).toBeGreaterThan(0);
    expect(result.cashLeftM).toBeCloseTo(expectedCashLeftM, 1);
    expect(result.topCostDrivers.length).toBe(3);
  });

  it('does not model owner-operated mature brands as structurally impossible by default', () => {
    const targetBrandIds = ['hansot', 'isaac', 'ediya'];

    for (const brandId of targetBrandIds) {
      const brand = brands.find((item) => item.id === brandId);
      expect(brand).toBeDefined();

      const baseInput = buildSimulatorScenarioInput(brand!, 'base');
      const improvedInput = buildSimulatorScenarioInput(brand!, 'improved');
      const baseResult = runSimulation(brand!, baseInput);
      const improvedResult = runSimulation(brand!, improvedInput);

      expect(baseResult.cashLeftM).toBeGreaterThan(0);
      expect(improvedResult.cashLeftM).toBeGreaterThan(baseResult.cashLeftM);
    }
  });

  it('uses small-format operating assumptions for Isaac Toast instead of a six-million-won staff plan', () => {
    const isaac = brands.find((brand) => brand.id === 'isaac');
    expect(isaac).toBeDefined();

    const baseInput = buildSimulatorScenarioInput(isaac!, 'base');
    const ownerLaborInput = buildSimulatorScenarioInput(isaac!, 'base', {
      includeLoan: false,
      includeOwnerLabor: true,
    });
    const ownerLaborResult = runSimulation(isaac!, ownerLaborInput);

    expect(baseInput.laborCostM).toBeLessThanOrEqual(2.5);
    expect(baseInput.monthlyRentM).toBeLessThan(4);
    expect(ownerLaborResult.cashLeftM).toBeGreaterThan(-2);
  });
});

describe('break-even and payback corrections', () => {
  it('raises the break-even sales line when a loan repayment is included', () => {
    const brand = brands.find((item) => item.id === 'mega')!;
    const noLoan = { ...brand.simulatorDefaults, loanPrincipalM: 0 };
    const withLoan = { ...brand.simulatorDefaults, loanPrincipalM: brand.cost.startupTotalM * 0.5 };

    expect(runSimulation(brand, withLoan).breakEvenSalesM).toBeGreaterThan(
      runSimulation(brand, noLoan).breakEvenSalesM,
    );
  });

  it('recovers only equity (startup cost minus loan principal), not the full startup cost', () => {
    const brand = brands.find((item) => item.id === 'mega')!;
    const input = {
      ...brand.simulatorDefaults,
      loanPrincipalM: brand.cost.startupTotalM * 0.5,
      ownerLaborM: brand.simulatorDefaults.ownerLaborM,
    };
    const result = runSimulation(brand, input);
    const equityM = brand.cost.startupTotalM - input.loanPrincipalM;

    expect(result.cashLeftM).toBeGreaterThan(0);
    expect(result.paybackMonths).toBe(Math.ceil(equityM / result.cashLeftM));
  });
});

describe('estimateDeliveryAdjustedSalesM', () => {
  it('keeps sales unchanged when the delivery ratio does not move', () => {
    expect(estimateDeliveryAdjustedSalesM(30, 0.2, 0.2, 0.5)).toBe(30);
  });

  it('raises sales more for delivery-dependent categories than for low-delivery ones', () => {
    const chickenLike = estimateDeliveryAdjustedSalesM(30, 0.7, 0.5, 0.55);
    const coffeeLike = estimateDeliveryAdjustedSalesM(30, 0.25, 0.05, 0.05);
    expect(chickenLike).toBeGreaterThan(30);
    expect(coffeeLike).toBeGreaterThan(30);
    expect(chickenLike - 30).toBeGreaterThan(coffeeLike - 30);
  });

  it('lowers sales symmetrically when the delivery ratio drops', () => {
    expect(estimateDeliveryAdjustedSalesM(30, 0.3, 0.5, 0.55)).toBeLessThan(30);
  });
});

describe('estimateRentAdjustedSalesM', () => {
  it('keeps sales unchanged when the rent does not move', () => {
    expect(estimateRentAdjustedSalesM(30, 3.8, 3.8, 3.8, 0.05)).toBe(30);
  });

  it('raises expected sales when moving to a pricier (better) location', () => {
    expect(estimateRentAdjustedSalesM(30, 4.56, 3.8, 3.8, 0.05)).toBeGreaterThan(30);
  });

  it('gives a larger location lift to low-delivery formats than to delivery-heavy ones', () => {
    const coffeeLike = estimateRentAdjustedSalesM(30, 4.56, 3.8, 3.8, 0.05);
    const chickenLike = estimateRentAdjustedSalesM(30, 7.44, 6.2, 6.2, 0.55);
    expect(coffeeLike - 30).toBeGreaterThan(chickenLike - 30);
  });

  it('returns sales unchanged when the base rent is zero', () => {
    expect(estimateRentAdjustedSalesM(30, 5, 4, 0, 0.1)).toBe(30);
  });
});

describe('estimateLaborCostM', () => {
  it('returns the fixed base when there are no sales', () => {
    expect(estimateLaborCostM(0, { baseM: 1.2, salesRate: 0.1 })).toBe(1.2);
  });

  it('adds sales-linked labor on top of the base', () => {
    expect(estimateLaborCostM(30, { baseM: 1.2, salesRate: 0.1 })).toBeCloseTo(4.2);
  });

  it('never goes below the base for negative sales input', () => {
    expect(estimateLaborCostM(-50, { baseM: 1, salesRate: 0.1 })).toBe(1);
  });

  it('increases monotonically with sales', () => {
    const model = { baseM: 1, salesRate: 0.08 };
    expect(estimateLaborCostM(60, model)).toBeGreaterThan(estimateLaborCostM(30, model));
  });
});

describe('labor coupling in brand defaults', () => {
  it('derives every brand default labor cost from its labor model and monthly sales', () => {
    for (const brand of brands) {
      const expected = estimateLaborCostM(brand.simulatorDefaults.monthlySalesM, brand.laborModel);
      expect(brand.simulatorDefaults.laborCostM).toBeCloseTo(expected);
    }
  });

  it('grows operating profit sub-linearly when sales rise with coupled labor', () => {
    const brand = brands.find((item) => item.id === 'momstouch');
    expect(brand).toBeDefined();
    if (!brand) return;

    const base = brand.simulatorDefaults;
    const higherSalesM = base.monthlySalesM * 1.5;

    const baseProfit = runSimulation(brand, base).operatingProfitBeforeOwnerLaborM;
    const coupled = runSimulation(brand, {
      ...base,
      monthlySalesM: higherSalesM,
      laborCostM: estimateLaborCostM(higherSalesM, brand.laborModel),
    }).operatingProfitBeforeOwnerLaborM;
    const fixedLabor = runSimulation(brand, {
      ...base,
      monthlySalesM: higherSalesM,
    }).operatingProfitBeforeOwnerLaborM;

    // 매출이 늘면 인건비도 늘어, 인건비를 고정했을 때보다 이익 증가폭이 작아야 한다.
    expect(coupled).toBeGreaterThan(baseProfit);
    expect(coupled).toBeLessThan(fixedLabor);
  });
});
