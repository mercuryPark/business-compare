import type { LearnChapter, LearnSourceCategory } from './types';

export const SENSITIVE_CATEGORIES: ReadonlySet<LearnSourceCategory> = new Set([
  'tax', 'wage', 'contract', 'lease', 'licensing',
]);

export interface GateViolation {
  chapterSlug: string;
  sourceId: string;
  reason: 'not-expert-reviewed' | 'malformed';
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function findSourceGateViolations(chapters: LearnChapter[]): GateViolation[] {
  const violations: GateViolation[] = [];

  for (const chapter of chapters) {
    for (const source of chapter.sources) {
      if (!source.sourceUrl || !ISO_DATE.test(source.lastCheckedAt)) {
        violations.push({ chapterSlug: chapter.slug, sourceId: source.id, reason: 'malformed' });
        continue;
      }
      if (SENSITIVE_CATEGORIES.has(source.category) && source.reviewStatus !== 'expert-reviewed') {
        violations.push({ chapterSlug: chapter.slug, sourceId: source.id, reason: 'not-expert-reviewed' });
      }
    }
  }

  return violations;
}
