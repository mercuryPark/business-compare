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
| Service name | 창업 나침반 |

## 4. Design System (foundation)

Establish a reusable visual language on top of the existing Tailwind tokens
(`tailwind.config.ts`: ink, muted, paper, line, forest, cream, mist, safe, watch, danger,
info, clay, leaf). Pretendard stays.

- **Typography (mobile-first):** body 16px / line-height ~1.65; clear hierarchy — large
  chapter title (h2), section heading (h3), body, caption. Tighter letter-spacing on large
  headings. Comfortable measure on mobile.
- **Color-coded boxes (the "bold box" language):** a consistent treatment across the
  existing primitives —
  - 경고/멈춤 → `danger` (HardStopGate, warning Callout)
  - 핵심 수치 → `forest`/`leaf` (NumericClaim, key figures)
  - 정보 → `info` (info Callout)
  - 면책/출처/예시 → `muted`/`clay` (Caveat, SourceNote, IllustrativeBadge)
- **Spacing & cards:** generous whitespace, rounded cards, soft shadows; touch targets
  large enough for thumbs.
- **Where it lives:** refine the shared primitives in `src/components/learn/primitives/`
  and shared Tailwind utility patterns; no new CSS framework. Components stay small and
  single-purpose. Apply the same language to compare/dashboard surfaces in Phase 4.

## 5. Information Architecture & Navigation (mobile-first)

- **New entry point = Welcome Home.** Routing default (`#` / empty / `#home`) renders the
  Home, not the compare dashboard. Home composition (approved mock):
  hero (headline "큰돈을 걸기 전에, 먼저 알고 시작하세요" + one-line subhead + primary CTA
  "10분 자가진단으로 시작하기") → quick-entry cards (지금 시작해도 될까? / 계약 전에 멈추기 /
  오픈에 드는 돈 / 매출이 안 나올 때) → 8-step curriculum preview → trust strip → secondary
  "프랜차이즈 비용 비교해보기" CTA. The existing `#learn` landing is absorbed/replaced by Home.
- **Top nav:** `홈 · 학습 · 비교`, compact on mobile, highlighting the active view.
- **Chapter navigation on mobile:** desktop keeps the left TOC sidebar; mobile replaces it
  with (1) a top "목차 열기" drawer/sheet, (2) large bottom "← 이전 / 다음 →" buttons, and
  (3) a reading-position indicator (e.g., "2 / 8").
- **Learn → Compare bridge:** chapter-end CTAs and the Home secondary CTA route into compare.

### Routing changes

Extend `src/domain/learn/route.ts` (and `useHashRoute`) so the view descriptor covers
`home | learn(landing/chapter/notFound) | compare`. Default (empty/`#`/`#home`) → home.
`#compare` → compare. `#learn`, `#learn/<slug>` unchanged. `App.tsx` renders the matching
view; `TopNav` gains the 홈 entry. Keep `route.ts` a pure, unit-tested function.

## 6. Content Readability Pass

Apply uniformly across all chapter content:
- **Lead with the conclusion** — key point in the first sentence of each paragraph; split
  long paragraphs into 2–3 sentences.
- **Make it scannable** — turn enumerations into lists; pull important figures/warnings
  out of prose into color-coded boxes.
- **One sentence, one message** — avoid sentences longer than ~3 mobile lines; remove
  filler and repetition.
- **Plain language** — gloss hard terms with `TermExplainer`; minimize 한자어/행정용어.

## 7. Content Safety Pass (for public exposure)

Apply the approved "principle-centered + official links" policy:
- For unreviewed sensitive areas (tax/labor/contract/lease/licensing), replace assertive
  specific numbers with ranges/mechanism descriptions + official-source links (already
  begun, e.g. the VAT schedule). Keep illustrative example figures clearly badged.
- Keep the per-chapter "전문가 검토 전" warning banner, the source/review-status footer, and
  the standing disclaimer.
- The `check:learn-sources` prelaunch gate stays as-is: it keeps failing on sensitive
  drafts until a real expert (세무사/노무사/가맹거래사) reviews them and raises
  `reviewStatus` to `expert-reviewed`. That human step is out of code scope; the product
  ships publicly as clearly-labeled 참고용 educational content until then.

## 8. Trust & Shareability

- **OG / link preview:** add Open Graph + Twitter meta tags to `index.html` (title,
  description, preview image), a proper `<title>`, and a favicon, so links pasted into
  Naver cafés / KakaoTalk render cleanly. Static tags (SPA) are sufficient for v1.
- **Trust elements:** Home trust strip (official-source basis + source/review status +
  "세무·법률은 참고용"), a "공익 · 무료" badge, and consistent source attribution.

## 9. Phased Delivery

A large effort; sequence into four phases (each independently shippable and verifiable):

1. **Design-system foundation** — unify primitive styles + typography/spacing tokens into
   the warm-editorial + bold-box language.
2. **Home + navigation + mobile IA** — new Welcome Home, routing default → home, top nav
   (홈·학습·비교), mobile chapter navigation (drawer + bottom prev/next + position).
3. **Learn content readability + safety pass** — sentence-level rewrite + soften unreviewed
   specific numbers to principle/range + links.
4. **Compare dashboard mobile polish + OG/share** — apply the design language to the
   compare surfaces for mobile, add OG meta/title/favicon.

## 10. Testing

- **Routing unit tests:** `route.ts` covers home default, `#compare`, `#learn` landing,
  `#learn/<slug>`, unknown-slug not-found.
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
- Actual expert review of sensitive content (separate human step; gate enforces it).
- Renaming/restructuring the compare domain logic beyond visual/mobile polish.
