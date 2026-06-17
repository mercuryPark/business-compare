import { describe, expect, it } from 'vitest';

import { formatKoreanMoneyFromMillion } from '../formatters';

describe('Korean display formatters', () => {
  it('formats million-KRW values as readable won units instead of 백만원 labels', () => {
    expect(formatKoreanMoneyFromMillion(100)).toBe('1억 원');
    expect(formatKoreanMoneyFromMillion(408, { suffix: '/년' })).toBe('4.1억 원/년');
    expect(formatKoreanMoneyFromMillion(78)).toBe('7,800만 원');
    expect(formatKoreanMoneyFromMillion(34, { suffix: ' 매출 기준' })).toBe('3,400만 원 매출 기준');
    expect(formatKoreanMoneyFromMillion(-2.2)).toBe('-220만 원');
  });

  it('returns a friendly fallback for invalid money values', () => {
    expect(formatKoreanMoneyFromMillion(Number.NaN)).toBe('계산 불가');
  });
});
