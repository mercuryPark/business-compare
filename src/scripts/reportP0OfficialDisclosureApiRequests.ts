import {
  buildP0OfficialDisclosureApiRequestPlan,
  formatP0OfficialDisclosureApiRequestPlan,
} from '../domain/p0OfficialDisclosureApiRequests';
import { P0_GYEONGGI_SOURCE_SNAPSHOTS } from '../domain/p0SourceSnapshots';

const plan = buildP0OfficialDisclosureApiRequestPlan(P0_GYEONGGI_SOURCE_SNAPSHOTS, {
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
});

console.log(formatP0OfficialDisclosureApiRequestPlan(plan));

if (!plan.readyToSearch) {
  process.exitCode = 1;
}
