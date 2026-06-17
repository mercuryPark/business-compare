import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter5 } from './Chapter5';

describe('Chapter5 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch5')!;

  it('renders the key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter5 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /매달 나가는 돈/ })).toBeTruthy();
  });

  it('renders the waterfall result line "손에 남는 돈"', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter5 />
      </LearnSourcesProvider>,
    );
    expect(screen.getAllByText('손에 남는 돈').length).toBeGreaterThan(0);
  });

  it('renders a tax-timing calendar entry (종합소득세)', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter5 />
      </LearnSourcesProvider>,
    );
    expect(
      screen.getByText('종합소득세 — 전년도 사업소득 확정신고·납부'),
    ).toBeTruthy();
  });

  it('renders one of the three MoneyScenario titles', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter5 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('시나리오 B — 자리 잡은 가게')).toBeTruthy();
  });
});
