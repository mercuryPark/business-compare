import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter1 } from './Chapter1';

describe('Chapter1 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch1')!;

  it('renders a key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter1 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /마음가짐/ })).toBeTruthy();
  });

  it('renders the HardStopGate with all six stop conditions', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter1 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('생활비 6~12개월치가 없다')).toBeTruthy();
    expect(screen.getByText('총투자금 대부분이 고금리 대출이다')).toBeTruthy();
    expect(screen.getByText('폐업 시 남는 대출·원상복구비를 감당 못 한다')).toBeTruthy();
    expect(screen.getByText('정보공개서·계약서를 직접 읽지 않았다')).toBeTruthy();
    expect(screen.getByText('예상매출을 본사 말로만 믿고 있다')).toBeTruthy();
    expect(screen.getByText('가족 생계비와 사업비가 섞여 있다')).toBeTruthy();
  });
});
