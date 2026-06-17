export function TopNav({ active }: { active: 'home' | 'learn' | 'compare' }) {
  const base = 'rounded-lg px-3 py-2 text-sm font-semibold';
  const cls = (on: boolean) => `${base} ${on ? 'bg-forest text-paper' : 'text-ink hover:bg-paper'}`;
  return (
    <nav aria-label="주요 메뉴" className="mb-6 flex gap-2 border-b border-line pb-3">
      <a href="#home" aria-current={active === 'home' ? 'page' : undefined} className={cls(active === 'home')}>홈</a>
      <a href="#learn/ch1-mindset-money" aria-current={active === 'learn' ? 'page' : undefined} className={cls(active === 'learn')}>창업 학습</a>
      <a href="#compare" aria-current={active === 'compare' ? 'page' : undefined} className={cls(active === 'compare')}>프랜차이즈 비교</a>
    </nav>
  );
}
