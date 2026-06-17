import type { LearnRoute } from './types';

export function parseLearnHash(hash: string, knownSlugs: readonly string[]): LearnRoute {
  const clean = hash.replace(/^#/, '').trim();

  if (clean === '' || clean === 'compare') {
    return { view: 'compare' };
  }

  if (clean === 'learn') {
    return { view: 'learn', mode: 'landing' };
  }

  if (clean.startsWith('learn/')) {
    const slug = clean.slice('learn/'.length);
    if (knownSlugs.includes(slug)) {
      return { view: 'learn', mode: 'chapter', chapterSlug: slug };
    }
    return { view: 'learn', mode: 'notFound', requestedSlug: slug };
  }

  return { view: 'compare' };
}
