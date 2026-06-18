import { useLearnSource } from './sourceContext';
import type { ReviewStatus } from '../../../domain/learn/types';

const statusLabel: Record<ReviewStatus, string> = {
  draft: '초안',
  'self-reviewed': '자체 검토',
  'expert-reviewed': '전문가 검토',
};

export function SourceNote({ sourceId }: { sourceId: string }) {
  const source = useLearnSource(sourceId);
  return (
    <span className="text-xs text-muted">
      출처:{' '}
      <a href={source.sourceUrl} target="_blank" rel="noreferrer" className="underline">
        {source.sourceTitle}
      </a>{' '}
      · {source.lastCheckedAt} 확인 · {statusLabel[source.reviewStatus]}
    </span>
  );
}
