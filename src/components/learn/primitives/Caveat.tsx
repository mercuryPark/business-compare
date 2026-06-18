import type { ReactNode } from 'react';

export function Caveat({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted">⚠ {children}</p>;
}
