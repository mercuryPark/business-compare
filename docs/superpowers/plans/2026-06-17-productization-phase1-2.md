# Productization Phase 1+2 — Design System + Home/Nav/Mobile IA (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the app's entry into a mobile-first Welcome Home ("창업 나침반") that leads into learning, with a 3-way top nav (홈·학습·비교), shared design-system button tokens, and mobile chapter navigation — without breaking any legacy deep link.

**Architecture:** Keep the single Vite/React SPA and hash routing. Extend the route model with a `home` view; the default route and bare `#learn` now render `Home` (replacing the old `LearnLanding`), `#compare` renders the unchanged compare dashboard, `#learn/<slug>` renders chapters. A new `Home` component and `ButtonLink` primitive establish the warm-editorial + bold-box design language; chapters gain mobile TOC drawer + bottom prev/next + position indicator.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind (tokens in `tailwind.config.ts`), Vitest + React Testing Library, Playwright. Tests colocate with components; e2e in `tests/e2e/`. jest-dom is wired via `src/test/setup.ts`.

**Scope note:** This plan covers spec Phases 1–2 only (`docs/superpowers/specs/2026-06-17-productization-design.md` §9.1–9.2 + §4–§5, §10). Phase 3 (content readability/safety) and Phase 4 (compare polish + OG/share + brand-risk launch gates, spec §7.2/§8) are separate later plans. Service name placeholder "창업 나침반".

---

## File Structure

- `src/domain/learn/types.ts` — `LearnRoute` gains `{ view: 'home' }`, loses `{ mode: 'landing' }`.
- `src/domain/learn/route.ts` — `parseLearnHash`: empty/`#`/`#home`/bare `#learn` → home; `#compare` → compare; `#learn/<slug>` → chapter/notFound; fallback → home.
- `src/components/learn/primitives/ButtonLink.tsx` (new) — primary/secondary CTA button-link (48px), design-system token.
- `src/components/Home.tsx` (new) — Welcome Home (hero → quick cards → curriculum preview → trust strip → compare CTA). Replaces `LearnLanding`.
- `src/components/learn/LearnLanding.tsx` + `LearnLanding.test.tsx` — **deleted** (superseded by Home).
- `src/components/TopNav.tsx` — 3 entries (홈/학습/비교), active for `home|learn|compare`.
- `src/App.tsx` — render `Home | CompareView | LearnPage` by `route.view`.
- `src/components/learn/LearnPage.tsx` — drop the `landing` branch (only chapter/notFound).
- `src/components/learn/LearnMobileToc.tsx` (new) — mobile TOC drawer/disclosure.
- `src/components/learn/LearnChapterNav.tsx` — large bottom prev/next + "N / 8" position.
- Test updates: `src/domain/__tests__/learnRoute.test.ts`, `src/components/learn/useHashRoute.test.tsx`, `src/components/learn/LearnPage.test.tsx`, `src/App.test.tsx`, `tests/e2e/app.spec.ts`, `tests/e2e/learn.spec.ts`.

---

## Task 1: ButtonLink primitive (design-system token)

**Files:**
- Create: `src/components/learn/primitives/ButtonLink.tsx`
- Test: `src/components/learn/primitives/ButtonLink.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ButtonLink } from './ButtonLink';

describe('ButtonLink', () => {
  it('renders a primary button-link with href and min height', () => {
    render(<ButtonLink href="#learn/ch1-mindset-money">시작하기</ButtonLink>);
    const link = screen.getByRole('link', { name: '시작하기' });
    expect(link).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(link.className).toContain('min-h-[48px]');
    expect(link.className).toContain('bg-forest');
  });

  it('renders a secondary variant with a distinct style', () => {
    render(<ButtonLink href="#compare" variant="secondary">비교</ButtonLink>);
    const link = screen.getByRole('link', { name: '비교' });
    expect(link.className).not.toContain('bg-forest');
    expect(link.className).toContain('border');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/primitives/ButtonLink.test.tsx`
Expected: FAIL — `ButtonLink` not defined.

- [ ] **Step 3: Implement ButtonLink**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/primitives/ButtonLink.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/primitives/ButtonLink.tsx src/components/learn/primitives/ButtonLink.test.tsx
git commit -m "feat(ui): add ButtonLink primitive (design-system CTA token)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Home component (Welcome Home)

