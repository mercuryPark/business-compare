import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./config', () => ({ COMPARE_ENABLED: false }));

import App from './App';

beforeEach(() => {
  window.location.hash = '#compare';
});
afterEach(() => {
  window.location.hash = '';
});

describe('App compare gating', () => {
  it('gates the compare dashboard behind a 준비 중 notice when compare is disabled', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /준비 중/ })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '한눈에 보는 창업 지도' })).toBeNull();
  });
});
