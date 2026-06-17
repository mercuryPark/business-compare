import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('P0 operator documentation', () => {
  it('documents every current P0 operator command needed for the manual review workflow', () => {
    const content = readFileSync('docs/research/p0-data-collection-template.md', 'utf8');

    for (const command of [
      'npm run report:p0-workflow',
      'npm run report:p0-review-todos',
      'npm run report:p0-disclosure-api',
      'npm run fetch:p0-disclosure-api',
      'npm run generate:p0-disclosure-candidates',
      'npm run generate:p0-fee-evidence',
      'npm run report:p0-template-suggestions',
      'npm run generate:p0-template-preview',
      'npm run report:p0-template-import',
      'npm run report:p0-gaps',
    ]) {
      expect(content).toContain(command);
    }
  });
});
