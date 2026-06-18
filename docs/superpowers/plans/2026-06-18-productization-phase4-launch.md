# Productization Phase 4 — Compare Gating + Share/Launch Readiness (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a **learn-only** public launch of 창업 나침반 — gate the prototype-data compare dashboard behind a "준비 중" notice in the production build, add link-preview (OG) + favicon + title for Naver-café/Kakao sharing, and document the remaining human launch gates.

**Architecture:** Keep the SPA. A build-time env flag `VITE_COMPARE_ENABLED` controls whether `#compare` renders the real dashboard (`CompareView`) or a `ComparePending` notice. The flag defaults **on** in dev/test/e2e (so the dashboard and all existing tests are unaffected) and is set **off** only in `.env.production`, so the deployed artifact is learn-only. OG/share metadata is static in `index.html`; the OG image is generated reproducibly via Playwright from an HTML template into `public/`.

**Tech Stack:** React 19, TypeScript, Vite (env via `import.meta.env`), Tailwind, Vitest + RTL (`vi.stubEnv`), Playwright. Static assets in `public/`.

**Decision (from brainstorming):** Public launch is **learn-only**; compare is gated "준비 중" until brand data is verified. Therefore the spec §7.2 brand-data risk controls (correction path, legal wording review, brand-data publication gate) and any compare mobile polish are **deferred to the un-gate milestone** (documented in Task 5), not built here.

**Spec:** `docs/superpowers/specs/2026-06-17-productization-design.md` §7.2 (brand-data risk / learn-only fallback), §8 (OG/share). Service: 창업 나침반.

---

## File Structure

- Create: `src/config.ts` — `COMPARE_ENABLED` flag derived from `import.meta.env`.
- Create: `src/components/ComparePending.tsx` (+ test) — the "준비 중" notice.
- Modify: `src/App.tsx` — gate the `compare` view on `COMPARE_ENABLED`.
- Modify: `src/components/Home.tsx` — when compare is gated, label the secondary CTA "(준비 중)".
- Create: `.env.production` — `VITE_COMPARE_ENABLED=false`.
- Modify: `index.html` — title, description, OG + Twitter tags, favicon link.
- Create: `public/favicon.svg`; `scripts/og-template.html`; `scripts/generate-og-image.mjs`; generated `public/og-changup-nachimbang.png`.
- Modify: `package.json` — add `generate:og` script.
- Create: `docs/LAUNCH.md` — launch readiness checklist + un-gate steps.
- Modify: `playwright.config.ts` — ensure e2e dev server runs with the flag on (it defaults on, so no functional change; documented).

---

## Task 1: Compare gating (flag + ComparePending + App + Home label)

**Files:**
- Create: `src/config.ts`, `src/components/ComparePending.tsx`, `src/components/ComparePending.test.tsx`
- Modify: `src/App.tsx`, `src/components/Home.tsx`
- Create: `.env.production`
- Test: extend `src/App.test.tsx`

- [ ] **Step 1: Add the config flag**

Create `src/config.ts`:

```typescript
// Compare dashboard uses prototype brand data; it is gated OFF in the production
// build (.env.production) until the data is verified. Dev/test/e2e default ON.
export const COMPARE_ENABLED = import.meta.env.VITE_COMPARE_ENABLED !== 'false';
```

- [ ] **Step 2: Write the failing ComparePending test**

Create `src/components/ComparePending.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ComparePending } from './ComparePending';

describe('ComparePending', () => {
  it('shows a 준비 중 notice and a link back to learning', () => {
    render(<ComparePending />);
    expect(screen.getByRole('heading', { name: /준비 중/ })).toBeTruthy();
    expect(screen.getByText(/데이터 검증/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /학습/ })).toHaveAttribute('href', '#learn/ch1-mindset-money');
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/components/ComparePending.test.tsx`
Expected: FAIL — `ComparePending` not defined.

- [ ] **Step 4: Implement ComparePending**

```tsx
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
```

- [ ] **Step 5: Run it to verify it passes**

Run: `npx vitest run src/components/ComparePending.test.tsx`
Expected: PASS.

- [ ] **Step 6: Gate the compare view in App**

In `src/App.tsx`, import the flag + component and gate the compare branch:

