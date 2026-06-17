import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter4 } from './Chapter4';

describe('Chapter4 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch4')!;

  it('renders the key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter4 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /창업에 드는 돈/ })).toBeTruthy();
  });

  it('renders an initial-cost table row and the worst-case loss section', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter4 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('가맹비·교육비 (프랜차이즈)')).toBeTruthy();
    expect(screen.getByText('원상복구비')).toBeTruthy();
    expect(screen.getByText('남은 대출 잔액')).toBeTruthy();
  });

  it('renders the pre-open checklist item', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter4 />
      </LearnSourcesProvider>,
    );
    expect(
      screen.getByText('예비 운전자금을 초기비용과 별도로 6~12개월치 확보했다'),
    ).toBeTruthy();
  });
});
