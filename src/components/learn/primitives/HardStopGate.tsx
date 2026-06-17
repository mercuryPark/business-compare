export function HardStopGate({ conditions }: { conditions: string[] }) {
  return (
    <section className="rounded-xl border border-danger/30 bg-danger/5 p-4">
      <h3 className="mb-2 text-base font-semibold text-danger">
        🚫 다음 중 하나라도 해당하면 지금은 멈춰야 합니다
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
        {conditions.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}
