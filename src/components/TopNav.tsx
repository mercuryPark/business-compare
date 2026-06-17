export function TopNav({ active }: { active: 'compare' | 'learn' }) {
  const base = 'rounded-lg px-3 py-2 text-sm font-semibold';
  return (
    <nav aria-label="주요 메뉴" className="mb-6 flex gap-2 border-b border-line pb-3">
      <a
        href="#compare"
        aria-current={active === 'compare' ? 'page' : undefined}
        className={`${base} ${active === 'compare' ? 'bg-forest text-paper' : 'text-ink hover:bg-paper'}`}
      >
        프랜차이즈 비교
      </a>
      <a
        href="#learn"
        aria-current={active === 'learn' ? 'page' : undefined}
        className={`${base} ${active === 'learn' ? 'bg-forest text-paper' : 'text-ink hover:bg-paper'}`}
      >
        창업 학습
      </a>
    </nav>
  );
}
