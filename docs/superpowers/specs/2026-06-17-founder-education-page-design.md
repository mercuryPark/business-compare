# Founder Education Page Design

## 1. Product Goal

Add a new "창업 학습" (founder education) page to the existing franchise comparison
site. Today the site only compares franchise brands on cost, revenue, and operating
burden. The new page teaches prospective and first-time owners — people with no
business or store-operation experience — how to prepare, how to read a franchise
contract before signing, what every cost type looks like (including the costs nobody
warns them about), how money actually flows from monthly sales to take-home, how to
run daily operations, and how to respond when sales are weak or unexpectedly strong.

The intent is a "learn first, then compare" flow: a visitor lands, studies the
fundamentals, and then moves into brand comparison with enough literacy to read the
numbers correctly.

The review bar for this page is: **a prospective owner betting their entire savings and
years of their life should be able to make decisions from it.** That raises four
non-negotiable requirements beyond "good reading material":

- **Trustworthy information** — every number is entered through a source-bound component;
  it traces to an official source with a last-checked date and a review status, not
  undated model recall.
- **Contract-risk gates** — the page marks the points where a beginner should *stop*
  before signing a franchise/lease contract or taking a loan.
- **A "do not start" gate** — desperate people only look for ways to *proceed*. The page
  must explicitly state the conditions under which one should not start a business now.
- **Real money-flow and action** — money-flow scenarios, a cash-outflow calendar that
  includes tax/insurance timing, and decision checklists — not just prose.

Like the rest of the site, this page is educational decision-support, **not** financial,
tax, legal, or investment advice. It organizes general guidance and plain-Korean
model answers, always separating fact from assumption and attaching clear caveats.

## 2. Target User

A prospective or first-time owner in Korea who has never run a store. They do not yet
know what they don't know: which costs exist, what a franchise disclosure document
(정보공개서) or a lease contract hides, how taxes accrue, or how to react when monthly
sales drop. The page must walk them through the journey in order, in plain Korean, with
concrete Korea-specific numbers they can actually use — each number bound to an official
source, a "기준" note, and a caveat to verify with official sources or a professional.

## 3. Scope

### In scope (v1)

- A standalone education page reachable from a top navigation bar.
- A **learn landing hub** at `#learn` with quick-entry cards (10분 생존 체크 / 계약 직전 체크 /
  오픈 준비 체크 / 운영 위기 체크) plus the full curriculum overview, so a beginner is not
  dropped into a wall of text.
- A 3-phase / 8-chapter curriculum (see Section 5), with a dedicated franchise-contract
  chapter, a worst-case loss section, an industry-specific licensing matrix, and a
  "do-not-start" hard-stop gate.
- Left table-of-contents sidebar + reading pane + "이전/다음" chapter buttons on chapter
  views. Mobile collapses the sidebar into a top disclosure.
- Hash-based navigation between compare and learn views, with a landing hub, per-chapter
  deep links, and an explicit not-found state. No new routing dependency.
- A **source & review metadata model** (Section 7): every chapter and every numeric claim
  carries `category / sourceTitle / sourceUrl / lastCheckedAt / reviewStatus / reviewer`,
  rendered transparently. Numbers are entered only through source-bound primitives.
- A **prelaunch source gate** (`check:learn-sources`) that fails if any sensitive-category
  source (tax / wage / contract / lease / licensing) is not `expert-reviewed`.
- **Action checklists** in v1: hard-stop 체크, 계약 전, 오픈 전 준비, 월 운영. Check state
  may persist in `localStorage` (no account).
- **Money-flow components**: monthly profit waterfall, cash-outflow calendar (including
  tax/insurance payment timing), and sales scenarios (월매출 2,000 / 3,000 / 4,000만원).
- Contextual CTA links into the existing dashboard and simulator.
- A standing disclaimer banner and reusable caveat/source primitives.

### Out of scope (v1)

