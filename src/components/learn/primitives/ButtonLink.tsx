export function ButtonLink({
  href,
  variant = 'primary',
  children,
}: {
  href: string;
  variant?: 'primary' | 'secondary';
  children: string;
}) {
  const base =
    'inline-flex min-h-[48px] items-center justify-center gap-1 rounded-lg px-4 text-base font-semibold';
  const tone =
    variant === 'primary'
      ? 'bg-forest text-paper hover:bg-forest-700'
      : 'border border-line bg-surface text-forest hover:bg-paper';
  return (
    <a href={href} className={`${base} ${tone}`}>
      {children} <span aria-hidden>→</span>
    </a>
  );
}
