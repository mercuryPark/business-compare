import type { P0Metric, VerificationStatus } from './types';
import type { P0ManualReviewRecord, P0ReviewMetricRecord } from './p0ReviewRecords';
import { P0_REQUIRED_METRICS, getP0MetricLabel } from './qa';
import {
  auditP0ManualReviewTemplateFiles,
  type P0ManualReviewTemplateAuditRow,
} from './p0ManualReviewTemplateAudit';
import type { P0ManualReviewTemplateFile } from './p0ManualReviewTemplates';

export interface P0ManualReviewTemplateParseResult {
  brandId: string;
  brandName: string;
  status: 'importable' | 'blocked';
  path: string;
  blockers: string[];
  record?: P0ManualReviewRecord;
}

export interface P0ManualReviewTemplateImportReport {
  ready: boolean;
  summary: {
    totalBrandFiles: number;
    importableRecords: number;
    blockedFiles: number;
  };
  rows: P0ManualReviewTemplateParseResult[];
}

const metricLabels: Record<string, P0Metric> = Object.fromEntries(
  P0_REQUIRED_METRICS.map((metric) => [getP0MetricLabel(metric), metric]),
) as Record<string, P0Metric>;

export function importP0ManualReviewTemplateFiles(
  files: P0ManualReviewTemplateFile[],
): P0ManualReviewTemplateImportReport {
  const rows = files.filter((file) => !file.path.endsWith('/README.md')).map(parseP0ManualReviewTemplateFile);
  const importableRecords = rows.filter((row) => row.status === 'importable').length;

  return {
    ready: importableRecords === rows.length,
    summary: {
      totalBrandFiles: rows.length,
      importableRecords,
      blockedFiles: rows.length - importableRecords,
    },
    rows,
  };
}

export function formatP0ManualReviewTemplateImportReport(report: P0ManualReviewTemplateImportReport): string {
  const lines = [
    `P0 manual review template import: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `Importable records: ${report.summary.importableRecords}/${report.summary.totalBrandFiles}`,
    '',
  ];

  for (const row of report.rows) {
    lines.push(`- ${row.brandId} ${row.brandName}: ${row.status.toUpperCase()}`);
    lines.push(`  Path: ${row.path}`);
    if (row.blockers.length > 0) {
      lines.push(`  Blockers: ${row.blockers.join(', ')}`);
    }
  }

  return lines.join('\n');
}

export function parseP0ManualReviewTemplateFile(
  file: P0ManualReviewTemplateFile,
): P0ManualReviewTemplateParseResult {
  const auditRow = auditP0ManualReviewTemplateFiles([file]).rows[0] ?? fallbackAuditRow(file);

  if (auditRow.blockers.length > 0) {
    return {
      brandId: auditRow.brandId,
      brandName: auditRow.brandName,
      status: 'blocked',
      path: file.path,
      blockers: auditRow.blockers,
    };
  }

  const blockers: string[] = [];
  const record = buildRecord(file, auditRow, blockers);

  return {
    brandId: auditRow.brandId,
    brandName: auditRow.brandName,
    status: blockers.length === 0 ? 'importable' : 'blocked',
    path: file.path,
    blockers,
    record: blockers.length === 0 ? record : undefined,
  };
}

function buildRecord(
  file: P0ManualReviewTemplateFile,
  auditRow: P0ManualReviewTemplateAuditRow,
  blockers: string[],
): P0ManualReviewRecord {
  const getString = (key: string) => readField(file.content, key, blockers);
  const getNumber = (key: string) => readNumberField(file.content, key, blockers);

  return {
    brandId: auditRow.brandId,
    disclosureReferenceYear: getNumber('disclosureReferenceYear'),
    disclosureSourceUrl: getString('disclosureSourceUrl'),
    crossCheckSourceUrl: getString('crossCheckSourceUrl'),
    capturedAt: getString('capturedAt'),
    researcher: getString('researcher'),
    reviewer: getString('reviewer'),
    reviewedAppValues: {
      cost: {
        startupTotalM: getNumber('startupTotalM'),
        franchiseFeeM: getNumber('franchiseFeeM'),
        trainingFeeM: getNumber('trainingFeeM'),
        depositM: getNumber('depositM'),
        interiorM: getNumber('interiorM'),
        equipmentM: getNumber('equipmentM'),
        otherStartupM: getNumber('otherStartupM'),
        recurringRoyaltyRate: getNumber('recurringRoyaltyRate'),
        adFeeRate: getNumber('adFeeRate'),
        requiredPurchaseBurdenRate: getNumber('requiredPurchaseBurdenRate'),
        differenceFranchiseFeeTotalM: getNumber('differenceFranchiseFeeTotalM'),
        recurringCostNote: getString('recurringCostNote'),
      },
      sales: {
        averageAnnualSalesM: getNumber('averageAnnualSalesM'),
        salesPerAreaM: getNumber('salesPerAreaM'),
      },
      stability: {
        currentStores: getNumber('currentStores'),
        directStores: getNumber('directStores'),
        storeChange3y: getNumber('storeChange3y'),
        openings3y: getNumber('openings3y'),
        closures3y: getNumber('closures3y'),
        terminations3y: getNumber('terminations3y'),
        expirations3y: getNumber('expirations3y'),
        ownershipTransfers3y: getNumber('ownershipTransfers3y'),
      },
    },
    metrics: parseMetricTable(file.content, blockers),
  };
}

function parseMetricTable(content: string, blockers: string[]): Record<P0Metric, P0ReviewMetricRecord> {
  const records = {} as Record<P0Metric, P0ReviewMetricRecord>;

  for (const line of content.split('\n')) {
    if (!line.startsWith('| ') || line.includes('---')) {
      continue;
    }

    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 5 || cells[0] === 'P0 지표') {
      continue;
    }

    const metric = metricLabels[cells[0]];
    if (!metric) {
      continue;
    }

    const originalDisclosureChecked = isChecked(cells[2]);
    const crossChecked = isChecked(cells[3]);
    const status: VerificationStatus =
      originalDisclosureChecked && crossChecked ? 'verified' : originalDisclosureChecked || crossChecked ? 'partial' : 'unverified';
    records[metric] = {
      status,
      rawValue: cells[1],
      appValueNote: cells[4],
      originalDisclosureChecked,
      crossChecked,
    };
  }

  for (const metric of P0_REQUIRED_METRICS) {
    if (!records[metric]) {
      blockers.push(`${getP0MetricLabel(metric)} 행 누락`);
    }
  }

  return records;
}

function readField(content: string, key: string, blockers: string[]): string {
  const match = content.match(new RegExp(`^- ${key}: (.+)$`, 'm'));
  const value = match?.[1]?.trim();

  if (!value) {
    blockers.push(`${key} 누락`);
    return '';
  }

  return value;
}

function readNumberField(content: string, key: string, blockers: string[]): number {
  const rawValue = readField(content, key, blockers);
  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    blockers.push(`${key} 숫자 변환 실패`);
    return Number.NaN;
  }

  return value;
}

function isChecked(value: string): boolean {
  return /\[x\]/i.test(value);
}

function fallbackAuditRow(file: P0ManualReviewTemplateFile): P0ManualReviewTemplateAuditRow {
  return {
    brandId: file.path.split('/').pop()?.replace(/\.md$/, '') ?? 'unknown',
    brandName: '브랜드명 확인 필요',
    path: file.path,
    status: 'blocked',
    blockers: ['템플릿 감사 실패'],
  };
}