- React Router or any new routing/content dependency (MDX, CMS, etc.).
- **Automated source fetching pipelines** (calling 공정위/소상공인365/국세청 APIs at
  build/runtime). Source attribution is authored manually for v1; auto-fetch belongs to
  the existing P0 data system, not this page.
- **A general "any digit in JSX text needs a source" lint.** Too many false positives
  (chapter numbers, dates, list counts) for v1. Enforcement is structural instead:
  numbers must go through source-bound primitives (Section 6.6). A stricter lint is a
  possible later addition.
- Deep data integration pulling live brand numbers into learn-content examples.
- User accounts, cross-curriculum progress tracking, completion %, or quizzes.
  (Per-checklist `localStorage` check state is allowed; curriculum-wide progress is not.)
- Search within learn content; multi-language content.

## 4. Key Decisions

| Decision | Choice |
|----------|--------|
| Chapter structure | Journey-stage: 3 phases (준비 / 운영 / 대응), 8 chapters + landing hub |
| Content depth | Korea-specific concrete numbers + explicit 기준·면책 caveats |
| Information trust | Numbers enterable only via source-bound primitives (required `sourceId`) |
| Review enforcement | `check:learn-sources` prelaunch gate fails on non-expert-reviewed sensitive sources |
| Contract risk | Dedicated franchise-contract chapter (CH2) + worst-case loss section (CH4) |
| Do-not-start gate | `HardStopGate` in CH1 and on the landing hub |
| Industry licensing | Industry-specific licensing matrix in CH3 |
| Money flow | Waterfall + cash calendar (with tax/insurance timing) + sales scenarios in CH5 |
| Action guidance | Checklists in v1 (hard-stop / contract / pre-open / monthly), `localStorage` state |
| Integration | Independent content + contextual CTA links (no deep data binding) |
| Navigation | Hash-based view switch, no new dependency; `#learn` = landing hub; explicit not-found |
| Layout | Left TOC sidebar + reading pane + prev/next footer; mobile = collapsible top menu |

## 5. Curriculum

Three journey phases, eight chapters, plus a landing hub. The do-not-start gate and
contract-risk gate are front-loaded; worst-case loss math lives in the cost chapter;
money-flow visualization anchors the operating-cost chapter; checklists attach where
action is required.

### Landing hub (`#learn`)

Quick-entry cards that route to the most decision-critical content first:

- **10분 생존 체크** → `HardStopGate` (do-not-start conditions)
- **계약 직전 체크** → CH2 contract checklist
- **오픈 준비 체크** → CH4 pre-open checklist
- **운영 위기 체크** → CH7 diagnosis

Below the cards, the full 3-phase / 8-chapter overview.

### Phase A — 준비 (before opening)

- **CH1 · 마음가짐과 자금 준비 + 창업하면 안 되는 조건 ★하드 스톱**
  창업 전 자가진단(생계형/투자형) · 자기자본 vs 대출 비율 · 예비 운전자금의 중요성 ·
  프랜차이즈 vs 개인창업 차이 · **`HardStopGate`: 지금은 멈춰야 하는 조건** — 생활비
  6–12개월치가 없다 / 총투자금 대부분이 고금리 대출이다 / 폐업 시 남는 대출·원상복구비를
  감당 못 한다 / 정보공개서·계약서를 직접 읽지 않았다 / 예상매출을 본사 말로만 믿고 있다 /
  가족 생계비와 사업비가 섞여 있다. "잘 안 되면 얼마를 잃는가"는 CH4 계산으로 연결.
- **CH2 · 계약 전 멈춤 — 정보공개서·가맹계약서 읽기 ★계약 리스크**
  정보공개서 읽는 법 · 가맹계약서 체크포인트 · 예상매출액 산정서 · 영업지역 보장 ·
  필수구매/차액가맹금 · 위약금·중도해지 · 계약갱신 · 인테리어 재시공 조건 ·
  본사 상담 때 반드시 물어볼 질문(`ContractQuestionList`) · **계약 전 체크리스트**
