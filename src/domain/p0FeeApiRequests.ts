import type { P0GyeonggiSourceSnapshot } from './p0SourceSnapshots';
import { normalizeP0ServiceKey, P0_SERVICE_KEY_PLACEHOLDER } from './p0ServiceKey';

const franchiseFeeEndpoint =
  'https://apis.data.go.kr/1130000/FftcbrandfrcsjnntinfoService/getbrandFrcsJnntinfo';
const otherCostEndpoint =
  'https://apis.data.go.kr/1130000/FftcbrandfrcsbzmnothctinfoService/getbrandFrcsBzmnOthctinfo';

export interface P0FeeApiRequestOptions {
  serviceKey?: string;
}

export interface P0FeeApiRequestRow {
  brandId: string;
  registeredBrandName: string;
  frnchsNo: string;
  brandMnno: string;
  referenceYear: number;
  franchiseFeeApiUrl: string;
  otherCostApiUrl: string;
  blockers: string[];
}

export interface P0FeeApiRequestPlan {
  readyToFetch: boolean;
  summary: {
    totalBrands: number;
    rowsWithServiceKey: number;
    rowsRequiringBrandConfirmation: number;
  };
  rows: P0FeeApiRequestRow[];
}

export function buildP0FeeApiRequestPlan(
  snapshots: P0GyeonggiSourceSnapshot[],
  options: P0FeeApiRequestOptions = {},
): P0FeeApiRequestPlan {
  const serviceKey = normalizeP0ServiceKey(options.serviceKey);
  const rows = snapshots.map((snapshot) => buildP0FeeApiRequestRow(snapshot, serviceKey));
  const rowsWithServiceKey = rows.filter((row) => !row.blockers.includes('DATA_GO_KR_SERVICE_KEY 미설정')).length;

  return {
    readyToFetch: false,
    summary: {
      totalBrands: rows.length,
      rowsWithServiceKey,
      rowsRequiringBrandConfirmation: rows.length,
    },
    rows,
  };
}

export function formatP0FeeApiRequestPlan(plan: P0FeeApiRequestPlan): string {
  const lines = [
    `P0 fee API requests: ${plan.readyToFetch ? 'READY' : 'BLOCKED'}`,
    `Rows with service key: ${plan.summary.rowsWithServiceKey}/${plan.summary.totalBrands}`,
    `Rows requiring brand confirmation: ${plan.summary.rowsRequiringBrandConfirmation}/${plan.summary.totalBrands}`,
    '',
  ];

  for (const row of plan.rows) {
    lines.push(`- ${row.brandId} ${row.registeredBrandName}: ${row.brandMnno}`);
    lines.push(`  Franchise fee API: ${row.franchiseFeeApiUrl}`);
    lines.push(`  Other-cost API: ${row.otherCostApiUrl}`);
    lines.push(`  Blockers: ${row.blockers.join(', ')}`);
  }

  return lines.join('\n');
}

function buildP0FeeApiRequestRow(
  snapshot: P0GyeonggiSourceSnapshot,
  serviceKey: string | undefined,
): P0FeeApiRequestRow {
  const brandMnno = `BRD_${snapshot.frnchsNo}`;
  const blockers = ['API 반환 브랜드명/원문 대조 필요'];

  if (!serviceKey) {
    blockers.unshift('DATA_GO_KR_SERVICE_KEY 미설정');
  }

  return {
    brandId: snapshot.brandId,
    registeredBrandName: snapshot.registeredBrandName,
    frnchsNo: snapshot.frnchsNo,
    brandMnno,
    referenceYear: snapshot.referenceYear,
    franchiseFeeApiUrl: buildApiUrl(franchiseFeeEndpoint, snapshot.referenceYear, brandMnno, serviceKey),
    otherCostApiUrl: buildApiUrl(otherCostEndpoint, snapshot.referenceYear, brandMnno, serviceKey),
    blockers,
  };
}

function buildApiUrl(endpoint: string, referenceYear: number, brandMnno: string, serviceKey: string | undefined): string {
  const params = new URLSearchParams({
    serviceKey: serviceKey || P0_SERVICE_KEY_PLACEHOLDER,
    pageNo: '1',
    numOfRows: '100',
    resultType: 'json',
    jngBizCrtraYr: String(referenceYear),
    brandMnno,
  });

  return `${endpoint}?${params.toString()}`;
}
