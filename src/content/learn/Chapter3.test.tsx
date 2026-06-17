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

  it('renders the ordered licensing step sequence (계약 전 적합성 확인 first)', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter3 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('rowheader', { name: '1. 계약 전 적합성 확인' })).toBeTruthy();
    expect(screen.getByRole('rowheader', { name: '4. 사업자등록' })).toBeTruthy();
  });

  it('renders the 환산보증금 protection-scope table distinguishing 기준 무관 vs 기준 이하', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter3 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('rowheader', { name: '대항력' })).toBeTruthy();
    expect(screen.getByRole('rowheader', { name: '우선변제권' })).toBeTruthy();
    expect(screen.getAllByText('기준과 무관하게 적용').length).toBeGreaterThan(0);
    expect(screen.getAllByText('기준 이하일 때만 적용').length).toBeGreaterThan(0);
  });
});
