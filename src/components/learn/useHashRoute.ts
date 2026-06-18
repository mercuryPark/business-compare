import { useEffect, useState } from 'react';
import { parseLearnHash } from '../../domain/learn/route';
import { CHAPTER_SLUGS } from '../../domain/learn/curriculum';
import type { LearnRoute } from '../../domain/learn/types';

export function useHashRoute(): LearnRoute {
  const [route, setRoute] = useState<LearnRoute>(() => parseLearnHash(window.location.hash, CHAPTER_SLUGS));

  useEffect(() => {
    function onChange() {
      setRoute(parseLearnHash(window.location.hash, CHAPTER_SLUGS));
    }
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
