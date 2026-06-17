import { brands } from '../domain/brands';
import { auditScoreReadiness, formatScoreAuditReport } from '../domain/scoreAudit';

const audit = auditScoreReadiness(brands);

console.log(formatScoreAuditReport(audit));

if (!audit.readyForAbsoluteGrades) {
  process.exitCode = 1;
}
