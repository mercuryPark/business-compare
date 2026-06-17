import { describe, expect, it } from 'vitest';

import { CHAPTERS, getAdjacentChapters, getChapter } from '../learn/curriculum';

describe('learn curriculum', () => {
  it('has eight chapters with unique, contiguous, sorted order', () => {
    expect(CHAPTERS).toHaveLength(8);
    const slugs = CHAPTERS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(8);
    expect(CHAPTERS.map((c) => c.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('every chapter has a non-empty sources list with valid category and status', () => {
    const categories = new Set(['tax', 'wage', 'contract', 'lease', 'licensing', 'general']);
    const statuses = new Set(['draft', 'self-reviewed', 'expert-reviewed']);
    for (const chapter of CHAPTERS) {
      expect(chapter.sources.length).toBeGreaterThan(0);
      for (const source of chapter.sources) {
        expect(categories.has(source.category)).toBe(true);
        expect(statuses.has(source.reviewStatus)).toBe(true);
      }
    }
  });

  it('computes adjacent chapters with null at the ends', () => {
    expect(getAdjacentChapters('ch1-mindset-money').prev).toBeNull();
    expect(getAdjacentChapters('ch1-mindset-money').next?.slug).toBe('ch2-contract');
    expect(getAdjacentChapters('ch8-high-sales').next).toBeNull();
    expect(getChapter('ch4-startup-cost')?.title).toContain('초기비용');
  });
});
