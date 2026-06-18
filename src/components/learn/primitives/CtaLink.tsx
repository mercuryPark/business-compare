export function CtaLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-paper">
      {children} <span aria-hidden>→</span>
    </a>
  );
}
