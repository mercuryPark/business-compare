import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface ScenarioLine {
  label: string;
  amount: string;
}

export function MoneyScenario({
  title,
  monthlySales,
  lines,
  takeHome,
  sourceId,
}: {
  title: string;
  monthlySales: string;
  lines: ScenarioLine[];
  takeHome: string;
  sourceId: string;
}) {
  useLearnSource(sourceId);
  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h4 className="text-sm font-semibold text-forest">{title}</h4>
      <p className="text-sm text-muted">월매출 {monthlySales} 기준</p>
      <ul className="my-2 space-y-1 text-sm">
        {lines.map((l) => (
          <li key={l.label} className="flex justify-between">
            <span className="text-muted">{l.label}</span>
            <span className="text-ink">{l.amount}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold">
        <span className="text-ink">손에 남는 돈</span>
        <span className="text-leaf">{takeHome}</span>
      </div>
      <div className="mt-2"><SourceNote sourceId={sourceId} /></div>
    </section>
  );
}
