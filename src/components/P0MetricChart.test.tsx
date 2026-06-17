import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { brands } from '../domain/brands';
import { P0MetricChart } from './P0MetricChart';

describe('P0MetricChart', () => {
  it('explains mixed units and the interpretation direction for each metric', () => {
    render(<P0MetricChart brand={brands[0]} />);

    const interpretation = screen.getByRole('note', { name: '차트 해석 기준' });

    expect(within(interpretation).getByText('단위 혼합 주의')).toBeTruthy();
    expect(within(interpretation).getByText(/막대 길이는 서로 다른 지표 간 순위가 아닙니다/)).toBeTruthy();
    expect(within(interpretation).getByText('창업비 낮을수록 유리')).toBeTruthy();
    expect(within(interpretation).getByText('평균매출 높을수록 유리')).toBeTruthy();
    expect(within(interpretation).getByText('3년 신규 높을수록 유리')).toBeTruthy();
    expect(within(interpretation).getByText('계약종료/해지 낮을수록 유리')).toBeTruthy();
  });

  it('renders money values in readable Korean won units', () => {
    render(<P0MetricChart brand={brands[0]} />);

    expect(screen.getByText('창업비 1억 원')).toBeTruthy();
    expect(screen.getByText('평균매출 4.1억 원/년')).toBeTruthy();
    expect(screen.queryByText(/100백만원/)).toBeNull();
  });
});
