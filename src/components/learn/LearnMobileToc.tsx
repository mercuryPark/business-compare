import { useState } from 'react';
import { CHAPTERS, PHASES } from '../../domain/learn/curriculum';

export function LearnMobileToc({ activeSlug }: { activeSlug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink"
      >
        목차 {open ? '닫기' : '열기'}
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <nav aria-label="학습 목차" className="mt-2 space-y-3 rounded-lg border border-line bg-surface p-3">
          {PHASES.map((phase) => (
            <div key={phase.id}>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
              <ul className="space-y-1">
                {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#learn/${c.slug}`}
                      aria-current={c.slug === activeSlug ? 'page' : undefined}
                      className={`block rounded px-2 py-1 text-sm ${c.slug === activeSlug ? 'bg-mist font-semibold text-forest' : 'text-ink'}`}
                    >
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
