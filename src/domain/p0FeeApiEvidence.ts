import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { buildP0FeeApiRequestPlan } from './p0FeeApiRequests';
import type { FetchJson } from './p0FeeApiFetch';
import { normalizeP0ServiceKey } from './p0ServiceKey';

export type P0FeeApiEvidenceSource = 'franchise-fee-api' | 'other-cost-api';

export interface P0FeeEvidenceCandidate {
  source: P0FeeApiEvidenceSource;
  label: string;
  amountText: string;
  target?: string;
  deadline?: string;
  raw: string;
}

export interface P0FeeApiEvidenceInput {
  brandId: string;
  registeredBrandName: string;
  brandMnno: string;
  franchiseFeeResponse: unknown;
  otherCostResponse: unknown;
}

export interface P0FeeApiEvidence {
  brandId: string;
  registeredBrandName: string;
  brandMnno: string;
  readyForReviewRecord: boolean;
  brandConfirmationRequired: boolean;
  marginFeeCandidates: P0FeeEvidenceCandidate[];
  recurringCostCandidates: P0FeeEvidenceCandidate[];
  blockers: string[];
}

export interface P0FeeApiEvidenceFetchOptions {
  serviceKey?: string;
  fetchJson?: FetchJson;
}

interface SafeFetchResult {
  response: unknown;
  blocker?: string;
}

export function createP0FeeApiEvidence(input: P0FeeApiEvidenceInput): P0FeeApiEvidence {
  const franchiseFeeItems = extractItems(input.franchiseFeeResponse);
  const otherCostItems = extractItems(input.otherCostResponse);

  return {
    brandId: input.brandId,
    registeredBrandName: input.registeredBrandName,
    brandMnno: input.brandMnno,
    readyForReviewRecord: false,
    brandConfirmationRequired: true,
    marginFeeCandidates: franchiseFeeItems
      .filter((item) => String(item.jngAmtSeNm ?? '').includes('차액'))
      .map(toMarginFeeCandidate),
    recurringCostCandidates: otherCostItems.map(toRecurringCostCandidate),
    blockers: ['API 반환 브랜드명/원문 대조 필요', '수동 리뷰 기록 반영 필요'],
  };
}

export async function fetchP0FeeApiEvidenceRows(
  snapshots: P0GyeonggiSourceSnapshot[],
  options: P0FeeApiEvidenceFetchOptions = {},
): Promise<P0FeeApiEvidence[]> {
  const serviceKey = normalizeP0ServiceKey(options.serviceKey);

  if (!serviceKey) {
    return [];
  }

  const fetchJson = options.fetchJson ?? defaultFetchJson;
  const plan = buildP0FeeApiRequestPlan(snapshots, { serviceKey });
  const evidenceRows: P0FeeApiEvidence[] = [];

  for (const row of plan.rows) {
    const [franchiseFeeFetch, otherCostFetch] = await Promise.all([
      safeFetchJson(fetchJson, row.franchiseFeeApiUrl, 'Franchise fee'),
      safeFetchJson(fetchJson, row.otherCostApiUrl, 'Other-cost'),
    ]);
    const evidence = createP0FeeApiEvidence({
      brandId: row.brandId,
      registeredBrandName: row.registeredBrandName,
      brandMnno: row.brandMnno,
      franchiseFeeResponse: franchiseFeeFetch.response,
      otherCostResponse: otherCostFetch.response,
    });

    if (franchiseFeeFetch.blocker) {
      evidence.blockers.unshift(franchiseFeeFetch.blocker);
    }
    if (otherCostFetch.blocker) {
      evidence.blockers.unshift(otherCostFetch.blocker);
    }

    evidenceRows.push(evidence);
  }

  return evidenceRows;
}

export function formatP0FeeApiEvidenceReport(evidenceRows: P0FeeApiEvidence[]): string {
  const totalMarginFeeCandidates = evidenceRows.reduce((sum, row) => sum + row.marginFeeCandidates.length, 0);
  const totalRecurringCostCandidates = evidenceRows.reduce((sum, row) => sum + row.recurringCostCandidates.length, 0);
  const lines = [
    'P0 fee API evidence: BLOCKED',
    `Brands: ${evidenceRows.length}`,
    `Margin fee candidates: ${totalMarginFeeCandidates}`,
    `Recurring cost candidates: ${totalRecurringCostCandidates}`,
    '',
  ];

  for (const evidence of evidenceRows) {
    lines.push(`- ${evidence.brandId} ${evidence.registeredBrandName}: ${evidence.brandMnno}`);
    for (const candidate of evidence.marginFeeCandidates) {
      lines.push(`  Margin: ${candidate.label} -> ${candidate.amountText}`);
    }
    for (const candidate of evidence.recurringCostCandidates) {
      lines.push(`  Recurring: ${candidate.label} -> ${candidate.amountText}`);
    }
    lines.push(`  Blockers: ${evidence.blockers.join(', ')}`);
  }

  return lines.join('\n');
}

function toMarginFeeCandidate(item: Record<string, unknown>): P0FeeEvidenceCandidate {
  return {
    source: 'franchise-fee-api',
    label: String(item.jngAmtSeNm ?? '가맹금 구분 미확인'),
    amountText: String(item.jngAmtScopeVal ?? '금액 미확인'),
    deadline: item.jngAmtGiveDdlnDateCn ? String(item.jngAmtGiveDdlnDateCn) : undefined,
    raw: JSON.stringify(item),
  };
}

function toRecurringCostCandidate(item: Record<string, unknown>): P0FeeEvidenceCandidate {
  return {
    source: 'other-cost-api',
    label: String(item.othctSeNm ?? '기타비용 구분 미확인'),
    amountText: String(item.giveAmtCn ?? item.crtraArAmtScopeVal ?? '금액 미확인'),
    target: item.ctGiveTrgtNm ? String(item.ctGiveTrgtNm) : undefined,
    deadline: item.ctGiveDdlnDateCn ? String(item.ctGiveDdlnDateCn) : undefined,
    raw: JSON.stringify(item),
  };
}

function extractItems(response: unknown): Record<string, unknown>[] {
  const body = (response as { response?: { body?: { items?: unknown } } }).response?.body;
  const items = body?.items;

  if (Array.isArray(items)) {
    return items.filter(isRecord);
  }

  if (isRecord(items)) {
    return [items];
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

async function defaultFetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}

async function safeFetchJson(fetchJson: FetchJson, url: string, label: string): Promise<SafeFetchResult> {
  try {
    return {
      response: await fetchJson(url),
    };
  } catch (error) {
    return {
      response: {},
      blocker: `${label} fetch 실패: ${getErrorMessage(error)}`,
    };
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
