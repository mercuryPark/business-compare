import { brands } from '../domain/brands';
import { evaluateTradeAreaReadiness, formatTradeAreaReadinessReport } from '../domain/tradeAreaReadiness';

const report = evaluateTradeAreaReadiness(brands);

console.log(formatTradeAreaReadinessReport(report));

if (!report.readyForEstimates) {
  process.exitCode = 1;
}
