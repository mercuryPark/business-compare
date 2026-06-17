import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import type { Brand, SimulatorDefaults } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import {
  estimateDeliveryAdjustedSalesM,
  estimateLaborCostM,
  estimateRentAdjustedSalesM,
  runSimulation,
} from '../domain/simulator';
import {
  buildSimulatorScenarioInput,
  getSimulatorScenarioToggleDefaults,
  simulatorScenarioOptions,
  type SimulatorScenarioId,
} from '../domain/simulatorScenarios';

export function Simulator({ brand }: { brand: Brand }) {
  const [scenarioId, setScenarioId] = useState<SimulatorScenarioId>('base');
  const [includeLoan, setIncludeLoan] = useState(false);
  const [includeOwnerLabor, setIncludeOwnerLabor] = useState(false);
  const [input, setInput] = useState<SimulatorDefaults>(() => buildSimulatorScenarioInput(brand, 'base'));
  const [laborTouched, setLaborTouched] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const selectedScenario =
    simulatorScenarioOptions.find((scenario) => scenario.id === scenarioId) ?? simulatorScenarioOptions[0];
  const result = runSimulation(brand, input);

  function updateInput(key: keyof SimulatorDefaults, value: number) {
    if (!Number.isFinite(value)) return;

    const nextValue = clampSimulatorValue(key, value);
    if (key === 'loanPrincipalM') setIncludeLoan(nextValue > 0);
    if (key === 'ownerLaborM') setIncludeOwnerLabor(nextValue > 0);
    if (key === 'laborCostM') setLaborTouched(true);
    setInput((current) => {
      const next = { ...current, [key]: nextValue };
      if (key === 'deliveryRatio') {
        next.monthlySalesM = estimateDeliveryAdjustedSalesM(
          current.monthlySalesM,
          nextValue,
          current.deliveryRatio,
          brand.simulatorDefaults.deliveryRatio,
        );
      }
      if (key === 'monthlyRentM') {
        next.monthlySalesM = estimateRentAdjustedSalesM(
          current.monthlySalesM,
          nextValue,
          current.monthlyRentM,
          brand.simulatorDefaults.monthlyRentM,
          brand.simulatorDefaults.deliveryRatio,
        );
      }
      if (
        (key === 'monthlySalesM' || key === 'deliveryRatio' || key === 'monthlyRentM') &&
        !laborTouched
      ) {
        next.laborCostM = estimateLaborCostM(next.monthlySalesM, brand.laborModel);
      }
      return next;
    });
  }

  function selectScenario(nextScenarioId: SimulatorScenarioId) {
    const toggleDefaults = getSimulatorScenarioToggleDefaults(nextScenarioId);

    setScenarioId(nextScenarioId);
    setIncludeLoan(toggleDefaults.includeLoan);
    setIncludeOwnerLabor(toggleDefaults.includeOwnerLabor);
    setLaborTouched(false);
    setInput(buildSimulatorScenarioInput(brand, nextScenarioId, toggleDefaults));
  }

  function toggleLoan(nextIncludeLoan: boolean) {
    setIncludeLoan(nextIncludeLoan);
    setInput((current) => ({
      ...current,
      loanPrincipalM: nextIncludeLoan ? brand.cost.startupTotalM * 0.5 : 0,
    }));
  }

  function toggleOwnerLabor(nextIncludeOwnerLabor: boolean) {
    setIncludeOwnerLabor(nextIncludeOwnerLabor);
    setInput((current) => ({
      ...current,
      ownerLaborM: nextIncludeOwnerLabor ? brand.simulatorDefaults.ownerLaborM : 0,
    }));
  }

  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Money rehearsal</p>
          <h3 className="mt-1 text-xl font-semibold text-ink">내 조건으로 계산</h3>
          <p className="mt-1 text-sm leading-6 text-muted">매출과 임대료를 만원 단위로 넣어 월별 남는 돈을 봅니다.</p>
        </div>
        <button
          type="button"
          aria-pressed={showAdvanced}
          onClick={() => setShowAdvanced((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-leaf/40"
        >
          <Settings2 className="h-4 w-4" />
          비용 자세히 조정
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-mist p-3">
        <div className="grid grid-cols-3 gap-2">
          {simulatorScenarioOptions.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              aria-pressed={scenario.id === scenarioId}
              onClick={() => selectScenario(scenario.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                scenario.id === scenarioId
                  ? 'border-leaf bg-white text-leaf shadow-sm'
                  : 'border-line bg-white/80 text-ink hover:border-leaf/40'
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{selectedScenario.description}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <label className="flex items-start gap-3 rounded-lg border border-line bg-white p-3 text-sm text-ink">
            <input
              aria-label="대출 포함"
              type="checkbox"
              checked={includeLoan}
              onChange={(event) => toggleLoan(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-semibold">대출 포함</span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                창업비의 절반을 빌렸다고 보고 원리금 상환액을 월 비용에 넣습니다.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-line bg-white p-3 text-sm text-ink">
            <input
              aria-label="사장 인건비 포함"
              type="checkbox"
              checked={includeOwnerLabor}
              onChange={(event) => toggleOwnerLabor(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-semibold">사장 인건비 포함</span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                직접 일해도 가져가야 할 생활비를 비용으로 넣어 실제 버틸 수 있는지 봅니다.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <NumberField
          label="월매출"
          unit="만원"
          value={toManwon(input.monthlySalesM)}
          min={0}
          step={10}
          helper="최근 월매출이 없으면 목표 매출이나 주변 비슷한 점포 매출을 넣어보세요."
          onChange={(value) => updateInput('monthlySalesM', fromManwon(value))}
        />
        <NumberField
          label="월 임대료"
          unit="만원"
          value={toManwon(input.monthlyRentM)}
          min={0}
          step={10}
          helper="임대료를 올리면 더 좋은 자리로 보고 예상 매출도 함께 오릅니다(전부는 아님)."
          onChange={(value) => updateInput('monthlyRentM', fromManwon(value))}
        />
        <NumberField
          label="배달 비중"
          unit="%"
          value={input.deliveryRatio * 100}
          min={0}
          max={90}
          step={1}
          helper="배달 비중을 높이면 배달 수요만큼 예상 매출도 늘지만 수수료 부담도 커집니다."
          onChange={(value) => updateInput('deliveryRatio', value / 100)}
        />
      </div>

      {showAdvanced && (
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="대출 원금"
            unit="만원"
            value={toManwon(input.loanPrincipalM)}
            min={0}
            step={100}
            helper="실제로 빌릴 금액만 넣으세요. 자기자본은 대출 원금에 넣지 않습니다."
            onChange={(value) => updateInput('loanPrincipalM', fromManwon(value))}
          />
          <NumberField
            label="직원 인건비"
            unit="만원"
            value={toManwon(input.laborCostM)}
            min={0}
            step={10}
            helper="급여명세서나 채용공고의 월급 총액을 넣으세요."
            onChange={(value) => updateInput('laborCostM', fromManwon(value))}
          />
          <NumberField
            label="내 인건비"
            unit="만원"
            value={toManwon(input.ownerLaborM)}
            min={0}
            step={10}
            helper="내가 직접 일해도 가져가야 할 최소 생활비를 넣으세요."
            onChange={(value) => updateInput('ownerLaborM', fromManwon(value))}
          />
          <NumberField
            label="전기수도/관리비"
            unit="만원"
            value={toManwon(input.utilitiesM)}
            min={0}
            step={10}
            helper="전기, 수도, 가스, 건물 관리비를 월평균으로 합산하세요."
            onChange={(value) => updateInput('utilitiesM', fromManwon(value))}
          />
          <NumberField
            label="기타 운영비"
            unit="만원"
            value={toManwon(input.otherOpexM)}
            min={0}
            step={10}
            helper="소모품, 청소, 보험, 세무, 통신비처럼 매달 나가는 비용입니다."
            onChange={(value) => updateInput('otherOpexM', fromManwon(value))}
          />
          <NumberField
            label="원가율"
            unit="%"
            value={input.cogsRate * 100}
            min={0}
            max={90}
            step={1}
            helper="재료비와 본사 필수 구매품을 제외한 기본 상품 원가율입니다."
            onChange={(value) => updateInput('cogsRate', value / 100)}
          />
          <NumberField
            label="배달앱 수수료"
            unit="%"
            value={input.deliveryCommissionRate * 100}
            min={0}
            max={40}
            step={0.5}
            helper="배달앱 정산서의 주문중개 수수료율을 넣으세요."
            onChange={(value) => updateInput('deliveryCommissionRate', value / 100)}
          />
          <NumberField
            label="배달대행 수수료"
            unit="%"
            value={input.deliveryAgencyRate * 100}
            min={0}
            max={40}
            step={0.5}
            helper="라이더 대행료나 배달대행 정산 비율을 넣으세요."
            onChange={(value) => updateInput('deliveryAgencyRate', value / 100)}
          />
          <NumberField
            label="포장비율"
            unit="%"
            value={input.packagingRate * 100}
            min={0}
            max={20}
            step={0.5}
            helper="용기, 봉투, 포장재가 매출에서 차지하는 비율입니다."
            onChange={(value) => updateInput('packagingRate', value / 100)}
          />
          <NumberField
            label="카드 수수료"
            unit="%"
            value={input.cardFeeRate * 100}
            min={0}
            max={10}
            step={0.1}
            helper="카드 결제 수수료율입니다. 모르면 1.5~2.0%부터 비교하세요."
            onChange={(value) => updateInput('cardFeeRate', value / 100)}
          />
          <NumberField
            label="세금 유보율"
            unit="%"
            value={input.taxReserveRate * 100}
            min={0}
            max={20}
            step={1}
            helper="부가세와 종합소득세 대비로 매달 남겨둘 비율입니다."
            onChange={(value) => updateInput('taxReserveRate', value / 100)}
          />
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ResultCard label="월 손에 남는 돈" value={formatKoreanMoneyFromMillion(result.cashLeftM)} emphasis />
        <ResultCard label="내 인건비 전 이익" value={formatKoreanMoneyFromMillion(result.operatingProfitBeforeOwnerLaborM)} />
        <ResultCard label="내 인건비 후 이익" value={formatKoreanMoneyFromMillion(result.operatingProfitAfterOwnerLaborM)} />
      </div>

      <ProfitWaterfall brand={brand} input={input} cashLeftM={result.cashLeftM} />
      <ScenarioGrid brand={brand} input={input} />

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper p-3">
          <p className="text-xs text-muted">버티기 쉬운 매출선</p>
          <p className="mt-1 font-semibold text-ink">{formatKoreanMoneyFromMillion(result.breakEvenSalesM)}</p>
          <p className="mt-2 text-xs leading-5 text-muted">이 매출보다 낮으면 임대료와 인건비 부담이 커집니다.</p>
        </div>
        <div className="rounded-lg border border-line bg-paper p-3">
          <p className="text-xs text-muted">투자 회수</p>
          <p className="mt-1 font-semibold text-ink">{formatPayback(result.paybackMonths)}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{buildCashMessage(result.cashLeftM)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-cream p-3">
        <p className="text-xs font-semibold text-muted">가장 크게 빠지는 비용</p>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
          {result.topCostDrivers.map((driver) => (
            <li key={driver.label} className="rounded-lg border border-line bg-white px-3 py-2">
              <p className="text-xs text-muted">{driver.label}</p>
              <p className="mt-1 font-semibold text-ink">{formatKoreanMoneyFromMillion(driver.valueM)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProfitWaterfall({ brand, input, cashLeftM }: { brand: Brand; input: SimulatorDefaults; cashLeftM: number }) {
  const rows = buildCostFlow(brand, input, cashLeftM);
  const maxAbs = Math.max(...rows.map((row) => Math.abs(row.valueM)), 1);

  return (
    <section className="mt-4 rounded-lg border border-line bg-paper p-3">
      <h4 className="text-sm font-semibold text-ink">월매출에서 순수익까지</h4>
      <div className="mt-3 space-y-2">
        {rows.map((row) => {
          const width = `${Math.max(5, Math.round((Math.abs(row.valueM) / maxAbs) * 100))}%`;
          return (
            <div key={row.label} className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)_92px] sm:items-center">
              <p className="text-xs font-medium text-ink">{row.label}</p>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${row.valueM >= 0 ? 'bg-safe' : 'bg-danger'}`} style={{ width }} />
              </div>
              <p className={`text-xs font-semibold sm:text-right ${row.valueM >= 0 ? 'text-safe' : 'text-danger'}`}>
                {row.valueM < 0 ? '-' : ''}
                {formatKoreanMoneyFromMillion(Math.abs(row.valueM))}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScenarioGrid({ brand, input }: { brand: Brand; input: SimulatorDefaults }) {
  const lowerSalesM = input.monthlySalesM * 0.85;
  const expandedDeliveryRatio = Math.min(0.9, input.deliveryRatio + 0.2);
  const expandedDeliverySalesM = estimateDeliveryAdjustedSalesM(
    input.monthlySalesM,
    expandedDeliveryRatio,
    input.deliveryRatio,
    brand.simulatorDefaults.deliveryRatio,
  );
  const higherRentM = input.monthlyRentM * 1.2;
  const higherRentSalesM = estimateRentAdjustedSalesM(
    input.monthlySalesM,
    higherRentM,
    input.monthlyRentM,
    brand.simulatorDefaults.monthlyRentM,
    brand.simulatorDefaults.deliveryRatio,
  );
  const scenarios = [
    { label: '현재 입력', input },
    {
      label: '매출 15% 하락',
      input: { ...input, monthlySalesM: lowerSalesM, laborCostM: estimateLaborCostM(lowerSalesM, brand.laborModel) },
    },
    {
      label: '임대료 상승',
      input: {
        ...input,
        monthlyRentM: higherRentM,
        monthlySalesM: higherRentSalesM,
        laborCostM: estimateLaborCostM(higherRentSalesM, brand.laborModel),
      },
    },
    {
      label: '배달 확대',
      input: {
        ...input,
        deliveryRatio: expandedDeliveryRatio,
        monthlySalesM: expandedDeliverySalesM,
        laborCostM: estimateLaborCostM(expandedDeliverySalesM, brand.laborModel),
      },
    },
    { label: '인건비 상승', input: { ...input, laborCostM: input.laborCostM * 1.15 } },
  ].map((scenario) => {
    const result = runSimulation(brand, scenario.input);
    return {
      label: scenario.label,
      cashLeftM: result.cashLeftM,
      breakEvenSalesM: result.breakEvenSalesM,
    };
  });

  return (
    <section className="mt-4 rounded-lg border border-line bg-paper p-3">
      <h4 className="text-sm font-semibold text-ink">예외상황별 결과</h4>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {scenarios.map((scenario) => (
          <div key={scenario.label} className="rounded-lg border border-line bg-white px-3 py-2">
            <p className="text-xs text-muted">{scenario.label}</p>
            <p className={`mt-1 font-semibold ${scenario.cashLeftM < 0 ? 'text-danger' : 'text-safe'}`}>
              {formatKoreanMoneyFromMillion(scenario.cashLeftM)}
            </p>
            <p className="mt-1 text-[11px] leading-4 text-muted">
              매출선 {formatKoreanMoneyFromMillion(scenario.breakEvenSalesM)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NumberField({
  label,
  unit,
  value,
  min,
  max,
  step,
  helper,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  helper?: string;
  onChange: (value: number) => void;
}) {
  const displayValue = Number.isFinite(value) ? (Number.isInteger(value) ? value : Number(value.toFixed(1))) : '';

  function handleChange(rawValue: string) {
    if (rawValue.trim() === '') return;

    const nextValue = Number(rawValue);
    if (!Number.isFinite(nextValue)) return;

    onChange(clamp(nextValue, min, max));
  }

  return (
    <label className="block rounded-lg border border-line bg-white p-3 text-sm font-medium text-ink">
      <span className="flex items-center justify-between gap-2">
        <span>{label}</span>
        <span className="text-xs font-normal text-muted">{unit}</span>
      </span>
      <input
        aria-label={label}
        title={helper}
        type="number"
        value={displayValue}
        min={min}
        max={max}
        step={step}
        onChange={(event) => handleChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-leaf focus:bg-white"
      />
      {helper && <span className="mt-1 block text-xs font-normal leading-5 text-muted">{helper}</span>}
    </label>
  );
}

function ResultCard({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${emphasis ? 'border-leaf/30 bg-mist' : 'border-line bg-paper'}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function buildCostFlow(brand: Brand, input: SimulatorDefaults, cashLeftM: number): Array<{ label: string; valueM: number }> {
  const deliverySalesM = input.monthlySalesM * input.deliveryRatio;
  const deliveryCostM = deliverySalesM * (input.deliveryCommissionRate + input.deliveryAgencyRate + input.packagingRate);
  const cogsAndPurchaseM = input.monthlySalesM * (input.cogsRate + brand.cost.requiredPurchaseBurdenRate);
  const feeAndFinanceM =
    input.monthlySalesM * (input.cardFeeRate + brand.cost.recurringRoyaltyRate + brand.cost.adFeeRate) +
    calculateLoanPaymentForFlow(input) +
    Math.max(0, runSimulation(brand, input).operatingProfitAfterOwnerLaborM * input.taxReserveRate);
  const fixedOpexM = input.monthlyRentM + input.utilitiesM + input.otherOpexM + brand.cost.renewalReserveM;

  return [
    { label: '월매출', valueM: input.monthlySalesM },
    { label: '원가/필수구매', valueM: -cogsAndPurchaseM },
    { label: '배달/포장 수수료', valueM: -deliveryCostM },
    { label: '임대료', valueM: -input.monthlyRentM },
    { label: '인건비/사장노동', valueM: -(input.laborCostM + input.ownerLaborM) },
    { label: '운영비/금융비용', valueM: -(fixedOpexM - input.monthlyRentM + feeAndFinanceM) },
    { label: '월 손에 남는 돈', valueM: cashLeftM },
  ];
}

function calculateLoanPaymentForFlow(input: SimulatorDefaults): number {
  if (input.loanPrincipalM <= 0 || input.loanYears <= 0) return 0;
  const monthlyRate = input.annualInterestRate / 12;
  const months = input.loanYears * 12;
  if (monthlyRate === 0) return input.loanPrincipalM / months;
  return (input.loanPrincipalM * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function formatPayback(paybackMonths: number | null): string {
  if (!paybackMonths) return '흑자 조건부터 맞춰보기';
  if (paybackMonths >= 120) return '10년 이상 장기 회수';
  return `${paybackMonths}개월`;
}

function buildCashMessage(cashLeftM: number): string {
  if (cashLeftM < 0) {
    return `월 ${formatKoreanMoneyFromMillion(Math.abs(cashLeftM))}만큼 부족합니다. 매출, 임대료, 인건비를 조정해 기준선을 맞춰보세요.`;
  }
  if (cashLeftM < 2) return '남는 돈이 얇아 임대료나 인건비가 조금만 올라가도 부담이 커집니다.';
  return '현재 입력값에서는 매달 남는 돈이 생기는 구조입니다.';
}

function toManwon(valueM: number): number {
  return Math.round(valueM * 100);
}

function fromManwon(valueManwon: number): number {
  return valueManwon / 100;
}

function clampSimulatorValue(key: keyof SimulatorDefaults, value: number): number {
  if (key === 'deliveryRatio') return clamp(value, 0, 0.9);
  if (key === 'taxReserveRate') return clamp(value, 0, 0.2);
  if (key === 'cogsRate') return clamp(value, 0, 0.9);
  if (key === 'deliveryCommissionRate' || key === 'deliveryAgencyRate') return clamp(value, 0, 0.4);
  if (key === 'packagingRate') return clamp(value, 0, 0.2);
  if (key === 'cardFeeRate') return clamp(value, 0, 0.1);
  return value;
}

function clamp(value: number, min: number, max?: number): number {
  if (max === undefined) return Math.max(min, value);
  return Math.min(max, Math.max(min, value));
}