```tsx
import { TopNav } from './components/TopNav';
import { Home } from './components/Home';
import { CompareView } from './components/CompareView';
import { ComparePending } from './components/ComparePending';
import { LearnPage } from './components/learn/LearnPage';
import { useHashRoute } from './components/learn/useHashRoute';
import { COMPARE_ENABLED } from './config';

export default function App() {
  const route = useHashRoute();

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <TopNav active={route.view} />
        {route.view === 'home' && <Home />}
        {route.view === 'compare' && (COMPARE_ENABLED ? <CompareView /> : <ComparePending />)}
        {route.view === 'learn' && <LearnPage route={route} />}
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Label Home's secondary CTA when gated**

In `src/components/Home.tsx`, import the flag and make the secondary CTA text conditional. Add `import { COMPARE_ENABLED } from '../config';` and change the secondary CTA line:

```tsx
          <ButtonLink href="#compare" variant="secondary">
            {COMPARE_ENABLED ? '프랜차이즈 비용 비교해보기' : '프랜차이즈 비용 비교 (준비 중)'}
          </ButtonLink>
```

(The existing `Home.test.tsx` matches `/프랜차이즈 비용 비교/`, which both strings satisfy — no test change needed since the flag defaults on in test.)

- [ ] **Step 8: Add the production env file**

Create `.env.production`:

```
VITE_COMPARE_ENABLED=false
```

- [ ] **Step 9: Add an App-level gating test**

In `src/App.test.tsx`, add a test (the flag defaults on, so existing dashboard tests are unaffected; this one stubs it off):

```tsx
  it('gates the compare dashboard behind a 준비 중 notice when compare is disabled', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_COMPARE_ENABLED', 'false');
    window.location.hash = '#compare';
    const { default: GatedApp } = await import('./App');
    render(<GatedApp />);
    expect(screen.getByRole('heading', { name: /준비 중/ })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '한눈에 보는 창업 지도' })).toBeNull();
    vi.unstubAllEnvs();
  });
```

Note: `COMPARE_ENABLED` is evaluated at module load, so the test uses `vi.resetModules()` + dynamic `import('./App')` after stubbing. If the import-time evaluation makes this flaky, instead test `ComparePending` rendering directly (Step 2) and assert App's gating via a `vi.mock('./config', () => ({ COMPARE_ENABLED: false }))` at the top of a dedicated test file `src/App.gating.test.tsx`. Use whichever reliably asserts: disabled → 준비 중, no dashboard heading.

- [ ] **Step 10: Run the full unit suite + dev build sanity**

Run: `npm test`
Expected: PASS — existing dashboard tests still green (flag defaults on in vitest), plus ComparePending + gating tests.

Run: `npx vite build --mode development >/dev/null && echo dev-build-ok`
Expected: `dev-build-ok` (compiles). (We avoid asserting the production-gated artifact here; Task 5 verifies prod mode.)

- [ ] **Step 11: Commit**

```bash
git add src/config.ts src/components/ComparePending.tsx src/components/ComparePending.test.tsx src/App.tsx src/components/Home.tsx src/App.test.tsx .env.production
git commit -m "feat(launch): gate compare dashboard behind 준비 중 in production build

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: OG / share metadata + favicon link in index.html

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create the favicon**

Create `public/favicon.svg` (a simple compass mark on the forest color):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#103a2c"/>
  <circle cx="32" cy="32" r="20" fill="none" stroke="#f4f3ee" stroke-width="3"/>
  <polygon points="32,16 38,34 32,30 26,34" fill="#f4f3ee"/>
  <polygon points="32,48 26,30 32,34 38,30" fill="#9bbfae"/>
</svg>
```

- [ ] **Step 2: Update index.html head**

Replace the `<title>` and `description` lines and add OG/Twitter + favicon tags. The `<head>` should contain (keep the existing charset, viewport, theme-color, and Pretendard preconnect/stylesheet lines):

```html
    <title>창업 나침반 — 큰돈을 걸기 전에, 먼저 알고 시작하세요</title>
    <meta name="description" content="가게에 실제로 드는 비용부터 계약·세금에서 놓치기 쉬운 부분까지, 창업이 처음인 분의 눈높이에 맞춰 정리한 무료 학습 가이드." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="창업 나침반" />
    <meta property="og:title" content="창업 나침반 — 큰돈을 걸기 전에, 먼저 알고 시작하세요" />
    <meta property="og:description" content="창업이 처음인 분을 위한 무료 학습 가이드: 모든 비용 타입, 계약·세금의 함정, 매출이 흔들릴 때의 대응까지." />
    <meta property="og:image" content="/og-changup-nachimbang.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="창업 나침반 — 큰돈을 걸기 전에, 먼저 알고 시작하세요" />
    <meta name="twitter:description" content="창업이 처음인 분을 위한 무료 학습 가이드." />
    <meta name="twitter:image" content="/og-changup-nachimbang.png" />
