import { brands } from '../domain/brands';
import { evaluateP0DataReplacementGaps, formatP0DataReplacementGapReport } from '../domain/p0DataGaps';
import { p0ManualReviewRecords } from '../domain/p0ReviewRecords';

const report = evaluateP0DataReplacementGaps(brands, p0ManualReviewRecords);

console.log(formatP0DataReplacementGapReport(report));

if (!report.readyForReplacement) {
  process.exitCode = 1;
}
