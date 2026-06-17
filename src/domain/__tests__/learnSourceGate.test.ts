import { describe, expect, it } from 'vitest';

import type { LearnChapter, LearnSource } from '../learn/types';
import { findSourceGateViolations } from '../learn/sourceGate';

function chapter(sources: LearnSource[]): LearnChapter {
  return {
    id: 'x', slug: 'x', phase: 'prepare', order: 1, title: 'x', summary: 'x',
    body: () => null, sources,
  };
}

const expertTax: LearnSource = {
  id: 's1', category: 'tax', sourceTitle: '국세청', sourceUrl: 'https://nts.go.kr',
  lastCheckedAt: '2026-06-17', reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('findSourceGateViolations', () => {
  it('flags a sensitive-category source that is not expert-reviewed', () => {
    const draftTax = { ...expertTax, id: 's2', reviewStatus: 'draft' as const, reviewer: null };
    const violations = findSourceGateViolations([chapter([draftTax])]);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ sourceId: 's2', reason: 'not-expert-reviewed' });
  });

  it('passes when all sensitive sources are expert-reviewed', () => {
    expect(findSourceGateViolations([chapter([expertTax])])).toHaveLength(0);
  });

  it('ignores general-category drafts', () => {
    const draftGeneral = { ...expertTax, id: 's3', category: 'general' as const, reviewStatus: 'draft' as const };
    expect(findSourceGateViolations([chapter([draftGeneral])])).toHaveLength(0);
  });

  it('flags malformed records (missing url or bad date)', () => {
    const bad = { ...expertTax, id: 's4', sourceUrl: '' };
    const violations = findSourceGateViolations([chapter([bad])]);
    expect(violations.some((v) => v.reason === 'malformed')).toBe(true);
  });
});