```

- [ ] **Step 3: Verify build still succeeds**

Run: `npx vite build --mode development >/dev/null && echo ok`
Expected: `ok` (the missing PNG is created in Task 3; the build does not fail on a referenced-but-absent public asset because it's only an HTML meta href).

- [ ] **Step 4: Commit**

```bash
git add index.html public/favicon.svg
git commit -m "feat(share): add OG/Twitter meta, title, and favicon for 창업 나침반

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Generate the OG preview image (1200×630)

**Files:**
- Create: `scripts/og-template.html`, `scripts/generate-og-image.mjs`
- Create (generated): `public/og-changup-nachimbang.png`
- Modify: `package.json` (add `generate:og`)

- [ ] **Step 1: Create the OG template HTML**

Create `scripts/og-template.html`:

```html
<!doctype html>
<html lang="ko"><head><meta charset="UTF-8"/>
<style>
  html,body{margin:0}
  .card{width:1200px;height:630px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;
    padding:90px;background:linear-gradient(135deg,#103a2c,#16523c);color:#f4f3ee;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  .badge{font-size:28px;opacity:.85;margin-bottom:24px}
  .title{font-size:84px;font-weight:900;line-height:1.2;letter-spacing:-.03em}
  .sub{font-size:36px;margin-top:28px;line-height:1.5;color:#cfe0d6}
</style></head>
<body>
  <div class="card">
    <div class="badge">🧭 창업 나침반 · 공익 · 무료</div>
    <div class="title">큰돈을 걸기 전에,<br/>먼저 알고 시작하세요</div>
    <div class="sub">모든 비용·계약·세금의 함정을 창업이 처음인 분 눈높이로</div>
  </div>
</body></html>
```

- [ ] **Step 2: Create the generation script**

Create `scripts/generate-og-image.mjs`:

```javascript
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const templateUrl = 'file://' + resolve(here, 'og-template.html');
const outPath = resolve(here, '../public/og-changup-nachimbang.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(templateUrl);
await page.screenshot({ path: outPath });
await browser.close();
console.log('OG image written to', outPath);
```

- [ ] **Step 3: Add the npm script**

In `package.json` `scripts`, add:

```json
"generate:og": "node scripts/generate-og-image.mjs",
```

- [ ] **Step 4: Generate the image**

Run: `mkdir -p public && PATH=/Users/hoyeon/.nvm/versions/node/v20.19.6/bin:$PATH npm run generate:og`
Expected: `OG image written to .../public/og-changup-nachimbang.png`. Confirm the file exists and is ~1200×630: `file public/og-changup-nachimbang.png`.

- [ ] **Step 5: Commit**

```bash
git add scripts/og-template.html scripts/generate-og-image.mjs public/og-changup-nachimbang.png package.json
git commit -m "feat(share): generate 1200x630 OG preview image via Playwright

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Launch readiness doc

**Files:**
- Create: `docs/LAUNCH.md`

- [ ] **Step 1: Write the launch checklist**

Create `docs/LAUNCH.md`:

```markdown
# 창업 나침반 — Launch Readiness

## Public launch scope (v1): learn-only
- Default route → Home; 학습(8개 챕터) 공개.
- 프랜차이즈 비교 대시보드는 **프로덕션 빌드에서 "준비 중"**으로 게이트됨
  (`.env.production` → `VITE_COMPARE_ENABLED=false`). 프로토타입 브랜드 데이터를 공개하지 않음.

## Before sharing publicly (do these)
- [ ] `npm test` 그린, `npm run build` 성공.
- [ ] `npm run generate:og` 후 `public/og-changup-nachimbang.png` 존재 확인.
- [ ] 배포본을 카카오톡/네이버 카페에 링크해 OG 미리보기(제목·설명·이미지) 정상 노출 확인.
- [ ] 모바일에서 홈→챕터 읽기 흐름·목차 드로어 동작 확인.

