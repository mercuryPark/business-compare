# Founder Education Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "창업 학습" education page to the franchise comparison SPA, with hash-based navigation, a source-enforced content model, a prelaunch review gate, and an 8-chapter Korean curriculum.

**Architecture:** Keep the single Vite/React SPA. A pure hash parser (`route.ts`) selects compare vs. learn view; `App` becomes a thin router rendering `TopNav` + either the extracted `CompareView` or `LearnPage` (landing / chapter / not-found). Learn content lives in `curriculum.ts` (typed index) + `Chapter1..8.tsx` (editorial bodies) composed from primitives. Numeric primitives require a `sourceId` resolved against the chapter's `LearnSource[]` via React context, so no concrete number renders without a bound official source. A `check:learn-sources` script gates publish on expert review.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind (tokens in `tailwind.config.ts`), Vitest + React Testing Library, Playwright. Tests colocate with components (`*.test.tsx`) and under `src/domain/__tests__/`.

---

## File Structure

**Domain (pure, testable):**
- `src/domain/learn/types.ts` — `LearnSource`, `LearnSourceCategory`, `ReviewStatus`, `LearnPhase`, `LearnChapter`, route descriptor types.
- `src/domain/learn/route.ts` — `parseLearnHash(hash): LearnRoute` pure function.
- `src/domain/learn/curriculum.ts` — the 8-chapter index + helpers (`getChapter`, `getAdjacentChapters`, `CHAPTERS`, `PHASES`).
- `src/domain/learn/sourceGate.ts` — `SENSITIVE_CATEGORIES`, `findSourceGateViolations(chapters)`.
- `src/domain/__tests__/learnRoute.test.ts`, `learnCurriculum.test.ts`, `learnSourceGate.test.ts`.

**Script:**
- `src/scripts/checkLearnSources.ts` — wraps `findSourceGateViolations`, sets `process.exitCode`.

**Primitives (`src/components/learn/primitives/`):**
- `sourceContext.tsx` — `LearnSourcesProvider`, `useLearnSource(id)`.
- `SourceNote.tsx`, `NumericClaim.tsx`, `SourceBackedTable.tsx`, `MoneyScenario.tsx`, `CashflowWaterfall.tsx`, `CashflowCalendar.tsx` (source-bound).
- `Callout.tsx`, `Caveat.tsx`, `CtaLink.tsx`, `TermExplainer.tsx`, `HiddenCostList.tsx`, `DecisionChecklist.tsx`, `HardStopGate.tsx`, `ContractQuestionList.tsx`.

**Learn page (`src/components/learn/`):**
- `useHashRoute.ts`, `LearnPage.tsx`, `LearnLanding.tsx`, `LearnSidebar.tsx`, `LearnChapterNav.tsx`, `LearnNotFound.tsx`.

**Content (`src/content/learn/`):**
- `Chapter1.tsx` … `Chapter8.tsx`.

**App-level:**
- `src/components/TopNav.tsx`, `src/components/CompareView.tsx` (extracted), `src/App.tsx` (rewired).
- `tests/e2e/learn.spec.ts`, `package.json` (script).

---

## Part 1 — Shell & Enforcement Infrastructure

### Task 1: Learn domain types

**Files:**
- Create: `src/domain/learn/types.ts`

- [ ] **Step 1: Write the types**

```typescript
import type { ComponentType } from 'react';

export type LearnPhase = 'prepare' | 'operate' | 'respond';

export type ReviewStatus = 'draft' | 'self-reviewed' | 'expert-reviewed';

export type LearnSourceCategory =
  | 'tax'
  | 'wage'
  | 'contract'
  | 'lease'
  | 'licensing'
  | 'general';

export interface LearnSource {
  id: string;
  category: LearnSourceCategory;
  sourceTitle: string;
  sourceUrl: string;
  lastCheckedAt: string; // ISO date, e.g. '2026-06-17'
  reviewStatus: ReviewStatus;
  reviewer: string | null;
}

export interface LearnChapter {
  id: string;
  slug: string;
  phase: LearnPhase;
  order: number;
  title: string;
  summary: string;
  body: ComponentType;
  sources: LearnSource[];
}

export type LearnRoute =
  | { view: 'compare' }
  | { view: 'learn'; mode: 'landing' }
  | { view: 'learn'; mode: 'chapter'; chapterSlug: string }
  | { view: 'learn'; mode: 'notFound'; requestedSlug: string };
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc -b --noEmit`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/domain/learn/types.ts
git commit -m "feat(learn): add learn domain types"
```

---

### Task 2: Hash route parser

**Files:**
- Create: `src/domain/learn/route.ts`
- Test: `src/domain/__tests__/learnRoute.test.ts`

The parser needs the set of known slugs. To avoid a circular import with `curriculum.ts`, `parseLearnHash` takes the known slugs as an argument.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from 'vitest';

import { parseLearnHash } from '../learn/route';

const SLUGS = ['ch1-mindset-money', 'ch2-contract'];

describe('parseLearnHash', () => {
  it('treats empty / #compare as the compare view', () => {
    expect(parseLearnHash('', SLUGS)).toEqual({ view: 'compare' });
    expect(parseLearnHash('#', SLUGS)).toEqual({ view: 'compare' });
    expect(parseLearnHash('#compare', SLUGS)).toEqual({ view: 'compare' });
  });

  it('treats #learn as the landing hub, not the first chapter', () => {
    expect(parseLearnHash('#learn', SLUGS)).toEqual({ view: 'learn', mode: 'landing' });
  });

  it('resolves a known chapter slug', () => {
    expect(parseLearnHash('#learn/ch2-contract', SLUGS)).toEqual({
      view: 'learn',
      mode: 'chapter',
      chapterSlug: 'ch2-contract',
    });
  });

  it('returns notFound for an unknown slug instead of redirecting', () => {
    expect(parseLearnHash('#learn/nope', SLUGS)).toEqual({
      view: 'learn',
      mode: 'notFound',
      requestedSlug: 'nope',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/__tests__/learnRoute.test.ts`
Expected: FAIL — `parseLearnHash` is not defined.

- [ ] **Step 3: Write the implementation**

```typescript
import type { LearnRoute } from './types';

export function parseLearnHash(hash: string, knownSlugs: readonly string[]): LearnRoute {
  const clean = hash.replace(/^#/, '').trim();

  if (clean === '' || clean === 'compare') {
    return { view: 'compare' };
  }

  if (clean === 'learn') {
    return { view: 'learn', mode: 'landing' };
  }

  if (clean.startsWith('learn/')) {
    const slug = clean.slice('learn/'.length);
    if (knownSlugs.includes(slug)) {
      return { view: 'learn', mode: 'chapter', chapterSlug: slug };
    }
    return { view: 'learn', mode: 'notFound', requestedSlug: slug };
  }

  return { view: 'compare' };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/domain/__tests__/learnRoute.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/domain/learn/route.ts src/domain/__tests__/learnRoute.test.ts
git commit -m "feat(learn): add hash route parser with landing and not-found"
```

---

### Task 3: Curriculum index with placeholder bodies

**Files:**
- Create: `src/content/learn/Chapter1.tsx` … `Chapter8.tsx` (scaffold bodies, replaced in Part 2)
- Create: `src/domain/learn/curriculum.ts`
- Test: `src/domain/__tests__/learnCurriculum.test.ts`

- [ ] **Step 1: Create eight scaffold chapter bodies**

Each file is identical except for the heading text. Create all eight now; Part 2 replaces the bodies. Example for `src/content/learn/Chapter1.tsx`:

