import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnLanding } from './LearnLanding';

describe('LearnLanding', () => {
  it('renders the four quick-entry cards', () => {
    render(<LearnLanding />);
    expect(screen.getByRole('link', { name: /10분 생존 체크/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(screen.getByRole('link', { name: /계약 직전 체크/ })).toHaveAttribute('href', '#learn/ch2-contract');
    expect(screen.getByRole('link', { name: /오픈 준비 체크/ })).toHaveAttribute('href', '#learn/ch4-startup-cost');
    expect(screen.getByRole('link', { name: /운영 위기 체크/ })).toHaveAttribute('href', '#learn/ch7-low-sales');
  });

  it('lists all eight chapters in the overview', () => {
    render(<LearnLanding />);
    expect(screen.getByText('일상 운영의 기본기')).toBeTruthy();
  });
});
