# Productization Design — 창업 나침반

## 1. Goal

Take the existing personal side-project (franchise comparison dashboard + 8-chapter
founder-education page) and productize it: polish the visual design, make every sentence
and screen read cleanly, fix the information architecture, and prepare it for **public
sharing with real self-employed owners** on Naver cafés and communities (a non-commercial,
public-interest effort).

The audience is cold mobile traffic: a first-time or struggling owner who opens a café
link on their phone, has no prior context, and must — within seconds — trust the site and
start reading comfortably. Today's pages (especially the learn pages) use baseline
Tailwind and read densely; this effort raises them to a shareable product.

Service name: **창업 나침반**.

## 2. Audience & Context

- **Device:** mobile-first. Café/community links open mostly on phones; design,
  readability, and navigation are tuned for small screens first, then scaled up to desktop.
- **Reader:** beginner owner, often middle-aged, trust-seeking, easily overwhelmed by
  dense data or jargon. Needs plain language, large legible type, and obvious next steps.
- **Purpose:** public-interest education. "Learn first, then compare." Not commercial.

## 3. Key Decisions (from brainstorming)

| Decision | Choice |
|----------|--------|
| Scope | Comprehensive: visual design + readability + IA/navigation + first-impression/trust/share, delivered in 4 phases |
| Device priority | Mobile-first |
| Design direction | Warm editorial (existing paper/forest palette) + bold, color-coded readability boxes (large type) |
| Entry point | New welcome **Home (hero)** → leads into learning; compare is the secondary "next step" tool |
| Draft-content safety | Principle-centered: soften unreviewed specific tax/legal numbers to ranges/mechanism + official links; keep per-chapter "검토 전" warnings, source/review footer, and illustrative badges |
| Source gate semantics | `check:learn-sources` is an **advisory "verified-status" check, not a publish blocker** (see §7.1). Public publishing is allowed for clearly-labeled 참고용 content that has passed the content-safety pass |
| Brand-data risk | Public named-brand comparison must satisfy the dashboard spec's risk controls (correction path, legal wording review, brand-data publication gate) — an explicit launch blocker (see §7.2) |
| Service name | 창업 나침반 |

## 4. Design System (foundation)

Establish a reusable visual language on top of the existing Tailwind tokens
(`tailwind.config.ts`: ink, muted, paper, line, forest, cream, mist, safe, watch, danger,
info, clay, leaf). Pretendard stays.

Concrete tokens (the single source of truth — avoid ad-hoc values):

| Token | Value |
|-------|-------|
| Body text | 16px / line-height 1.65 / `text-ink` |
| Caption / note | 13px / line-height 1.6 / `text-muted` |
| h3 (section) | 18px mobile, 20px desktop / 1.35 / semibold |
| h2 (chapter title) | 22px mobile, 26px desktop / 1.3 / bold / `tracking-tight` (−0.02em) |
| Hero headline | 24px mobile, 32px desktop / 1.3 / 900 / `tracking-tightest` |
| Card / box radius | `rounded-xl` (1.25rem) — the max radius for content cards |
| Box shadow | `shadow-sm` default, `shadow-md` on raised/hover only (existing tokens) |
| Primary button | min-height 48px, `rounded-lg`, 16px semibold, full-width on mobile |
| Touch target | ≥ 44px min for any tappable control |
| Mobile content width | full width minus 16px side padding; max readable measure 640px (`max-w-2xl`) on desktop |
| Section vertical rhythm | `space-y-8` between sections, `space-y-3` within |

- **Color-coded boxes (the "bold box" language):** consistent treatment across the
  existing primitives —
  - 경고/멈춤 → `danger` (HardStopGate, warning Callout)
  - 핵심 수치 → `forest`/`leaf` (NumericClaim, key figures)
  - 정보 → `info` (info Callout)
  - 면책/출처/예시 → `muted`/`clay` (Caveat, SourceNote, IllustrativeBadge)
- **Where it lives:** refine the shared primitives in `src/components/learn/primitives/`
  and shared Tailwind utility patterns; no new CSS framework. Components stay small and
  single-purpose. Apply the same language to compare/dashboard surfaces in Phase 4.

## 5. Information Architecture & Navigation (mobile-first)

