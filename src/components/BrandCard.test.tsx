import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { brands } from '../domain/brands';
import { BrandCard } from './BrandCard';

describe('BrandCard', () => {
  it('leads with founder-facing fit, money, and operating signals', () => {
    render(
      <BrandCard
        brand={brands[0]}
        benchmarkBrands={brands}
        selected={false}
        compareDisabled={false}
        onSelect={vi.fn()}
        onOpen={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: '한솥도시락' })).toBeTruthy();
    expect(screen.getByText('처음 창업자가 보기 좋은 포인트')).toBeTruthy();
    expect(screen.getByText('먼저 따져볼 점')).toBeTruthy();

    const metricGroup = screen.getByRole('group', { name: '한솥도시락 핵심 숫자' });
    expect(within(metricGroup).getByText('창업비')).toBeTruthy();
    expect(within(metricGroup).getByText('1억 원')).toBeTruthy();
    expect(within(metricGroup).getByText('월매출')).toBeTruthy();
    expect(within(metricGroup).getByText('3,403만 원')).toBeTruthy();
    expect(within(metricGroup).getByText('3년 계약 변동')).toBeTruthy();
    expect(within(metricGroup).getByText('86건')).toBeTruthy();
  });

  it('does not expose internal review, warning, or raw unit language on cards', () => {
    render(
      <BrandCard
        brand={brands[0]}
        benchmarkBrands={brands}
        selected={false}
        compareDisabled={false}
        onSelect={vi.fn()}
        onOpen={vi.fn()}
      />,
    );

    for (const copy of ['원문 검토 필요', '원문 대조 전', 'P0', '경고', '자료 부족', '100만 원 단위', '백만원']) {
      expect(screen.queryByText(copy, { exact: false })).toBeNull();
    }
  });
});
