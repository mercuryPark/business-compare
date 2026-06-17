import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface CostRow {
  label: string;
  value: string;
  note?: string;
}

export function SourceBackedTable({
  caption,
  rows,
  sourceId,
}: {
  caption: string;
  rows: CostRow[];
  sourceId: string;
}) {
  useLearnSource(sourceId);
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <table className="w-full text-sm">
        <caption className="mb-2 text-left font-semibold text-ink">{caption}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <th scope="row" className="py-1.5 text-left font-normal text-muted">{r.label}</th>
              <td className="py-1.5 text-right font-semibold text-ink">{r.value}</td>
              <td className="py-1.5 pl-3 text-right text-xs text-muted">{r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-2"><SourceNote sourceId={sourceId} /></figcaption>
    </figure>
  );
}
