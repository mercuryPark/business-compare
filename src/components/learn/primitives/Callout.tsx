import type { ReactNode } from 'react';

export function Callout({ tone = 'info', children }: { tone?: 'info' | 'warning'; children: ReactNode }) {
  const cls = tone === 'warning' ? 'border-watch/30 bg-watch/10 text-ink' : 'border-info/25 bg-info/10 text-ink';
  return <div className={`rounded-lg border p-3 text-sm ${cls}`}>{children}</div>;
}
