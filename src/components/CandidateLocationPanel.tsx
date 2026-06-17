import { MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Brand } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import { analyzeCandidateLocation, type CandidateRadiusM } from '../domain/locationAnalysis';
import { tradeAreaFixtures } from '../domain/locationAnalysisFixtures';
import { Badge } from './Badge';

const radiusOptions: Array<{ label: string; value: CandidateRadiusM }> = [
  { label: '300m', value: 300 },
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
];

export function CandidateLocationPanel({ brand }: { brand: Brand }) {
  const [query, setQuery] = useState('강남');
  const [radiusM, setRadiusM] = useState<CandidateRadiusM>(500);
  const [rentManwon, setRentManwon] = useState(() => Math.round(brand.simulatorDefaults.monthlyRentM * 100));
  const analysis = useMemo(
    () =>
      analyzeCandidateLocation(
        brand,
        {
          query,
          radiusM,
          monthlyRentM: rentManwon / 100,
        },
        tradeAreaFixtures,
      ),
    [brand, query, radiusM, rentManwon],
  );

  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-clay">Candidate area</p>
          <h3 className="mt-1 text-xl font-semibold text-ink">내 후보지로 계산</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            후보 상권의 임대료와 경쟁 밀도를 넣어 이 브랜드가 버틸 매출선을 확인합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">예시 상권 데이터</Badge>
          <Badge tone="neutral">신규점 보정 포함</Badge>
          <Badge tone="neutral">사장 인건비·대출 포함 기준</Badge>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.8fr)_minmax(180px,0.8fr)]">
        <label className="block rounded-lg border border-line bg-paper p-3 text-sm font-medium text-ink">
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4 text-leaf" />
            후보지 상권명
          </span>
          <input
            aria-label="후보지 상권명"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-leaf"
            placeholder="예: 강남, 홍대, 성수"
          />
        </label>

        <div className="rounded-lg border border-line bg-paper p-3">
          <p className="text-sm font-medium text-ink">반경</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {radiusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={radiusM === option.value}
                onClick={() => setRadiusM(option.value)}
                className={`rounded-lg border px-2 py-2 text-sm font-semibold ${
                  radiusM === option.value
                    ? 'border-leaf bg-leaf text-white'
                    : 'border-line bg-white text-ink hover:border-leaf/40'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block rounded-lg border border-line bg-paper p-3 text-sm font-medium text-ink">
          <span className="flex items-center justify-between gap-2">
            <span>후보지 월 임대료</span>
            <span className="text-xs font-normal text-muted">만원</span>
          </span>
          <input
            aria-label="후보지 월 임대료"
            type="number"
            min={0}
            step={10}
            value={rentManwon}
            onChange={(event) => setRentManwon(parsePositiveNumber(event.target.value, rentManwon))}
            className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-leaf"
          />
        </label>
      </div>

      {analysis.status === 'no-data' ? (
        <div className="mt-4 rounded-lg border border-line bg-cream p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <MapPin className="h-4 w-4 text-clay" />
            해당 상권 데이터 없음
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{analysis.message}</p>
          <p className="mt-2 text-sm font-medium text-ink">예: 강남, 홍대, 성수</p>
          <p className="mt-1 text-xs leading-5 text-muted">현재 예시 후보지: {analysis.availableAreaLabels.join(', ')}</p>
        </div>
      ) : (
        <ReadyResult analysis={analysis} />
      )}
    </section>
  );
}

function ReadyResult({ analysis }: { analysis: Extract<ReturnType<typeof analyzeCandidateLocation>, { status: 'ready' }> }) {
  const cashLabel = analysis.expectedCashLeftM < 0 ? '월 예상 부족액' : '월 예상 잔여금';
  const cashTone = analysis.expectedCashLeftM < 0 ? 'text-danger' : 'text-safe';

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg border border-line bg-mist p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Candidate result</p>
            <h4 className="mt-1 text-lg font-semibold text-ink">{analysis.matchedAreaLabel}</h4>
            <p className="mt-1 text-sm leading-6 text-muted">
              표시 점포 수는 예시 데이터이고, 경쟁밀도는 상권 추정값으로 계산합니다.
            </p>
          </div>
          <Badge tone={recommendationTone(analysis.recommendation)}>{analysis.recommendation}</Badge>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ResultCard label="후보지 기대 월매출" value={formatKoreanMoneyFromMillion(analysis.expectedCandidateMonthlySalesM)} />
          <ResultCard label={cashLabel} value={formatKoreanMoneyFromMillion(Math.abs(analysis.expectedCashLeftM))} valueClassName={cashTone} />
          <ResultCard label="손익분기 월매출" value={formatKoreanMoneyFromMillion(analysis.breakEvenSalesM)} />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <ResultCard label="브랜드 평균 월매출" value={formatKoreanMoneyFromMillion(analysis.brandAverageMonthlySalesM)} />
          <ResultCard label="상권 예상 경쟁밀도" value={`${Math.round(analysis.categoryDensityRatio * 100)}%`} />
          <ResultCard label="임대료 부담" value={`${Math.round(analysis.rentPressureRatio * 100)}%`} />
        </div>

        <p className="mt-3 rounded-lg border border-line bg-white px-3 py-2 text-sm leading-6 text-ink">
          {analysis.explanation}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted">{analysis.limitation}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-lg border border-line bg-paper p-3">
          <h4 className="text-sm font-semibold text-ink">반경 {formatRadius(analysis.radiusM)} 경쟁 현황</h4>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniMetric label="같은 브랜드" value={`${analysis.sameBrandCompetitors}곳`} />
            <MiniMetric label="같은 업종" value={`${analysis.sameCategoryCompetitors}곳`} />
            <MiniMetric label="인접 경쟁" value={`${analysis.adjacentCompetitors}곳`} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-3">
          <h4 className="text-sm font-semibold text-ink">계약 전 확인 질문</h4>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-ink">
            {analysis.nextQuestions.map((question, index) => (
              <li key={question} className="grid grid-cols-[24px_minmax(0,1fr)] gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-leaf">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  valueClassName = 'text-ink',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-3">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`mt-1 break-keep text-lg font-semibold ${valueClassName}`}>{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white px-2 py-2">
      <p className="truncate text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function parsePositiveNumber(value: string, fallback: number): number {
  if (value.trim() === '') return 0;
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return fallback;
  return Math.max(0, Math.round(nextValue));
}

function recommendationTone(recommendation: string): 'good' | 'info' | 'watch' {
  if (recommendation === '검토 가능') return 'good';
  if (recommendation === '재검토 권장') return 'watch';
  return 'info';
}

function formatRadius(radiusM: CandidateRadiusM): string {
  return radiusM === 1000 ? '1km' : `${radiusM}m`;
}