```tsx
export function Chapter1() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-ink">마음가짐과 자금 준비</h2>
      <p className="text-muted">작성 예정 — Part 2에서 본문을 채웁니다.</p>
    </div>
  );
}
```

Create `Chapter2.tsx`..`Chapter8.tsx` the same way with these headings:
`Chapter2` → "계약 전 멈춤 — 정보공개서·가맹계약서 읽기";
`Chapter3` → "입지·상권·임대차·인허가";
`Chapter4` → "창업에 드는 돈 — 초기비용 전체 지도";
`Chapter5` → "매달 나가는 돈 + 돈의 흐름";
`Chapter6` → "일상 운영의 기본기";
`Chapter7` → "매출이 안 나올 때 — 진단과 회복";
`Chapter8` → "매출이 잘 나올 때 — 지속과 확장".

- [ ] **Step 2: Write the curriculum index**

```tsx
import type { LearnChapter, LearnPhase } from './types';
import { Chapter1 } from '../../content/learn/Chapter1';
import { Chapter2 } from '../../content/learn/Chapter2';
import { Chapter3 } from '../../content/learn/Chapter3';
import { Chapter4 } from '../../content/learn/Chapter4';
import { Chapter5 } from '../../content/learn/Chapter5';
import { Chapter6 } from '../../content/learn/Chapter6';
import { Chapter7 } from '../../content/learn/Chapter7';
import { Chapter8 } from '../../content/learn/Chapter8';

export const PHASES: { id: LearnPhase; label: string }[] = [
  { id: 'prepare', label: '준비' },
  { id: 'operate', label: '운영' },
  { id: 'respond', label: '대응' },
];

// Seed each chapter with at least one draft source so curriculum invariants hold
// before Part 2 authoring. Real sources are added with the content.
const seedSource = (id: string): LearnChapter['sources'] => [
  {
    id,
    category: 'general',
    sourceTitle: '작성 예정',
    sourceUrl: 'https://example.com',
    lastCheckedAt: '2026-06-17',
    reviewStatus: 'draft',
    reviewer: null,
  },
];

export const CHAPTERS: LearnChapter[] = [
  { id: 'ch1', slug: 'ch1-mindset-money', phase: 'prepare', order: 1, title: '마음가짐과 자금 준비', summary: '자금 준비와 창업하면 안 되는 조건', body: Chapter1, sources: seedSource('ch1-seed') },
  { id: 'ch2', slug: 'ch2-contract', phase: 'prepare', order: 2, title: '계약 전 멈춤 — 정보공개서·가맹계약서', summary: '계약 전 반드시 확인할 것', body: Chapter2, sources: seedSource('ch2-seed') },
  { id: 'ch3', slug: 'ch3-location-license', phase: 'prepare', order: 3, title: '입지·상권·임대차·인허가', summary: '장소를 구하고 허가받기', body: Chapter3, sources: seedSource('ch3-seed') },
  { id: 'ch4', slug: 'ch4-startup-cost', phase: 'prepare', order: 4, title: '창업에 드는 돈 — 초기비용 전체 지도', summary: '초기비용과 최악의 손실 계산', body: Chapter4, sources: seedSource('ch4-seed') },
  { id: 'ch5', slug: 'ch5-monthly-cashflow', phase: 'operate', order: 5, title: '매달 나가는 돈 + 돈의 흐름', summary: '운영비용과 손익 흐름', body: Chapter5, sources: seedSource('ch5-seed') },
  { id: 'ch6', slug: 'ch6-operations', phase: 'operate', order: 6, title: '일상 운영의 기본기', summary: '손익·인력·재고·마케팅', body: Chapter6, sources: seedSource('ch6-seed') },
  { id: 'ch7', slug: 'ch7-low-sales', phase: 'respond', order: 7, title: '매출이 안 나올 때 — 진단과 회복', summary: '원인 진단과 손절 판단', body: Chapter7, sources: seedSource('ch7-seed') },
  { id: 'ch8', slug: 'ch8-high-sales', phase: 'respond', order: 8, title: '매출이 잘 나올 때 — 지속과 확장', summary: '세금·확장·번아웃 관리', body: Chapter8, sources: seedSource('ch8-seed') },
];

export const CHAPTER_SLUGS = CHAPTERS.map((c) => c.slug);

export function getChapter(slug: string): LearnChapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function getAdjacentChapters(slug: string): {
  prev: LearnChapter | null;
  next: LearnChapter | null;
} {
  const index = CHAPTERS.findIndex((c) => c.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? CHAPTERS[index - 1] : null,
    next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null,
  };
}
```

- [ ] **Step 3: Write the failing test**

```typescript
import { describe, expect, it } from 'vitest';

import { CHAPTERS, getAdjacentChapters, getChapter } from '../learn/curriculum';

describe('learn curriculum', () => {
  it('has eight chapters with unique, contiguous, sorted order', () => {
    expect(CHAPTERS).toHaveLength(8);
    const slugs = CHAPTERS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(8);
    expect(CHAPTERS.map((c) => c.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('every chapter has a non-empty sources list with valid category and status', () => {
    const categories = new Set(['tax', 'wage', 'contract', 'lease', 'licensing', 'general']);
    const statuses = new Set(['draft', 'self-reviewed', 'expert-reviewed']);
    for (const chapter of CHAPTERS) {
      expect(chapter.sources.length).toBeGreaterThan(0);
      for (const source of chapter.sources) {
        expect(categories.has(source.category)).toBe(true);
        expect(statuses.has(source.reviewStatus)).toBe(true);
      }
    }
  });

  it('computes adjacent chapters with null at the ends', () => {
    expect(getAdjacentChapters('ch1-mindset-money').prev).toBeNull();
    expect(getAdjacentChapters('ch1-mindset-money').next?.slug).toBe('ch2-contract');
    expect(getAdjacentChapters('ch8-high-sales').next).toBeNull();
    expect(getChapter('ch4-startup-cost')?.title).toContain('초기비용');
  });
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/domain/__tests__/learnCurriculum.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content/learn src/domain/learn/curriculum.ts src/domain/__tests__/learnCurriculum.test.ts
git commit -m "feat(learn): add curriculum index with scaffold chapter bodies"
```

---

### Task 4: Source gate (domain logic)

**Files:**
- Create: `src/domain/learn/sourceGate.ts`
- Test: `src/domain/__tests__/learnSourceGate.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from 'vitest';

import type { LearnChapter, LearnSource } from '../learn/types';
import { findSourceGateViolations } from '../learn/sourceGate';

function chapter(sources: LearnSource[]): LearnChapter {
  return {
    id: 'x', slug: 'x', phase: 'prepare', order: 1, title: 'x', summary: 'x',
    body: () => null, sources,
  };
}

const expertTax: LearnSource = {
  id: 's1', category: 'tax', sourceTitle: '국세청', sourceUrl: 'https://nts.go.kr',
  lastCheckedAt: '2026-06-17', reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('findSourceGateViolations', () => {
  it('flags a sensitive-category source that is not expert-reviewed', () => {
    const draftTax = { ...expertTax, id: 's2', reviewStatus: 'draft' as const, reviewer: null };
    const violations = findSourceGateViolations([chapter([draftTax])]);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ sourceId: 's2', reason: 'not-expert-reviewed' });
  });

  it('passes when all sensitive sources are expert-reviewed', () => {
    expect(findSourceGateViolations([chapter([expertTax])])).toHaveLength(0);
  });

  it('ignores general-category drafts', () => {
    const draftGeneral = { ...expertTax, id: 's3', category: 'general' as const, reviewStatus: 'draft' as const };
    expect(findSourceGateViolations([chapter([draftGeneral])])).toHaveLength(0);
  });

  it('flags malformed records (missing url or bad date)', () => {
    const bad = { ...expertTax, id: 's4', sourceUrl: '' };
    const violations = findSourceGateViolations([chapter([bad])]);
    expect(violations.some((v) => v.reason === 'malformed')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/__tests__/learnSourceGate.test.ts`
