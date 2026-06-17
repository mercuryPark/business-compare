import { buildP0OfficialDisclosureApiRequestPlan } from './p0OfficialDisclosureApiRequests';
import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { normalizeP0ServiceKey } from './p0ServiceKey';

export type FetchText = (url: string) => Promise<string>;

export interface P0OfficialDisclosureApiFetchOptions {
  serviceKey?: string;
  fetchText?: FetchText;
}

export interface P0OfficialDisclosureCandidate {
  disclosureSerial: string;
  brandName: string;
  corporationName: string;
  businessRegistrationNumber: string;
  registrationNumber: string;
  viewerUrl: string;
  raw: string;
}

export interface P0OfficialDisclosureFetchRow {
  brandId: string;
  registeredBrandName: string;
  lookupKeyword: string;
  candidateCount: number;
  candidates: P0OfficialDisclosureCandidate[];
  blockers: string[];
}

export interface P0OfficialDisclosureFetchReport {
  readyForManualReviewUrlInput: boolean;
  summary: {
    totalBrands: number;
    fetchedBrands: number;
    matchedBrands: number;
    blockedBrands: number;
  };
  rows: P0OfficialDisclosureFetchRow[];
}

interface SafeFetchTextResult {
  text: string;
  blocker?: string;
}

export async function fetchP0OfficialDisclosureCandidates(
  snapshots: P0GyeonggiSourceSnapshot[],
  options: P0OfficialDisclosureApiFetchOptions = {},
): Promise<P0OfficialDisclosureFetchReport> {
  const serviceKey = normalizeP0ServiceKey(options.serviceKey);
  const plan = buildP0OfficialDisclosureApiRequestPlan(snapshots, { serviceKey });
  const fetchText = options.fetchText ?? defaultFetchText;
  const candidateCache = new Map<number, SafeDisclosureListResult>();
  const rows: P0OfficialDisclosureFetchRow[] = [];

  for (const planned of plan.rows) {
    if (!serviceKey) {
      rows.push({
        brandId: planned.brandId,
        registeredBrandName: planned.registeredBrandName,
        lookupKeyword: planned.lookupKeyword,
        candidateCount: 0,
        candidates: [],
        blockers: planned.blockers,
      });
      continue;
    }

    const listResult =
      candidateCache.get(planned.referenceYear) ??
      (await fetchDisclosureListCandidates(fetchText, planned.listApiUrl, planned.referenceYear));
    candidateCache.set(planned.referenceYear, listResult);
    const candidates = findDisclosureCandidates(listResult.candidates, planned.lookupKeyword);
    const blockers = ['정보공개서 원문 URL 수동 입력 필요', 'API 후보와 FTC 원문 수동 대조 필요'];

    for (const blocker of listResult.blockers) {
      blockers.unshift(blocker);
    }
    if (candidates.length === 0) {
      blockers.unshift('공개본 목록에서 브랜드 후보 미발견');
    }

    rows.push({
      brandId: planned.brandId,
      registeredBrandName: planned.registeredBrandName,
      lookupKeyword: planned.lookupKeyword,
      candidateCount: candidates.length,
      candidates,
      blockers,
    });
  }

  const fetchedBrands = rows.filter((row) => !row.blockers.includes('DATA_GO_KR_SERVICE_KEY 미설정')).length;
  const matchedBrands = rows.filter((row) => row.candidateCount > 0).length;

  return {
    readyForManualReviewUrlInput: false,
    summary: {
      totalBrands: rows.length,
      fetchedBrands,
      matchedBrands,
      blockedBrands: rows.length,
    },
    rows,
  };
}

interface SafeDisclosureListResult {
  candidates: P0OfficialDisclosureCandidate[];
  blockers: string[];
}

