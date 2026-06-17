import { BarChart3, Coffee, Compass, Search, Store, TrendingUp, WalletCards } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatKoreanMoneyFromMillion } from '../domain/formatters';
import type { Brand, BrandCategory } from '../domain/types';
import { getMonthlySalesM } from '../domain/founderCopy';
import { BrandCard } from './BrandCard';

const categoryLabels: Array<{ value: BrandCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'coffee', label: '커피' },
  { value: 'lunchbox', label: '도시락' },
  { value: 'chicken', label: '치킨' },
  { value: 'dessert', label: '디저트' },
  { value: 'toast-burger', label: '토스트/버거' },
];

export function Dashboard({
  brands,
  category,
  selectedIds,
  onCategoryChange,
  onToggleSelect,
  onOpenBrand,
}: {
  brands: Brand[];
  category: BrandCategory | 'all';
  selectedIds: string[];
  onCategoryChange: (category: BrandCategory | 'all') => void;
  onToggleSelect: (brandId: string) => void;
  onOpenBrand: (brandId: string) => void;
}) {
  const filtered = category === 'all' ? brands : brands.filter((brand) => brand.category === category);
  const comparisonLimitReached = selectedIds.length >= 4;
  const averageStartupM = brands.reduce((sum, brand) => sum + brand.cost.startupTotalM, 0) / brands.length;
  const totalStores = brands.reduce((sum, brand) => sum + brand.stability.currentStores, 0);
  const averageMonthlySalesM = brands.reduce((sum, brand) => sum + getMonthlySalesM(brand), 0) / brands.length;
  const stableOperators = brands.filter((brand) => (brand.stability.averageOperatingYears ?? 0) >= 7).length;

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-forest text-cream shadow-hero">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(90% 120% at 90% -10%, rgba(58,140,104,0.45) 0%, rgba(16,58,44,0) 55%), radial-gradient(80% 120% at 0% 110%, rgba(187,90,54,0.25) 0%, rgba(16,58,44,0) 50%)',
          }}
        />
        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream/90 backdrop-blur">
              <Compass className="h-3.5 w-3.5" />
              창업 판단 브리핑
            </p>
            <h1 className="display mt-5 break-keep text-4xl font-semibold leading-[1.05] text-white md:text-6xl">
              내 조건에 맞는<br className="hidden sm:block" /> 프랜차이즈 찾기
            </h1>
            <p className="mt-5 max-w-xl break-keep text-base leading-7 text-cream/80 md:text-lg">
              처음 보는 사람도 비용, 매출 규모, 운영 부담을 한 화면에서 비교할 수 있게 정리했습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm">
              <GuidePill icon={<Compass className="h-4 w-4" />} label="1. 돈이 묶이는 크기" />
              <GuidePill icon={<TrendingUp className="h-4 w-4" />} label="2. 월매출 체감" />
              <GuidePill icon={<BarChart3 className="h-4 w-4" />} label="3. 비용을 뺀 뒤" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/12 bg-white/10 lg:grid-cols-1 lg:divide-y lg:divide-white/10">
            <HeroStat icon={<WalletCards className="h-4 w-4" />} label="평균 창업비" value={formatKoreanMoneyFromMillion(averageStartupM)} />
            <HeroStat icon={<Coffee className="h-4 w-4" />} label="평균 월매출" value={formatKoreanMoneyFromMillion(averageMonthlySalesM)} />
            <HeroStat icon={<Store className="h-4 w-4" />} label="분석 점포" value={`${totalStores.toLocaleString('ko-KR')}개`} />
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-black/10 px-6 py-3.5 text-sm text-cream/75 md:px-10">
          오래 버틴 브랜드 <span className="font-semibold text-cream">{stableOperators}개</span>, 전체{' '}
          <span className="font-semibold text-cream">{brands.length}개</span> 브랜드를 같은 기준으로 놓고 봅니다.
        </div>
      </div>

      <FounderMap brands={brands} />

      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist text-leaf">
              <Search className="h-4 w-4" />
            </span>
            업종별로 좁혀 보기
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryLabels.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={category === item.value}
                onClick={() => onCategoryChange(item.value)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium ${
                  category === item.value
                    ? 'border-forest bg-forest text-white shadow-sm'
                    : 'border-line bg-paper text-ink hover:border-leaf/40 hover:bg-mist'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p
          aria-live="polite"
          className="tnum mt-3 inline-flex items-center rounded-full bg-mist px-3 py-1 text-sm font-semibold text-leaf"
        >
          비교함 {selectedIds.length}/4
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            benchmarkBrands={brands}
            selected={selectedIds.includes(brand.id)}
            compareDisabled={comparisonLimitReached && !selectedIds.includes(brand.id)}
            onSelect={() => onToggleSelect(brand.id)}
            onOpen={() => onOpenBrand(brand.id)}
          />
        ))}
      </div>
    </section>
  );
}

function HeroStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/[0.06] px-4 py-4 md:px-5 md:py-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-cream/65">
        <span className="text-cream/80">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="tnum mt-2 text-xl font-semibold leading-none text-white md:text-2xl">{value}</p>
    </div>
  );
}

function GuidePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm font-medium text-cream/90 backdrop-blur">
      <span className="text-cream">{icon}</span>
      {label}
    </span>
  );
}

function FounderMap({ brands }: { brands: Brand[] }) {
  const maxStartup = Math.max(...brands.map((brand) => brand.cost.startupTotalM), 1);
  const maxSales = Math.max(...brands.map((brand) => getMonthlySalesM(brand)), 1);
  const highlights = [...brands]
    .sort((a, b) => getMonthlySalesM(b) / b.cost.startupTotalM - getMonthlySalesM(a) / a.cost.startupTotalM)
    .slice(0, 5);

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Visual reading</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">한눈에 보는 창업 지도</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              브랜드를 고르기 전, 돈이 묶이는 정도와 매출 체감을 먼저 비교하세요.
            </p>
          </div>
          <p className="text-xs leading-5 text-muted">막대가 길수록 해당 값이 큰 브랜드입니다.</p>
        </div>

        <div className="mt-5 grid gap-3">
          {highlights.map((brand) => {
            const startupWidth = `${Math.max(8, Math.round((brand.cost.startupTotalM / maxStartup) * 100))}%`;
            const salesWidth = `${Math.max(8, Math.round((getMonthlySalesM(brand) / maxSales) * 100))}%`;

            return (
              <div key={brand.id} className="rounded-lg border border-line bg-paper p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{brand.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{brand.categoryLabel}</p>
                  </div>
                  <p className="text-xs font-medium text-leaf">
                    월매출 {formatKoreanMoneyFromMillion(getMonthlySalesM(brand))}
                  </p>
                </div>
                <div className="mt-3 grid gap-2">
                  <MiniRow label="창업비" width={startupWidth} value={formatKoreanMoneyFromMillion(brand.cost.startupTotalM)} color="bg-clay" />
                  <MiniRow label="월매출" width={salesWidth} value={formatKoreanMoneyFromMillion(getMonthlySalesM(brand))} color="bg-leaf" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="rounded-lg border border-line bg-mist p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Beginner guide</p>
        <h3 className="mt-2 text-xl font-semibold text-ink">초보자용 읽는 법</h3>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-ink">
          {[
            '창업비는 내 돈이 얼마나 오래 묶이는지 보는 숫자입니다.',
            '월매출은 크기만 보지 말고 임대료, 인건비, 수수료를 뺀 뒤를 봅니다.',
            '마지막에는 시뮬레이터에서 내 지역 임대료와 인건비로 다시 계산합니다.',
          ].map((item, index) => (
            <li key={item} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-leaf shadow-sm">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
}

function MiniRow({ label, width, value, color }: { label: string; width: string; value: string; color: string }) {
  return (
    <div className="grid grid-cols-[58px_minmax(0,1fr)_88px] items-center gap-2 text-xs">
      <span className="font-medium text-muted">{label}</span>
      <span className="h-2.5 overflow-hidden rounded-full bg-white">
        <span className={`block h-full rounded-full ${color}`} style={{ width }} />
      </span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
