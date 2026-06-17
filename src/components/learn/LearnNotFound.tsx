import { CHAPTERS } from '../../domain/learn/curriculum';

export function LearnNotFound({ requestedSlug }: { requestedSlug: string }) {
  const first = CHAPTERS[0];
  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-ink">해당 학습 글을 찾을 수 없습니다</h2>
      <p className="mt-1 text-sm text-muted">요청한 주소: <code>#learn/{requestedSlug}</code></p>
      <div className="mt-4 flex gap-3">
        <a href="#learn" className="text-sm font-semibold text-forest">학습 목차로 →</a>
        <a href={`#learn/${first.slug}`} className="text-sm font-semibold text-forest">{first.title}부터 보기 →</a>
      </div>
    </div>
  );
}
