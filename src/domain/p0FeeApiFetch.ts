import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { buildP0FeeApiRequestPlan } from './p0FeeApiRequests';
import { normalizeP0ServiceKey } from './p0ServiceKey';

export type FetchJson = (url: string) => Promise<unknown>;

export interface P0FeeApiFetchOptions {
  serviceKey?: string;
  fetchJson?: FetchJson;
}

export interface P0FeeApiFetchRow {
  brandId: string;
  registeredBrandName: string;
  brandMnno: string;
  franchiseFeeItemCount: number;
  otherCostItemCount: number;
  blockers: string[];
}

interface SafeFetchResult {
  response: unknown;
  blocker?: string;
}

export interface P0FeeApiFetchReport {
  readyForReviewRecordInput: boolean;
  summary: {
    totalBrands: number;
    fetchedBrands: number;
    blockedBrands: number;
  };
  rows: P0FeeApiFetchRow[];
}

export async function fetchP0FeeApiEvidence(
  snapshots: P0GyeonggiSourceSnapshot[],
  options: P0FeeApiFetchOptions = {},
): Promise<P0FeeApiFetchReport> {
  const serviceKey = normalizeP0ServiceKey(options.serviceKey);
  const plan = buildP0FeeApiRequestPlan(snapshots, { serviceKey });
  const hasServiceKey = Boolean(serviceKey);
  const fetchJson = options.fetchJson ?? defaultFetchJson;
  const rows: P0FeeApiFetchRow[] = [];

  for (const planned of plan.rows) {
    if (!hasServiceKey) {
      rows.push({
        brandId: planned.brandId,
        registeredBrandName: planned.registeredBrandName,
        brandMnno: planned.brandMnno,
        franchiseFeeItemCount: 0,
        otherCostItemCount: 0,
        blockers: planned.blockers,
      });
      continue;
    }

    const [franchiseFeeFetch, otherCostFetch] = await Promise.all([
      safeFetchJson(fetchJson, planned.franchiseFeeApiUrl, 'Franchise fee'),
      safeFetchJson(fetchJson, planned.otherCostApiUrl, 'Other-cost'),
    ]);
    const blockers = ['API 반환 브랜드명/원문 대조 필요', '수동 리뷰 기록 반영 필요'];
    if (franchiseFeeFetch.blocker) {
      blockers.unshift(franchiseFeeFetch.blocker);
    }
    if (otherCostFetch.blocker) {
      blockers.unshift(otherCostFetch.blocker);
    }

    rows.push({
      brandId: planned.brandId,
      registeredBrandName: planned.registeredBrandName,
      brandMnno: planned.brandMnno,
      franchiseFeeItemCount: extractItemCount(franchiseFeeFetch.response),
      otherCostItemCount: extractItemCount(otherCostFetch.response),
      blockers,
    });
  }

  const fetchedBrands = rows.filter((row) => row.franchiseFeeItemCount + row.otherCostItemCount > 0).length;

  return {
    readyForReviewRecordInput: false,
    summary: {
      totalBrands: rows.length,
      fetchedBrands,
      blockedBrands: rows.length,
    },
    rows,
  };
}

export function formatP0FeeApiFetchReport(report: P0FeeApiFetchReport): string {
  const lines = [
    `P0 fee API fetch: ${report.readyForReviewRecordInput ? 'READY' : 'BLOCKED'}`,
    `Fetched brands: ${report.summary.fetchedBrands}/${report.summary.totalBrands}`,
    `Blocked brands: ${report.summary.blockedBrands}`,
    '',
  ];

  for (const row of report.rows) {
    lines.push(`- ${row.brandId} ${row.registeredBrandName}: ${row.brandMnno}`);
    lines.push(`  Franchise fee items: ${row.franchiseFeeItemCount}`);
    lines.push(`  Other-cost items: ${row.otherCostItemCount}`);
    lines.push(`  Blockers: ${row.blockers.join(', ')}`);
  }

  return lines.join('\n');
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

function extractItemCount(response: unknown): number {
  const body = (response as { response?: { body?: { items?: unknown } } }).response?.body;
  const items = body?.items;

  if (Array.isArray(items)) {
    return items.length;
  }

  if (items && typeof items === 'object') {
    return 1;
  }

  return 0;
}
