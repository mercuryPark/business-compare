import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { Brand } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import {
  getContractChangeLabel,
  getCounselingQuestions,
  getDataBasisSummary,
  getFounderFitLabel,
  getFounderSummary,
  getMonthlySalesM,
  getSalesScaleLabel,
  getStartupScaleLabel,
  getTrendLabel,
} from '../domain/founderCopy';
import { getMarketSignals } from '../domain/marketSignals';
import { Badge } from './Badge';
import { CandidateLocationPanel } from './CandidateLocationPanel';
import { Simulator } from './Simulator';

export function BrandDetail({
  brand,
  benchmarkBrands,
  expanded,
  onToggle,
}: {
  brand: Brand;
  benchmarkBrands: Brand[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const [showSources, setShowSources] = useState(false);
  const titleId = `${brand.id}-detail-title`;
  const averageStartupM = benchmarkBrands.reduce((sum, item) => sum + item.cost.startupTotalM, 0) / benchmarkBrands.length;
  const averageMonthlySalesM =
    benchmarkBrands.reduce((sum, item) => sum + item.sales.averageAnnualSalesM / 12, 0) / benchmarkBrands.length;
  const marketSignals = getMarketSignals(brand);

  return (
    <section
      id={`brand-${brand.id}`}
      aria-labelledby={titleId}
      tabIndex={-1}
      className="scroll-mt-6 overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-line bg-cream p-6 md:flex-row md:items-start md:justify-between md:p-7">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-clay">{brand.categoryLabel}</p>
            <Badge tone="info">{getFounderFitLabel(brand)}</Badge>
          </div>
          <h2 id={titleId} className="display mt-2.5 text-3xl font-semibold leading-tight text-ink md:text-4xl">
            {brand.name} 창업 판단 리포트
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{getFounderSummary(brand)}</p>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`${brand.id}-detail-body`}
          onClick={onToggle}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:border-leaf/40 hover:bg-mist"
        >
          {expanded ? '리포트 접기' : '리포트 펼치기'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div id={`${brand.id}-detail-body`} className="space-y-5 p-4 md:p-5">
          <section className="grid gap-3 md:grid-cols-3">
            <InfoCard
              title="창업비"
              value={formatKoreanMoneyFromMillion(brand.cost.startupTotalM)}
              description={`${getStartupScaleLabel(brand)} · 전체 평균 ${formatKoreanMoneyFromMillion(averageStartupM)}`}
            />
            <InfoCard
              title="월매출"
              value={formatKoreanMoneyFromMillion(getMonthlySalesM(brand))}
              description={`${getSalesScaleLabel(brand)} · 전체 평균 ${formatKoreanMoneyFromMillion(averageMonthlySalesM)}`}
            />
            <InfoCard
              title="계약 변동"
              value={getContractChangeLabel(brand)}
              description={getTrendLabel(brand)}
            />
          </section>

          <VisualReadout brand={brand} benchmarkBrands={benchmarkBrands} />

          {marketSignals.length > 0 && <MarketSignalPanel signals={marketSignals} />}

          <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-4">
              <LearningBlock
                title="이 브랜드를 읽는 순서"
                items={[
                  `먼저 창업비 ${formatKoreanMoneyFromMillion(brand.cost.startupTotalM)}를 내가 준비 가능한 금액과 비교합니다.`,
                  `그다음 월매출 ${formatKoreanMoneyFromMillion(getMonthlySalesM(brand))}에서 임대료와 인건비를 빼도 남는지 봅니다.`,
                  `마지막으로 3년 계약 변동 ${brand.stability.closures3y.toLocaleString('ko-KR')}건이 많은 편인지 확인합니다.`,
                ]}
              />
              <LearningBlock title="상담 전 질문" items={getCounselingQuestions(brand)} />
            </div>
            <Simulator brand={brand} />
          </section>

          <CandidateLocationPanel brand={brand} />

          <section className="rounded-lg border border-line bg-paper p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-ink">자료 기준은 필요할 때만 확인</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{getDataBasisSummary(brand)}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSources((current) => !current)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-leaf/40"
              >
                자료 기준 보기
                {showSources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            {showSources && <DataBasis brand={brand} />}
          </section>
        </div>
      )}
    </section>
  );
}

function MarketSignalPanel({ signals }: { signals: ReturnType<typeof getMarketSignals> }) {
  return (
    <section className="rounded-lg border border-line bg-mist p-4">
      <h3 className="text-lg font-semibold text-ink">시장 기사로 보는 맥락</h3>
      <p className="mt-1 text-sm leading-6 text-muted">기사 자체보다 창업 판단에 연결되는 질문만 뽑았습니다.</p>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {signals.map((signal) => (
          <li key={signal.sourceUrl} className="rounded-lg border border-line bg-white p-3">
            <p className="text-xs font-semibold text-info">{signal.label}</p>
            <h4 className="mt-1 text-sm font-semibold leading-6 text-ink">{signal.title}</h4>
            <p className="mt-2 text-sm leading-6 text-muted">{signal.summary}</p>
            <p className="mt-3 rounded-lg border border-line bg-cream px-3 py-2 text-sm leading-6 text-ink">
              {signal.takeaway}
            </p>
            <a
              href={signal.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-xs font-medium text-info"
            >
              기사 원문
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InfoCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</p>
      <p className="tnum mt-2 break-keep text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
    </div>
  );
}

function VisualReadout({ brand, benchmarkBrands }: { brand: Brand; benchmarkBrands: Brand[] }) {
  const maxStartup = Math.max(...benchmarkBrands.map((item) => item.cost.startupTotalM), 1);
  const maxMonthlySales = Math.max(...benchmarkBrands.map((item) => getMonthlySalesM(item)), 1);
  const maxContract = Math.max(...benchmarkBrands.map((item) => item.stability.closures3y), 1);
  const rows = [
    {
      label: '창업비',
      value: brand.cost.startupTotalM,
      max: maxStartup,
      display: formatKoreanMoneyFromMillion(brand.cost.startupTotalM),
      tone: 'bg-info',
    },
    {
      label: '월매출',
      value: getMonthlySalesM(brand),
      max: maxMonthlySales,
      display: formatKoreanMoneyFromMillion(getMonthlySalesM(brand)),
      tone: 'bg-safe',
    },
    {
      label: '계약 변동',
      value: brand.stability.closures3y,
      max: maxContract,
      display: `${brand.stability.closures3y.toLocaleString('ko-KR')}건`,
      tone: 'bg-muted',
    },
  ];

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-ink">숫자로 보는 위치</h3>
      <p className="mt-1 text-sm leading-6 text-muted">막대는 이 화면에 있는 브랜드 안에서의 상대적 크기입니다.</p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const width = `${Math.max(6, Math.round((row.value / row.max) * 100))}%`;
          return (
            <div key={row.label} className="grid gap-2 sm:grid-cols-[100px_minmax(0,1fr)_96px] sm:items-center">
              <p className="text-sm font-medium text-ink">{row.label}</p>
              <div className="h-4 overflow-hidden rounded-full bg-paper">
                <div className={`h-full rounded-full ${row.tone}`} style={{ width }} />
              </div>
              <p className="text-sm font-semibold text-ink sm:text-right">{row.display}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LearningBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <ol className="mt-3 space-y-2 text-sm leading-6 text-ink">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-[24px_minmax(0,1fr)] gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mist text-xs font-semibold text-leaf">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DataBasis({ brand }: { brand: Brand }) {
  return (
    <div className="mt-4 rounded-lg border border-line bg-white p-3">
      <h4 className="font-semibold text-ink">자료 기준</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {brand.sources.map((source) => (
          <li key={`${source.title}-${source.capturedAt}`} className="rounded-lg border border-line p-3">
            <p className="font-medium text-ink">{source.title}</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              {source.referenceYear ? `${source.referenceYear}년 기준` : '수집 자료'} · 수집일 {source.capturedAt}
            </p>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-info"
              >
                출처 열기
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
