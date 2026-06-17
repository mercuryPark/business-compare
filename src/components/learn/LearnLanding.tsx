import { CHAPTERS, PHASES } from '../../domain/learn/curriculum';

const QUICK_CARDS = [
  { label: '10분 생존 체크', desc: '지금 창업해도 되는지부터', href: '#learn/ch1-mindset-money' },
  { label: '계약 직전 체크', desc: '정보공개서·가맹계약서', href: '#learn/ch2-contract' },
  { label: '오픈 준비 체크', desc: '초기비용과 빠진 돈', href: '#learn/ch4-startup-cost' },
  { label: '운영 위기 체크', desc: '매출이 안 나올 때', href: '#learn/ch7-low-sales' },
];

export function LearnLanding() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink">창업, 비교하기 전에 먼저 배우기</h1>
        <p className="mt-1 text-muted">처음이라면 아래 빠른 체크부터 시작하세요.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {QUICK_CARDS.map((card) => (
          <a key={card.href} href={card.href} className="rounded-xl border border-line bg-surface p-4 hover:shadow-md">
            <div className="text-base font-semibold text-forest">{card.label}</div>
            <div className="text-sm text-muted">{card.desc}</div>
          </a>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">전체 커리큘럼</h2>
        {PHASES.map((phase) => (
          <div key={phase.id}>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
            <ul className="space-y-1">
              {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
                <li key={c.slug}>
                  <a href={`#learn/${c.slug}`} className="text-sm text-ink hover:text-forest">
                    {c.title} <span className="text-muted">— {c.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
