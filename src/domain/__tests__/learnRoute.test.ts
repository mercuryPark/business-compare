import { describe, expect, it } from 'vitest';

import { parseLearnHash } from '../learn/route';
import { CHAPTER_SLUGS } from '../learn/curriculum';

const SLUGS = ['ch1-mindset-money', 'ch2-contract'];

describe('parseLearnHash', () => {
  it('routes empty / #home / bare #learn to home', () => {
    expect(parseLearnHash('', SLUGS)).toEqual({ view: 'home' });
    expect(parseLearnHash('#', SLUGS)).toEqual({ view: 'home' });
    expect(parseLearnHash('#home', SLUGS)).toEqual({ view: 'home' });
    expect(parseLearnHash('#learn', SLUGS)).toEqual({ view: 'home' });
  });

  it('routes #compare to compare', () => {
    expect(parseLearnHash('#compare', SLUGS)).toEqual({ view: 'compare' });
  });

  it('resolves a known chapter slug', () => {
    expect(parseLearnHash('#learn/ch2-contract', SLUGS)).toEqual({
      view: 'learn',
      mode: 'chapter',
      chapterSlug: 'ch2-contract',
    });
  });

  it('returns notFound for an unknown slug', () => {
    expect(parseLearnHash('#learn/nope', SLUGS)).toEqual({
      view: 'learn',
      mode: 'notFound',
      requestedSlug: 'nope',
    });
  });

  it('falls back to home for anything else', () => {
    expect(parseLearnHash('#whatever', SLUGS)).toEqual({ view: 'home' });
  });

  it('resolves every real curriculum chapter deep link (backward-compat)', () => {
    for (const slug of CHAPTER_SLUGS) {
      expect(parseLearnHash(`#learn/${slug}`, CHAPTER_SLUGS)).toEqual({
        view: 'learn',
        mode: 'chapter',
        chapterSlug: slug,
      });
    }
  });
});
