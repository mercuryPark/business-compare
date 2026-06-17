export function TermExplainer({ term, explanation }: { term: string; explanation: string }) {
  return (
    <abbr title={explanation} className="cursor-help border-b border-dotted border-muted no-underline">
      {term}
    </abbr>
  );
}
