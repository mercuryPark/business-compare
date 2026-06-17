import { describe, expect, it } from 'vitest';

import { parseLearnHash } from '../learn/route';

const SLUGS = ['ch1-mindset-money', 'ch2-contract'];

describe('parseLearnHash', () => {
  it('treats empty / #compare as the compare view', () => {
    expect(parseLearnHash('', SLUGS)).toEqual({ view: 'compare' });
    expect(parseLearnHash('#', SLUGS)).toEqual({ view: 'compare' });
    expect(parseLearnHash('#compare', SLUGS)).toEqual({ view: 'compare' });
  });

  it('treats #learn as the landing hub, not the first chapter', () => {
    expect(parseLearnHash('#learn', SLUGS)).toEqual({ view: 'learn', mode: 'landing' });
  });

  it('resolves a known chapter slug', () => {
    expect(parseLearnHash('#learn/ch2-contract', SLUGS)).toEqual({
      view: 'learn',
      mode: 'chapter',
      chapterSlug: 'ch2-contract',
    });
  });

  it('returns notFound for an unknown slug instead of redirecting', () => {
    expect(parseLearnHash('#learn/nope', SLUGS)).toEqual({
      view: 'learn',
      mode: 'notFound',
      requestedSlug: 'nope',
    });
  });
});
