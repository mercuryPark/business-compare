import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter6 } from './Chapter6';

describe('Chapter6 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch6')!;

  it('renders a key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter6 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /일상 운영의 기본기/ })).toBeTruthy();
  });

  it('renders the wage NumericClaims and the monthly checklist', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter6 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('최저임금(시급)')).toBeTruthy();
    expect(screen.getByText('주휴수당 발생 기준')).toBeTruthy();
    expect(screen.getByText('4주 평균 1주 소정근로 15시간 이상 + 그 주 개근')).toBeTruthy();
    expect(screen.getByText('월 운영 체크리스트')).toBeTruthy();
  });
});