- **CH3 · 입지·상권·임대차·인허가**
  상권/입지 보는 법(공식 상권분석 데이터) · 임대차계약 함정(권리금·보증금·환산보증금·특약) ·
  인테리어/시설 · 사업자등록·영업신고 순서 · **업종별 인허가 체크 매트릭스**
  (음식점 예: 일반/휴게음식점·제과점 영업신고 · 위생교육 · 보건증 · 소방/간판·옥외광고물 ·
  배달·포장 표시 · 음악 저작권)
- **CH4 · 창업에 드는 돈 — 초기비용 전체 지도**
  가맹비·교육비·보증금 · 인테리어/설비 · 초도물품 · 권리금 · "보이는 비용 vs 놓치는 비용" ·
  **최악의 경우 잃는 돈 계산**(폐업비·원상복구·권리금 회수불가·중도해지 위약·재고 처리·대출 잔액) ·
  **오픈 전 준비 체크리스트**

### Phase B — 운영 (after opening)

- **CH5 · 매달 나가는 돈 + 돈의 흐름 ★핵심**
  고정비(임대료·인건비·4대보험·로열티/광고비·공과금·보험·대출이자) · 변동비(원재료·소모품) ·
  숨은 비용(부가세 적립·종합소득세·카드/배달 수수료·폐기 로스·감가상각/재투자·명절 상여) ·
  **월 손익 워터폴**(월매출 → 수수료/원가/인건비/임대료/세금/대출 → 손에 남는 돈) ·
  **현금 유출 캘린더 — 월별 고정비뿐 아니라 세금·보험 납부 타이밍 포함**
  (부가세 분기/반기 · 종소세 5월 · 4대보험 매월 · 원천세) ·
  **매출 시나리오 카드(2,000 / 3,000 / 4,000만원)**
- **CH6 · 일상 운영의 기본기**
  손익분기점·손익 보는 법 · 인력 관리(근로계약·주휴수당·최저임금) · 위생/CS · 재고·발주 ·
  기본 마케팅 · **월 운영 체크리스트**

### Phase C — 대응 (when things change)

- **CH7 · 매출이 안 나올 때 — 진단과 회복**
  원인 진단 순서(매출? 원가? 고정비?) · 줄여도 되는 비용 vs 줄이면 안 되는 비용 ·
  버티기 vs 손절(CH4의 최악-손실 계산을 실제 의사결정에 적용) · 폐업/양도 절차와 비용
- **CH8 · 매출이 잘 나올 때 — 지속과 확장**
  세금·현금흐름 관리(잘 벌수록 세금 주의) · 재투자 vs 저축 · 2호점/다점포의 함정 ·
  번아웃·사람 관리

## 6. Architecture

The app stays a single Vite/React SPA. A hash route selects which top-level view renders.

### 6.1 Routing — `src/domain/learn/route.ts`

A pure function parses `window.location.hash` into a view descriptor:

- `''`, `#`, `#compare` → `{ view: 'compare' }`
- `#learn` → `{ view: 'learn', mode: 'landing' }`
- `#learn/<slug>` where `<slug>` is known → `{ view: 'learn', mode: 'chapter', chapterSlug }`
- `#learn/<slug>` where `<slug>` is **unknown** → `{ view: 'learn', mode: 'notFound', requestedSlug }`

`#learn` shows the landing hub, not the first chapter. Unknown slugs are **not** silently
redirected; `LearnPage` renders an explicit "해당 학습 글을 찾을 수 없습니다" state with
links to the landing hub and the first chapter, so a stale/mistyped shared link never
quietly shows different content. `route.ts` is a pure string→object function, unit-tested
directly. `App.tsx` subscribes to `hashchange`; navigation sets `window.location.hash` so
browser back/forward works.

### 6.2 Top navigation — `src/components/TopNav.tsx`

