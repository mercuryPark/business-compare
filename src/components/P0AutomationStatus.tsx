import type { Brand } from '../domain/types';
import { evaluateP0AutomationReadiness } from '../domain/p0Automation';
import { Badge } from './Badge';

export function P0AutomationStatus({ brands }: { brands: Brand[] }) {
  const report = evaluateP0AutomationReadiness(brands);
  const topBlockers = getTopBlockers(report.brands.flatMap((brand) => brand.blockers));

  return (
    <section aria-label="데이터 검증 상태" className="rounded-lg border border-line bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium text-info">확인 상태</p>
          <h2 className="mt-1 text-lg font-semibold">데이터 검증 상태</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            원문 대조, 수수료 항목, 교차확인을 마친 브랜드만 판단에 사용합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Badge tone={report.ready ? 'good' : 'watch'}>{report.ready ? '검증 완료' : '검증 대기'}</Badge>
          <span className="rounded border border-line bg-paper px-2 py-0.5 text-xs font-medium text-ink">
            {report.summary.readyBrands}/{report.summary.totalBrands} 준비
          </span>
        </div>
      </div>

      {topBlockers.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2 text-xs">
          {topBlockers.map((blocker) => (
            <li key={blocker} className="rounded border border-watch/30 bg-watch/10 px-2 py-1 text-watch">
              {formatBlockerLabel(blocker)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatBlockerLabel(blocker: string): string {
  if (blocker === 'P0 전체 검증 미완료') {
    return '원문 검토 미완료';
  }
  return blocker;
}

function getTopBlockers(blockers: string[]): string[] {
  return [...new Set(blockers)].slice(0, 4);
}
