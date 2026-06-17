import type { Brand, P0Metric, VerificationStatus } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';

type ChartMetric = {
  label: string;
  value: number;
  display: string;
  interpretation: '낮을수록 유리' | '높을수록 유리';
  tone: 'info' | 'good' | 'watch' | 'neutral';
  metric: P0Metric;
  status: VerificationStatus;
};

const toneStyles: Record<ChartMetric['tone'], { bar: string; text: string }> = {
  info: { bar: '#2563eb', text: 'text-info' },
  good: { bar: '#0f766e', text: 'text-good' },
  watch: { bar: '#b45309', text: 'text-watch' },
  neutral: { bar: '#64748b', text: 'text-muted' },
};

export function P0MetricChart({ brand }: { brand: Brand }) {
  const metrics: ChartMetric[] = [
    {
      label: '창업비',
      value: brand.cost.startupTotalM,
      display: `창업비 ${formatKoreanMoneyFromMillion(brand.cost.startupTotalM)}`,
      interpretation: '낮을수록 유리',
      tone: 'info',
      metric: 'startup-cost',
      status: getChecklistStatus(brand, 'startup-cost'),
    },
    {
      label: '평균매출',
      value: brand.sales.averageAnnualSalesM,
      display: `평균매출 ${formatKoreanMoneyFromMillion(brand.sales.averageAnnualSalesM, { suffix: '/년' })}`,
      interpretation: '높을수록 유리',
      tone: 'good',
      metric: 'average-sales',
      status: getChecklistStatus(brand, 'average-sales'),
    },
    {
      label: '3년 신규',
      value: brand.stability.openings3y,
      display: `3년 신규 ${brand.stability.openings3y}개`,
      interpretation: '높을수록 유리',
      tone: 'neutral',
      metric: 'store-count-trend',
      status: getChecklistStatus(brand, 'store-count-trend'),
    },
    {
      label: '계약종료/해지',
      value: brand.stability.closures3y,
      display: `계약종료/해지 ${brand.stability.closures3y}개`,
      interpretation: '낮을수록 유리',
      tone: 'watch',
      metric: 'closure-contract',
      status: getChecklistStatus(brand, 'closure-contract'),
    },
  ];
  const maxValue = Math.max(...metrics.map((metric) => metric.value), 1);
  const chartWidth = 520;
  const chartHeight = 170;
  const left = 112;
  const top = 20;
  const barHeight = 18;
  const rowGap = 35;
  const maxBarWidth = 330;

  return (
    <section className="mt-4 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-semibold">P0 핵심 지표 차트</h3>
          <p className="mt-1 text-xs leading-5 text-muted">부분 검증 수치만 시각화하며 미검증 비용 항목은 제외합니다.</p>
        </div>
        <p className="text-xs font-medium text-watch">원문 대조 전</p>
      </div>

      <svg
        role="img"
        aria-label={`${brand.name} P0 핵심 지표 차트`}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="mt-3 h-auto w-full max-w-full"
      >
        <line x1={left} y1={8} x2={left} y2={chartHeight - 18} stroke="#d7dde5" strokeWidth="1" />
        {metrics.map((metric, index) => {
          const y = top + index * rowGap;
          const barWidth = Math.max(8, (metric.value / maxValue) * maxBarWidth);
          const tone = toneStyles[metric.tone];

          return (
            <g key={metric.label}>
              <text x="0" y={y + 13} className="fill-slate-600 text-[13px]">
                {metric.label}
              </text>
              <rect x={left} y={y} width={barWidth} height={barHeight} rx="3" fill={tone.bar} />
              <text x={left + barWidth + 8} y={y + 13} className="fill-slate-900 text-[13px] font-medium">
                {formatChartValue(metric)}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        role="note"
        aria-label="차트 해석 기준"
        className="mt-3 rounded border border-watch/30 bg-watch/10 px-3 py-2 text-xs leading-5 text-watch"
      >
        <p className="font-semibold">단위 혼합 주의</p>
        <p className="mt-1">막대 길이는 서로 다른 지표 간 순위가 아닙니다. 각 수치는 원문 대조 전 참고용으로 봅니다.</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <li key={metric.label} className="rounded border border-watch/30 bg-white px-2 py-1">
              {metric.label} {metric.interpretation}
            </li>
          ))}
        </ul>
      </div>

      <ul aria-label="P0 지표 검증 상태" className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        {metrics.map((metric) => (
          <li key={metric.label} className="rounded border border-line bg-paper px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">{metric.label}</span>
              <span className={`font-medium ${toneStyles[metric.tone].text}`}>{metric.display}</span>
            </div>
            <span className={`mt-2 inline-flex rounded border px-2 py-0.5 text-xs font-medium ${getStatusTone(metric.status)}`}>
              {getStatusLabel(metric.status)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatChartValue(metric: ChartMetric): string {
  if (metric.label === '창업비' || metric.label === '평균매출') {
    return formatKoreanMoneyFromMillion(metric.value);
  }

  return `${metric.value.toFixed(0)}개`;
}

function getChecklistStatus(brand: Brand, metric: P0Metric): VerificationStatus {
  return brand.audit.p0Checklist.find((item) => item.metric === metric)?.status ?? 'unverified';
}

function getStatusLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    verified: '검증 완료',
    partial: '부분 검증',
    unverified: '미검증',
  };
  return labels[status];
}

function getStatusTone(status: VerificationStatus): string {
  const tones: Record<VerificationStatus, string> = {
    verified: 'border-safe/30 bg-safe/10 text-safe',
    partial: 'border-info/30 bg-info/10 text-info',
    unverified: 'border-watch/30 bg-watch/10 text-watch',
  };
  return tones[status];
}
