import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  fetchP0OfficialDisclosureCandidates,
  formatP0OfficialDisclosureFetchReport,
} from '../p0OfficialDisclosureApiFetch';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';

const disclosureXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <totalCount>2</totalCount>
  <items>
    <item>
      <jngIfrmpSn>111111</jngIfrmpSn>
      <corpNm>주식회사 한솥</corpNm>
      <brandNm>한솥</brandNm>
      <brno>1234567890</brno>
      <jngIfrmpRgsno>20240001</jngIfrmpRgsno>
      <viwerUrl>https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&amp;serviceKey=TEST_SERVICE_KEY</viwerUrl>
    </item>
    <item>
      <jngIfrmpSn>222222</jngIfrmpSn>
      <corpNm>다른 법인</corpNm>
      <brandNm>다른 브랜드</brandNm>
      <brno>0000000000</brno>
      <jngIfrmpRgsno>20240002</jngIfrmpRgsno>
      <viwerUrl>https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=222222&amp;serviceKey=TEST_SERVICE_KEY</viwerUrl>
    </item>
  </items>
</root>`;

describe('P0 official disclosure API fetch', () => {
  it('skips fetching when DATA_GO_KR_SERVICE_KEY is missing', async () => {
    let calls = 0;

    const report = await fetchP0OfficialDisclosureCandidates(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: '',
      fetchText: async () => {
        calls += 1;
        return disclosureXml;
      },
    });

    expect(calls).toBe(0);
    expect(report.summary.matchedBrands).toBe(0);
    expect(report.rows[0].blockers).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  });

  it('matches official disclosure list items by registered brand name', async () => {
    const fetchedUrls: string[] = [];

    const report = await fetchP0OfficialDisclosureCandidates(P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 1), {
      serviceKey: 'TEST_SERVICE_KEY',
      fetchText: async (url) => {
        fetchedUrls.push(url);
        return disclosureXml;
      },
    });

    expect(fetchedUrls).toHaveLength(1);
    expect(fetchedUrls[0]).toContain('type=list');
    expect(report.readyForManualReviewUrlInput).toBe(false);
    expect(report.summary).toEqual({
      totalBrands: 1,
      fetchedBrands: 1,
      matchedBrands: 1,
      blockedBrands: 1,
    });
    expect(report.rows[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        registeredBrandName: '한솥',
        candidateCount: 1,
        blockers: ['정보공개서 원문 URL 수동 입력 필요', 'API 후보와 FTC 원문 수동 대조 필요'],
      }),
    );
    expect(report.rows[0].candidates[0]).toEqual(
      expect.objectContaining({
        disclosureSerial: '111111',
        brandName: '한솥',
        corporationName: '주식회사 한솥',
        registrationNumber: '20240001',
        viewerUrl: 'https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&serviceKey=TEST_SERVICE_KEY',
      }),
    );
  });

  it('fetches all disclosure-list pages once per reference year before matching candidates', async () => {
    const fetchedUrls: string[] = [];
    const snapshots = P0_GYEONGGI_SOURCE_SNAPSHOTS.slice(0, 2);
    const pageOneXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <totalCount>201</totalCount>
  <items>
    <item>
      <jngIfrmpSn>111111</jngIfrmpSn>
      <corpNm>주식회사 한솥</corpNm>
      <brandNm>한솥</brandNm>
      <brno>1234567890</brno>
      <jngIfrmpRgsno>20240001</jngIfrmpRgsno>
      <viwerUrl>https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&amp;serviceKey=TEST_SERVICE_KEY</viwerUrl>
    </item>
  </items>
</root>`;
    const pageTwoXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <totalCount>201</totalCount>
  <items>
    <item>
      <jngIfrmpSn>222222</jngIfrmpSn>
      <corpNm>이삭 본사</corpNm>
      <brandNm>이삭토스트</brandNm>
      <brno>9876543210</brno>
      <jngIfrmpRgsno>20240002</jngIfrmpRgsno>
      <viwerUrl>https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=222222&amp;serviceKey=TEST_SERVICE_KEY</viwerUrl>
    </item>
  </items>
</root>`;

    const report = await fetchP0OfficialDisclosureCandidates(snapshots, {
      serviceKey: 'TEST_SERVICE_KEY',
      fetchText: async (url) => {
        fetchedUrls.push(url);
        return url.includes('pageNo=2') ? pageTwoXml : pageOneXml;
      },
    });

    expect(fetchedUrls).toHaveLength(2);
    expect(fetchedUrls[0]).toContain('pageNo=1');
    expect(fetchedUrls[1]).toContain('pageNo=2');
    expect(report.summary).toEqual({
      totalBrands: 2,
      fetchedBrands: 2,
      matchedBrands: 2,
      blockedBrands: 2,
    });
    expect(report.rows.map((row) => row.candidates[0]?.disclosureSerial)).toEqual(['111111', '222222']);
  });

  it('formats and exposes the fetch report as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'fetch:p0-disclosure-api'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 official disclosure API fetch: BLOCKED');
    expect(output).toContain('Matched brands: 0/10');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');

    expect(formatP0OfficialDisclosureFetchReport({
      readyForManualReviewUrlInput: false,
      summary: {
        totalBrands: 0,
        fetchedBrands: 0,
        matchedBrands: 0,
        blockedBrands: 0,
      },
      rows: [],
    })).toContain('P0 official disclosure API fetch: BLOCKED');
  }, 15000);
});
