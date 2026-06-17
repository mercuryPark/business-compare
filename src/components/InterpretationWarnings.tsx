import { AlertTriangle, CalendarClock, TrendingDown } from 'lucide-react';
import type { ComponentType } from 'react';
import type { Brand } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import { getFreshnessLabel } from '../domain/qa';

export function InterpretationWarnings({ brand }: { brand: Brand }) {
  const publicSource = brand.sources.find((source) => source.type !== 'manual-assumption');
  const referenceYear = publicSource?.referenceYear ? `${publicSource.referenceYear}년 기준` : '기준연도 미확인';
  const verificationLabel = brand.audit.p0Verified ? '원문 대조 완료' : '원문 대조 전';
  const feeWarning =
    brand.cost.differenceFranchiseFeeTotalM === null || brand.cost.recurringCostBasis === 'manual-assumption'
      ? '차액가맹금·반복비용 미확보'
      : '차액가맹금·반복비용 확인';

  const warnings = [
    {
      priority: 1,
      title: '평균의 함정',
      value: formatKoreanMoneyFromMillion(brand.sales.averageAnnualSalesM, { suffix: '/년' }),
      description: brand.sales.averageSalesCaveat,
      Icon: AlertTriangle,
    },
    {
      priority: 2,
      title: '자료 신선도',
      value: `${referenceYear} · ${getFreshnessLabel(brand.freshness)}`,
      description: `${verificationLabel}입니다. 기준연도와 수집일이 최신이어도 P0 검증 전에는 확정 판단에 쓰지 않습니다.`,
      Icon: CalendarClock,
    },
    {
      priority: 3,
      title: '하한 추정',
      value: feeWarning,
      description: '순수익은 보수 입력값으로 먼저 확인합니다. 필수비용과 차액가맹금 원문 확인 전에는 낙관 시나리오를 숨깁니다.',
      Icon: TrendingDown,
    },
  ];

  return (
    <section
      aria-label={`${brand.name} 해석 경고`}
      className="mt-4 rounded-lg border-2 border-watch/50 bg-watch/10 p-4"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-watch">자료 해석 경고</p>
          <h3 className="mt-1 text-base font-semibold">확정 판단 전 확인</h3>
        </div>
        <p className="text-xs font-medium text-watch">{verificationLabel}</p>
      </div>
      <ul aria-label={`${brand.name} 핵심 해석 경고 목록`} className="mt-3 grid gap-3 md:grid-cols-3">
        {warnings.map((warning) => (
          <WarningItem key={warning.title} {...warning} />
        ))}
      </ul>
    </section>
  );
}

function WarningItem({
  priority,
  title,
  value,
  description,
  Icon,
}: {
  priority: number;
  title: string;
  value: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}) {
  return (
    <li className="rounded border border-watch/40 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-watch" />
        <div>
          <span className="inline-flex rounded border border-watch/40 bg-watch/15 px-2 py-0.5 text-[11px] font-semibold text-watch">
            필수 확인 {priority}
          </span>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm font-medium text-watch">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{description}</p>
    </li>
  );
}
