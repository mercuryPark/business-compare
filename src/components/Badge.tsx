import type { ReactNode } from 'react';

type Tone = 'neutral' | 'good' | 'watch' | 'danger' | 'info';

const toneClass: Record<Tone, string> = {
  neutral: 'border-line bg-paper text-muted',
  good: 'border-safe/25 bg-safe/10 text-safe',
  watch: 'border-watch/25 bg-watch/10 text-watch',
  danger: 'border-danger/25 bg-danger/10 text-danger',
  info: 'border-info/25 bg-info/10 text-info',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
