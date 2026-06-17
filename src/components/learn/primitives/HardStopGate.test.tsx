import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HardStopGate } from './HardStopGate';

describe('HardStopGate', () => {
  it('renders the stop heading and each stop condition', () => {
    render(<HardStopGate conditions={['생활비 6~12개월치가 없다', '총투자금 대부분이 고금리 대출이다']} />);
    expect(screen.getByRole('heading', { name: /지금은 멈춰야/ })).toBeTruthy();
    expect(screen.getByText('생활비 6~12개월치가 없다')).toBeTruthy();
    expect(screen.getByText('총투자금 대부분이 고금리 대출이다')).toBeTruthy();
  });
});
