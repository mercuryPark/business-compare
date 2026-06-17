import type { P0ManualReviewTemplateFile } from './p0ManualReviewTemplates';

export interface P0ManualReviewTodoRow {
  brandId: string;
  brandName: string;
  path: string;
  fieldTodos: string[];
  metricTodos: string[];
}

export interface P0ManualReviewTodoReport {
  ready: boolean;
  summary: {
    totalBrandFiles: number;
    brandsWithTodos: number;
    totalTodos: number;
  };
  rows: P0ManualReviewTodoRow[];
}

const fieldTodoChecks: Array<{ token: string; todo: string }> = [
  { token: 'FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED', todo: 'disclosureSourceUrl: FTC 원문 URL 입력' },
  { token: 'REVIEWER_REQUIRED', todo: 'reviewer: 2차 검토자 입력' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_ROYALTY_RATE_REQUIRED', todo: 'recurringRoyaltyRate: 0-1 요율 입력' },
  { token: 'FTC_ORIGINAL_DISCLOSURE_AD_FEE_RATE_REQUIRED', todo: 'adFeeRate: 0-1 요율 입력' },
  {
    token: 'FTC_ORIGINAL_DISCLOSURE_REQUIRED_PURCHASE_RATE_REQUIRED',
    todo: 'requiredPurchaseBurdenRate: 0-1 요율 입력',
  },
  {
    token: 'FTC_ORIGINAL_DISCLOSURE_MARGIN_FEE_TOTAL_REQUIRED',
    todo: 'differenceFranchiseFeeTotalM: 백만원 단위 숫자 입력',
  },
  { token: 'FTC_ORIGINAL_DISCLOSURE_FEE_REVIEW_REQUIRED', todo: 'recurringCostNote: 원문/수수료 API 근거 메모 입력' },
];

export function buildP0ManualReviewTodoReport(files: P0ManualReviewTemplateFile[]): P0ManualReviewTodoReport {
  const rows = files.filter((file) => !file.path.endsWith('/README.md')).map(buildTodoRow);
  const brandsWithTodos = rows.filter((row) => row.fieldTodos.length + row.metricTodos.length > 0).length;
  const totalTodos = rows.reduce((sum, row) => sum + row.fieldTodos.length + row.metricTodos.length, 0);

  return {
    ready: totalTodos === 0,
    summary: {
      totalBrandFiles: rows.length,
      brandsWithTodos,
      totalTodos,
    },
    rows,
  };
}

export function formatP0ManualReviewTodoReport(report: P0ManualReviewTodoReport): string {
  const lines = [
    `P0 manual review todos: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `Brands with todos: ${report.summary.brandsWithTodos}/${report.summary.totalBrandFiles}`,
    `Total todos: ${report.summary.totalTodos}`,
    '',
  ];

  for (const row of report.rows) {
    const todoCount = row.fieldTodos.length + row.metricTodos.length;
    lines.push(`- ${row.brandId} ${row.brandName}: ${todoCount} todos`);
    lines.push(`  Path: ${row.path}`);
    if (row.fieldTodos.length > 0) {
      lines.push(`  Fields: ${row.fieldTodos.join('; ')}`);
    }
    if (row.metricTodos.length > 0) {
      lines.push(`  Metrics: ${row.metricTodos.join('; ')}`);
    }
  }

  return lines.join('\n');
}

function buildTodoRow(file: P0ManualReviewTemplateFile): P0ManualReviewTodoRow {
  const auditableContent = getAuditableContent(file.content);

  return {
    ...parseBrandIdentity(file),
    path: file.path,
    fieldTodos: buildFieldTodos(auditableContent),
    metricTodos: buildMetricTodos(auditableContent),
  };
}

function buildFieldTodos(content: string): string[] {
  const todos: string[] = [];

  for (const check of fieldTodoChecks) {
    if (content.includes(check.token) && !todos.includes(check.todo)) {
      todos.push(check.todo);
    }
  }

  return todos;
}

function buildMetricTodos(content: string): string[] {
  const todos: string[] = [];

  for (const line of content.split('\n')) {
    if (!line.startsWith('| ') || line.includes('---') || line.includes('P0 지표')) {
      continue;
    }

    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 5) {
      continue;
    }

    const checks: string[] = [];
    if (!isChecked(cells[2])) {
      checks.push('FTC 원문 확인 체크');
    }
    if (!isChecked(cells[3])) {
      checks.push('2차 출처 교차확인 체크');
    }
    if (checks.length > 0) {
      todos.push(`${cells[0]}: ${checks.join(', ')}`);
    }
  }

  return todos;
}

function isChecked(value: string): boolean {
  return /\[x\]/i.test(value);
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
