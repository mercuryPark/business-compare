import type { LearnRoute } from '../../domain/learn/types';
import { getChapter } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from './primitives/sourceContext';
import { SourceNote } from './primitives/SourceNote';
import { LearnLanding } from './LearnLanding';
import { LearnSidebar } from './LearnSidebar';
import { LearnChapterNav } from './LearnChapterNav';
import { LearnNotFound } from './LearnNotFound';

const DISCLAIMER =
  '이 페이지는 일반적인 안내입니다. 구체적인 수치는 시점·지역·업종에 따라 다르며, 정확한 내용은 공식 자료·세무사·전문가 확인이 필요합니다.';

export function LearnPage({ route }: { route: Extract<LearnRoute, { view: 'learn' }> }) {
  if (route.mode === 'landing') {
    return <div className="mx-auto max-w-4xl">{<LearnLanding />}</div>;
  }

  if (route.mode === 'notFound') {
    return (
      <div className="mx-auto max-w-4xl">
        <LearnNotFound requestedSlug={route.requestedSlug} />
      </div>
    );
  }

  const chapter = getChapter(route.chapterSlug);
  if (!chapter) {
    return (
      <div className="mx-auto max-w-4xl">
        <LearnNotFound requestedSlug={route.chapterSlug} />
      </div>
    );
  }

  const Body = chapter.body;

  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <aside className="md:sticky md:top-4 md:self-start">
        <LearnSidebar activeSlug={chapter.slug} />
      </aside>
      <article>
        <div className="mb-4 rounded-lg border border-line bg-cream p-3 text-xs text-muted">{DISCLAIMER}</div>
        <LearnSourcesProvider sources={chapter.sources}>
          <Body />
          <footer className="mt-6 rounded-lg border border-line bg-surface p-3">
            <div className="mb-2 text-xs font-semibold text-muted">출처 및 검토 상태</div>
            <ul className="space-y-1">
              {chapter.sources.map((s) => (
                <li key={s.id}>
                  <SourceNote sourceId={s.id} />
                </li>
              ))}
            </ul>
          </footer>
        </LearnSourcesProvider>
        <LearnChapterNav activeSlug={chapter.slug} />
      </article>
    </div>
  );
}
