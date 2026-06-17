import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnPage } from './LearnPage';

describe('LearnPage', () => {
  it('renders the landing hub in landing mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'landing' }} />);
    expect(screen.getByRole('heading', { name: /비교하기 전에 먼저 배우기/ })).toBeTruthy();
  });

  it('renders a chapter with the disclaimer banner and source footer in chapter mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'chapter', chapterSlug: 'ch1-mindset-money' }} />);
    expect(screen.getByText(/일반적인 안내입니다/)).toBeTruthy();
    expect(screen.getByText(/출처 및 검토 상태/)).toBeTruthy();
  });

  it('renders not-found for notFound mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'notFound', requestedSlug: 'nope' }} />);
    expect(screen.getByText(/찾을 수 없습니다/)).toBeTruthy();
  });
});