**Files:**
- Create: `src/components/Home.tsx`
- Test: `src/components/Home.test.tsx`

`Home` reuses `CHAPTERS`/`PHASES` from `src/domain/learn/curriculum`. It is a pure presentational component (no props). Quick cards and curriculum links use chapter hash routes; the secondary CTA points to `#compare`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Home } from './Home';

describe('Home', () => {
  it('renders the hero headline and primary CTA into the first chapter', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: /큰돈을 걸기 전에/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /10분 자가진단으로 시작하기/ })).toHaveAttribute(
      'href',
      '#learn/ch1-mindset-money',
    );
  });

  it('renders the four quick-entry cards with correct chapter links', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /지금 시작해도 될까/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(screen.getByRole('link', { name: /계약 전에 멈추기/ })).toHaveAttribute('href', '#learn/ch2-contract');
    expect(screen.getByRole('link', { name: /오픈에 드는 돈/ })).toHaveAttribute('href', '#learn/ch4-startup-cost');
    expect(screen.getByRole('link', { name: /매출이 안 나올 때/ })).toHaveAttribute('href', '#learn/ch7-low-sales');
  });

  it('lists all eight curriculum chapters and a secondary compare CTA', () => {
    render(<Home />);
    expect(screen.getByText('일상 운영의 기본기')).toBeTruthy();
    expect(screen.getByRole('link', { name: /프랜차이즈 비용 비교/ })).toHaveAttribute('href', '#compare');
  });

  it('shows the trust strip noting official sources and 참고용 status', () => {
    render(<Home />);
    expect(screen.getByText(/공식 자료/)).toBeTruthy();
    expect(screen.getByText(/참고용/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Home.test.tsx`
Expected: FAIL — `Home` not defined.

- [ ] **Step 3: Implement Home**

```tsx
import { CHAPTERS, PHASES } from '../domain/learn/curriculum';
import { ButtonLink } from './learn/primitives/ButtonLink';

const QUICK_CARDS = [
  { label: '🚦 지금 시작해도 될까?', desc: '10분 자가진단', href: '#learn/ch1-mindset-money' },
  { label: '📑 계약 전에 멈추기', desc: '정보공개서·계약서', href: '#learn/ch2-contract' },
  { label: '💸 오픈에 드는 돈', desc: '초기비용·놓친 비용', href: '#learn/ch4-startup-cost' },
  { label: '📉 매출이 안 나올 때', desc: '진단과 대응', href: '#learn/ch7-low-sales' },
];

export function Home() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="rounded-2xl bg-mist/50 p-6">
        <h1 className="text-2xl font-bold tracking-tightest text-ink md:text-[32px] md:leading-tight">
          큰돈을 걸기 전에,<br />먼저 알고 시작하세요
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/80">
          가게에 실제로 드는 비용부터 계약·세금에서 놓치기 쉬운 부분까지, 창업이 처음인 분의 눈높이에 맞춰 정리했어요.
        </p>
        <div className="mt-5">
          <ButtonLink href="#learn/ch1-mindset-money">10분 자가진단으로 시작하기</ButtonLink>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">어디서부터 볼까요?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_CARDS.map((card) => (
            <a key={card.href} href={card.href} className="rounded-xl border border-line bg-surface p-4 hover:shadow-md">
              <div className="text-base font-semibold text-forest">{card.label}</div>
              <div className="mt-1 text-sm text-muted">{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">전체 8단계로 차근차근</h2>
        <div className="rounded-xl border border-line bg-surface p-2">
          {PHASES.map((phase) => (
            <div key={phase.id} className="px-2 py-1">
              <div className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
              <ul>
                {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
                  <li key={c.slug} className="border-t border-line/60 first:border-t-0">
                    <a href={`#learn/${c.slug}`} className="block py-2 text-sm text-ink hover:text-forest">
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-mist/40 p-4 text-sm leading-relaxed text-ink/80">
        📌 공정위·국세청·소상공인시장진흥공단 등 <strong>공식 자료를 바탕으로</strong> 정리했어요. 글마다 출처와 검토 상태를
        표시하며, 세무·법률 내용은 전문가 검토 전이라 <strong>참고용</strong>입니다.
      </section>

      <section className="rounded-xl border border-dashed border-line p-4 text-center">
        <div className="text-sm text-muted">어느 정도 감을 잡았다면</div>
        <div className="mt-2 flex justify-center">
          <ButtonLink href="#compare" variant="secondary">프랜차이즈 비용 비교하기</ButtonLink>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Home.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Home.tsx src/components/Home.test.tsx
git commit -m "feat(home): add Welcome Home component (hero, quick cards, curriculum, trust strip)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Routing model switch + TopNav + App wiring + remove LearnLanding

This is the coordinated cut-over. It changes the route model, wires Home, updates the nav, drops the learn landing, and updates every dependent unit test so `npm test` stays green.

**Files:**
- Modify: `src/domain/learn/types.ts`, `src/domain/learn/route.ts`
- Modify: `src/components/TopNav.tsx`, `src/App.tsx`, `src/components/learn/LearnPage.tsx`
- Delete: `src/components/learn/LearnLanding.tsx`, `src/components/learn/LearnLanding.test.tsx`
- Modify tests: `src/domain/__tests__/learnRoute.test.ts`, `src/components/learn/useHashRoute.test.tsx`, `src/components/learn/LearnPage.test.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Update the route test first (TDD for the new model)**

Replace the body of `src/domain/__tests__/learnRoute.test.ts` with:

```typescript
import { describe, expect, it } from 'vitest';

import { parseLearnHash } from '../learn/route';

const SLUGS = ['ch1-mindset-money', 'ch2-contract'];

describe('parseLearnHash', () => {
  it('routes empty / #home / bare #learn to home', () => {
    expect(parseLearnHash('', SLUGS)).toEqual({ view: 'home' });
    expect(parseLearnHash('#', SLUGS)).toEqual({ view: 'home' });
    expect(parseLearnHash('#home', SLUGS)).toEqual({ view: 'home' });
    expect(parseLearnHash('#learn', SLUGS)).toEqual({ view: 'home' });
  });

  it('routes #compare to compare', () => {
    expect(parseLearnHash('#compare', SLUGS)).toEqual({ view: 'compare' });
  });

  it('resolves a known chapter slug', () => {
    expect(parseLearnHash('#learn/ch2-contract', SLUGS)).toEqual({
      view: 'learn',
      mode: 'chapter',
      chapterSlug: 'ch2-contract',
    });
  });

  it('returns notFound for an unknown slug', () => {
    expect(parseLearnHash('#learn/nope', SLUGS)).toEqual({
      view: 'learn',
      mode: 'notFound',
      requestedSlug: 'nope',
    });
  });

  it('falls back to home for anything else', () => {
    expect(parseLearnHash('#whatever', SLUGS)).toEqual({ view: 'home' });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/domain/__tests__/learnRoute.test.ts`
Expected: FAIL (home view not produced yet).

- [ ] **Step 3: Update the `LearnRoute` type**

In `src/domain/learn/types.ts`, replace the `LearnRoute` union with:

```typescript
export type LearnRoute =
  | { view: 'home' }
  | { view: 'compare' }
  | { view: 'learn'; mode: 'chapter'; chapterSlug: string }
  | { view: 'learn'; mode: 'notFound'; requestedSlug: string };
```

- [ ] **Step 4: Update `parseLearnHash`**

Replace `src/domain/learn/route.ts` with:

```typescript
import type { LearnRoute } from './types';

export function parseLearnHash(hash: string, knownSlugs: readonly string[]): LearnRoute {
  const clean = hash.replace(/^#/, '').trim();

  if (clean === '' || clean === 'home' || clean === 'learn') {
    return { view: 'home' };
  }

  if (clean === 'compare') {
    return { view: 'compare' };
  }

  if (clean.startsWith('learn/')) {
    const slug = clean.slice('learn/'.length);
    if (knownSlugs.includes(slug)) {
      return { view: 'learn', mode: 'chapter', chapterSlug: slug };
    }
    return { view: 'learn', mode: 'notFound', requestedSlug: slug };
  }

  return { view: 'home' };
}
```

- [ ] **Step 5: Run route test to verify it passes**

Run: `npx vitest run src/domain/__tests__/learnRoute.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Update TopNav to 3 entries**

Replace `src/components/TopNav.tsx` with:

```tsx
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
```

- [ ] **Step 7: Update App to render Home/Compare/Learn**

Replace `src/App.tsx` with:

```tsx
import { TopNav } from './components/TopNav';
import { Home } from './components/Home';
import { CompareView } from './components/CompareView';
import { LearnPage } from './components/learn/LearnPage';
import { useHashRoute } from './components/learn/useHashRoute';

export default function App() {
  const route = useHashRoute();

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <TopNav active={route.view} />
        {route.view === 'home' && <Home />}
        {route.view === 'compare' && <CompareView />}
        {route.view === 'learn' && <LearnPage route={route} />}
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Drop the landing branch from LearnPage**

In `src/components/learn/LearnPage.tsx`: change the prop type to the chapter/notFound variants only and remove the `landing` branch. Replace the function signature and the first branch:

Change `export function LearnPage({ route }: { route: Extract<LearnRoute, { view: 'learn' }> }) {` — keep as-is (the `Extract` now yields only chapter|notFound). Then DELETE this block entirely:

```tsx
  if (route.mode === 'landing') {
    return <div className="mx-auto max-w-4xl">{<LearnLanding />}</div>;
  }
```

Also remove the now-unused import `import { LearnLanding } from './LearnLanding';`. Keep the `notFound` and chapter branches unchanged.

- [ ] **Step 9: Delete LearnLanding and its test**

```bash
git rm src/components/learn/LearnLanding.tsx src/components/learn/LearnLanding.test.tsx
```

- [ ] **Step 10: Update `LearnPage.test.tsx`**

In `src/components/learn/LearnPage.test.tsx`, DELETE the test that renders landing mode:

```tsx
  it('renders the landing hub in landing mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'landing' }} />);
    expect(screen.getByRole('heading', { name: /비교하기 전에 먼저 배우기/ })).toBeTruthy();
  });
```

Keep the chapter-mode and notFound-mode tests (they already use `mode: 'chapter'` / `mode: 'notFound'`).

- [ ] **Step 11: Update `useHashRoute.test.tsx`**

In `src/components/learn/useHashRoute.test.tsx`, change the default and `#learn` expectations:
- The initial expectation `expect(result.current).toEqual({ view: 'compare' })` becomes `expect(result.current).toEqual({ view: 'home' })`.
- The `#learn` step expectation `toEqual({ view: 'learn', mode: 'landing' })` becomes `toEqual({ view: 'home' })`.
Leave the `#learn/ch2-contract` chapter expectation unchanged.

- [ ] **Step 12: Update `App.test.tsx` to target the compare view**

The compare dashboard is no longer the default view. At the top of `src/App.test.tsx`, after the imports, add hash setup/teardown so every existing test renders the compare view:

```tsx
beforeEach(() => {
  window.location.hash = '#compare';
});
afterEach(() => {
  window.location.hash = '';
});
```

(Import `beforeEach, afterEach` from `vitest` in the existing import line.) No other changes — the dashboard assertions stay valid under `#compare`.

- [ ] **Step 13: Run the full unit suite**

Run: `npm test`
Expected: PASS — route/useHashRoute/LearnPage/App tests green under the new model; Home/ButtonLink tests green; LearnLanding test gone.

- [ ] **Step 14: Typecheck + build**

Run: `npm run build`
Expected: PASS (`tsc -b && vite build`).

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat(nav): default to Home, 3-way top nav, retire LearnLanding

- LearnRoute gains home, drops landing; empty/#home/bare #learn -> home
- App renders Home/Compare/Learn; TopNav 홈/학습/비교
- App.test targets #compare; route/useHashRoute/LearnPage tests updated

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Mobile chapter navigation (TOC drawer + bottom prev/next + position)

**Files:**
- Create: `src/components/learn/LearnMobileToc.tsx`
- Test: `src/components/learn/LearnMobileToc.test.tsx`
- Modify: `src/components/learn/LearnChapterNav.tsx` (+ existing `src/components/learn/LearnNav.test.tsx`)
- Modify: `src/components/learn/LearnPage.tsx` (show sidebar on desktop, mobile TOC on small screens)

- [ ] **Step 1: Write the failing test for LearnMobileToc**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LearnMobileToc } from './LearnMobileToc';

describe('LearnMobileToc', () => {
  it('is collapsed by default and reveals the chapter list when opened', async () => {
    const user = userEvent.setup();
    render(<LearnMobileToc activeSlug="ch2-contract" />);
    const toggle = screen.getByRole('button', { name: /목차/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /마음가짐과 자금 준비/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/learn/LearnMobileToc.test.tsx`
Expected: FAIL — `LearnMobileToc` not defined.

- [ ] **Step 3: Implement LearnMobileToc**

```tsx
import { useState } from 'react';
import { CHAPTERS, PHASES } from '../../domain/learn/curriculum';

export function LearnMobileToc({ activeSlug }: { activeSlug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink"
      >
        목차 {open ? '닫기' : '열기'}
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <nav aria-label="학습 목차" className="mt-2 space-y-3 rounded-lg border border-line bg-surface p-3">
          {PHASES.map((phase) => (
            <div key={phase.id}>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
              <ul className="space-y-1">
                {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#learn/${c.slug}`}
                      aria-current={c.slug === activeSlug ? 'page' : undefined}
                      className={`block rounded px-2 py-1 text-sm ${c.slug === activeSlug ? 'bg-mist font-semibold text-forest' : 'text-ink'}`}
                    >
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/components/learn/LearnMobileToc.test.tsx`
Expected: PASS.

- [ ] **Step 5: Add a position-indicator test to LearnNav.test.tsx**

Append to `src/components/learn/LearnNav.test.tsx` inside the existing `describe`:

```tsx
  it('chapter nav shows the reading position', () => {
    render(<LearnChapterNav activeSlug="ch2-contract" />);
    expect(screen.getByText('2 / 8')).toBeTruthy();
  });
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/components/learn/LearnNav.test.tsx`
Expected: FAIL — no "2 / 8" text yet.

- [ ] **Step 7: Update LearnChapterNav (position + larger buttons)**

Replace `src/components/learn/LearnChapterNav.tsx` with:

```tsx
import { CHAPTERS, getAdjacentChapters } from '../../domain/learn/curriculum';

export function LearnChapterNav({ activeSlug }: { activeSlug: string }) {
  const { prev, next } = getAdjacentChapters(activeSlug);
  const index = CHAPTERS.findIndex((c) => c.slug === activeSlug);
  const position = index >= 0 ? `${index + 1} / ${CHAPTERS.length}` : '';

  const btn = 'inline-flex min-h-[48px] items-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-forest';

  return (
    <nav aria-label="챕터 이동" className="mt-8 border-t border-line pt-4">
      <div className="mb-2 text-center text-xs text-muted">{position}</div>
      <div className="flex justify-between gap-3">
        {prev ? <a href={`#learn/${prev.slug}`} className={btn}>← 이전</a> : <span />}
        {next ? <a href={`#learn/${next.slug}`} className={btn}>다음 →</a> : <span />}
      </div>
    </nav>
  );
}
```

- [ ] **Step 8: Wire LearnMobileToc into LearnPage**

In `src/components/learn/LearnPage.tsx`, in the chapter render, keep the existing desktop sidebar `<aside>` but hide it on mobile, and add the mobile TOC above the article. Change the `<aside>` className to include `hidden md:block`:

```tsx
      <aside className="hidden md:sticky md:top-4 md:block md:self-start">
        <LearnSidebar activeSlug={chapter.slug} />
      </aside>
```

And immediately inside `<article>`, before the warning/disclaimer banners, add:

```tsx
        <div className="mb-4">
          <LearnMobileToc activeSlug={chapter.slug} />
        </div>
```

Add the import: `import { LearnMobileToc } from './LearnMobileToc';`.

- [ ] **Step 9: Run learn component tests + full suite**

Run: `npx vitest run src/components/learn` then `npm test`
Expected: PASS — LearnMobileToc, LearnNav (incl. position), LearnPage all green; full suite green.

- [ ] **Step 10: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(learn): mobile TOC drawer + bottom prev/next with reading position

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: E2E — new IA + backward-compatible deep links

**Files:**
- Modify: `tests/e2e/app.spec.ts` (compare tests now navigate to `#compare`)
- Modify: `tests/e2e/learn.spec.ts` (Home default; nav; deep links; mobile drawer)

- [ ] **Step 1: Point the existing compare e2e at #compare**

In `tests/e2e/app.spec.ts`, every test currently calls `await page.goto('/')`. Change each to `await page.goto('/#compare')` so the compare dashboard renders (it is no longer the default). No other assertions change.

- [ ] **Step 2: Rewrite learn.spec.ts for the new IA**

Replace `tests/e2e/learn.spec.ts` with:

```typescript
import { expect, test } from '@playwright/test';

test('default route shows the Welcome Home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /큰돈을 걸기 전에/ })).toBeVisible();
});

test('home primary CTA opens the first chapter', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /10분 자가진단으로 시작하기/ }).click();
  await expect(page).toHaveURL(/#learn\/ch1-mindset-money/);
  await expect(page.getByRole('heading', { name: '마음가짐과 자금 준비' })).toBeVisible();
});

test('top nav moves between 홈 / 학습 / 비교', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '프랜차이즈 비교' }).click();
  await expect(page).toHaveURL(/#compare/);
  await expect(page.getByRole('heading', { name: '한눈에 보는 창업 지도' })).toBeVisible();
  await page.getByRole('link', { name: '홈' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /큰돈을 걸기 전에/ })).toBeVisible();
});

test('legacy deep links still resolve', async ({ page }) => {
  await page.goto('/#learn'); // legacy bare learn -> home
  await expect(page.getByRole('heading', { level: 1, name: /큰돈을 걸기 전에/ })).toBeVisible();

  await page.goto('/#learn/ch5-monthly-cashflow'); // chapter deep link
  await expect(page.getByRole('heading', { name: /매달 나가는 돈/ })).toBeVisible();

  await page.goto('/#learn/does-not-exist'); // unknown -> not found
  await expect(page.getByText(/찾을 수 없습니다/)).toBeVisible();
});

test('mobile shows the TOC drawer on a chapter', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/#learn/ch2-contract');
  const toggle = page.getByRole('button', { name: /목차/ });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.getByRole('link', { name: /마음가짐과 자금 준비/ })).toBeVisible();
});
```

- [ ] **Step 2b: Sanity-check chapter headings used above**

Confirm the chapter `<h2>` titles match: ch1 "마음가짐과 자금 준비", ch5 contains "매달 나가는 돈", ch2 chapter loads. (These come from the chapter bodies authored earlier; if a heading differs, align the test text to the actual `<h2>`.)

- [ ] **Step 3: Run the e2e suite**

Run: `PATH=/Users/hoyeon/.nvm/versions/node/v20.19.6/bin:$PATH npm run e2e`
Expected: PASS — updated compare specs (now at `#compare`) + new learn/home specs, on chromium and mobile-chrome. (Node 20.19+ required per README.)

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/app.spec.ts tests/e2e/learn.spec.ts
git commit -m "test(e2e): cover Home default, 3-way nav, legacy deep links, mobile TOC

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** design tokens/ButtonLink (T1, spec §4); Welcome Home with hero/quick-cards/curriculum/trust strip/secondary CTA (T2, spec §5); routing default→home, bare `#learn`→home, 3-way nav (T3, spec §5); mobile chapter nav drawer + bottom prev/next + position (T4, spec §5); Phase-2 backward-compatibility acceptance criteria — empty hash, `#compare`, `#learn`, every chapter deep link, unknown slug (T5, spec §9.2); testing across unit/component/e2e (spec §10). Phases 3–4 (content readability/safety, compare polish, OG/share, brand-risk gates) are explicitly deferred to later plans.
- **Placeholder scan:** every code/test step shows real code or an exact edit; no TBD/TODO. Test-migration edits name the exact lines/strings to change.
- **Type consistency:** `LearnRoute` (home|compare|learn{chapter|notFound}) is defined in T3 and used consistently by `route.ts`, `useHashRoute`, `App`, `LearnPage`, and `TopNav` (`active: 'home'|'learn'|'compare'`). `ButtonLink`/`Home`/`LearnMobileToc`/`LearnChapterNav` signatures match their usages.
