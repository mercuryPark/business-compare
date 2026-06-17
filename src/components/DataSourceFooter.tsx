import type { ProjectDataSource } from '../domain/dataSources';
import { currentProjectDataSources, recommendedProjectDataSources } from '../domain/dataSources';

export function DataSourceFooter() {
  return (
    <footer
      aria-labelledby="data-source-footer-title"
      className="rounded-lg border border-line bg-ink p-4 text-sm text-white shadow-sm md:p-6"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-cream">Data transparency</p>
        <h2 id="data-source-footer-title" className="mt-2 text-xl font-semibold text-white">
          데이터 출처와 보강 후보
        </h2>
        <p className="mt-2 leading-6 text-white/70">
          현재 화면에 반영된 근거와, 앞으로 붙이면 판단 정확도가 올라가는 외부 데이터를 분리했습니다.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SourceList title="현재 화면에 반영된 데이터" sources={currentProjectDataSources} />
        <SourceList title="추가 확보하면 정확도가 올라가는 데이터" sources={recommendedProjectDataSources} />
      </div>
    </footer>
  );
}

function SourceList({ title, sources }: { title: string; sources: ProjectDataSource[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-3">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li key={source.title} className="rounded-lg border border-white/10 bg-white p-3 text-ink">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold leading-6 text-ink underline decoration-line underline-offset-4"
                >
                  {source.title}
                </a>
              ) : (
                <p className="font-semibold leading-6 text-ink">{source.title}</p>
              )}
              <span className="w-fit rounded-full border border-line bg-paper px-2 py-0.5 text-xs font-medium text-muted">
                {source.status}
              </span>
            </div>
            <p className="mt-2 leading-6 text-muted">{source.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
