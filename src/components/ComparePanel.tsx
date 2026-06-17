import type { Brand } from '../domain/types';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import { getContractChangeLabel, getFounderFitLabel, getMonthlySalesM, getOperationLoadLabel } from '../domain/founderCopy';
import { Badge } from './Badge';
import { GitCompareArrows } from 'lucide-react';

export function ComparePanel({ brands }: { brands: Brand[]; benchmarkBrands: Brand[] }) {
  if (brands.length < 2) {
    return (
      <section className="rounded-xl border border-dashed border-line bg-surface p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-leaf">
              <GitCompareArrows className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink">브랜드 비교 준비</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                비교함에 브랜드를 2개 이상 담으면 비용, 월매출, 운영 부담을 한 표로 볼 수 있습니다.
              </p>
            </div>
          </div>
          <p className="shrink-0 rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">최대 4개 비교</p>
        </div>
      </section>
    );
  }

  const mixedCategory = new Set(brands.map((brand) => brand.category)).size > 1;
  const columns = ['브랜드', '창업 판단', '창업비', '월매출', '계약 변동', '운영 부담'];

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex flex-col gap-2 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-leaf">Comparison</p>
          <h2 className="display mt-1 text-xl font-semibold text-ink">담은 브랜드 비교</h2>
        </div>
        {mixedCategory && <Badge tone="watch">업종이 다르면 비용 구조도 다릅니다</Badge>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-paper text-[11px] font-semibold uppercase tracking-wide text-muted">
              {columns.map((column) => (
                <th key={column} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tnum">
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t border-line transition-colors hover:bg-mist/40">
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-ink">{brand.name}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted">{getFounderFitLabel(brand)}</td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-ink">{formatKoreanMoneyFromMillion(brand.cost.startupTotalM)}</td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-ink">{formatKoreanMoneyFromMillion(getMonthlySalesM(brand))}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted">{getContractChangeLabel(brand)}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted">{getOperationLoadLabel(brand)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
