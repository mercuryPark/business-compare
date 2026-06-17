import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { normalizeP0ServiceKey, P0_SERVICE_KEY_PLACEHOLDER } from './p0ServiceKey';

const disclosureSearchEndpoint = 'https://franchise.ftc.go.kr/api/search.do';
const disclosureViewerEndpoint = 'https://franchise.ftc.go.kr/api/viewer.do';
const disclosureSerialPlaceholder = 'FTC_DISCLOSURE_SERIAL_REQUIRED';

export interface P0OfficialDisclosureApiRequestOptions {
  serviceKey?: string;
}

export interface P0OfficialDisclosureApiRequestRow {
  brandId: string;
  registeredBrandName: string;
  lookupKeyword: string;
  referenceYear: number;
  listApiUrl: string;
  titleApiUrlTemplate: string;
  contentApiUrlTemplate: string;
  viewerUrlTemplate: string;
  blockers: string[];
}

export interface P0OfficialDisclosureApiRequestPlan {
  readyToSearch: boolean;
  summary: {
    totalBrands: number;
    rowsWithServiceKey: number;
    rowsRequiringDisclosureSerial: number;
  };
  rows: P0OfficialDisclosureApiRequestRow[];
}

export function buildP0OfficialDisclosureApiRequestPlan(
  snapshots: P0GyeonggiSourceSnapshot[],
  options: P0OfficialDisclosureApiRequestOptions = {},
): P0OfficialDisclosureApiRequestPlan {
  const serviceKey = normalizeP0ServiceKey(options.serviceKey);
  const rows = snapshots.map((snapshot) => buildRequestRow(snapshot, serviceKey));
  const rowsWithServiceKey = rows.filter((row) => !row.blockers.includes('DATA_GO_KR_SERVICE_KEY 미설정')).length;

  return {
    readyToSearch: false,
    summary: {
      totalBrands: rows.length,
      rowsWithServiceKey,
      rowsRequiringDisclosureSerial: rows.length,
    },
    rows,
  };
}

export function formatP0OfficialDisclosureApiRequestPlan(plan: P0OfficialDisclosureApiRequestPlan): string {
  const lines = [
    `P0 official disclosure API requests: ${plan.readyToSearch ? 'READY' : 'BLOCKED'}`,
    `Rows with service key: ${plan.summary.rowsWithServiceKey}/${plan.summary.totalBrands}`,
    `Rows requiring disclosure serial: ${plan.summary.rowsRequiringDisclosureSerial}/${plan.summary.totalBrands}`,
    '',
  ];

  for (const row of plan.rows) {
    lines.push(`- ${row.brandId} ${row.registeredBrandName}: ${row.lookupKeyword}`);
    lines.push(`  List API: ${row.listApiUrl}`);
    lines.push(`  Title API template: ${row.titleApiUrlTemplate}`);
    lines.push(`  Content API template: ${row.contentApiUrlTemplate}`);
    lines.push(`  Viewer template: ${row.viewerUrlTemplate}`);
    lines.push(`  Blockers: ${row.blockers.join(', ')}`);
  }

  return lines.join('\n');
}

function buildRequestRow(
  snapshot: P0GyeonggiSourceSnapshot,
  serviceKey: string | undefined,
): P0OfficialDisclosureApiRequestRow {
  const blockers = ['공개본 목록에서 정보공개서 일련번호 확인 필요'];

  if (!serviceKey) {
    blockers.unshift('DATA_GO_KR_SERVICE_KEY 미설정');
  }

  return {
    brandId: snapshot.brandId,
    registeredBrandName: snapshot.registeredBrandName,
    lookupKeyword: snapshot.registeredBrandName,
    referenceYear: snapshot.referenceYear,
    listApiUrl: buildSearchUrl('list', snapshot.referenceYear, serviceKey),
    titleApiUrlTemplate: buildSerialSearchUrl('title', serviceKey),
    contentApiUrlTemplate: buildSerialSearchUrl('content', serviceKey),
    viewerUrlTemplate: buildViewerUrl(serviceKey),
    blockers,
  };
}

function buildSearchUrl(type: 'list', referenceYear: number, serviceKey: string | undefined): string {
  const params = new URLSearchParams({
    type,
    yr: String(referenceYear),
    serviceKey: serviceKey || P0_SERVICE_KEY_PLACEHOLDER,
    pageNo: '1',
    numOfRows: '200',
  });

  return `${disclosureSearchEndpoint}?${params.toString()}`;
}

function buildSerialSearchUrl(type: 'title' | 'content', serviceKey: string | undefined): string {
  const params = new URLSearchParams({
    type,
    jngIfrmpSn: disclosureSerialPlaceholder,
    serviceKey: serviceKey || P0_SERVICE_KEY_PLACEHOLDER,
  });

  return `${disclosureSearchEndpoint}?${params.toString()}`;
}

function buildViewerUrl(serviceKey: string | undefined): string {
  const params = new URLSearchParams({
    jngIfrmpSn: disclosureSerialPlaceholder,
    serviceKey: serviceKey || P0_SERVICE_KEY_PLACEHOLDER,
  });

  return `${disclosureViewerEndpoint}?${params.toString()}`;
}
