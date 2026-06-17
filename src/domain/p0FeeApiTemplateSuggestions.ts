import type { P0FeeApiEvidence, P0FeeEvidenceCandidate } from './p0FeeApiEvidence';

export interface P0FeeApiTemplateSuggestedFields {
  differenceFranchiseFeeTotalM?: number;
  recurringRoyaltyRate?: number;
  adFeeRate?: number;
  requiredPurchaseBurdenRate?: number;
  recurringCostNote?: string;
}

export interface P0FeeApiTemplateSuggestionRow {
  brandId: string;
  registeredBrandName: string;
  brandMnno: string;
  status: 'needs-review' | 'no-suggestion';
  suggestedFields: P0FeeApiTemplateSuggestedFields;
  blockers: string[];
}

export interface P0FeeApiTemplateSuggestionReport {
  readyForManualReviewInput: false;
  summary: {
    totalRows: number;
    rowsWithSuggestions: number;
  };
  rows: P0FeeApiTemplateSuggestionRow[];
}

export function buildP0FeeApiTemplateSuggestionReport(
  evidenceRows: P0FeeApiEvidence[],
): P0FeeApiTemplateSuggestionReport {
  const rows = evidenceRows.map(buildSuggestionRow);
  const rowsWithSuggestions = rows.filter((row) => Object.keys(row.suggestedFields).length > 0).length;

  return {
    readyForManualReviewInput: false,
    summary: {
      totalRows: rows.length,
      rowsWithSuggestions,
    },
    rows,
  };
}

export function formatP0FeeApiTemplateSuggestionReport(report: P0FeeApiTemplateSuggestionReport): string {
  const lines = [
    'P0 fee API template suggestions: BLOCKED',
    `Rows with suggestions: ${report.summary.rowsWithSuggestions}/${report.summary.totalRows}`,
    '',
  ];

  for (const row of report.rows) {
    lines.push(`- ${row.brandId} ${row.registeredBrandName}: ${row.status.toUpperCase().replace('-', '_')}`);
    lines.push(`  brandMnno: ${row.brandMnno}`);
    for (const [key, value] of Object.entries(row.suggestedFields)) {
      lines.push(`  ${key}: ${value}`);
    }
    if (row.blockers.length > 0) {
      lines.push(`  Blockers: ${row.blockers.join(', ')}`);
    }
  }

  return lines.join('\n');
}

function buildSuggestionRow(evidence: P0FeeApiEvidence): P0FeeApiTemplateSuggestionRow {
  const suggestedFields: P0FeeApiTemplateSuggestedFields = {};
  const blockers = new Set<string>(['FTC 원문 대조 필요', ...evidence.blockers]);

  const marginFeeTotal = parseMillionKrw(evidence.marginFeeCandidates[0]?.amountText);
  if (marginFeeTotal === undefined) {
    blockers.add('차액가맹금 숫자 후보 없음');
  } else {
    suggestedFields.differenceFranchiseFeeTotalM = marginFeeTotal;
  }

  applyRecurringRateSuggestions(evidence.recurringCostCandidates, suggestedFields, blockers);

  const noteCandidates = [...evidence.marginFeeCandidates, ...evidence.recurringCostCandidates];
  if (noteCandidates.length > 0) {
    suggestedFields.recurringCostNote = `API 후보: ${noteCandidates
      .map((candidate) => `${candidate.label}=${candidate.amountText}`)
      .join('; ')}`;
  }

  return {
    brandId: evidence.brandId,
    registeredBrandName: evidence.registeredBrandName,
    brandMnno: evidence.brandMnno,
    status: Object.keys(suggestedFields).length > 0 ? 'needs-review' : 'no-suggestion',
    suggestedFields,
    blockers: [...blockers, ...missingRateBlockers(suggestedFields)],
  };
}

function applyRecurringRateSuggestions(
  candidates: P0FeeEvidenceCandidate[],
  suggestedFields: P0FeeApiTemplateSuggestedFields,
  blockers: Set<string>,
): void {
  for (const candidate of candidates) {
    const rate = parsePercentRate(candidate.amountText);
    if (rate === undefined) {
      continue;
    }

    const label = `${candidate.label} ${candidate.target ?? ''}`;
    if (isRoyalty(label) && suggestedFields.recurringRoyaltyRate === undefined) {
      suggestedFields.recurringRoyaltyRate = rate;
    } else if (isAdFee(label) && suggestedFields.adFeeRate === undefined) {
      suggestedFields.adFeeRate = rate;
    } else if (isRequiredPurchase(label) && suggestedFields.requiredPurchaseBurdenRate === undefined) {
      suggestedFields.requiredPurchaseBurdenRate = rate;
    }
  }

  if (candidates.length === 0) {
    blockers.add('반복비용 API 후보 없음');
  }
}

function missingRateBlockers(suggestedFields: P0FeeApiTemplateSuggestedFields): string[] {
  const blockers: string[] = [];

  if (suggestedFields.recurringRoyaltyRate === undefined) {
    blockers.push('로열티 요율 후보 없음');
  }
  if (suggestedFields.adFeeRate === undefined) {
    blockers.push('광고비 요율 후보 없음');
  }
  if (suggestedFields.requiredPurchaseBurdenRate === undefined) {
    blockers.push('필수비용 요율 후보 없음');
  }

  return blockers;
}

function parseMillionKrw(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const amount = parseFirstNumber(value);
  if (amount === undefined) {
    return undefined;
  }

  if (value.includes('천원')) {
    return round(amount / 1000);
  }
  if (value.includes('만원')) {
    return round(amount / 100);
  }
  if (value.includes('백만원')) {
    return round(amount);
  }

  return undefined;
}

function parsePercentRate(value: string): number | undefined {
  const percentMatch = value.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);

  if (!percentMatch) {
    return undefined;
  }

  return round(Number(percentMatch[1]) / 100);
}

function parseFirstNumber(value: string): number | undefined {
  const match = value.replace(/,/g, '').match(/([0-9]+(?:\.[0-9]+)?)/);
  const amount = match ? Number(match[1]) : Number.NaN;

  return Number.isFinite(amount) ? amount : undefined;
}

function isRoyalty(label: string): boolean {
  return /로열티|royalty/i.test(label);
}

function isAdFee(label: string): boolean {
  return /광고|홍보|ad/i.test(label);
}

function isRequiredPurchase(label: string): boolean {
  return /필수|구매|물품|원재료|재료|purchase/i.test(label);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
