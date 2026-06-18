import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LearnSource } from '../../../domain/learn/types';
import { LearnSourcesProvider } from './sourceContext';
import { Callout } from './Callout';
import { HiddenCostList } from './HiddenCostList';
import { CtaLink } from './CtaLink';
import { SourceBackedTable } from './SourceBackedTable';
import { CashflowCalendar } from './CashflowCalendar';
import { MoneyScenario } from './MoneyScenario';
import { CashflowWaterfall } from './CashflowWaterfall';

const src: LearnSource = {
  id: 's', category: 'tax', sourceTitle: '국세청', sourceUrl: 'https://nts.go.kr',
  lastCheckedAt: '2026-06-17', reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('presentational primitives', () => {
  it('Callout renders children', () => {
    render(<Callout tone="warning">조심하세요</Callout>);
    expect(screen.getByText('조심하세요')).toBeTruthy();
  });

  it('HiddenCostList renders items', () => {
    render(<HiddenCostList items={['폐기 로스', '카드 수수료']} />);
    expect(screen.getByText('폐기 로스')).toBeTruthy();
  });

  it('CtaLink renders an arrowed link', () => {
    render(<CtaLink href="#compare">브랜드 비교하기</CtaLink>);
    expect(screen.getByRole('link', { name: /브랜드 비교하기/ })).toHaveAttribute('href', '#compare');
  });

  it('SourceBackedTable renders rows and resolves its source', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <SourceBackedTable caption="초기비용" rows={[{ label: '가맹비', value: '1,000만 원' }]} sourceId="s" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('가맹비')).toBeTruthy();
    expect(screen.getByText('국세청')).toBeTruthy();
  });

  it('CashflowCalendar surfaces tax/insurance timing', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <CashflowCalendar entries={[{ month: '5월', item: '종합소득세' }]} sourceId="s" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('5월')).toBeTruthy();
    expect(screen.getByText('종합소득세')).toBeTruthy();
  });

  it('MoneyScenario renders its fields and resolves its source', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <MoneyScenario
          title="치킨집 손익"
          monthlySales="3,000만 원"
          lines={[{ label: '재료비', amount: '1,000만 원' }]}
          takeHome="300만 원"
          sourceId="s"
        />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('치킨집 손익')).toBeTruthy();
    expect(screen.getByText('국세청')).toBeTruthy();
  });

  it('MoneyScenario throws on a missing sourceId', () => {
    expect(() =>
      render(
        <LearnSourcesProvider sources={[]}>
          <MoneyScenario title="x" monthlySales="0" lines={[]} takeHome="0" sourceId="missing" />
        </LearnSourcesProvider>,
      ),
    ).toThrow(/Unknown learn sourceId/);
  });

  it('CashflowWaterfall renders its steps and resolves its source', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <CashflowWaterfall
          steps={[{ label: '월매출', amount: '3,000만 원', kind: 'start' }]}
          sourceId="s"
        />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('월매출')).toBeTruthy();
    expect(screen.getByText('국세청')).toBeTruthy();
  });

  it('CashflowWaterfall throws on a missing sourceId', () => {
    expect(() =>
      render(
        <LearnSourcesProvider sources={[]}>
          <CashflowWaterfall steps={[]} sourceId="missing" />
        </LearnSourcesProvider>,
      ),
    ).toThrow(/Unknown learn sourceId/);
  });

  it('SourceBackedTable shows the illustrative badge when illustrative is true', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <SourceBackedTable caption="예시" rows={[{ label: '가맹비', value: '1,000만 원' }]} sourceId="s" illustrative />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('교육용 예시 — 실제 통계 아님')).toBeTruthy();
  });

  it('SourceBackedTable hides the illustrative badge by default', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <SourceBackedTable caption="공식" rows={[{ label: '가맹비', value: '1,000만 원' }]} sourceId="s" />
      </LearnSourcesProvider>,
    );
    expect(screen.queryByText('교육용 예시 — 실제 통계 아님')).toBeNull();
  });

  it('source-bound primitive throws on a missing sourceId', () => {
    expect(() =>
      render(
        <LearnSourcesProvider sources={[]}>
          <SourceBackedTable caption="x" rows={[]} sourceId="missing" />
        </LearnSourcesProvider>,
      ),
    ).toThrow(/Unknown learn sourceId/);
  });
});
