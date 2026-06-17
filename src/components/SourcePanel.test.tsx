import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { brands } from '../domain/brands';
import { SourcePanel } from './SourcePanel';

describe('SourcePanel', () => {
  it('hides numeric QA warnings when P0 numbers are within guardrails', () => {
    render(<SourcePanel brand={brands[0]} />);

    expect(screen.queryByText('숫자 검수 경고')).toBeNull();
  });

  it('shows each P0 checklist item with source and review flags', () => {
    const brand = brands.find((item) => item.id === 'hansot');
    expect(brand).toBeDefined();

    render(<SourcePanel brand={brand!} />);

    const checklist = screen.getByRole('list', { name: 'P0 검증 체크리스트' });
    expect(within(checklist).getByText('초기비용')).toBeTruthy();
    expect(within(checklist).getAllByText('부분 검증').length).toBeGreaterThan(0);
    expect(within(checklist).getAllByText('출처 1개').length).toBeGreaterThan(0);
    expect(within(checklist).getAllByText('원문 대조 전').length).toBeGreaterThan(0);
    expect(within(checklist).getAllByText('교차확인 전').length).toBeGreaterThan(0);
    expect(within(checklist).getByText('차액가맹금 총액')).toBeTruthy();
    expect(within(checklist).getAllByText('미검증').length).toBeGreaterThan(0);
    expect(within(checklist).getAllByText('출처 0개').length).toBeGreaterThan(0);
  });

  it('summarizes cross-check readiness separately from missing sources', () => {
    const brand = brands.find((item) => item.id === 'hansot');
    expect(brand).toBeDefined();

    render(<SourcePanel brand={brand!} />);

    const summary = screen.getByRole('group', { name: 'P0 교차확인 요약' });
    expect(within(summary).getByText('교차확인 완료')).toBeTruthy();
    expect(within(summary).getByText('0/7')).toBeTruthy();
    expect(within(summary).getByText('교차확인 가능')).toBeTruthy();
    expect(within(summary).getByText('0개')).toBeTruthy();
    expect(within(summary).getByText('1차 출처만')).toBeTruthy();
    expect(within(summary).getByText('5개')).toBeTruthy();
    expect(within(summary).getByText('출처 없음')).toBeTruthy();
    expect(within(summary).getByText('2개')).toBeTruthy();
  });

  it('surfaces numeric QA warnings for likely unit typos', () => {
    const brand = structuredClone(brands[0]);
    brand.sales.averageAnnualSalesM = brand.sales.averageAnnualSalesM * 1000;
    brand.cost.otherStartupM = brand.cost.otherStartupM + 10;

    render(<SourcePanel brand={brand} />);

    expect(screen.getByText('숫자 검수 경고')).toBeTruthy();
    expect(screen.getByText('평균매출 단위 확인 필요')).toBeTruthy();
    expect(screen.getByText('창업비 구성 합계 불일치')).toBeTruthy();
  });
});
