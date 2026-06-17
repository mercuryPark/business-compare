export function HiddenCostList({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-clay/30 bg-clay/5 p-4">
      <h4 className="mb-2 text-sm font-semibold text-clay">사람들이 자주 놓치는 비용</h4>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
