import { brands } from '../domain/brands';
import { evaluateP0AutomationReadiness, formatP0AutomationReport } from '../domain/p0Automation';

const report = evaluateP0AutomationReadiness(brands);

console.log(formatP0AutomationReport(report));

if (!report.ready) {
  process.exitCode = 1;
}