The app currently has no global header. Add a `TopNav` at the top of `App` with two
buttons: "프랜차이즈 비교" (→ `#compare`) and "창업 학습" (→ `#learn`). The button matching
the active view is highlighted.

### 6.3 App composition — `src/App.tsx`

`App` renders `<TopNav>` always, then switches the body:

- `view === 'compare'` → existing Dashboard + ComparePanel + BrandDetail + Footer cluster,
  extracted into a thin `CompareView` wrapper (no behavior change).
- `view === 'learn'` → `<LearnPage route={...} />` (landing / chapter / not-found).

### 6.4 Learn page — `src/components/learn/`

- **`LearnPage.tsx`** — resolves `route.mode` and renders landing, chapter, or not-found.
  Chapter mode shows the disclaimer banner, sidebar, chapter body, source/review footer,
  and prev/next; scrolls to top on chapter change.
- **`LearnLanding.tsx`** — quick-entry cards + 3-phase/8-chapter overview.
- **`LearnSidebar.tsx`** — TOC grouped by phase, highlighting the active chapter; mobile =
  collapsible top disclosure.
- **`LearnChapterNav.tsx`** — "← 이전 / 다음 →" footer from chapter order.
- **`LearnNotFound.tsx`** — explicit not-found state.

### 6.5 Content model — `src/domain/learn/curriculum.ts` + `src/content/learn/`

Hybrid of typed index data and component bodies:

- **`curriculum.ts`** exports a typed chapter array:
  `{ id, slug, phase, order, title, summary, body, sources }` where `body` is a React
  component and `sources` is the chapter-level `LearnSource[]` (Section 7). Single source
  for sidebar, prev/next, routing, landing overview, and the source footer.
  `phase` ∈ `'prepare' | 'operate' | 'respond'` with display labels.
- **`src/content/learn/Chapter1.tsx … Chapter8.tsx`** — editorial Korean content composed
  from shared primitives. Kept as components (rich editorial prose); no MDX dependency.

### 6.6 Content primitives — `src/components/learn/primitives/`

Presentational pieces that keep styling consistent and **structurally enforce** the
source culture. The numeric primitives take a **required `sourceId`** prop (a TypeScript
error if omitted), so a concrete number cannot enter the page without a bound source:

- **`NumericClaim`** — a single numbered claim (e.g., 최저임금 시급); required `sourceId`.
- **`SourceBackedTable`** — a cost/figure table; required `sourceId` (per table or per row).
- **`MoneyScenario`** — a sales scenario with derived figures; required `sourceId`.
- **`CashflowWaterfall`** — sales → … → take-home breakdown; required `sourceId`.
- **`CashflowCalendar`** — month-by-month outflows **including tax/insurance payment timing**.

Supporting primitives (no required source):

- **`SourceNote`** — renders a `LearnSource` (title, link, last-checked, review status).
- **`Callout`** — info/warning note box.
- **`HiddenCostList`** — emphasized "사람들이 놓치는 비용" list.
- **`Caveat`** — inline/blocked caveat.
- **`CtaLink`** — styled link into an existing tool (e.g., `#compare`).
- **`TermExplainer`** — beginner term gloss (차액가맹금, 환산보증금, 주휴수당 …).
- **`DecisionChecklist`** — actionable checklist; toggleable items, optional `localStorage`
  persistence keyed by checklist id (no account).
- **`HardStopGate`** — the do-not-start conditions, framed as stop-now criteria.
- **`ContractQuestionList`** — "본사 상담 때 물어볼 질문", contract-risk framed.

`SourceNote` resolves a `sourceId` against the chapter's `sources`, so numeric primitives
render their attribution and inherit the chapter's review status.

## 7. Source & Review Model

Trust is a product requirement. Learn content mirrors the site's existing P0 source/review
discipline, scaled to manual authoring, and is **enforced structurally and at a gate**.

