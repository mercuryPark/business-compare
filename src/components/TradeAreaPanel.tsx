import type { Brand, FitLabel, TradeAreaScenarioStatus } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import { Badge } from './Badge';

const fitTone: Record<FitLabel, 'info' | 'good' | 'watch' | 'neutral'> = {
  적합: 'good',
  조건부: 'info',
  주의: 'watch',
  '자료 부족': 'neutral',
};

const statusLabel: Record<TradeAreaScenarioStatus, string> = {
  'structural-only': '구조 준비',
  estimated: '추정',
  verified: '검증',
};

export function TradeAreaPanel({ brand }: { brand: Brand }) {
  return (
    <section className="mt-4 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-semibold">상권 시나리오</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            실제 입지 점수는 지역 데이터 연동 뒤 계산하며, 현재는 검토 틀만 표시합니다.
          </p>
        </div>
        <p className="text-xs font-medium text-watch">입지 예측 미포함</p>
      </div>

      <ul className="mt-3 grid gap-3 md:grid-cols-3">
        {brand.tradeAreaScenarios.map((scenario) => (
          <li key={scenario.id} className="rounded border border-line bg-paper p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{scenario.label}</p>
              <Badge tone={fitTone[scenario.fitLabel]}>{scenario.fitLabel}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">상태</dt>
                <dd className="font-medium">{statusLabel[scenario.status]}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">월 임대료</dt>
                <dd className="font-medium">{formatMoney(scenario.monthlyRentM)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">배달 비중</dt>
                <dd className="font-medium">{formatPercent(scenario.deliveryRatio)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">예상 순수익</dt>
                <dd className="font-medium">{formatMoney(scenario.expectedNetProfitM)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-5 text-muted">{scenario.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatMoney(value: number | null): string {
  return value === null ? '미산출' : formatKoreanMoneyFromMillion(value);
}

function formatPercent(value: number | null): string {
  return value === null ? '미산출' : `${(value * 100).toFixed(0)}%`;
}
