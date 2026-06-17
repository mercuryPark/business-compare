import type { ReactNode } from 'react';
import type { Brand, P0ChecklistItem, VerificationStatus } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import { getP0CrossCheckSummary, getP0MetricLabel, getP0NumericAnomalies, getUnverifiedP0ChecklistItems } from '../domain/qa';

export function SourcePanel({ brand }: { brand: Brand }) {
  const unresolvedChecklist = getUnverifiedP0ChecklistItems(brand);
  const numericAnomalies = getP0NumericAnomalies(brand);
  const crossCheckSummary = getP0CrossCheckSummary(brand);

  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h3 className="text-base font-semibold">출처와 검증 상태</h3>
      <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        <div>
          <dt className="text-muted">P0 검증</dt>
          <dd className="font-medium">{brand.audit.p0Verified ? '완료' : '검증 전'}</dd>
        </div>
        <div>
          <dt className="text-muted">다음 검토</dt>
          <dd className="font-medium">{brand.audit.nextReviewMonth}</dd>
        </div>
      </dl>
      {unresolvedChecklist.length > 0 && (
        <div className="mt-3 rounded border border-watch/30 bg-watch/10 p-3 text-sm">
          <p className="font-medium text-watch">미검증 P0 항목</p>
          <ul aria-label="미검증 P0 항목" className="mt-2 flex flex-wrap gap-2 text-xs text-watch">
            {unresolvedChecklist.map((item) => (
              <li key={item.metric} className="rounded border border-watch/30 bg-white px-2 py-1">
                {getP0MetricLabel(item.metric)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {brand.cost.recurringCostBasis === 'manual-assumption' && (
        <div className="mt-3 rounded border border-line bg-paper p-3 text-sm">
          <p className="font-medium">반복 비용 가정</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            {brand.cost.differenceFranchiseFeeTotalM === null
              ? '차액가맹금 수치 미확보'
              : `차액가맹금 ${formatKoreanMoneyFromMillion(brand.cost.differenceFranchiseFeeTotalM)}`}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">{brand.cost.recurringCostNote}</p>
        </div>
      )}
      <div className="mt-3 rounded border border-line bg-paper p-3 text-sm">
        <p className="font-medium">P0 검증 체크리스트</p>
        <div
          role="group"
          aria-label="P0 교차확인 요약"
          className="mt-2 grid gap-2 text-xs sm:grid-cols-2"
        >
          <SummaryItem label="교차확인 완료" value={`${crossCheckSummary.crossChecked}/${crossCheckSummary.total}`} tone="good" />
          <SummaryItem label="교차확인 가능" value={`${crossCheckSummary.crossCheckable}개`} tone="info" />
          <SummaryItem label="1차 출처만" value={`${crossCheckSummary.singleSourceOnly}개`} tone="watch" />
          <SummaryItem label="출처 없음" value={`${crossCheckSummary.missingSource}개`} tone="watch" />
        </div>
        <ul aria-label="P0 검증 체크리스트" className="mt-2 space-y-2">
          {brand.audit.p0Checklist.map((item) => (
            <P0ChecklistRow key={item.metric} item={item} />
          ))}
        </ul>
      </div>
      {numericAnomalies.length > 0 && (
        <div className="mt-3 rounded border border-watch/30 bg-watch/10 p-3 text-sm">
          <p className="font-medium text-watch">숫자 검수 경고</p>
          <ul className="mt-2 space-y-1 text-xs leading-5 text-watch">
            {numericAnomalies.map((anomaly) => (
              <li key={anomaly}>{anomaly}</li>
            ))}
          </ul>
        </div>
      )}
      <ul className="mt-3 space-y-2 text-sm">
        {brand.sources.map((source) => (
          <li key={`${source.title}-${source.capturedAt}`} className="rounded border border-line p-2">
            <p className="font-medium">{source.title}</p>
            <p className="text-xs text-muted">
              {source.type} · 신뢰도 {source.confidence}
              {source.referenceYear ? ` · 기준연도 ${source.referenceYear}` : ''} · 수집일 {source.capturedAt}
            </p>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-xs font-medium text-info"
              >
                출처 열기
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SummaryItem({ label, value, tone }: { label: string; value: string; tone: 'good' | 'info' | 'watch' }) {
  const toneClass = {
    good: 'text-safe',
    info: 'text-info',
    watch: 'text-watch',
  }[tone];

  return (
    <div className="rounded border border-line bg-white px-2 py-1">
      <span className="text-muted">{label}</span> <span className={`font-medium ${toneClass}`}>{value}</span>
    </div>
  );
}

function P0ChecklistRow({ item }: { item: P0ChecklistItem }) {
  return (
    <li className="rounded border border-line bg-white p-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="font-medium">{getP0MetricLabel(item.metric)}</p>
        <div className="flex flex-wrap gap-1 text-xs">
          <ChecklistBadge tone={item.status === 'verified' ? 'good' : item.status === 'partial' ? 'info' : 'watch'}>
            {getVerificationStatusLabel(item.status)}
          </ChecklistBadge>
          <ChecklistBadge tone="neutral">출처 {item.sourceCount}개</ChecklistBadge>
          <ChecklistBadge tone={item.originalDisclosureChecked ? 'good' : 'watch'}>
            {item.originalDisclosureChecked ? '원문 대조 완료' : '원문 대조 전'}
          </ChecklistBadge>
          <ChecklistBadge tone={item.crossChecked ? 'good' : 'watch'}>
            {item.crossChecked ? '교차확인 완료' : '교차확인 전'}
          </ChecklistBadge>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted">{item.note}</p>
    </li>
  );
}

function ChecklistBadge({
  tone,
  children,
}: {
  tone: 'good' | 'info' | 'watch' | 'neutral';
  children: ReactNode;
}) {
  const toneClass = {
    good: 'border-safe/30 bg-safe/10 text-safe',
    info: 'border-info/30 bg-info/10 text-info',
    watch: 'border-watch/30 bg-watch/10 text-watch',
    neutral: 'border-line bg-paper text-ink',
  }[tone];

  return <span className={`rounded border px-2 py-0.5 font-medium ${toneClass}`}>{children}</span>;
}

function getVerificationStatusLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    verified: '검증 완료',
    partial: '부분 검증',
    unverified: '미검증',
  };
  return labels[status];
}
