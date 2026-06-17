import { getAdjacentChapters } from '../../domain/learn/curriculum';

export function LearnChapterNav({ activeSlug }: { activeSlug: string }) {
  const { prev, next } = getAdjacentChapters(activeSlug);
  return (
    <nav aria-label="챕터 이동" className="mt-8 flex justify-between border-t border-line pt-4">
      {prev ? (
        <a href={`#learn/${prev.slug}`} className="text-sm text-forest">← {prev.title}</a>
      ) : <span />}
      {next ? (
        <a href={`#learn/${next.slug}`} className="text-sm text-forest">{next.title} →</a>
      ) : <span />}
    </nav>
  );
}
