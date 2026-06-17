import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface CalendarEntry {
  month: string; // e.g. '매달', '1·4·7·10월', '5월'
  item: string; // e.g. '4대보험', '부가세', '종합소득세'
}

export function CashflowCalendar({ entries, sourceId }: { entries: CalendarEntry[]; sourceId: string }) {
  useLearnSource(sourceId);
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <h4 className="mb-2 text-sm font-semibold text-forest">현금 유출 캘린더 (세금·보험 납부 타이밍 포함)</h4>
      <ul className="space-y-1 text-sm">
        {entries.map((e) => (
          <li key={`${e.month}-${e.item}`} className="flex justify-between">
            <span className="text-muted">{e.month}</span>
            <span className="text-ink">{e.item}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2"><SourceNote sourceId={sourceId} /></figcaption>
    </figure>
  );
}
