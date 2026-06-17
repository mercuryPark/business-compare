import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnSidebar } from './LearnSidebar';
import { LearnChapterNav } from './LearnChapterNav';
import { LearnNotFound } from './LearnNotFound';

describe('learn navigation components', () => {
  it('sidebar marks the active chapter with aria-current', () => {
    render(<LearnSidebar activeSlug="ch2-contract" />);
    const active = screen.getByRole('link', { current: 'page' });
    expect(active.textContent).toContain('계약');
  });

  it('chapter nav links to prev and next', () => {
    render(<LearnChapterNav activeSlug="ch2-contract" />);
    expect(screen.getByRole('link', { name: /마음가짐/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(screen.getByRole('link', { name: /입지/ })).toHaveAttribute('href', '#learn/ch3-location-license');
  });

  it('not-found shows the requested slug and recovery links', () => {
    render(<LearnNotFound requestedSlug="nope" />);
    expect(screen.getByText(/찾을 수 없습니다/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /학습 목차로/ })).toHaveAttribute('href', '#learn');
  });
});