### 7.1 Metadata — `LearnSource`

- `id` — referenced by numeric primitives' `sourceId`
- `category` — `'tax' | 'wage' | 'contract' | 'lease' | 'licensing' | 'general'`
- `sourceTitle` — e.g., "국세청 부가가치세 안내"
- `sourceUrl` — official URL
- `lastCheckedAt` — ISO date the author last verified the claim against the source
- `reviewStatus` — `'draft' | 'self-reviewed' | 'expert-reviewed'`
- `reviewer` — who reviewed (or `null` for drafts)

Each chapter exposes a `sources: LearnSource[]`, rendered in a chapter-level
"출처 및 검토 상태" footer. Numeric primitives reference a source by `sourceId`.

### 7.2 Authoring source list (reference for content authors)

Verified-reachable:

- 공정위/공공데이터포털 — 등록완료된 정보공개서 공개본 목록 조회 API: https://www.data.go.kr/data/15125569/openapi.do (category: contract)
- 소상공인365 상권분석: https://bigdata.sbiz.or.kr/ (category: licensing/general — 상권)
- 소상공인시장진흥공단 상가(상권)정보 (2026-03-31 기준 파일데이터): https://www.data.go.kr/data/15083033/fileData.do
- 국세청 부가가치세 안내: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7693&mi=2272 (category: tax)
- 국세청 종합소득세 안내: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7664&mi=2224 (category: tax)

Labor sources — use specific authorities, **not** a generic ministry landing page. Exact
deep URLs must be confirmed at authoring time and recorded in `lastCheckedAt`:

- 최저임금 — 최저임금위원회: https://www.minimumwage.go.kr/ (category: wage)
- 4대 사회보험 — 4대 사회보험 정보연계센터: https://www.4insure.or.kr/ (category: wage)
- 근로계약서·주휴수당 — 고용노동부 표준근로계약서/주휴수당 안내 (specific 자료/정책 페이지를
  작성 시점에 확인해 링크; `https://www.moel.go.kr/mainpop2.do` 같은 메인성 URL 사용 금지)
  (category: wage)

### 7.3 Disclaimer rendering

- `LearnPage` shows a standing neutral banner on every chapter:
  *"이 페이지는 일반적인 안내입니다. 구체적인 수치는 시점·지역·업종에 따라 다르며,
  정확한 내용은 공식 자료·세무사·전문가 확인이 필요합니다."*
- **Per-chapter pending-review warning:** when a chapter has any source whose `category`
  ∈ `SENSITIVE_CATEGORIES` and `reviewStatus !== 'expert-reviewed'`, `LearnPage` renders a
  prominent `role="alert"` danger-style banner above the body warning that the chapter
  contains 세무·노무·계약·임대차·인허가 items not yet expert-reviewed.
- Every concrete number renders through a source-bound primitive with a `기준` note.
- **Educational-example separation:** source-bound primitives accept an optional
  `illustrative` prop. When set, an `IllustrativeBadge` ("교육용 예시 — 실제 통계 아님")
  renders next to the `SourceNote`, so made-up teaching figures (CH4 cost tables, CH5
  waterfall/scenarios, CH6 breakeven example) are visually distinct from factual/legal
  claims (정보공개서 14일, VAT/소득세 mechanism, 최저임금/주휴수당).
- The chapter footer makes the current `reviewStatus` visible to the reader.

### 7.4 Prelaunch gate — `check:learn-sources`

A script (`src/scripts/checkLearnSources.ts`, run via `npm run check:learn-sources`,
modeled on the existing `check:p0` scripts) walks every chapter's `sources` and **fails**
if any source whose `category` ∈ {tax, wage, contract, lease, licensing} has
`reviewStatus !== 'expert-reviewed'`. It also fails on malformed records (missing url,
invalid date, unknown category).

