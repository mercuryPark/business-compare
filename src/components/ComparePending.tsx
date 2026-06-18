import { ButtonLink } from './learn/primitives/ButtonLink';

export function ComparePending() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-8 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-ink">프랜차이즈 비교는 준비 중입니다</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        브랜드별 비용·매출 비교는 데이터 검증을 마친 뒤 공개할 예정입니다. 그동안 창업에 꼭 필요한
        내용을 먼저 둘러보세요.
      </p>
      <div className="mt-5 flex justify-center">
        <ButtonLink href="#learn/ch1-mindset-money">창업 학습 시작하기</ButtonLink>
      </div>
    </div>
  );
}
