import { brands } from '../domain/brands';
import {
  evaluateAutomationPromotionPolicy,
  formatAutomationPromotionPolicyReport,
} from '../domain/automationPolicy';

const policy = evaluateAutomationPromotionPolicy(brands);

console.log(formatAutomationPromotionPolicyReport(policy));

if (!policy.promotable) {
  process.exitCode = 1;
}