- **New entry point = Welcome Home.** Routing default (`#` / empty / `#home`) renders the
  Home, not the compare dashboard. Home composition (approved mock):
  hero (headline "큰돈을 걸기 전에, 먼저 알고 시작하세요" + one-line subhead + primary CTA
  "10분 자가진단으로 시작하기") → quick-entry cards (지금 시작해도 될까? / 계약 전에 멈추기 /
  오픈에 드는 돈 / 매출이 안 나올 때) → 8-step curriculum preview → trust strip → secondary
  "프랜차이즈 비용 비교해보기" CTA. Home **replaces the old `#learn` landing hub**: bare
  `#learn` now renders Home (the `LearnLanding` component is removed/superseded), while
  chapter routes `#learn/<slug>` are unchanged.
- **Top nav:** `홈 · 학습 · 비교`, compact on mobile, highlighting the active view.
- **Chapter navigation on mobile:** desktop keeps the left TOC sidebar; mobile replaces it
  with (1) a top "목차 열기" drawer/sheet, (2) large bottom "← 이전 / 다음 →" buttons, and
  (3) a reading-position indicator (e.g., "2 / 8").
- **Learn → Compare bridge:** chapter-end CTAs and the Home secondary CTA route into compare.

### Routing changes

Extend `src/domain/learn/route.ts` (and `useHashRoute`) so the view descriptor covers
`home | learn(chapter/notFound) | compare`. Mapping:

- empty / `#` / `#home` → **home**
- `#learn` (bare) → **home** (the old landing is replaced by Home)
- `#learn/<known-slug>` → chapter (unchanged)
- `#learn/<unknown-slug>` → notFound (unchanged)
- `#compare` → compare (unchanged)

`App.tsx` renders the matching view; `TopNav` gains the 홈 entry. Keep `route.ts` a pure,
unit-tested function. Backward-compatibility for old shared links is a Phase-2 acceptance
criterion (§9).

## 6. Content Readability Pass

Apply uniformly across all chapter content:
- **Lead with the conclusion** — key point in the first sentence of each paragraph; split
  long paragraphs into 2–3 sentences.
- **Make it scannable** — turn enumerations into lists; pull important figures/warnings
  out of prose into color-coded boxes.
- **One sentence, one message** — avoid sentences longer than ~3 mobile lines; remove
  filler and repetition.
- **Plain language** — gloss hard terms with `TermExplainer`; minimize 한자어/행정용어.

## 7. Public-Launch Safety

### 7.1 Learn content safety pass + gate semantics

Apply the approved "principle-centered + official links" policy:
- For unreviewed sensitive areas (tax/labor/contract/lease/licensing), replace assertive
  specific numbers with ranges/mechanism descriptions + official-source links (already
  begun, e.g. the VAT schedule). Keep illustrative example figures clearly badged.
- Keep the per-chapter "전문가 검토 전" warning banner, the source/review-status footer, and
  the standing disclaimer.

**Gate semantics (resolves the publish-vs-gate contradiction).** Two distinct things are
separated:
- **Publish criterion (what allows public sharing):** the content-safety pass above —
  no assertive unreviewed specific numbers, prominent 참고용/검토-전 labels, official links.
  This is what makes 참고용 educational content safe to share publicly.
- **Verified status (what `check:learn-sources` governs):** the script is an **advisory
  "verified-status" check, NOT a publish blocker.** It keeps reporting which sensitive
  sources are still `draft` (not yet expert-reviewed). Reaching all-`expert-reviewed`
  lets the UI drop the "검토 전" warnings and present content as verified — an upgrade, not
  a prerequisite for public sharing.
- Documentation/wording for the script and spec must call it "advisory verified-status
  check," not "prelaunch gate," to avoid the earlier contradiction. The content shipped
  publicly before expert review is always clearly-labeled 참고용.

### 7.2 Brand-data risk controls (launch blocker for the compare surface)

Public sharing routes users into the real **named-brand** comparison, whose data is still
prototype-level (per the dashboard README/spec). Before public launch, the compare surface
must satisfy the existing dashboard spec's risk controls — these are **explicit launch
blockers**, in scope for this productization:
- **Correction-request path** present and reachable from brand reports (the existing
  `CorrectionCta` component / 정정 요청 경로).
