import { CHAPTERS, PHASES } from '../../domain/learn/curriculum';

export function LearnSidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="학습 목차" className="space-y-4">
      {PHASES.map((phase) => (
        <div key={phase.id}>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
          <ul className="space-y-1">
            {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
              <li key={c.slug}>
                <a
                  href={`#learn/${c.slug}`}
                  aria-current={c.slug === activeSlug ? 'page' : undefined}
                  className={`block rounded px-2 py-1 text-sm ${
                    c.slug === activeSlug ? 'bg-mist font-semibold text-forest' : 'text-ink hover:bg-paper'
                  }`}
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
