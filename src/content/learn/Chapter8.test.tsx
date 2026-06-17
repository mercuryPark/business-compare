import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter8 } from './Chapter8';

describe('Chapter8 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch8')!;

  it('renders a key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter8 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /지속과 확장/ })).toBeTruthy();
  });

  it('closes the learn→compare loop with a CTA to #compare', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter8 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('종합소득세 구조')).toBeTruthy();
    expect(screen.getByRole('link', { name: /브랜드별로 비교해보기/ })).toHaveAttribute(
      'href',
      '#compare',
    );
  });
});
