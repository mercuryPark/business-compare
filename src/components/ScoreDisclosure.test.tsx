import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { brands } from '../domain/brands';
import type { Brand } from '../domain/types';
import { BrandCard } from './BrandCard';
import { BrandDetail } from './BrandDetail';
import { ComparePanel } from './ComparePanel';

function verifiedBrand(id: string): Brand {
  const brand = structuredClone(brands.find((item) => item.id === id));
  expect(brand).toBeDefined();
  brand!.audit.p0Verified = true;
  brand!.audit.verificationStatus = 'verified';
  brand!.audit.reviewer = 'qa';
  brand!.audit.lastVerifiedAt = '2026-06-15';
  return brand!;
}

describe('founder-facing score disclosure policy', () => {
  it('keeps scoring and review labels off repeated brand cards', () => {
    const brand = verifiedBrand('hansot');
    const benchmarkBrands = [brand, verifiedBrand('bondosirak')];

    render(
      <BrandCard
        brand={brand}
        benchmarkBrands={benchmarkBrands}
        selected={false}
        compareDisabled={false}
        onSelect={vi.fn()}
        onOpen={vi.fn()}
      />,
    );

    expect(screen.getByText('처음 비교하기 좋음')).toBeTruthy();
    expect(screen.queryByText('판단 보류')).toBeNull();
    expect(screen.queryByText('업종 표본 부족으로 참고용')).toBeNull();
  });

  it('uses a learning report instead of score reasons in the expanded detail report', () => {
    const brand = verifiedBrand('hansot');
    const benchmarkBrands = [brand, verifiedBrand('bondosirak')];

    render(<BrandDetail brand={brand} benchmarkBrands={benchmarkBrands} expanded={true} onToggle={vi.fn()} />);

    const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
    expect(within(report).getByRole('heading', { level: 3, name: '이 브랜드를 읽는 순서' })).toBeTruthy();
    expect(within(report).getByRole('heading', { level: 3, name: '상담 전 질문' })).toBeTruthy();
    expect(within(report).queryByText('판단 보류')).toBeNull();
    expect(within(report).queryByText('업종 표본 부족으로 참고용')).toBeNull();
  });

  it('compares practical operating signals instead of score reasons in the compare table', () => {
    const brand = verifiedBrand('hansot');
    const peer = verifiedBrand('bondosirak');

    render(<ComparePanel brands={[brand, peer]} benchmarkBrands={[brand, peer]} />);

    const rows = screen.getAllByRole('row');
    const hansotRow = rows.find((row) => within(row).queryByText('한솥도시락'));
    expect(hansotRow).toBeDefined();
    expect(within(hansotRow!).getByText('처음 비교하기 좋음')).toBeTruthy();
    expect(within(hansotRow!).getByText('식사 시간 집중형 운영')).toBeTruthy();
    expect(within(hansotRow!).queryByText('판단 보류')).toBeNull();
  });
});
