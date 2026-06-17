import { createContext, useContext, type ReactNode } from 'react';
import type { LearnSource } from '../../../domain/learn/types';

const LearnSourcesContext = createContext<LearnSource[]>([]);

export function LearnSourcesProvider({
  sources,
  children,
}: {
  sources: LearnSource[];
  children: ReactNode;
}) {
  return <LearnSourcesContext.Provider value={sources}>{children}</LearnSourcesContext.Provider>;
}

export function useLearnSource(sourceId: string): LearnSource {
  const sources = useContext(LearnSourcesContext);
  const source = sources.find((s) => s.id === sourceId);
  if (!source) {
    throw new Error(`Unknown learn sourceId: "${sourceId}". Add it to the chapter's sources.`);
  }
  return source;
}
