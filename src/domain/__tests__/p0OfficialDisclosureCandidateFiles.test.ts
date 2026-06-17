import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import {
  buildP0OfficialDisclosureCandidateFiles,
  formatP0OfficialDisclosureCandidateFileGenerationReport,
} from '../p0OfficialDisclosureCandidateFiles';
import type { P0OfficialDisclosureFetchRow } from '../p0OfficialDisclosureApiFetch';

describe('P0 official disclosure candidate files', () => {
  it('builds one review handoff markdown file per disclosure candidate row', () => {
    const files = buildP0OfficialDisclosureCandidateFiles([sampleHansotRow], {
      capturedAt: '2026-06-16T08:00:00.000Z',
    });

    expect(files.map((file) => file.path)).toEqual([
      'docs/research/p0-disclosure-api-candidates/README.md',
      'docs/research/p0-disclosure-api-candidates/hansot.md',
    ]);
    expect(files[0].content).toContain('P0 정보공개서 공개본 후보 파일');
    expect(files[0].content).toContain('Captured at: 2026-06-16T08:00:00.000Z');
    expect(files[0].content).toContain('- [hansot 한솥](./hansot.md)');
    expect(files[1].content).toContain('# hansot 한솥 P0 정보공개서 공개본 후보');
    expect(files[1].content).toContain('- lookupKeyword: 한솥');
    expect(files[1].content).toContain('| 111111 | 한솥 | 주식회사 한솥 | 20240001 |');
    expect(files[1].content).toContain('https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&serviceKey=TEST_SERVICE_KEY');
    expect(files[1].content).toContain('- API 후보와 FTC 원문 수동 대조 필요');
  });

  it('formats a deterministic generation report', () => {
    const output = formatP0OfficialDisclosureCandidateFileGenerationReport(
      buildP0OfficialDisclosureCandidateFiles([sampleHansotRow], {
        capturedAt: '2026-06-16T08:00:00.000Z',
      }),
    );

    expect(output).toContain('P0 official disclosure candidate files: GENERATED');
    expect(output).toContain('Files: 2');
    expect(output).toContain('- docs/research/p0-disclosure-api-candidates/hansot.md');
  });

  it('exposes service-key gated candidate file generation as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'generate:p0-disclosure-candidates'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATA_GO_KR_SERVICE_KEY: '' },
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 official disclosure candidate files: BLOCKED');
    expect(output).toContain('Files: 0');
    expect(output).toContain('DATA_GO_KR_SERVICE_KEY 미설정');
  }, 15000);
});

const sampleHansotRow: P0OfficialDisclosureFetchRow = {
  brandId: 'hansot',
  registeredBrandName: '한솥',
  lookupKeyword: '한솥',
  candidateCount: 1,
  candidates: [
    {
      disclosureSerial: '111111',
      brandName: '한솥',
      corporationName: '주식회사 한솥',
      businessRegistrationNumber: '1234567890',
      registrationNumber: '20240001',
      viewerUrl: 'https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=111111&serviceKey=TEST_SERVICE_KEY',
      raw: '<item><jngIfrmpSn>111111</jngIfrmpSn><brandNm>한솥</brandNm></item>',
    },
  ],
  blockers: ['정보공개서 원문 URL 수동 입력 필요', 'API 후보와 FTC 원문 수동 대조 필요'],
};