## Sensitive learn content (참고용으로 공개)
- 세무·노무·계약·임대차·인허가 항목은 `reviewStatus: 'draft'`이며 챕터별 "전문가 검토 전" 경고가 노출됨.
- 공개는 가능하나, 이를 "검증된 정보"로 격상하려면 세무사·노무사·가맹거래사 검토 후
  해당 `LearnSource.reviewStatus`를 `expert-reviewed`로 올리고 `npm run check:learn-sources` 통과.

## Before un-gating compare (future milestone)
- [ ] 브랜드 P0 데이터 2차 검수·모델 QA 통과(정보공개서 원문 대조).
- [ ] 정정 요청 경로(`CorrectionCta`) 노출·동작 확인.
- [ ] 브랜드 대면 문구 법률 검토.
- [ ] `.env.production`에서 `VITE_COMPARE_ENABLED=false` 제거(또는 `true`)로 비교 공개.
```

- [ ] **Step 2: Commit**

```bash
git add docs/LAUNCH.md
git commit -m "docs: add launch readiness checklist (learn-only, compare gated)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Production-gating verification + e2e

**Files:**
- Modify: `tests/e2e/learn.spec.ts` (add a gated-build assertion only if feasible; see Step 3)

- [ ] **Step 1: Verify the production build gates compare**

Run: `npm run build` (production mode → flag off) then `npm run preview -- --port 4173 &` and check, or simpler, grep the built bundle is not required — instead verify via a dev-mode unit already covers gating. Confirm `npm run build` succeeds and `.env.production` is picked up by checking the build logs show mode production. Minimum gate: `npm run build` exits 0.
Expected: build succeeds.

- [ ] **Step 2: Verify dev/e2e still shows the dashboard (flag on)**

Run: `PATH=/Users/hoyeon/.nvm/versions/node/v20.19.6/bin:$PATH npm run e2e`
Expected: PASS — the e2e dev server runs in development mode (flag defaults on), so `tests/e2e/app.spec.ts` (dashboard at `#compare`) and the learn nav test (clicking 프랜차이즈 비교 → dashboard heading) still pass unchanged. Confirm 22/22 (or current count) green.

- [ ] **Step 3: (Optional) add a gated-preview e2e**

If you want e2e coverage of the 준비 중 state, add a separate Playwright project/test that runs against `npm run preview` of a production build. This requires a second webServer config and is optional — the unit test in Task 1 Step 9 already covers gating. If you skip it, note "gating covered by unit test" and do not add brittle config.

- [ ] **Step 4: Final full verification**

Run: `npm test` then `npm run build`
Expected: both PASS.

- [ ] **Step 5: Commit any e2e additions**

```bash
git add -A
git commit -m "test(launch): verify compare gating (prod) and dashboard (dev) paths

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(If no e2e file changed, skip the commit and note "gating covered by unit test; e2e dashboard path unchanged.")

---

## Self-Review (completed by plan author)

- **Spec coverage:** §7.2 learn-only fallback with compare gated "준비 중" → Task 1 (flag + ComparePending + App gating + `.env.production`); deferred brand-risk controls documented → Task 4 (`LAUNCH.md` un-gate checklist). §8 OG/share (og:title/description/image 1200×630, twitter card, ko_KR, `<title>`, favicon) → Tasks 2–3 (`index.html`, `public/favicon.svg`, generated `public/og-changup-nachimbang.png` at the spec-named path). Expert-review note for draft content → Task 4.
- **Placeholder scan:** every step has real code/commands; no TBD/TODO. The optional gated-preview e2e (Task 5 Step 3) is explicitly optional with a stated fallback (unit test covers gating), not a vague placeholder.
- **Type/flag consistency:** `COMPARE_ENABLED` from `src/config.ts` is the single flag, imported by `App.tsx` and `Home.tsx`; `VITE_COMPARE_ENABLED` env var name is consistent across `config.ts`, `.env.production`, and the gating test. Asset path `/og-changup-nachimbang.png` matches between `index.html` and `generate-og-image.mjs` output. The flag defaults ON so existing dashboard unit/e2e tests are unaffected; only the production artifact gates.
