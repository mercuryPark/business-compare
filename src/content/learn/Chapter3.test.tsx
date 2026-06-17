import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter3 } from './Chapter3';

describe('Chapter3 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch3')!;

  it('renders a key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter3 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /입지·상권·임대차·인허가/ })).toBeTruthy();
  });

  it('renders a licensing-matrix row from the SourceBackedTable', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter3 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('rowheader', { name: '영업신고' })).toBeTruthy();
    expect(screen.getByText('보건증(건강진단결과서)')).toBeTruthy();
  });
});
