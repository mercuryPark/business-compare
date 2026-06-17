import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter7 } from './Chapter7';

describe('Chapter7 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch7')!;

  it('renders a key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter7 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /진단과 회복/ })).toBeTruthy();
  });

  it('links the 손절 decision back to the CH4 worst-case loss math', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter7 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: '줄이면 안 되는 비용' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /최악의 경우 잃는 돈/ })).toHaveAttribute(
      'href',
      '#learn/ch4-startup-cost',
    );
  });
});
