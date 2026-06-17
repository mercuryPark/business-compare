export function formatKoreanMoneyFromMillion(value: number, options: { suffix?: string } = {}): string {
  if (!Number.isFinite(value)) {
    return '계산 불가';
  }

  const sign = value < 0 ? '-' : '';
  const absolute = Math.abs(value);
  const suffix = options.suffix ?? '';

  if (absolute >= 100) {
    return `${sign}${formatEok(absolute / 100)}억 원${suffix}`;
  }

  return `${sign}${formatMan(absolute * 100)}만 원${suffix}`;
}

export function formatDecisionLabel(label: string): string {
  return label === '자료 부족' ? '판단 보류' : label;
}

function formatEok(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const formatted = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  return Number(formatted).toLocaleString('ko-KR', { maximumFractionDigits: 1 });
}

function formatMan(value: number): string {
  return Math.round(value).toLocaleString('ko-KR');
}
