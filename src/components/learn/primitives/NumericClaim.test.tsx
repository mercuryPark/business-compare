import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LearnSource } from '../../../domain/learn/types';
import { LearnSourcesProvider } from './sourceContext';
import { NumericClaim } from './NumericClaim';

const source: LearnSource = {
  id: 'min-wage', category: 'wage', sourceTitle: '최저임금위원회',
  sourceUrl: 'https://minimumwage.go.kr', lastCheckedAt: '2026-06-17',
  reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('NumericClaim', () => {
  it('renders the label, value, basis note, and a resolved source', () => {
    render(
      <LearnSourcesProvider sources={[source]}>
        <NumericClaim label="최저임금(시급)" value="약 10,000원대" basis="2026년 기준" sourceId="min-wage" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('최저임금(시급)')).toBeTruthy();
    expect(screen.getByText('약 10,000원대')).toBeTruthy();
    expect(screen.getByText('2026년 기준')).toBeTruthy();
    expect(screen.getByText('최저임금위원회')).toBeTruthy();
  });

  it('throws when the sourceId is not registered (authoring safety net)', () => {
    expect(() =>
      render(
        <LearnSourcesProvider sources={[]}>
          <NumericClaim label="x" value="1" sourceId="missing" />
        </LearnSourcesProvider>,
      ),
    ).toThrow(/Unknown learn sourceId/);
  });
});
