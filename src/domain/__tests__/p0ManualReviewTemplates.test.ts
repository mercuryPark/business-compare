import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { brands } from '../brands';
import { buildP0ManualReviewTemplateFiles } from '../p0ManualReviewTemplates';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../p0SourceSnapshots';

describe('P0 manual review template files', () => {
  it('builds an index and one fillable markdown template per brand', () => {
    const files = buildP0ManualReviewTemplateFiles(P0_GYEONGGI_SOURCE_SNAPSHOTS, brands);

    expect(files).toHaveLength(11);
    expect(files[0].path).toBe('docs/research/p0-manual-review-records/README.md');
    expect(files[0].content).toContain('P0 수동 원문 대조 입력 템플릿');
    expect(files[0].content).toContain('- [hansot 한솥도시락](./hansot.md)');

    const hansot = files.find((file) => file.path.endsWith('/hansot.md'));
    expect(hansot?.content).toContain('# hansot 한솥도시락 P0 원문 대조 기록');
    expect(hansot?.content).toContain('FTC_ORIGINAL_DISCLOSURE_URL_REQUIRED');
    expect(hansot?.content).toContain('REVIEWER_REQUIRED');
    expect(hansot?.content).toContain('startupTotalM: 100.259');
    expect(hansot?.content).toContain('averageAnnualSalesM: 408.402');
    expect(hansot?.content).toContain('closures3y: 86');
    expect(hansot?.content).toContain('차액가맹금 총액');
    expect(hansot?.content).toContain('로열티/광고비/필수비용');
    expect(hansot?.content).toContain('frnchsNo=20080100308');
  });

  it('exposes the templates as a generation command', () => {
    const result = spawnSync('npm', ['run', '--silent', 'generate:p0-review-templates'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(0);
    expect(output).toContain('Generated 11 P0 manual review template files');
    expect(output).toContain('docs/research/p0-manual-review-records/hansot.md');
  }, 15000);
});
