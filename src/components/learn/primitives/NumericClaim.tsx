import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export function NumericClaim({
  label,
  value,
  basis,
  sourceId,
}: {
  label: string;
  value: string;
  basis?: string;
  sourceId: string; // required: no number without a bound source
}) {
  useLearnSource(sourceId); // throws early if unregistered
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-base font-semibold text-ink">{value}</span>
      </div>
      {basis && <div className="text-xs text-muted">{basis}</div>}
      <div className="mt-1">
        <SourceNote sourceId={sourceId} />
      </div>
    </div>
  );
}
