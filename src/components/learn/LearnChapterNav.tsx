import { CHAPTERS, getAdjacentChapters } from '../../domain/learn/curriculum';

export function LearnChapterNav({ activeSlug }: { activeSlug: string }) {
  const { prev, next } = getAdjacentChapters(activeSlug);
  const index = CHAPTERS.findIndex((c) => c.slug === activeSlug);
  const position = index >= 0 ? `${index + 1} / ${CHAPTERS.length}` : '';

  const btn = 'inline-flex min-h-[48px] items-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-forest';

  return (
    <nav aria-label="챕터 이동" className="mt-8 border-t border-line pt-4">
      <div className="mb-2 text-center text-xs text-muted">{position}</div>
      <div className="flex justify-between gap-3">
        {prev ? <a href={`#learn/${prev.slug}`} className={btn}>← 이전</a> : <span />}
        {next ? <a href={`#learn/${next.slug}`} className={btn}>다음 →</a> : <span />}
      </div>
    </nav>
  );
}
