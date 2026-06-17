import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useHashRoute } from './useHashRoute';

beforeEach(() => { window.location.hash = ''; });
afterEach(() => { window.location.hash = ''; });

describe('useHashRoute', () => {
  it('returns the compare view by default and updates on hashchange', () => {
    const { result } = renderHook(() => useHashRoute());
    expect(result.current).toEqual({ view: 'compare' });

    act(() => { window.location.hash = '#learn'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(result.current).toEqual({ view: 'learn', mode: 'landing' });

    act(() => { window.location.hash = '#learn/ch2-contract'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(result.current).toMatchObject({ view: 'learn', mode: 'chapter', chapterSlug: 'ch2-contract' });
  });
});
