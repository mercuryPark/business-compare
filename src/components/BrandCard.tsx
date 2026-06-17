import { ArrowRight, Check, Plus, TrendingUp } from 'lucide-react';
import type { Brand } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import {
  getContractChangeCount,
  getFounderFitLabel,
  getFounderSummary,
  getGoodPoint,
  getMonthlySalesM,
  getOperationLoadLabel,
  getStartupScaleLabel,
  getWatchPoint,
} from '../domain/founderCopy';
import { Badge } from './Badge';

export function BrandCard({
  brand,
  benchmarkBrands,
  selected,
  compareDisabled,
  onSelect,
  onOpen,
}: {
  brand: Brand;
  benchmarkBrands: Brand[];
  selected: boolean;
  compareDisabled: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const maxStartup = Math.max(...benchmarkBrands.map((item) => item.cost.startupTotalM), 1);
  const maxSales = Math.max(...benchmarkBrands.map((item) => getMonthlySalesM(item)), 1);
  const maxContract = Math.max(...benchmarkBrands.map((item) => getContractChangeCount(item)), 1);
  const metrics = [
    { label: '창업비', value: formatKoreanMoneyFromMillion(brand.cost.startupTotalM), hint: getStartupScaleLabel(brand) },
    { label: '월매출', value: formatKoreanMoneyFromMillion(getMonthlySalesM(brand)), hint: '평균 기준' },
    { label: '3년 계약 변동', value: `${getContractChangeCount(brand).toLocaleString('ko-KR')}건`, hint: '종료/해지 합산' },
  ];
  const chartRows = [
    {
      label: '창업비',
      value: formatKoreanMoneyFromMillion(brand.cost.startupTotalM),
      width: `${Math.max(7, Math.round((brand.cost.startupTotalM / maxStartup) * 100))}%`,
      color: 'bg-clay',
    },
    {
      label: '월매출',
      value: formatKoreanMoneyFromMillion(getMonthlySalesM(brand)),
      width: `${Math.max(7, Math.round((getMonthlySalesM(brand) / maxSales) * 100))}%`,
      color: 'bg-leaf',
    },
    {
      label: '변동',
      value: `${getContractChangeCount(brand).toLocaleString('ko-KR')}건`,
      width: `${Math.max(7, Math.round((getContractChangeCount(brand) / maxContract) * 100))}%`,
      color: 'bg-muted',
    },
  ];

  return (
    <article className="group flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-leaf/30 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-clay">{brand.categoryLabel}</p>
          <h2 className="display mt-1 text-2xl font-semibold leading-tight text-ink">{brand.name}</h2>
        </div>
        <Badge tone="info">{getFounderFitLabel(brand)}</Badge>
      </div>

      <p className="mt-3 min-h-[48px] text-sm leading-6 text-muted">{getFounderSummary(brand)}</p>

      <div role="group" aria-label={`${brand.name} 사업감 미니 차트`} className="mt-4 rounded-lg border border-line bg-paper p-3.5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-ink">
          <TrendingUp className="h-4 w-4 text-leaf" />
          숫자 감 잡기
        </div>
        <div className="space-y-2">
          {chartRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[52px_minmax(0,1fr)_74px] items-center gap-2 text-xs">
              <span className="font-medium text-muted">{row.label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-white">
                <span className={`block h-full rounded-full ${row.color}`} style={{ width: row.width }} />
              </span>
              <span className="text-right font-semibold text-ink">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div role="group" aria-label={`${brand.name} 핵심 숫자`} className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-0 rounded-lg border border-line bg-paper px-2.5 py-2.5">
            <p className="truncate text-[11px] font-medium text-muted">{metric.label}</p>
            <p className="tnum mt-1 break-keep text-sm font-semibold leading-5 text-ink">{metric.value}</p>
            <p className="mt-1 truncate text-[11px] text-muted">{metric.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 rounded-lg bg-mist/70 p-3.5 text-sm">
        <Insight label="처음 창업자가 보기 좋은 포인트" value={getGoodPoint(brand)} />
        <Insight label="먼저 따져볼 점" value={getWatchPoint(brand)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded border border-line bg-white px-2 py-1">{getOperationLoadLabel(brand)}</span>
        <span className="rounded border border-line bg-white px-2 py-1">평균 운영 {brand.stability.averageOperatingYears ?? '-'}년</span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4 text-sm">
        <button
          type="button"
          onClick={onSelect}
          disabled={compareDisabled}
          aria-disabled={compareDisabled}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 font-semibold ${
            selected
              ? 'border-leaf bg-leaf text-white shadow-sm'
              : compareDisabled
                ? 'cursor-not-allowed border-line bg-paper text-muted'
                : 'border-line bg-surface text-ink hover:border-leaf/50 hover:bg-mist'
          }`}
        >
          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {selected ? '비교함' : compareDisabled ? '최대 4개' : '비교 담기'}
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-forest px-3 py-2 font-semibold text-white hover:bg-forest-700"
        >
          자세히 보기
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 leading-6 text-ink">{value}</p>
    </div>
  );
}
