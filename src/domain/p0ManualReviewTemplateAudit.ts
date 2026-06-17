import type { P0ManualReviewTemplateFile } from './p0ManualReviewTemplates';

export interface P0ManualReviewTemplateAuditRow {
  brandId: string;
  brandName: string;
  path: string;
  status: 'complete' | 'blocked';
  blockers: string[];
}

export interface P0ManualReviewTemplateAuditReport {
  ready: boolean;
  summary: {
    totalBrandFiles: number;
    completeBrandFiles: number;
    blockedBrandFiles: number;
  };
  rows: P0ManualReviewTemplateAuditRow[];
}

const requiredPlaceholderChecks: Array<{ token: string; blocker: string }> = [
  { token: 'FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED', blocker: 'FTC 원문 URL placeholder' },
  { token: 'REVIEWER_REQUIRED', blocker: '검토자 placeholder' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED', blocker: '차액가맹금 placeholder' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_RECURRING_COSTS_REQUIRED', blocker: '반복비용 placeholder' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_ROYALTY_RATE_REQUIRED', blocker: '반복비용 placeholder' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_AD_FEE_RATE_REQUIRED', blocker: '반복비용 placeholder' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_REQUIRED_PURCHASE_RATE_REQUIRED', blocker: '반복비용 placeholder' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED', blocker: '반복비용 placeholder' },
];

export function auditP0ManualReviewTemplateFiles(
  files: P0ManualReviewTemplateFile[],
): P0ManualReviewTemplateAuditReport {
  const rows = files.filter((file) => !file.path.endsWith('/README.md')).map(auditTemplateFile);
  const completeBrandFiles = rows.filter((row) => row.status === 'complete').length;

  return {
    ready: completeBrandFiles === rows.length,
    summary: {
      totalBrandFiles: rows.length,
      completeBrandFiles,
      blockedBrandFiles: rows.length - completeBrandFiles,
    },
    rows,
  };
}

export function formatP0ManualReviewTemplateAuditReport(report: P0ManualReviewTemplateAuditReport): string {
  const lines = [
    `P0 manual review templates: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `Complete templates: ${report.summary.completeBrandFiles}/${report.summary.totalBrandFiles}`,
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

function auditTemplateFile(file: P0ManualReviewTemplateFile): P0ManualReviewTemplateAuditRow {
  const blockers = new Set<string>();
  const auditableContent = getAuditableContent(file.content);

  for (const check of requiredPlaceholderChecks) {
    if (auditableContent.includes(check.token)) {
      blockers.add(check.blocker);
    }
  }

  if (auditableContent.includes('| [ ] |')) {
    blockers.add('FTC 원문 확인 미체크');
  }

  if (auditableContent.includes('| [ ] | [ ] |')) {
    blockers.add('2차 출처 교차확인 미체크');
  }

  return {
    ...parseBrandIdentity(file),
    path: file.path,
    status: blockers.size === 0 ? 'complete' : 'blocked',
    blockers: [...blockers],
  };
}

function getAuditableContent(content: string): string {
  return content.split('\n## 승격 전 차단 조건\n')[0] ?? content;
}

function parseBrandIdentity(file: P0ManualReviewTemplateFile): { brandId: string; brandName: string } {
  const titleMatch = file.content.match(/^# ([a-z0-9-]+) (.+?) P0 원문 대조 기록/m);

  if (!titleMatch) {
    return {
      brandId: file.path.split('/').pop()?.replace(/\.md$/, '') ?? 'unknown',
      brandName: '브랜드명 확인 필요',
    };
  }

  return {
    brandId: titleMatch[1],
    brandName: titleMatch[2],
  };
}
