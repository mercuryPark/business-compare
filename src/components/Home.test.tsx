import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../domain/learn/curriculum';
import { Home } from './Home';

describe('Home', () => {
  it('renders the hero headline and primary CTA into the first chapter', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: /큰돈을 걸기 전에/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /10분 자가진단으로 시작하기/ })).toHaveAttribute(
      'href',
      '#learn/ch1-mindset-money',
    );
  });

  it('renders the four quick-entry cards with correct chapter links', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /지금 시작해도 될까/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(screen.getByRole('link', { name: /계약 전에 멈추기/ })).toHaveAttribute('href', '#learn/ch2-contract');
    expect(screen.getByRole('link', { name: /오픈에 드는 돈/ })).toHaveAttribute('href', '#learn/ch4-startup-cost');
    expect(screen.getByRole('link', { name: /📉 매출이 안 나올 때/ })).toHaveAttribute('href', '#learn/ch7-low-sales');
  });

  it('lists all eight curriculum chapters and a secondary compare CTA', () => {
    render(<Home />);
    expect(CHAPTERS).toHaveLength(8);
    for (const chapter of CHAPTERS) {
      expect(screen.getByRole('link', { name: chapter.title })).toHaveAttribute(
        'href',
        `#learn/${chapter.slug}`,
      );
    }
    expect(screen.getByRole('link', { name: /프랜차이즈 비용 비교/ })).toHaveAttribute('href', '#compare');
  });

  it('shows the trust strip noting official sources and 참고용 status', () => {
    render(<Home />);
    expect(screen.getByText(/공식 자료/)).toBeTruthy();
    expect(screen.getByText(/참고용/)).toBeTruthy();
  });
});
