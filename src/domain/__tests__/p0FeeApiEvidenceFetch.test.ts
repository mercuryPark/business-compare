import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';
import {
  fetchP0FeeApiEvidenceRows,
  formatP0FeeApiEvidenceReport,
} from '../p0FeeApiEvidence';

describe('P0 fee API evidence fetch', () => {
  it('fetches official fee APIs and normalizes responses into evidence rows without marking them verified', async () => {
    const calls: string[] = [];
    const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'TEST_SERVICE_KEY',
      fetchJson: async (url) => {
        calls.push(url);
        return url.includes('FftcbrandfrcsjnntinfoService')
          ? {
              response: {
                body: {
                  items: [{ brandMnno: 'BRD_20080100308', brandNm: '한솥', jngAmtSeNm: '차액가맹금', jngAmtScopeVal: '12,300천원' }],
                },
              },
            }
          : {
              response: {
                body: {
                  items: [{ brandMnno: 'BRD_20080100308', brandNm: '한솥', othctSeNm: '광고비', giveAmtCn: '매출액의 1%' }],
                },
              },
            };
      },
    });

    expect(calls).toHaveLength(2);
    expect(evidenceRows).toHaveLength(1);
    expect(evidenceRows[0].readyForReviewRecord).toBe(false);
    expect(evidenceRows[0].marginFeeCandidates[0].amountText).toBe('12,300천원');
    expect(evidenceRows[0].recurringCostCandidates[0].amountText).toBe('매출액의 1%');
    expect(formatP0FeeApiEvidenceReport(evidenceRows)).toContain('Margin fee candidates: 1');
  });

  it('skips fetching and returns no evidence rows without DATA_GO_KR_SERVICE_KEY', async () => {
    let calls = 0;
    const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: '',
      fetchJson: async () => {
        calls += 1;
        return {};
      },
    });

    expect(calls).toBe(0);
    expect(evidenceRows).toEqual([]);
  });

  it('skips fetching when DATA_GO_KR_SERVICE_KEY is still the documented placeholder', async () => {
    let calls = 0;
    const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'DATA_GO_KR_SERVICE_KEY_REQUIRED',
      fetchJson: async () => {
        calls += 1;
        return {};
      },
    });

    expect(calls).toBe(0);
    expect(evidenceRows).toEqual([]);
  });

  it('preserves partial evidence rows when one official API endpoint fails', async () => {
    const evidenceRows = await fetchP0FeeApiEvidenceRows(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'TEST_SERVICE_KEY',
      fetchJson: async (url) => {
        if (url.includes('FftcbrandfrcsjnntinfoService')) {
          throw new Error('HTTP 502 Bad Gateway');
        }

        return {
          response: {
            body: {
              items: [{ brandMnno: 'BRD_20080100308', brandNm: '한솥', othctSeNm: '광고비', giveAmtCn: '매출액의 1%' }],
            },
          },
        };
      },
    });

    expect(evidenceRows).toHaveLength(1);
    expect(evidenceRows[0].marginFeeCandidates).toEqual([]);
    expect(evidenceRows[0].recurringCostCandidates[0].amountText).toBe('매출액의 1%');
    expect(evidenceRows[0].blockers).toEqual(
      expect.arrayContaining([
        'Franchise fee fetch 실패: HTTP 502 Bad Gateway',
        'API 반환 브랜드명/원문 대조 필요',
      ]),
    );
    expect(formatP0FeeApiEvidenceReport(evidenceRows)).toContain(
      'Franchise fee fetch 실패: HTTP 502 Bad Gateway',
    );
  });

  it('exposes the fetched evidence report as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'fetch:p0-fee-evidence'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 fee API evidence: BLOCKED');
    expect(output).toContain('Brands: 0');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  }, 15000);
});