export function formatP0OfficialDisclosureFetchReport(report: P0OfficialDisclosureFetchReport): string {
  const lines = [
    `P0 official disclosure API fetch: ${report.readyForManualReviewUrlInput ? 'READY' : 'BLOCKED'}`,
    `Fetched brands: ${report.summary.fetchedBrands}/${report.summary.totalBrands}`,
    `Matched brands: ${report.summary.matchedBrands}/${report.summary.totalBrands}`,
    `Blocked brands: ${report.summary.blockedBrands}`,
    '',
  ];

  for (const row of report.rows) {
    lines.push(`- ${row.brandId} ${row.registeredBrandName}: ${row.candidateCount} candidates`);
    for (const candidate of row.candidates) {
      lines.push(`  Candidate: ${candidate.disclosureSerial} ${candidate.brandName} / ${candidate.corporationName}`);
      lines.push(`  Viewer: ${candidate.viewerUrl}`);
    }
    lines.push(`  Blockers: ${row.blockers.join(', ')}`);
  }

  return lines.join('\n');
}

function findDisclosureCandidates(
  candidates: P0OfficialDisclosureCandidate[],
  lookupKeyword: string,
): P0OfficialDisclosureCandidate[] {
  const normalizedKeyword = normalizeSearchText(lookupKeyword);

  return candidates.filter((candidate) => {
    const brandName = normalizeSearchText(candidate.brandName);
    const corporationName = normalizeSearchText(candidate.corporationName);
    return brandName.includes(normalizedKeyword) || normalizedKeyword.includes(brandName) || corporationName.includes(normalizedKeyword);
  });
}

function parseDisclosureItems(xml: string): P0OfficialDisclosureCandidate[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const raw = match[1] ?? '';

    return {
      disclosureSerial: readXmlTag(raw, 'jngIfrmpSn'),
      brandName: readXmlTag(raw, 'brandNm'),
      corporationName: readXmlTag(raw, 'corpNm'),
      businessRegistrationNumber: readXmlTag(raw, 'brno'),
      registrationNumber: readXmlTag(raw, 'jngIfrmpRgsno'),
      viewerUrl: decodeXmlEntities(readXmlTag(raw, 'viwerUrl')),
      raw: `<item>${raw}</item>`,
    };
  });
}

async function fetchDisclosureListCandidates(
  fetchText: FetchText,
  pageOneUrl: string,
  referenceYear: number,
): Promise<SafeDisclosureListResult> {
  const pageOne = await safeFetchText(fetchText, pageOneUrl);
  const candidates = parseDisclosureItems(pageOne.text);
  const blockers = pageOne.blocker ? [pageOne.blocker] : [];
  const totalCount = readXmlNumber(pageOne.text, 'totalCount');
  const numOfRows = readUrlNumber(pageOneUrl, 'numOfRows') ?? 200;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / numOfRows) : 1;

  for (let pageNo = 2; pageNo <= totalPages; pageNo += 1) {
    const pageUrl = withPageNo(pageOneUrl, pageNo);
    const page = await safeFetchText(fetchText, pageUrl);
    candidates.push(...parseDisclosureItems(page.text));
    if (page.blocker) {
      blockers.push(`Disclosure list ${referenceYear} page ${pageNo} fetch 실패: ${page.blocker}`);
    }
  }

  return {
    candidates,
    blockers,
  };
}

function readXmlTag(xml: string, tagName: string): string {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));
  return decodeXmlEntities(match?.[1]?.trim() ?? '');
}

function readXmlNumber(xml: string, tagName: string): number {
  const value = Number(readXmlTag(xml, tagName));
  return Number.isFinite(value) ? value : 0;
}

function readUrlNumber(url: string, key: string): number | undefined {
  const value = Number(new URL(url).searchParams.get(key));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function withPageNo(url: string, pageNo: number): string {
  const parsed = new URL(url);
  parsed.searchParams.set('pageNo', String(pageNo));
  return parsed.toString();
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[^0-9a-z가-힣]/g, '');
}

async function defaultFetchText(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}

async function safeFetchText(fetchText: FetchText, url: string): Promise<SafeFetchTextResult> {
  try {
    return {
      text: await fetchText(url),
    };
  } catch (error) {
    return {
      text: '',
      blocker: `Disclosure list fetch 실패: ${getErrorMessage(error)}`,
    };
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
