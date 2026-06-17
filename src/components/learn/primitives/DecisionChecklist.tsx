import { useEffect, useState } from 'react';

export function DecisionChecklist({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  const storageKey = `learn-checklist:${id}`;
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw) as string[]);
    } catch {
      // ignore corrupt storage
    }
  }, [storageKey]);

  function toggle(item: string) {
    setChecked((current) => {
      const next = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore write failures (private mode, quota)
      }
      return next;
    });
  }

  return (
    <section className="rounded-xl border border-line bg-mist/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-forest">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={checked.includes(item)}
                onChange={() => toggle(item)}
                aria-label={item}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
