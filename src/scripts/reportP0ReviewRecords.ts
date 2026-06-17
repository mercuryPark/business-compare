import { brands } from '../domain/brands';
import {
  formatP0ReviewRecordReport,
  p0ManualReviewRecords,
  validateP0ReviewRecords,
} from '../domain/p0ReviewRecords';

const report = validateP0ReviewRecords(brands, p0ManualReviewRecords);

console.log(formatP0ReviewRecordReport(report));

if (!report.ready) {
  process.exitCode = 1;
}
