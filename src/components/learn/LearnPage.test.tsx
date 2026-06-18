import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnPage } from './LearnPage';

describe('LearnPage', () => {
  it('renders a chapter with the disclaimer banner and source footer in chapter mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'chapter', chapterSlug: 'ch1-mindset-money' }} />);
    expect(screen.getByText(/일반적인 안내입니다/)).toBeTruthy();
    expect(screen.getByText(/출처 및 검토 상태/)).toBeTruthy();
  });

  it('shows the pending-expert-review warning for a chapter with a sensitive draft source (ch5)', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'chapter', chapterSlug: 'ch5-monthly-cashflow' }} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText(/아직 전문가 검토를 거치지 않은/)).toBeTruthy();
  });

  it('does NOT show the pending-expert-review warning for a general-only chapter (ch1)', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'chapter', chapterSlug: 'ch1-mindset-money' }} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByText(/아직 전문가 검토를 거치지 않은/)).toBeNull();
  });

  it('renders not-found for notFound mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'notFound', requestedSlug: 'nope' }} />);
    expect(screen.getByText(/찾을 수 없습니다/)).toBeTruthy();
  });
});
