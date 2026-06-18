export function ContractQuestionList({ questions }: { questions: string[] }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <h4 className="mb-2 text-sm font-semibold text-forest">본사 상담 때 반드시 물어볼 질문</h4>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-ink">
        {questions.map((q) => <li key={q}>{q}</li>)}
      </ol>
    </div>
  );
}