Expected: FAIL — `findSourceGateViolations` not defined.

- [ ] **Step 3: Write the implementation**

```typescript
import type { LearnChapter, LearnSourceCategory } from './types';

export const SENSITIVE_CATEGORIES: ReadonlySet<LearnSourceCategory> = new Set([
  'tax', 'wage', 'contract', 'lease', 'licensing',
]);

export interface GateViolation {
  chapterSlug: string;
  sourceId: string;
  reason: 'not-expert-reviewed' | 'malformed';
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function findSourceGateViolations(chapters: LearnChapter[]): GateViolation[] {
  const violations: GateViolation[] = [];

  for (const chapter of chapters) {
    for (const source of chapter.sources) {
      if (!source.sourceUrl || !ISO_DATE.test(source.lastCheckedAt)) {
        violations.push({ chapterSlug: chapter.slug, sourceId: source.id, reason: 'malformed' });
        continue;
      }
      if (SENSITIVE_CATEGORIES.has(source.category) && source.reviewStatus !== 'expert-reviewed') {
        violations.push({ chapterSlug: chapter.slug, sourceId: source.id, reason: 'not-expert-reviewed' });
      }
    }
  }

  return violations;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/domain/__tests__/learnSourceGate.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/domain/learn/sourceGate.ts src/domain/__tests__/learnSourceGate.test.ts
git commit -m "feat(learn): add source review gate domain logic"
```

---

### Task 5: Prelaunch gate script + npm script

**Files:**
- Create: `src/scripts/checkLearnSources.ts`
- Modify: `package.json` (add `check:learn-sources` script)

- [ ] **Step 1: Write the script**

```typescript
import { CHAPTERS } from '../domain/learn/curriculum';
import { findSourceGateViolations } from '../domain/learn/sourceGate';

const violations = findSourceGateViolations(CHAPTERS);

if (violations.length === 0) {
  console.log('Learn source gate: OK');
  console.log(`Chapters checked: ${CHAPTERS.length}`);
} else {
  console.error('Learn source gate: FAILED');
  for (const v of violations) {
    console.error(`- ${v.chapterSlug} / ${v.sourceId}: ${v.reason}`);
  }
  process.exitCode = 1;
}
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, add after `check:p0:sources`:

```json
"check:learn-sources": "vite-node src/scripts/checkLearnSources.ts",
```

- [ ] **Step 3: Run the script (expected to FAIL on seed drafts)**

Run: `npm run check:learn-sources`
Expected: This passes for now — seed sources are `category: 'general'`, which is not sensitive. Output: `Learn source gate: OK`. (The gate becomes meaningful once Part 2 adds sensitive-category sources; before public launch they must be `expert-reviewed`.)

- [ ] **Step 4: Commit**

```bash
git add src/scripts/checkLearnSources.ts package.json
git commit -m "feat(learn): add check:learn-sources prelaunch gate script"
```

---

### Task 6: Source context + SourceNote primitive

**Files:**
- Create: `src/components/learn/primitives/sourceContext.tsx`
- Create: `src/components/learn/primitives/SourceNote.tsx`
- Test: `src/components/learn/primitives/SourceNote.test.tsx`

- [ ] **Step 1: Write the source context**

```tsx
import { createContext, useContext, type ReactNode } from 'react';
import type { LearnSource } from '../../../domain/learn/types';

const LearnSourcesContext = createContext<LearnSource[]>([]);

export function LearnSourcesProvider({
  sources,
  children,
}: {
  sources: LearnSource[];
  children: ReactNode;
}) {
  return <LearnSourcesContext.Provider value={sources}>{children}</LearnSourcesContext.Provider>;
}

export function useLearnSource(sourceId: string): LearnSource {
  const sources = useContext(LearnSourcesContext);
  const source = sources.find((s) => s.id === sourceId);
  if (!source) {
    throw new Error(`Unknown learn sourceId: "${sourceId}". Add it to the chapter's sources.`);
  }
  return source;
}
```

- [ ] **Step 2: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LearnSource } from '../../../domain/learn/types';
import { LearnSourcesProvider } from './sourceContext';
import { SourceNote } from './SourceNote';

const source: LearnSource = {
  id: 'nts-vat', category: 'tax', sourceTitle: '국세청 부가가치세 안내',
  sourceUrl: 'https://nts.go.kr', lastCheckedAt: '2026-06-17',
  reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('SourceNote', () => {
  it('renders the source title, link, and review status', () => {
    render(
      <LearnSourcesProvider sources={[source]}>
        <SourceNote sourceId="nts-vat" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('국세청 부가가치세 안내')).toBeTruthy();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://nts.go.kr');
    expect(screen.getByText(/전문가 검토/)).toBeTruthy();
  });
});
```

- [ ] **Step 3: Write SourceNote**

```tsx
import { useLearnSource } from './sourceContext';
import type { ReviewStatus } from '../../../domain/learn/types';

const statusLabel: Record<ReviewStatus, string> = {
  draft: '초안',
  'self-reviewed': '자체 검토',
  'expert-reviewed': '전문가 검토',
};

export function SourceNote({ sourceId }: { sourceId: string }) {
  const source = useLearnSource(sourceId);
  return (
    <span className="text-xs text-muted">
      출처:{' '}
      <a href={source.sourceUrl} target="_blank" rel="noreferrer" className="underline">
        {source.sourceTitle}
      </a>{' '}
      · {source.lastCheckedAt} 확인 · {statusLabel[source.reviewStatus]}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/primitives/SourceNote.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/primitives/sourceContext.tsx src/components/learn/primitives/SourceNote.tsx src/components/learn/primitives/SourceNote.test.tsx
git commit -m "feat(learn): add source context and SourceNote primitive"
```

---

### Task 7: NumericClaim primitive (required sourceId)

**Files:**
- Create: `src/components/learn/primitives/NumericClaim.tsx`
- Test: `src/components/learn/primitives/NumericClaim.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LearnSource } from '../../../domain/learn/types';
import { LearnSourcesProvider } from './sourceContext';
import { NumericClaim } from './NumericClaim';

const source: LearnSource = {
  id: 'min-wage', category: 'wage', sourceTitle: '최저임금위원회',
  sourceUrl: 'https://minimumwage.go.kr', lastCheckedAt: '2026-06-17',
  reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('NumericClaim', () => {
  it('renders the label, value, basis note, and a resolved source', () => {
    render(
      <LearnSourcesProvider sources={[source]}>
        <NumericClaim label="최저임금(시급)" value="약 10,000원대" basis="2026년 기준" sourceId="min-wage" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('최저임금(시급)')).toBeTruthy();
    expect(screen.getByText('약 10,000원대')).toBeTruthy();
    expect(screen.getByText('2026년 기준')).toBeTruthy();
    expect(screen.getByText('최저임금위원회')).toBeTruthy();
  });

  it('throws when the sourceId is not registered (authoring safety net)', () => {
    expect(() =>
      render(
        <LearnSourcesProvider sources={[]}>
          <NumericClaim label="x" value="1" sourceId="missing" />
        </LearnSourcesProvider>,
      ),
    ).toThrow(/Unknown learn sourceId/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/primitives/NumericClaim.test.tsx`
