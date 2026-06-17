import { CHAPTERS } from '../domain/learn/curriculum';
import { findSourceGateViolations } from '../domain/learn/sourceGate';

const violations = findSourceGateViolations(CHAPTERS);

if (violations.length === 0) {
  console.log('Learn source gate: OK');
  console.log(`Chapters checked: ${CHAPTERS.length}`);
} else {
  console.error('Learn source gate: FAILED');
  for (const v of violations) {
    console.error(`- ${v.chapterSlug} / ${v.sourceId}: ${v.reason}`);
  }
  process.exitCode = 1;
}
