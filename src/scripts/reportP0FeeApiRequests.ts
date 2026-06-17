import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';
import { buildP0FeeApiRequestPlan, formatP0FeeApiRequestPlan } from '../domain/p0FeeApiRequests';

const plan = buildP0FeeApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS, {
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
});

console.log(formatP0FeeApiRequestPlan(plan));

if (!plan.readyToFetch) {
  process.exitCode = 1;
}
