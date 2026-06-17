import { CHAPTERS, PHASES } from '../domain/learn/curriculum';
import { ButtonLink } from './learn/primitives/ButtonLink';

const QUICK_CARDS = [
  { label: '🚦 지금 시작해도 될까?', desc: '10분 자가진단', href: '#learn/ch1-mindset-money' },
  { label: '📑 계약 전에 멈추기', desc: '정보공개서·계약서', href: '#learn/ch2-contract' },
  { label: '💸 오픈에 드는 돈', desc: '초기비용·놓친 비용', href: '#learn/ch4-startup-cost' },
  { label: '📉 매출이 안 나올 때', desc: '진단과 대응', href: '#learn/ch7-low-sales' },
];

export function Home() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="rounded-2xl bg-mist/50 p-6">
        <h1 className="text-2xl font-bold tracking-tightest text-ink md:text-[32px] md:leading-tight">
          큰돈을 걸기 전에,<br />먼저 알고 시작하세요
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/80">
          가게에 실제로 드는 비용부터 계약·세금에서 놓치기 쉬운 부분까지, 창업이 처음인 분의 눈높이에 맞춰 정리했어요.
        </p>
        <div className="mt-5">
          <ButtonLink href="#learn/ch1-mindset-money">10분 자가진단으로 시작하기</ButtonLink>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">어디서부터 볼까요?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_CARDS.map((card) => (
            <a key={card.href} href={card.href} className="rounded-xl border border-line bg-surface p-4 hover:shadow-md">
              <div className="text-base font-semibold text-forest">{card.label}</div>
              <div className="mt-1 text-sm text-muted">{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">전체 8단계로 차근차근</h2>
        <div className="rounded-xl border border-line bg-surface p-2">
          {PHASES.map((phase) => (
            <div key={phase.id} className="px-2 py-1">
              <div className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
              <ul>
                {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
                  <li key={c.slug} className="border-t border-line/60 first:border-t-0">
                    <a href={`#learn/${c.slug}`} className="block py-2 text-sm text-ink hover:text-forest">
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-mist/40 p-4 text-sm leading-relaxed text-ink/80">
        📌 공정위·국세청·소상공인시장진흥공단 등 <strong>공식 자료를 바탕으로</strong> 정리했어요. 글마다 출처와 검토 상태를
        표시하며, 세무·법률 내용은 전문가 검토 전이라 <strong>참고용</strong>입니다.
      </section>

      <section className="rounded-xl border border-dashed border-line p-4 text-center">
        <div className="text-sm text-muted">어느 정도 감을 잡았다면</div>
        <div className="mt-2 flex justify-center">
          <ButtonLink href="#compare" variant="secondary">프랜차이즈 비용 비교해보기</ButtonLink>
        </div>
      </section>
    </div>
  );
}
