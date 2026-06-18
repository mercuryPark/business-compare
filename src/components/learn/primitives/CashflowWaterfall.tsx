import { useLearnSource } from './sourceContext';
import { IllustrativeBadge } from './IllustrativeBadge';
import { SourceNote } from './SourceNote';

export interface WaterfallStep {
  label: string;
  amount: string;
  kind: 'start' | 'deduction' | 'result';
}

export function CashflowWaterfall({
  steps,
  sourceId,
  illustrative,
}: {
  steps: WaterfallStep[];
  sourceId: string;
  illustrative?: boolean;
}) {
  useLearnSource(sourceId);
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <ul className="space-y-1 text-sm">
        {steps.map((s) => (
          <li key={s.label} className="flex justify-between">
            <span className={s.kind === 'deduction' ? 'text-danger' : 'text-ink'}>
              {s.kind === 'deduction' ? '− ' : ''}{s.label}
            </span>
            <span className={s.kind === 'result' ? 'font-semibold text-leaf' : 'text-ink'}>{s.amount}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 flex flex-wrap items-center gap-2">
        {illustrative && <IllustrativeBadge />}
        <SourceNote sourceId={sourceId} />
      </figcaption>
    </figure>
  );
}
