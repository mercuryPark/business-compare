import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LearnSource } from '../../../domain/learn/types';
import { LearnSourcesProvider } from './sourceContext';
import { SourceNote } from './SourceNote';

const source: LearnSource = {
  id: 'nts-vat', category: 'tax', sourceTitle: '국세청 부가가치세 안내',
  sourceUrl: 'https://nts.go.kr', lastCheckedAt: '2026-06-17',
  reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('SourceNote', () => {
  it('renders the source title, link, and review status', () => {
    render(
      <LearnSourcesProvider sources={[source]}>
        <SourceNote sourceId="nts-vat" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('국세청 부가가치세 안내')).toBeTruthy();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://nts.go.kr');
    expect(screen.getByText(/전문가 검토/)).toBeTruthy();
  });
});
