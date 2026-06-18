import type { LearnRoute } from './types';

export function parseLearnHash(hash: string, knownSlugs: readonly string[]): LearnRoute {
  const clean = hash.replace(/^#/, '').trim();

  if (clean === '' || clean === 'home' || clean === 'learn') {
    return { view: 'home' };
  }

  if (clean === 'compare') {
    return { view: 'compare' };
  }

  if (clean.startsWith('learn/')) {
    const slug = clean.slice('learn/'.length);
    if (knownSlugs.includes(slug)) {
      return { view: 'learn', mode: 'chapter', chapterSlug: slug };
    }
    return { view: 'learn', mode: 'notFound', requestedSlug: slug };
  }

  return { view: 'home' };
}
