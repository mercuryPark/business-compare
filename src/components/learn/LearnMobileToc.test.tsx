import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LearnMobileToc } from './LearnMobileToc';

describe('LearnMobileToc', () => {
  it('is collapsed by default and reveals the chapter list when opened', async () => {
    const user = userEvent.setup();
    render(<LearnMobileToc activeSlug="ch2-contract" />);
    const toggle = screen.getByRole('button', { name: /목차/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /마음가짐과 자금 준비/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
  });
});