Expected: FAIL — `NumericClaim` not defined.

- [ ] **Step 3: Write NumericClaim**

```tsx
import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export function NumericClaim({
  label,
  value,
  basis,
  sourceId,
}: {
  label: string;
  value: string;
  basis?: string;
  sourceId: string; // required: no number without a bound source
}) {
  useLearnSource(sourceId); // throws early if unregistered
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-base font-semibold text-ink">{value}</span>
      </div>
      {basis && <div className="text-xs text-muted">{basis}</div>}
      <div className="mt-1">
        <SourceNote sourceId={sourceId} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/primitives/NumericClaim.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/primitives/NumericClaim.tsx src/components/learn/primitives/NumericClaim.test.tsx
git commit -m "feat(learn): add source-bound NumericClaim primitive"
```

---

### Task 8: DecisionChecklist primitive (localStorage)

**Files:**
- Create: `src/components/learn/primitives/DecisionChecklist.tsx`
- Test: `src/components/learn/primitives/DecisionChecklist.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { DecisionChecklist } from './DecisionChecklist';

afterEach(() => localStorage.clear());

describe('DecisionChecklist', () => {
  it('renders items and toggles a check, persisting to localStorage', async () => {
    const user = userEvent.setup();
    render(<DecisionChecklist id="contract" title="계약 전 체크" items={['정보공개서를 직접 읽었다', '영업지역을 확인했다']} />);

    expect(screen.getByText('계약 전 체크')).toBeTruthy();
    const first = screen.getByRole('checkbox', { name: '정보공개서를 직접 읽었다' });
    expect(first).not.toBeChecked();

    await user.click(first);
    expect(first).toBeChecked();
    expect(localStorage.getItem('learn-checklist:contract')).toContain('정보공개서를 직접 읽었다');
  });

  it('restores checked state from localStorage on mount', () => {
    localStorage.setItem('learn-checklist:contract', JSON.stringify(['영업지역을 확인했다']));
    render(<DecisionChecklist id="contract" title="계약 전 체크" items={['정보공개서를 직접 읽었다', '영업지역을 확인했다']} />);
    expect(screen.getByRole('checkbox', { name: '영업지역을 확인했다' })).toBeChecked();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/primitives/DecisionChecklist.test.tsx`
Expected: FAIL — `DecisionChecklist` not defined.

- [ ] **Step 3: Write DecisionChecklist**

```tsx
import { useEffect, useState } from 'react';

export function DecisionChecklist({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  const storageKey = `learn-checklist:${id}`;
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw) as string[]);
    } catch {
      // ignore corrupt storage
    }
  }, [storageKey]);

  function toggle(item: string) {
    setChecked((current) => {
      const next = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore write failures (private mode, quota)
      }
      return next;
    });
  }

  return (
    <section className="rounded-xl border border-line bg-mist/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-forest">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={checked.includes(item)}
                onChange={() => toggle(item)}
                aria-label={item}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/primitives/DecisionChecklist.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/primitives/DecisionChecklist.tsx src/components/learn/primitives/DecisionChecklist.test.tsx
git commit -m "feat(learn): add DecisionChecklist with localStorage persistence"
```

---

### Task 9: HardStopGate primitive

**Files:**
- Create: `src/components/learn/primitives/HardStopGate.tsx`
- Test: `src/components/learn/primitives/HardStopGate.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HardStopGate } from './HardStopGate';

describe('HardStopGate', () => {
  it('renders the stop heading and each stop condition', () => {
    render(<HardStopGate conditions={['생활비 6~12개월치가 없다', '총투자금 대부분이 고금리 대출이다']} />);
    expect(screen.getByRole('heading', { name: /지금은 멈춰야/ })).toBeTruthy();
    expect(screen.getByText('생활비 6~12개월치가 없다')).toBeTruthy();
    expect(screen.getByText('총투자금 대부분이 고금리 대출이다')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/primitives/HardStopGate.test.tsx`
Expected: FAIL — `HardStopGate` not defined.

- [ ] **Step 3: Write HardStopGate**

```tsx
export function HardStopGate({ conditions }: { conditions: string[] }) {
  return (
    <section className="rounded-xl border border-danger/30 bg-danger/5 p-4">
      <h3 className="mb-2 text-base font-semibold text-danger">
        🚫 다음 중 하나라도 해당하면 지금은 멈춰야 합니다
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
        {conditions.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/primitives/HardStopGate.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/primitives/HardStopGate.tsx src/components/learn/primitives/HardStopGate.test.tsx
git commit -m "feat(learn): add HardStopGate primitive"
```

---

### Task 10: Presentational + remaining source-bound primitives

These are low-logic presentational components. Build them together with one combined test file. The source-bound ones (`SourceBackedTable`, `MoneyScenario`, `CashflowWaterfall`, `CashflowCalendar`) call `useLearnSource(sourceId)` so a missing source throws.

**Files:**
- Create: `src/components/learn/primitives/Callout.tsx`, `Caveat.tsx`, `CtaLink.tsx`, `TermExplainer.tsx`, `HiddenCostList.tsx`, `ContractQuestionList.tsx`, `SourceBackedTable.tsx`, `MoneyScenario.tsx`, `CashflowWaterfall.tsx`, `CashflowCalendar.tsx`
- Test: `src/components/learn/primitives/primitives.test.tsx`

- [ ] **Step 1: Write the simple presentational primitives**

`Callout.tsx`:

```tsx
import type { ReactNode } from 'react';

export function Callout({ tone = 'info', children }: { tone?: 'info' | 'warning'; children: ReactNode }) {
  const cls = tone === 'warning' ? 'border-watch/30 bg-watch/10 text-ink' : 'border-info/25 bg-info/10 text-ink';
  return <div className={`rounded-lg border p-3 text-sm ${cls}`}>{children}</div>;
}
```

`Caveat.tsx`:

```tsx
import type { ReactNode } from 'react';

export function Caveat({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted">⚠ {children}</p>;
}
```

`CtaLink.tsx`:

```tsx
export function CtaLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-paper">
      {children} <span aria-hidden>→</span>
    </a>
  );
}
```

`TermExplainer.tsx`:

```tsx
export function TermExplainer({ term, explanation }: { term: string; explanation: string }) {
  return (
    <abbr title={explanation} className="cursor-help border-b border-dotted border-muted no-underline">
      {term}
    </abbr>
  );
}
```

`HiddenCostList.tsx`:

```tsx
export function HiddenCostList({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-clay/30 bg-clay/5 p-4">
      <h4 className="mb-2 text-sm font-semibold text-clay">사람들이 자주 놓치는 비용</h4>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
```

`ContractQuestionList.tsx`:

```tsx
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
```

- [ ] **Step 2: Write the source-bound primitives**

`SourceBackedTable.tsx`:

```tsx
import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface CostRow {
  label: string;
  value: string;
  note?: string;
}

export function SourceBackedTable({
  caption,
  rows,
  sourceId,
}: {
  caption: string;
  rows: CostRow[];
  sourceId: string;
}) {
  useLearnSource(sourceId);
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <table className="w-full text-sm">
        <caption className="mb-2 text-left font-semibold text-ink">{caption}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <th scope="row" className="py-1.5 text-left font-normal text-muted">{r.label}</th>
              <td className="py-1.5 text-right font-semibold text-ink">{r.value}</td>
              <td className="py-1.5 pl-3 text-right text-xs text-muted">{r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-2"><SourceNote sourceId={sourceId} /></figcaption>
    </figure>
  );
}
```

