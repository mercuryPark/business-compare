import { brands } from '../domain/brands';
import {
  evaluateP0ReviewPromotionReadiness,
  formatP0ReviewPromotionReport,
  p0ManualReviewRecords,
} from '../domain/p0ReviewRecords';

const report = evaluateP0ReviewPromotionReadiness(brands, p0ManualReviewRecords);

console.log(formatP0ReviewPromotionReport(report));

if (!report.ready) {
  process.exitCode = 1;
}
