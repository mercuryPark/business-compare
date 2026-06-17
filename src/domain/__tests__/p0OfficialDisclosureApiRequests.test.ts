import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  buildP0OfficialDisclosureApiRequestPlan,
  formatP0OfficialDisclosureApiRequestPlan,
} from '../p0OfficialDisclosureApiRequests';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';

describe('P0 official disclosure API request plan', () => {
  it('builds official disclosure list request URLs for every brand snapshot', () => {
    const plan = buildP0OfficialDisclosureApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS, {
      serviceKey: 'TEST_SERVICE_KEY',
    });

    expect(plan.readyToSearch).toBe(false);
    expect(plan.summary).toEqual({
      totalBrands: 10,
      rowsWithServiceKey: 10,
      rowsRequiringDisclosureSerial: 10,
    });
    expect(plan.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        registeredBrandName: '한솥',
        lookupKeyword: '한솥',
        referenceYear: 2024,
        blockers: ['공개본 목록에서 정보공개서 일련번호 확인 필요'],
      }),
    );
    expect(plan.rows[0].listApiUrl).toContain('https://franchise.ftc.go.kr/api/search.do');
    expect(plan.rows[0].listApiUrl).toContain('type=list');
    expect(plan.rows[0].listApiUrl).toContain('yr=2024');
    expect(plan.rows[0].listApiUrl).toContain('serviceKey=TEST_SERVICE_KEY');
    expect(plan.rows[0].listApiUrl).toContain('numOfRows=200');
    expect(plan.rows[0].contentApiUrlTemplate).toContain('type=content');
    expect(plan.rows[0].contentApiUrlTemplate).toContain('jngIfrmpSn=FTC_DISCLOSURE_SERIAL_REQUIRED');
    expect(plan.rows[0].viewerUrlTemplate).toContain('/api/viewer.do');
  });

  it('treats the documented service-key placeholder as missing', () => {
    const plan = buildP0OfficialDisclosureApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'DATA_GO_KR_SERVICE_KEY_REQUIRED',
    });

    expect(plan.summary.rowsWithServiceKey).toBe(0);
    expect(plan.rows[0].listApiUrl).toContain('serviceKey=DATA_GO_KR_SERVICE_KEY_REQUIRED');
    expect(plan.rows[0].blockers).toEqual(
      expect.arrayContaining(['DATA_GO_KR_SERVICE_KEY 미설정', '공개본 목록에서 정보공개서 일련번호 확인 필요']),
    );
  });

  it('treats the FTC guide sample key as missing', () => {
    const plan = buildP0OfficialDisclosureApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'sampleKey',
    });

    expect(plan.summary.rowsWithServiceKey).toBe(0);
    expect(plan.rows[0].listApiUrl).toContain('serviceKey=DATA_GO_KR_SERVICE_KEY_REQUIRED');
    expect(plan.rows[0].blockers).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  });

  it('formats and exposes the request plan as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-disclosure-api'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 official disclosure API requests: BLOCKED');
    expect(output).toContain('Rows with service key: 0/10');
    expect(output).toContain('type=list');
    expect(output).toContain('FTC_DISCLOSURE_SERIAL_REQUIRED');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');

    expect(formatP0OfficialDisclosureApiRequestPlan(buildP0OfficialDisclosureApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS))).toContain(
      '공개본 목록에서 정보공개서 일련번호 확인 필요',
    );
  }, 15000);
});