`MoneyScenario.tsx`:

```tsx
import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface ScenarioLine {
  label: string;
  amount: string;
}

export function MoneyScenario({
  title,
  monthlySales,
  lines,
  takeHome,
  sourceId,
}: {
  title: string;
  monthlySales: string;
  lines: ScenarioLine[];
  takeHome: string;
  sourceId: string;
}) {
  useLearnSource(sourceId);
  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h4 className="text-sm font-semibold text-forest">{title}</h4>
      <p className="text-sm text-muted">월매출 {monthlySales} 기준</p>
      <ul className="my-2 space-y-1 text-sm">
        {lines.map((l) => (
          <li key={l.label} className="flex justify-between">
            <span className="text-muted">{l.label}</span>
            <span className="text-ink">{l.amount}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold">
        <span className="text-ink">손에 남는 돈</span>
        <span className="text-leaf">{takeHome}</span>
      </div>
      <div className="mt-2"><SourceNote sourceId={sourceId} /></div>
    </section>
  );
}
```

`CashflowWaterfall.tsx`:

```tsx
import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface WaterfallStep {
  label: string;
  amount: string;
  kind: 'start' | 'deduction' | 'result';
}

export function CashflowWaterfall({ steps, sourceId }: { steps: WaterfallStep[]; sourceId: string }) {
  useLearnSource(sourceId);
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <ul className="space-y-1 text-sm">
        {steps.map((s) => (
          <li key={s.label} className="flex justify-between">
            <span className={s.kind === 'deduction' ? 'text-danger' : 'text-ink'}>
              {s.kind === 'deduction' ? '− ' : ''}{s.label}
            </span>
            <span className={s.kind === 'result' ? 'font-semibold text-leaf' : 'text-ink'}>{s.amount}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2"><SourceNote sourceId={sourceId} /></figcaption>
    </figure>
  );
}
```

`CashflowCalendar.tsx` (must include tax/insurance payment timing):

```tsx
import { useLearnSource } from './sourceContext';
import { SourceNote } from './SourceNote';

export interface CalendarEntry {
  month: string; // e.g. '매달', '1·4·7·10월', '5월'
  item: string; // e.g. '4대보험', '부가세', '종합소득세'
}

export function CashflowCalendar({ entries, sourceId }: { entries: CalendarEntry[]; sourceId: string }) {
  useLearnSource(sourceId);
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <h4 className="mb-2 text-sm font-semibold text-forest">현금 유출 캘린더 (세금·보험 납부 타이밍 포함)</h4>
      <ul className="space-y-1 text-sm">
        {entries.map((e) => (
          <li key={`${e.month}-${e.item}`} className="flex justify-between">
            <span className="text-muted">{e.month}</span>
            <span className="text-ink">{e.item}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2"><SourceNote sourceId={sourceId} /></figcaption>
    </figure>
  );
}
```

- [ ] **Step 3: Write the combined test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LearnSource } from '../../../domain/learn/types';
import { LearnSourcesProvider } from './sourceContext';
import { Callout } from './Callout';
import { HiddenCostList } from './HiddenCostList';
import { CtaLink } from './CtaLink';
import { SourceBackedTable } from './SourceBackedTable';
import { CashflowCalendar } from './CashflowCalendar';

const src: LearnSource = {
  id: 's', category: 'tax', sourceTitle: '국세청', sourceUrl: 'https://nts.go.kr',
  lastCheckedAt: '2026-06-17', reviewStatus: 'expert-reviewed', reviewer: 'cpa',
};

describe('presentational primitives', () => {
  it('Callout renders children', () => {
    render(<Callout tone="warning">조심하세요</Callout>);
    expect(screen.getByText('조심하세요')).toBeTruthy();
  });

  it('HiddenCostList renders items', () => {
    render(<HiddenCostList items={['폐기 로스', '카드 수수료']} />);
    expect(screen.getByText('폐기 로스')).toBeTruthy();
  });

  it('CtaLink renders an arrowed link', () => {
    render(<CtaLink href="#compare">브랜드 비교하기</CtaLink>);
    expect(screen.getByRole('link', { name: /브랜드 비교하기/ })).toHaveAttribute('href', '#compare');
  });

  it('SourceBackedTable renders rows and resolves its source', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <SourceBackedTable caption="초기비용" rows={[{ label: '가맹비', value: '1,000만 원' }]} sourceId="s" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('가맹비')).toBeTruthy();
    expect(screen.getByText('국세청')).toBeTruthy();
  });

  it('CashflowCalendar surfaces tax/insurance timing', () => {
    render(
      <LearnSourcesProvider sources={[src]}>
        <CashflowCalendar entries={[{ month: '5월', item: '종합소득세' }]} sourceId="s" />
      </LearnSourcesProvider>,
    );
    expect(screen.getByText('5월')).toBeTruthy();
    expect(screen.getByText('종합소득세')).toBeTruthy();
  });

  it('source-bound primitive throws on a missing sourceId', () => {
    expect(() =>
      render(
        <LearnSourcesProvider sources={[]}>
          <SourceBackedTable caption="x" rows={[]} sourceId="missing" />
        </LearnSourcesProvider>,
      ),
    ).toThrow(/Unknown learn sourceId/);
  });
});
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run src/components/learn/primitives/primitives.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/primitives
git commit -m "feat(learn): add remaining presentational and source-bound primitives"
```

---

### Task 11: LearnSidebar, LearnChapterNav, LearnNotFound

**Files:**
- Create: `src/components/learn/LearnSidebar.tsx`, `LearnChapterNav.tsx`, `LearnNotFound.tsx`
- Test: `src/components/learn/LearnNav.test.tsx`

- [ ] **Step 1: Write the components**

`LearnSidebar.tsx`:

```tsx
import { CHAPTERS, PHASES } from '../../domain/learn/curriculum';

export function LearnSidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="학습 목차" className="space-y-4">
      {PHASES.map((phase) => (
        <div key={phase.id}>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
          <ul className="space-y-1">
            {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
              <li key={c.slug}>
                <a
                  href={`#learn/${c.slug}`}
                  aria-current={c.slug === activeSlug ? 'page' : undefined}
                  className={`block rounded px-2 py-1 text-sm ${
                    c.slug === activeSlug ? 'bg-mist font-semibold text-forest' : 'text-ink hover:bg-paper'
                  }`}
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

`LearnChapterNav.tsx`:

```tsx
import { getAdjacentChapters } from '../../domain/learn/curriculum';

export function LearnChapterNav({ activeSlug }: { activeSlug: string }) {
  const { prev, next } = getAdjacentChapters(activeSlug);
  return (
    <nav aria-label="챕터 이동" className="mt-8 flex justify-between border-t border-line pt-4">
      {prev ? (
        <a href={`#learn/${prev.slug}`} className="text-sm text-forest">← {prev.title}</a>
      ) : <span />}
      {next ? (
        <a href={`#learn/${next.slug}`} className="text-sm text-forest">{next.title} →</a>
      ) : <span />}
    </nav>
  );
}
```

`LearnNotFound.tsx`:

```tsx
import { CHAPTERS } from '../../domain/learn/curriculum';

export function LearnNotFound({ requestedSlug }: { requestedSlug: string }) {
  const first = CHAPTERS[0];
  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-ink">해당 학습 글을 찾을 수 없습니다</h2>
      <p className="mt-1 text-sm text-muted">요청한 주소: <code>#learn/{requestedSlug}</code></p>
      <div className="mt-4 flex gap-3">
        <a href="#learn" className="text-sm font-semibold text-forest">학습 목차로 →</a>
        <a href={`#learn/${first.slug}`} className="text-sm font-semibold text-forest">{first.title}부터 보기 →</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnSidebar } from './LearnSidebar';
