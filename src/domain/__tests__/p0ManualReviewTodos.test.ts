import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  buildP0ManualReviewTodoReport,
  formatP0ManualReviewTodoReport,
} from '../p0ManualReviewTodos';
import { buildP0ManualReviewTemplateFiles } from '../p0ManualReviewTemplates';
import { brands } from '../brands';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';

describe('P0 manual review todos', () => {
  it('lists exact placeholder fields and metric checks still required per brand', () => {
    const report = buildP0ManualReviewTodoReport(
      buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands),
    );
    const hansot = report.rows.find((row) => row.brandId === 'hansot')!;

    expect(report.ready).toBe(false);
    expect(report.summary).toEqual({
      totalBrandFiles: 10,
      brandsWithTodos: 10,
      totalTodos: 140,
    });
    expect(hansot.fieldTodos).toEqual([
      'disclosureSourceUrl: FTC 원문 URL 입력',
      'reviewer: 2차 검토자 입력',
      'recurringRoyaltyRate: 0-1 요율 입력',
      'adFeeRate: 0-1 요율 입력',
      'requiredPurchaseBurdenRate: 0-1 요율 입력',
      'differenceFranchiseFeeTotalM: 백만원 단위 숫자 입력',
      'recurringCostNote: 원문/수수료 API 근거 메모 입력',
    ]);
    expect(hansot.metricTodos).toEqual([
      '초기비용: FTC 원문 확인 체크',
      '가맹점 수 추이: FTC 원문 확인 체크',
      '평균매출: FTC 원문 확인 체크',
      '폐점/계약해지 지표: FTC 원문 확인 체크',
      '차액가맹금 총액: FTC 원문 확인 체크, 2차 출처 교차확인 체크',
      '로열티/광고비/필수비용: FTC 원문 확인 체크, 2차 출처 교차확인 체크',
      '정보공개서 기준연도/출처: FTC 원문 확인 체크',
    ]);
  });

  it('formats a deterministic todo report', () => {
    const output = formatP0ManualReviewTodoReport(
      buildP0ManualReviewTodoReport(buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands)),
    );

    expect(output).toContain('P0 manual review todos: BLOCKED');
    expect(output).toContain('Brands with todos: 10/10');
    expect(output).toContain('Total todos: 140');
    expect(output).toContain('- hansot 한솥도시락: 14 todos');
    expect(output).toContain('Fields: disclosureSourceUrl: FTC 원문 URL 입력');
    expect(output).toContain('Metrics: 초기비용: FTC 원문 확인 체크');
  });

  it('exposes current docs todos as an npm operator command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-review-todos'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 manual review todos: BLOCKED');
    expect(output).toContain('Brands with todos: 10/10');
    expect(output).toContain('- hansot 한솥도시락: 14 todos');
  }, 15000);
});
