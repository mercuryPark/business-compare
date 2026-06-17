import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';
import {
  createP0ReviewRecordDrafts,
  formatP0ReviewRecordDrafts,
} from '../p0ReviewRecordDrafts';
import { validateP0ReviewRecords } from '../p0ReviewRecords';
import { brands } from '../brands';

describe('P0 review record drafts', () => {
  it('creates one non-promotable manual review draft per Gyeonggi source snapshot', () => {
    const drafts = createP0ReviewRecordDrafts(P0_GYEONGGI_SOURCE_SNAPSHOTS);

    expect(drafts).toHaveLength(10);
    expect(drafts[0]).toEqual(
      expect.objectContaining({
        brandId: 'hansot',
        disclosureReferenceYear: 2024,
        crossCheckSourceUrl:
          'https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do?brandYear=2024&frnchsNo=20080100308',
        disclosureSourceUrl: 'FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED',
        researcher: 'codex-gyeonggi-draft',
        reviewer: 'REVIEWER_REQUIRED',
      }),
    );
    expect(drafts[0].reviewedAppValues.cost.startupTotalM).toBe(100.259);
    expect(drafts[0].reviewedAppValues.sales.averageAnnualSalesM).toBe(408.402);
    expect(drafts[0].reviewedAppValues.stability.closures3y).toBe(86);
    expect(drafts[0].reviewedAppValues.cost.differenceFranchiseFeeTotalM).toBe(0);
    expect(drafts[0].metrics['startup-cost'].rawValue).toContain('startupTotal=100259천원');
    expect(drafts[0].metrics['startup-cost'].status).toBe('partial');
    expect(drafts[0].metrics['margin-fee-total'].status).toBe('unverified');

    const validation = validateP0ReviewRecords([brands[0]], [drafts[0]]);

    expect(validation.ready).toBe(false);
    expect(validation.rows[0].blockers).toEqual(
      expect.arrayContaining([
        '공식 FTC 정보공개서 URL 필요',
        '연구자와 검토자 분리 필요',
        '차액가맹금 총액 원문 검증 미완료',
        '로열티/광고비/필수비용 원문 검증 미완료',
      ]),
    );
  });

  it('formats TypeScript draft records for manual completion', () => {
    const output = formatP0ReviewRecordDrafts(createP0ReviewRecordDrafts(P0_GYEONGGI_SOURCE_SNAPSHOTS).slice(0, 1));

    expect(output).toContain('P0 manual review record drafts');
    expect(output).toContain("brandId: 'hansot'");
    expect(output).toContain("disclosureSourceUrl: 'FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED'");
    expect(output).toContain('differenceFranchiseFeeTotalM: 0');
    expect(output).toContain("'royalty-ad-required-cost'");
  });

  it('exposes the draft records as an npm command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'report:p0-drafts'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('P0 manual review record drafts');
    expect(output).toContain("brandId: 'hansot'");
    expect(output).toContain('Drafts are not promotion-ready');
  }, 15000);
});
