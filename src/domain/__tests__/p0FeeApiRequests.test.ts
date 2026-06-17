import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';
import {
  buildP0FeeApiRequestPlan,
  formatP0FeeApiRequestPlan,
} from '../p0FeeApiRequests';

describe('P0 fee API request plan', () => {
  it('builds official fee and other-cost API request URLs for every brand snapshot', () => {
    const plan = buildP0FeeApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS, {
      serviceKey: 'TEST_SERVICE_KEY',
    });

    expect(plan.readyToFetch).toBe(false);
    expect(plan.summary).toEqual({
      totalBrands: 10,
      rowsWithServiceKey: 10,
      rowsRequiringBrandConfirmation: 10,
    });
    expect(plan.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        registeredBrandName: '한솥',
        brandMnno: 'BRD_20080100308',
        referenceYear: 2024,
        blockers: ['API 반환 브랜드명/원문 대조 필요'],
      }),
    );
    expect(plan.rows[0].franchiseFeeApiUrl).toContain(
      'https://apis.data.go.kr/1130000/FftcbrandfrcsjnntinfoService/getbrandFrcsJnntinfo',
    );
    expect(plan.rows[0].franchiseFeeApiUrl).toContain('jngBizCrtraYr=2024');
    expect(plan.rows[0].franchiseFeeApiUrl).toContain('brandMnno=BRD_20080100308');
    expect(plan.rows[0].franchiseFeeApiUrl).toContain('serviceKey=TEST_SERVICE_KEY');
    expect(plan.rows[0].otherCostApiUrl).toContain(
      'https://apis.data.go.kr/1130000/FftcbrandfrcsbzmnothctinfoService/getbrandFrcsBzmnOthctinfo',
    );
  });

  it('keeps the plan blocked when DATA_GO_KR_SERVICE_KEY is missing', () => {
    const plan = buildP0FeeApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS);

    expect(plan.readyToFetch).toBe(false);
    expect(plan.summary.rowsWithServiceKey).toBe(0);
    expect(plan.rows[0].franchiseFeeApiUrl).toContain('serviceKey=DATA_GO_KR_SERVICE_KEY_REQUIRED');
    expect(plan.rows[0].blockers).toEqual(
      expect.arrayContaining(['DATA_GO_KR_SERVICE_KEY 미설정', 'API 반환 브랜드명/원문 대조 필요']),
    );
  });

  it('treats the documented service-key placeholder as missing', () => {
    const plan = buildP0FeeApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'DATA_GO_KR_SERVICE_KEY_REQUIRED',
    });

    expect(plan.summary.rowsWithServiceKey).toBe(0);
    expect(plan.rows[0].franchiseFeeApiUrl).toContain('serviceKey=DATA_GO_KR_SERVICE_KEY_REQUIRED');
    expect(plan.rows[0].blockers).toEqual(
      expect.arrayContaining(['DATA_GO_KR_SERVICE_KEY 미설정', 'API 반환 브랜드명/원문 대조 필요']),
    );
  });

  it('treats the public API sample key as missing', () => {
    const plan = buildP0FeeApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'sampleKey',
    });

    expect(plan.summary.rowsWithServiceKey).toBe(0);
    expect(plan.rows[0].franchiseFeeApiUrl).toContain('serviceKey=DATA_GO_KR_SERVICE_KEY_REQUIRED');
    expect(plan.rows[0].blockers).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  });

  it('formats and exposes the request plan as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-fee-api'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 fee API requests: BLOCKED');
    expect(output).toContain('Rows with service key: 0/10');
    expect(output).toContain('brandMnno=BRD_20080100308');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');

    expect(formatP0FeeApiRequestPlan(buildP0FeeApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS))).toContain(
      'API 반환 브랜드명/원문 대조 필요',
    );
  }, 15000);
});
