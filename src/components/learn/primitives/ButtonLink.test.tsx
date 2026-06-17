import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ButtonLink } from './ButtonLink';

describe('ButtonLink', () => {
  it('renders a primary button-link with href and min height', () => {
    render(<ButtonLink href="#learn/ch1-mindset-money">시작하기</ButtonLink>);
    const link = screen.getByRole('link', { name: '시작하기' });
    expect(link).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(link.className).toContain('min-h-[48px]');
    expect(link.className).toContain('bg-forest');
  });

  it('renders a secondary variant with a distinct style', () => {
    render(<ButtonLink href="#compare" variant="secondary">비교</ButtonLink>);
    const link = screen.getByRole('link', { name: '비교' });
    expect(link.className).not.toContain('bg-forest');
    expect(link.className).toContain('border');
  });
});