- **Negative/judgment labels** show their source and rule, with no unsupported claims.
- **Legal wording review** of brand-facing copy (final 문구 법률 검토).
- **Brand-data publication gate** — P0 data 2차 검수 / model QA per the dashboard spec; do
  not publicly present unverified named-brand numbers as fact. If brand data cannot clear
  this in time, the public launch ships **learn-only** (Home + learn), with the compare
  surface gated/marked "준비 중" until its data is verified.

## 8. Trust & Shareability

- **OG / link preview:** add Open Graph + Twitter meta tags to `index.html`. Concrete assets:
  - `og:title` = "창업 나침반 — 큰돈을 걸기 전에, 먼저 알고 시작하세요"
  - `og:description` = one-line value prop (≤ 100 chars).
  - `og:image` = `/og-changup-nachimbang.png`, **1200×630**, placed in `public/`. v1 image
    is a static, hand-made composition (service name + tagline on the paper/forest palette;
    fallback background `#103a2c`). No dynamic generation.
  - `og:type` = website, `og:locale` = `ko_KR`, plus `twitter:card` = `summary_large_image`.
  - `<title>` = "창업 나침반"; favicon as `public/favicon.svg` (SVG, with a PNG fallback).
  - **Validation step:** verify rendered tags via a screenshot/metadata check (e.g. the
    KakaoTalk/Naver share debugger or a local OG-preview) and confirm the image resolves.
- **Trust elements:** Home trust strip (official-source basis + source/review status +
  "세무·법률은 참고용"), a "공익 · 무료" badge, and consistent source attribution.

## 9. Phased Delivery

A large effort; sequence into four phases (each independently shippable and verifiable):

1. **Design-system foundation** — unify primitive styles + typography/spacing tokens (§4)
   into the warm-editorial + bold-box language.
2. **Home + navigation + mobile IA** — new Welcome Home, routing default → home, `#learn`
   (bare) → home, top nav (홈·학습·비교), mobile chapter navigation (drawer + bottom
   prev/next + position).
   **Backward-compatibility acceptance criteria (required to ship Phase 2):** every legacy
   link still resolves correctly — empty hash → home; `#compare` → compare; `#learn` →
   home; **every** `#learn/<slug>` chapter deep link → that chapter; unknown slug →
   not-found. Existing e2e specs updated for the new default (Home) and a deep-link test
   added for each chapter route.
3. **Learn content readability + safety pass** — sentence-level rewrite (§6) + soften
   unreviewed specific numbers to principle/range + links (§7.1).
4. **Compare polish + share + launch gates** — apply the design language to the compare
   surfaces for mobile; add OG meta/title/favicon (§8); and resolve the §7.2 brand-data
   risk controls (correction path, legal wording review, brand-data publication gate) — or,
   if brand data can't be verified in time, ship learn-only with compare marked "준비 중".

## 10. Testing

- **Routing unit tests:** `route.ts` covers home default (empty/`#`/`#home`), `#compare`,
  bare `#learn` → home, `#learn/<slug>` → chapter, unknown-slug → not-found.
- **Component tests (RTL):** Home renders hero + quick-entry cards + curriculum preview +
  trust strip + secondary CTA; TopNav highlights active view incl. 홈; mobile chapter nav
  (drawer toggle, prev/next, position) behaves; existing learn/primitive tests stay green.
- **E2E (Playwright):** default route shows Home; Home CTA → 자가진단 chapter; nav 홈↔학습↔비교;
  mobile-chrome project exercises the drawer/bottom-nav; existing compare e2e stays green.
- **Gate:** `check:learn-sources` still fails on sensitive drafts (expected).
- **Visual sanity:** mobile + desktop screenshots of Home and a chapter before/after.

## 11. Out of Scope (v1)

- A backend, accounts, analytics, or progress persistence beyond existing localStorage.
- New routing dependency (keep hash-based routing).
- Dynamic/server-rendered OG images.
- Actual expert review of sensitive learn content (a separate human step; the advisory
  `check:learn-sources` check tracks it, and content ships as clearly-labeled 참고용 until
  done). Note: brand-data risk controls (§7.2) are **in scope** as a launch blocker.
- Renaming/restructuring the compare domain logic beyond visual/mobile polish.
