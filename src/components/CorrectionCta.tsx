import { FilePenLine } from 'lucide-react';

export function CorrectionCta({ brandName }: { brandName: string }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <FilePenLine className="mt-0.5 h-5 w-5 text-info" />
        <div>
          <h3 className="text-base font-semibold">자료 정정 요청</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            {brandName} 관련 수치나 출처가 다르다고 판단되면 disputed field, 근거 자료, 요청 내용을 기록해
            검토하는 흐름이 필요합니다. 프로토타입에서는 요청 경로만 표시합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