This gate is **not** wired into the everyday `build`/dev loop (all content begins as
`draft`, which would otherwise block development). It runs in the prelaunch/deploy step,
the same way `check:p0` gates the data publish. Raising sensitive content to
`expert-reviewed` (세무사/전문가) before public launch is therefore mechanically required,
not just promised.

## 8. Data Flow

1. A TopNav button, landing card, sidebar entry, prev/next, or `CtaLink` sets `window.location.hash`.
2. `hashchange` → `App` re-parses via `route.ts` → updates view state.
3. For `learn`, `LearnPage` renders landing, the chapter (body + sidebar + prev/next +
   source footer, resolved from `curriculum.ts`), or not-found.
4. Numeric primitives resolve their `sourceId` against the chapter `sources` to render
   attribution + review status.
5. `DecisionChecklist` toggles update local state and, if enabled, persist to
   `localStorage` under a checklist-specific key. No curriculum-wide progress is tracked.

## 9. Testing

- **Domain unit tests**
  - `route.test.ts` — compare; `#learn` → landing; known slug → chapter; **unknown slug →
    notFound (not a silent first-chapter redirect)**.
  - `curriculum.test.ts` — slugs unique; `order` contiguous/sorted; phases group; prev/next
    neighbors correct (incl. `null` at ends); every chapter has a non-empty `sources` list
    with valid `category` and `reviewStatus`.
  - `checkLearnSources.test.ts` — the gate **fails** when a sensitive-category source is not
    `expert-reviewed` and on malformed records; **passes** when all sensitive sources are
    `expert-reviewed`.
- **Component tests (RTL)**
  - Numeric primitives (`NumericClaim`, `SourceBackedTable`, `MoneyScenario`,
    `CashflowWaterfall`) require `sourceId` (type-level) and render a resolved `SourceNote`.
  - `LearnPage` chapter mode renders the matching chapter, disclaimer banner, and source footer.
  - Landing mode renders the four quick-entry cards and the curriculum overview.
  - Unknown slug renders `LearnNotFound` with landing/first-chapter links.
  - Sidebar navigation and prev/next update the rendered chapter (absent/disabled at ends).
  - `HardStopGate` renders the stop conditions; `DecisionChecklist` toggles and round-trips
    through `localStorage` when enabled.
- **E2E (Playwright)**
  - Top button navigates compare → learn (landing) and back.
  - Landing quick-entry card routes to its target chapter.
  - Sidebar chapter click changes content and updates the hash.
  - Prev/next navigation works.
  - Deep link to `#learn/<ch-slug>` loads that chapter; `#learn/<bad-slug>` shows not-found.

## 10. Implementation Sequencing

The largest deliverable is authoring eight chapters of source-verified editorial Korean
content. Plan split:

1. **Shell + enforcement**: `route.ts` (incl. landing + not-found), `TopNav`, `App` →
   `CompareView` + view switch, `LearnPage`/`LearnLanding`/`LearnSidebar`/`LearnChapterNav`/
   `LearnNotFound`, the curriculum index with placeholder bodies, all primitives (incl.
   source-bound numeric ones, `HardStopGate`, `CashflowWaterfall`/`CashflowCalendar`,
   `DecisionChecklist`), the `LearnSource` model, and `checkLearnSources` + its test —
   with all tests passing.
2. **Content**: author CH1–CH8 bodies using the primitives, with source metadata
   (`reviewStatus: 'draft'`), the hard-stop gate, money-flow scenarios + tax-timing
   calendar, worst-case loss math, the industry licensing matrix, contract-question lists,
   and checklists. Numbers authored against the Section 7.2 sources.
3. **Pre-launch review (separate, gated)**: expert review of tax/wage/contract/lease/
   licensing numbers to raise `reviewStatus` to `expert-reviewed`, verified by
   `check:learn-sources`. Tracked like the existing P0 manual-review records; not a coding task.

This keeps the navigable structure verifiable early, enforces sources structurally and at
a gate, and keeps the trust gate explicit and separate from implementation.
