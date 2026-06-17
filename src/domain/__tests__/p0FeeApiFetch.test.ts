import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';
import {
  fetchP0FeeApiEvidence,
  formatP0FeeApiFetchReport,
} from '../p0FeeApiFetch';

describe('P0 fee API fetch', () => {
  it('does not fetch official fee APIs without a public-data service key', async () => {
    let calls = 0;
    const report = await fetchP0FeeApiEvidence(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: '',
      fetchJson: async () => {
        calls += 1;
        return {};
      },
    });

    expect(calls).toBe(0);
    expect(report.readyForReviewRecordInput).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 1,
      fetchedBrands: 0,
      blockedBrands: 1,
    });
    expect(report.rows[0].blockers).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  });

  it('captures fee and other-cost responses but keeps records blocked for brand and original-disclosure review', async () => {
    const calls: string[] = [];
    const report = await fetchP0FeeApiEvidence(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'TEST_SERVICE_KEY',
      fetchJson: async (url) => {
        calls.push(url);
        return url.includes('FftcbrandfrcsjnntinfoService')
          ? { response: { body: { items: [{ brandMnno: 'BRD_20080100308', jngAmtSeNm: '차액가맹금' }] } } }
          : { response: { body: { items: [{ brandMnno: 'BRD_20080100308', othctSeNm: '광고비' }] } } };
      },
    });

    expect(calls).toHaveLength(2);
    expect(report.readyForReviewRecordInput).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 1,
      fetchedBrands: 1,
      blockedBrands: 1,
    });
    expect(report.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        brandMnno: 'BRD_20080100308',
        franchiseFeeItemCount: 1,
        otherCostItemCount: 1,
      }),
    );
    expect(report.rows[0].blockers).toEqual([
      'API 반환 브랜드명/원문 대조 필요',
      '수동 리뷰 기록 반영 필요',
    ]);
  });

  it('keeps the fetch report usable when one official API endpoint fails', async () => {
    const report = await fetchP0FeeApiEvidence(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'TEST_SERVICE_KEY',
      fetchJson: async (url) => {
        if (url.includes('FftcbrandfrcsjnntinfoService')) {
          throw new Error('HTTP 500 Internal Server Error');
        }

        return { response: { body: { items: [{ brandMnno: 'BRD_20080100308', othctSeNm: '광고비' }] } } };
      },
    });

    expect(report.readyForReviewRecordInput).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 1,
      fetchedBrands: 1,
      blockedBrands: 1,
    });
    expect(report.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        franchiseFeeItemCount: 0,
        otherCostItemCount: 1,
      }),
    );
    expect(report.rows[0].blockers).toEqual(
      expect.arrayContaining([
        'Franchise fee fetch 실패: HTTP 500 Internal Server Error',
        'API 반환 브랜드명/원문 대조 필요',
      ]),
    );
    expect(formatP0FeeApiFetchReport(report)).toContain(
      'Franchise fee fetch 실패: HTTP 500 Internal Server Error',
    );
  });

  it('formats and exposes the fetch report as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'fetch:p0-fee-api'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 fee API fetch: BLOCKED');
    expect(output).toContain('Fetched brands: 0/10');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
    expect(formatP0FeeApiFetchReport({ readyForReviewRecordInput: false, summary: { totalBrands: 0, fetchedBrands: 0, blockedBrands: 0 }, rows: [] })).toContain(
      'P0 fee API fetch: BLOCKED',
    );
  }, 15000);
});
