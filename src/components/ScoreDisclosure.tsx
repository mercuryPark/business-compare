import type { BrandScore } from '../domain/scoring';

export function getScoreGradeLabel(score: BrandScore): string {
  return score.grade === 'insufficient-data' ? '판단 보류' : `${score.grade} 등급`;
}

export function getClosureRiskLabel(score: BrandScore): string {
  return score.closureRisk === 'insufficient-data' ? '검증 후 판단' : score.closureRisk;
}

export function ScoreReason({ score, className = '' }: { score: BrandScore; className?: string }) {
  if (score.grade !== 'insufficient-data' || score.drivers.length === 0) {
    return null;
  }

  return (
    <p className={`text-xs leading-5 text-watch ${className}`.trim()}>
      {score.drivers.map(formatScoreDriver).join(' · ')}
    </p>
  );
}

function formatScoreDriver(driver: string): string {
  if (driver === 'P0 데이터 검증 전') {
    return '원문·비용 검토 전: 점수보다 출처 확인이 먼저입니다';
  }
  if (driver === 'P0 수치 검증 필요') {
    return '검증 수치 보완 필요';
  }
  return driver;
}