import { LearnChapterNav } from './LearnChapterNav';
import { LearnNotFound } from './LearnNotFound';

describe('learn navigation components', () => {
  it('sidebar marks the active chapter with aria-current', () => {
    render(<LearnSidebar activeSlug="ch2-contract" />);
    const active = screen.getByRole('link', { current: 'page' });
    expect(active.textContent).toContain('계약');
  });

  it('chapter nav links to prev and next', () => {
    render(<LearnChapterNav activeSlug="ch2-contract" />);
    expect(screen.getByRole('link', { name: /마음가짐/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(screen.getByRole('link', { name: /입지/ })).toHaveAttribute('href', '#learn/ch3-location-license');
  });

  it('not-found shows the requested slug and recovery links', () => {
    render(<LearnNotFound requestedSlug="nope" />);
    expect(screen.getByText(/찾을 수 없습니다/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /학습 목차로/ })).toHaveAttribute('href', '#learn');
  });
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npx vitest run src/components/learn/LearnNav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 4: Commit**

```bash
git add src/components/learn/LearnSidebar.tsx src/components/learn/LearnChapterNav.tsx src/components/learn/LearnNotFound.tsx src/components/learn/LearnNav.test.tsx
git commit -m "feat(learn): add sidebar, chapter nav, and not-found components"
```

---

### Task 12: LearnLanding

**Files:**
- Create: `src/components/learn/LearnLanding.tsx`
- Test: `src/components/learn/LearnLanding.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnLanding } from './LearnLanding';

describe('LearnLanding', () => {
  it('renders the four quick-entry cards', () => {
    render(<LearnLanding />);
    expect(screen.getByRole('link', { name: /10분 생존 체크/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
    expect(screen.getByRole('link', { name: /계약 직전 체크/ })).toHaveAttribute('href', '#learn/ch2-contract');
    expect(screen.getByRole('link', { name: /오픈 준비 체크/ })).toHaveAttribute('href', '#learn/ch4-startup-cost');
    expect(screen.getByRole('link', { name: /운영 위기 체크/ })).toHaveAttribute('href', '#learn/ch7-low-sales');
  });

  it('lists all eight chapters in the overview', () => {
    render(<LearnLanding />);
    expect(screen.getByText('일상 운영의 기본기')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/LearnLanding.test.tsx`
Expected: FAIL — `LearnLanding` not defined.

- [ ] **Step 3: Write LearnLanding**

```tsx
import { CHAPTERS, PHASES } from '../../domain/learn/curriculum';

const QUICK_CARDS = [
  { label: '10분 생존 체크', desc: '지금 창업해도 되는지부터', href: '#learn/ch1-mindset-money' },
  { label: '계약 직전 체크', desc: '정보공개서·가맹계약서', href: '#learn/ch2-contract' },
  { label: '오픈 준비 체크', desc: '초기비용과 빠진 돈', href: '#learn/ch4-startup-cost' },
  { label: '운영 위기 체크', desc: '매출이 안 나올 때', href: '#learn/ch7-low-sales' },
];

export function LearnLanding() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink">창업, 비교하기 전에 먼저 배우기</h1>
        <p className="mt-1 text-muted">처음이라면 아래 빠른 체크부터 시작하세요.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {QUICK_CARDS.map((card) => (
          <a key={card.href} href={card.href} className="rounded-xl border border-line bg-surface p-4 hover:shadow-md">
            <div className="text-base font-semibold text-forest">{card.label}</div>
            <div className="text-sm text-muted">{card.desc}</div>
          </a>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">전체 커리큘럼</h2>
        {PHASES.map((phase) => (
          <div key={phase.id}>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{phase.label}</div>
            <ul className="space-y-1">
              {CHAPTERS.filter((c) => c.phase === phase.id).map((c) => (
                <li key={c.slug}>
                  <a href={`#learn/${c.slug}`} className="text-sm text-ink hover:text-forest">
                    {c.title} <span className="text-muted">— {c.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/LearnLanding.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/LearnLanding.tsx src/components/learn/LearnLanding.test.tsx
git commit -m "feat(learn): add learn landing hub with quick-entry cards"
```

---

### Task 13: LearnPage shell

**Files:**
- Create: `src/components/learn/LearnPage.tsx`
- Test: `src/components/learn/LearnPage.test.tsx`

`LearnPage` takes the `LearnRoute` (already known to be `view: 'learn'`) and renders landing / chapter / not-found. In chapter mode it wraps the body in `LearnSourcesProvider`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LearnPage } from './LearnPage';

describe('LearnPage', () => {
  it('renders the landing hub in landing mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'landing' }} />);
    expect(screen.getByRole('heading', { name: /비교하기 전에 먼저 배우기/ })).toBeTruthy();
  });

  it('renders a chapter with the disclaimer banner and source footer in chapter mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'chapter', chapterSlug: 'ch1-mindset-money' }} />);
    expect(screen.getByText(/일반적인 안내입니다/)).toBeTruthy();
    expect(screen.getByText(/출처 및 검토 상태/)).toBeTruthy();
  });

  it('renders not-found for notFound mode', () => {
    render(<LearnPage route={{ view: 'learn', mode: 'notFound', requestedSlug: 'nope' }} />);
    expect(screen.getByText(/찾을 수 없습니다/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/LearnPage.test.tsx`
Expected: FAIL — `LearnPage` not defined.

- [ ] **Step 3: Write LearnPage**

```tsx
import type { LearnRoute } from '../../domain/learn/types';
import { getChapter } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from './primitives/sourceContext';
import { SourceNote } from './primitives/SourceNote';
import { LearnLanding } from './LearnLanding';
import { LearnSidebar } from './LearnSidebar';
import { LearnChapterNav } from './LearnChapterNav';
import { LearnNotFound } from './LearnNotFound';

const DISCLAIMER =
  '이 페이지는 일반적인 안내입니다. 구체적인 수치는 시점·지역·업종에 따라 다르며, 정확한 내용은 공식 자료·세무사·전문가 확인이 필요합니다.';

export function LearnPage({ route }: { route: Extract<LearnRoute, { view: 'learn' }> }) {
  if (route.mode === 'landing') {
    return <div className="mx-auto max-w-4xl">{<LearnLanding />}</div>;
  }

  if (route.mode === 'notFound') {
    return (
      <div className="mx-auto max-w-4xl">
        <LearnNotFound requestedSlug={route.requestedSlug} />
      </div>
    );
  }

  const chapter = getChapter(route.chapterSlug);
  if (!chapter) {
    return (
      <div className="mx-auto max-w-4xl">
        <LearnNotFound requestedSlug={route.chapterSlug} />
      </div>
    );
  }

  const Body = chapter.body;

  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <aside className="md:sticky md:top-4 md:self-start">
        <LearnSidebar activeSlug={chapter.slug} />
      </aside>
      <article>
        <div className="mb-4 rounded-lg border border-line bg-cream p-3 text-xs text-muted">{DISCLAIMER}</div>
        <LearnSourcesProvider sources={chapter.sources}>
          <Body />
        </LearnSourcesProvider>
        <footer className="mt-6 rounded-lg border border-line bg-surface p-3">
          <div className="mb-2 text-xs font-semibold text-muted">출처 및 검토 상태</div>
          <ul className="space-y-1">
            {chapter.sources.map((s) => (
              <li key={s.id}>
                <LearnSourcesProvider sources={chapter.sources}>
                  <SourceNote sourceId={s.id} />
                </LearnSourcesProvider>
              </li>
            ))}
          </ul>
        </footer>
        <LearnChapterNav activeSlug={chapter.slug} />
      </article>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/LearnPage.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/LearnPage.tsx src/components/learn/LearnPage.test.tsx
git commit -m "feat(learn): add LearnPage shell rendering landing/chapter/not-found"
```

---

### Task 14: useHashRoute hook

**Files:**
- Create: `src/components/learn/useHashRoute.ts`
- Test: `src/components/learn/useHashRoute.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useHashRoute } from './useHashRoute';

beforeEach(() => { window.location.hash = ''; });
afterEach(() => { window.location.hash = ''; });

describe('useHashRoute', () => {
  it('returns the compare view by default and updates on hashchange', () => {
    const { result } = renderHook(() => useHashRoute());
    expect(result.current).toEqual({ view: 'compare' });

    act(() => { window.location.hash = '#learn'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(result.current).toEqual({ view: 'learn', mode: 'landing' });

    act(() => { window.location.hash = '#learn/ch2-contract'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(result.current).toMatchObject({ view: 'learn', mode: 'chapter', chapterSlug: 'ch2-contract' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/learn/useHashRoute.test.tsx`
Expected: FAIL — `useHashRoute` not defined.

- [ ] **Step 3: Write the hook**

```typescript
import { useEffect, useState } from 'react';
import { parseLearnHash } from '../../domain/learn/route';
import { CHAPTER_SLUGS } from '../../domain/learn/curriculum';
import type { LearnRoute } from '../../domain/learn/types';

export function useHashRoute(): LearnRoute {
  const [route, setRoute] = useState<LearnRoute>(() => parseLearnHash(window.location.hash, CHAPTER_SLUGS));

  useEffect(() => {
    function onChange() {
      setRoute(parseLearnHash(window.location.hash, CHAPTER_SLUGS));
    }
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/learn/useHashRoute.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/useHashRoute.ts src/components/learn/useHashRoute.test.tsx
git commit -m "feat(learn): add useHashRoute hook"
```

---

### Task 15: Extract CompareView + add TopNav + rewire App

**Files:**
- Create: `src/components/CompareView.tsx`
- Create: `src/components/TopNav.tsx`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx` (extend existing — verify it first)

- [ ] **Step 1: Read the existing App test**

Run: `cat src/App.test.tsx`
Confirm what it currently asserts so the rewrite keeps it green (the compare experience must be unchanged when the hash is empty).

- [ ] **Step 2: Create CompareView with the current App body**

Move the entire current compare UI (the `Dashboard` + `ComparePanel` + `BrandDetail` + `DataSourceFooter` block and its state/handlers from `App.tsx` lines 10-64) into `src/components/CompareView.tsx` as a `CompareView` component. It takes no props. Keep behavior identical.

```tsx
import { useEffect, useState } from 'react';
import { brands } from '../domain/brands';
import type { BrandCategory } from '../domain/types';
import { BrandDetail } from './BrandDetail';
import { ComparePanel } from './ComparePanel';
import { DataSourceFooter } from './DataSourceFooter';
import { Dashboard } from './Dashboard';

export function CompareView() {
  const [category, setCategory] = useState<BrandCategory | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedBrandId, setExpandedBrandId] = useState(brands[0]?.id ?? '');
  const [focusBrandId, setFocusBrandId] = useState('');
  const selectedBrands = brands.filter((brand) => selectedIds.includes(brand.id));
  const expandedBrand = brands.find((brand) => brand.id === expandedBrandId);

  useEffect(() => {
    if (!focusBrandId) return;
    const target = document.getElementById(`brand-${focusBrandId}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
    setFocusBrandId('');
  }, [focusBrandId, expandedBrandId]);

  function toggleSelect(brandId: string) {
    setSelectedIds((current) => {
      if (current.includes(brandId)) return current.filter((id) => id !== brandId);
      if (current.length >= 4) return current;
      return [...current, brandId];
    });
  }

  function openBrand(brandId: string) {
    setExpandedBrandId(brandId);
    setFocusBrandId(brandId);
  }

  return (
    <>
      <Dashboard
        brands={brands}
        category={category}
        selectedIds={selectedIds}
        onCategoryChange={setCategory}
        onToggleSelect={toggleSelect}
        onOpenBrand={openBrand}
      />
      <ComparePanel brands={selectedBrands} benchmarkBrands={brands} />
      <div className="space-y-5">
        {expandedBrand && (
          <BrandDetail
            key={expandedBrand.id}
            brand={expandedBrand}
            benchmarkBrands={brands}
            expanded={true}
            onToggle={() => setExpandedBrandId('')}
          />
        )}
      </div>
      <DataSourceFooter />
    </>
  );
}
```

- [ ] **Step 3: Create TopNav**

```tsx
export function TopNav({ active }: { active: 'compare' | 'learn' }) {
  const base = 'rounded-lg px-3 py-2 text-sm font-semibold';
  return (
    <nav aria-label="주요 메뉴" className="mb-6 flex gap-2 border-b border-line pb-3">
      <a href="#compare" aria-current={active === 'compare' ? 'page' : undefined}
         className={`${base} ${active === 'compare' ? 'bg-forest text-paper' : 'text-ink hover:bg-paper'}`}>
        프랜차이즈 비교
      </a>
      <a href="#learn" aria-current={active === 'learn' ? 'page' : undefined}
         className={`${base} ${active === 'learn' ? 'bg-forest text-paper' : 'text-ink hover:bg-paper'}`}>
        창업 학습
      </a>
    </nav>
  );
}
```

- [ ] **Step 4: Rewrite App.tsx**

```tsx
import { TopNav } from './components/TopNav';
import { CompareView } from './components/CompareView';
import { LearnPage } from './components/learn/LearnPage';
import { useHashRoute } from './components/learn/useHashRoute';

export default function App() {
  const route = useHashRoute();

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <TopNav active={route.view} />
        {route.view === 'compare' ? <CompareView /> : <LearnPage route={route} />}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run the full unit suite**

Run: `npm test`
Expected: PASS — existing `App.test.tsx` still green (compare view unchanged at empty hash), plus all new learn tests.

- [ ] **Step 6: Typecheck and build**

Run: `npm run build`
Expected: PASS (`tsc -b` + vite build succeed).

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/CompareView.tsx src/components/TopNav.tsx
git commit -m "feat(learn): add top nav and route between compare and learn views"
```

---

### Task 16: E2E navigation tests

**Files:**
- Create: `tests/e2e/learn.spec.ts`

- [ ] **Step 1: Write the E2E test**

```typescript
import { expect, test } from '@playwright/test';

test('top nav moves from compare to the learn landing and back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '창업 학습' }).click();
  await expect(page.getByRole('heading', { name: /비교하기 전에 먼저 배우기/ })).toBeVisible();
  await page.getByRole('link', { name: '프랜차이즈 비교' }).click();
  await expect(page.getByRole('heading', { name: '한눈에 보는 창업 지도' })).toBeVisible();
});

test('landing quick card opens its chapter; sidebar and prev/next navigate', async ({ page }) => {
  await page.goto('/#learn');
  await page.getByRole('link', { name: /계약 직전 체크/ }).click();
  await expect(page).toHaveURL(/#learn\/ch2-contract/);

  await page.getByRole('link', { name: /입지/ }).first().click();
  await expect(page).toHaveURL(/#learn\/ch3-location-license/);
});

test('unknown learn slug shows the not-found state', async ({ page }) => {
  await page.goto('/#learn/does-not-exist');
  await expect(page.getByText(/찾을 수 없습니다/)).toBeVisible();
  await expect(page.getByRole('link', { name: /학습 목차로/ })).toBeVisible();
});
```

- [ ] **Step 2: Run the E2E suite**

Run: `PATH=/Users/hoyeon/.nvm/versions/node/v20.19.6/bin:$PATH npm run e2e`
Expected: PASS — all new learn specs plus the unchanged existing specs.
(Node 20.19+ is required, per README.)

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/learn.spec.ts
git commit -m "test(learn): add e2e navigation coverage"
```

---

## Part 2 — Chapter Content Authoring

Each chapter replaces its scaffold body in `src/content/learn/ChapterN.tsx` and updates the
chapter's `sources` in `src/domain/learn/curriculum.ts`. **Rules for every chapter:**

- Every concrete number goes through a source-bound primitive (`NumericClaim`,
  `SourceBackedTable`, `MoneyScenario`, `CashflowWaterfall`, `CashflowCalendar`) with a
  `sourceId` present in that chapter's `sources`.
- Add real `LearnSource` records (Section 7.2 of the spec) with the correct `category`,
  a real `sourceUrl`, today's `lastCheckedAt`, and `reviewStatus: 'draft'` (raised to
  `expert-reviewed` only in Part 3).
- Plain-Korean tone consistent with `src/domain/founderCopy.ts`. No investment-advice
  phrasing. Use `Caveat`/`TermExplainer` generously.
- After authoring, add/extend a render smoke test `ChapterN.test.tsx` that wraps the body
  in `LearnSourcesProvider` with the chapter's `sources` and asserts a key section renders
  (this also proves every `sourceId` resolves — unresolved ids throw).

Per-chapter task template (repeat for CH1–CH8):

### Task 17–24: Author CH1 … CH8

For each chapter N:

- [ ] **Step 1: Add the chapter's real `LearnSource[]`** to its entry in `curriculum.ts`,
  replacing the seed source. Use the Section 7.2 sources matching the chapter's topics
  (e.g., CH5 uses 국세청 부가세/종소세 = category `tax`; CH6 uses 최저임금위원회 = `wage`).

- [ ] **Step 2: Write the body** in `src/content/learn/ChapterN.tsx` using primitives.
  Required content elements per chapter (from spec Section 5):
  - **CH1**: 자가진단, 자기자본/대출, 예비자금; **`HardStopGate`** with the six stop
    conditions; a pointer to CH4 for worst-case loss math.
  - **CH2**: 정보공개서 읽는 법, 가맹계약서 체크, 예상매출액 산정서, 영업지역, 필수구매/
    차액가맹금, 위약금, 갱신, 재시공; **`ContractQuestionList`**; **`DecisionChecklist id="contract"`**.
  - **CH3**: 상권/입지, 임대차 함정, 인허가 순서; **업종별 인허가 체크 매트릭스**
    (음식점: 영업신고 유형·위생교육·보건증·소방/옥외광고물·배달표시·음악저작권) as a
    `SourceBackedTable` or a structured list.
  - **CH4**: 초기비용 `SourceBackedTable`; `HiddenCostList`; **최악의 경우 잃는 돈 계산**
    (폐업비·원상복구·권리금 회수불가·중도해지 위약·재고·대출 잔액) via `SourceBackedTable`
    or `MoneyScenario`; **`DecisionChecklist id="pre-open"`**.
  - **CH5**: 고정비/변동비/숨은비용; **`CashflowWaterfall`**; **`CashflowCalendar`** with
    부가세/종소세/4대보험/원천세 timing; **`MoneyScenario`** ×3 (2,000 / 3,000 / 4,000만원).
  - **CH6**: 손익분기점, 인력(근로계약·주휴수당·최저임금 via `NumericClaim`), 위생/CS,
    재고/발주, 마케팅; **`DecisionChecklist id="monthly"`**.
  - **CH7**: 진단 순서, 줄일 비용 vs 지킬 비용, 버티기 vs 손절(연결: CH4 최악-손실),
    폐업/양도 절차·비용.
  - **CH8**: 세금·현금흐름, 재투자 vs 저축, 2호점 함정, 번아웃·사람 관리.

- [ ] **Step 3: Write the render smoke test** `src/content/learn/ChapterN.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { ChapterN } from './ChapterN'; // replace N

describe('ChapterN content', () => {
  it('renders with all sourceIds resolving against the chapter sources', () => {
    const chapter = CHAPTERS.find((c) => c.id === 'chN')!; // replace
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <ChapterN />
      </LearnSourcesProvider>,
    );
    // assert one key section unique to this chapter, e.g. for CH1:
    expect(screen.getByRole('heading', { name: /마음가짐/ })).toBeTruthy();
  });
});
```

- [ ] **Step 4: Run the chapter test**

Run: `npx vitest run src/content/learn/ChapterN.test.tsx`
Expected: PASS. (A failing `useLearnSource` throw here means a `sourceId` is missing from `sources` — fix the source list.)

- [ ] **Step 5: Commit**

```bash
git add src/content/learn/ChapterN.tsx src/content/learn/ChapterN.test.tsx src/domain/learn/curriculum.ts
git commit -m "content(learn): author CHN <chapter title>"
```

---

## Part 3 — Pre-launch Review Gate (operational, not a coding task)

- [ ] **Step 1: Run the gate to see current failures**

Run: `npm run check:learn-sources`
Expected: FAILS, listing every sensitive-category (tax/wage/contract/lease/licensing)
source still at `draft`. This is the correct state during development.

- [ ] **Step 2: Expert review**

A 세무사/전문가 reviews the tax/wage/contract/lease/licensing numbers against the live
official sources. As each is confirmed, update its `LearnSource` in `curriculum.ts`:
`reviewStatus: 'expert-reviewed'`, set `reviewer`, refresh `lastCheckedAt`. Track this like
the existing P0 manual-review records under `docs/research/`.

- [ ] **Step 3: Gate passes before publish**

Run: `npm run check:learn-sources`
Expected: `Learn source gate: OK`. Wire this into the prelaunch/deploy checklist alongside
`npm run check:p0`. Do **not** add it to the everyday `build` (content starts as draft).

---

## Self-Review (completed by plan author)

- **Spec coverage:** landing hub (T12), 8-chapter journey curriculum (T3, Part 2),
  contract chapter + worst-case loss (CH2/CH4 in Part 2), money-flow + tax-timing calendar
  (CH5, T10 primitives), hard-stop gate (T9 + CH1), industry licensing matrix (CH3),
  source-bound numbers (T6–T7, T10), prelaunch gate (T4–T5, Part 3), hash routing incl.
  not-found (T2, T13, T16), TopNav + view switch (T15), checklists w/ localStorage (T8),
  testing across unit/component/e2e (throughout). All spec sections map to a task.
- **Placeholder scan:** scaffold chapter bodies in T3 are intentional and replaced in
  Part 2; every code step shows real code. No TBD/“implement later” steps.
- **Type consistency:** `LearnSource`, `LearnChapter`, `LearnRoute`, `parseLearnHash`,
  `getChapter`, `getAdjacentChapters`, `CHAPTER_SLUGS`, `findSourceGateViolations`,
  `LearnSourcesProvider`/`useLearnSource`, and the route `mode` discriminants are used
  consistently across tasks.
```
