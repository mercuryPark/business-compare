import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ComparePending } from './ComparePending';

describe('ComparePending', () => {
  it('shows a 준비 중 notice and a link back to learning', () => {
    render(<ComparePending />);
    expect(screen.getByRole('heading', { name: /준비 중/ })).toBeTruthy();
    expect(screen.getByText(/데이터 검증/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /학습/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
  });
});
