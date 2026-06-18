# Productization Phase 3 — Learn Content Readability + Safety Pass (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish all 8 learn chapters so every sentence reads cleanly on mobile and no assertive unreviewed number sits in bare prose — without inventing new facts or breaking source bindings.

**Architecture:** Editorial polish over existing chapter components (`src/content/learn/Chapter1..8.tsx`). This is a rubric-driven pass, not red-green TDD: each chapter is rewritten against the readability + safety rubrics below, gated by its existing render smoke test (which also proves every `sourceId` still resolves), the full unit suite, and `npm run build`. No new facts, no new numbers; all existing source-bound primitives and their `sourceId`s are preserved.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind, Vitest + RTL. Chapter content lives in `src/content/learn/`; primitives in `src/components/learn/primitives/`.

**Spec:** `docs/superpowers/specs/2026-06-17-productization-design.md` §6 (readability) + §7.1 (safety pass + gate semantics). Service: 창업 나침반.

---

## Rubrics (apply to every chapter task)

### Readability rubric (spec §6)
1. **Lead with the conclusion** — the first sentence of each paragraph states the point; supporting detail follows.
2. **Split long paragraphs** — no paragraph longer than ~3 mobile lines; break into 2–3 shorter sentences or a list.
3. **Make it scannable** — convert in-prose enumerations into `<ul>`/`<ol>`; pull key figures/warnings into the existing color-coded primitives (`Callout`/`Caveat`/`HardStopGate`/`NumericClaim`/tables), not inline bold runs.
4. **One sentence, one message** — remove filler, hedging, and repetition; prefer plain words; gloss hard terms with `TermExplainer`.

**Worked example (the pattern to apply):**

Before (dense prose with an inline figure):
```tsx
<p className="text-sm text-ink">
  창업 자금을 어떻게 마련하느냐가 가게의 체력을 결정합니다. 대출 비중이 높을수록 매달 나가는
  이자가 고정비처럼 쌓이고, 매출이 잠깐 흔들릴 때 버틸 힘이 줄어들며, 권장 자기자본 비율은 총투자금의 절반 이상입니다.
</p>
```
After (conclusion first, one message per sentence, figure stays in its source-bound `NumericClaim`):
```tsx
<p className="text-sm text-ink">
  자금을 어떻게 마련하느냐가 가게의 체력을 결정합니다. 대출 비중이 높을수록 매달 이자가
  고정비처럼 쌓여, 매출이 잠깐 흔들릴 때 버틸 힘이 줄어듭니다.
</p>
<NumericClaim label="권장 자기자본 비율" value="총투자금의 절반 이상" basis="일반 권장 기준" sourceId={SOURCE_ID} />
```

### Safety sweep rubric (spec §7.1)
- **Every concrete 원 / 만 원 / % / 배수 figure must sit inside a source-bound primitive** (`NumericClaim`, `SourceBackedTable`, `MoneyScenario`, `CashflowWaterfall`, `CashflowCalendar`) bound to a `sourceId` already in that chapter's `sources`. If a bare figure appears in a `<p>`/`<li>`/`<Callout>`/`<Caveat>` text run, MOVE it into the appropriate primitive (illustrative ones get `illustrative`). Do NOT create new sources or invent numbers.
- **Soften assertive unreviewed claims** in tax/wage/contract/lease/licensing prose to mechanism/range + a `Caveat` and (where natural) the existing official link. Keep all `reviewStatus: 'draft'`.
- Exempt non-financial incidental numbers (step counts like "3단계", chapter numbers, "6~12개월" inside HardStopGate condition strings, dates).

### Hard constraints (all tasks)
- Do NOT change `curriculum.ts` sources, add sources, change any `sourceId`, or alter any numeric value/fact. This is wording + placement only.
- Keep each chapter's existing exported component name and all CTAs/links.
- Each chapter's existing `ChapterN.test.tsx` MUST stay green (it renders the chapter inside `LearnSourcesProvider` with the real sources, so any `sourceId` you fail to preserve will throw).

---

## File Structure

- Modify: `src/content/learn/Chapter1.tsx` … `Chapter8.tsx` (prose/placement only).
- Modify/extend (only where a restructure changes asserted text): the matching `Chapter1.test.tsx` … `Chapter8.test.tsx`.
- No changes to primitives, curriculum, routing, or app shell.

---

## Task 1: Readability + safety pass — CH1 & CH2

**Files:** `src/content/learn/Chapter1.tsx`, `Chapter2.tsx` (+ their `.test.tsx` if asserted text changes)

- [ ] **Step 1: Read both chapters and their tests**

Run: `cat src/content/learn/Chapter1.tsx src/content/learn/Chapter1.test.tsx src/content/learn/Chapter2.tsx src/content/learn/Chapter2.test.tsx`
Note the current prose, every `sourceId` used, and what each test asserts.

- [ ] **Step 2: Apply the readability rubric to CH1**

Rewrite long paragraphs (lead-with-conclusion, ≤3 mobile lines, scannable lists) per the rubric. CH1 is the gold-standard reference and is already strong — keep its structure (자가진단 / 자기자본 vs 대출 / 예비자금 / 프랜차이즈 vs 개인 / HardStopGate / CTA); only tighten wording where a sentence runs long or repeats. Preserve the `HardStopGate` six conditions verbatim (the test asserts them) and the `NumericClaim`/`CtaLink` bindings.

- [ ] **Step 3: Apply the safety sweep to CH1**

Confirm every 원/%/만 원 figure is inside a source-bound primitive; move any stray figure in. CH1 should already comply — verify and fix only if needed.

- [ ] **Step 4: Apply rubric + safety sweep to CH2**

Same for CH2 (정보공개서·가맹계약서). Keep the `ContractQuestionList`, `DecisionChecklist id="contract"`, `TermExplainer`s, and the 정보공개서 사전 제공 `NumericClaim`. Tighten prose; ensure any 기간/비율 figures sit in the `NumericClaim` (mechanism + caveat for the 14일/7일 timing).

- [ ] **Step 5: Keep tests green (adjust only if asserted text changed)**

If you changed text that a test asserts, update the test string to the new text (keep the assertion's intent). Run: `npx vitest run src/content/learn/Chapter1.test.tsx src/content/learn/Chapter2.test.tsx`
Expected: PASS.

- [ ] **Step 6: Full suite + build**

Run: `npm test` then `npm run build`
Expected: both PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/learn/Chapter1.tsx src/content/learn/Chapter1.test.tsx src/content/learn/Chapter2.tsx src/content/learn/Chapter2.test.tsx
git commit -m "content(learn): readability + safety polish for CH1, CH2

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Readability + safety pass — CH3 & CH4

**Files:** `src/content/learn/Chapter3.tsx`, `Chapter4.tsx` (+ tests if needed)

- [ ] **Step 1: Read both chapters and their tests**

Run: `cat src/content/learn/Chapter3.tsx src/content/learn/Chapter3.test.tsx src/content/learn/Chapter4.tsx src/content/learn/Chapter4.test.tsx`

- [ ] **Step 2: Apply rubric + safety sweep to CH3 (입지·임대차·인허가)**

Tighten prose. CH3 already uses `SourceBackedTable` for the 환산보증금 protection-scope and the licensing-step matrix — keep both tables, their `sourceId`s, and `TermExplainer`/`Caveat`s. Ensure no bare 보증금/월세/금액 figure sits in prose; the 환산보증금 = 보증금 + (월세 × 100) formula is a formula (no won amount) so it may stay in `TermExplainer`/text. Make the 인허가 단계 sequence scannable (it is already an ordered table — keep it).

- [ ] **Step 3: Apply rubric + safety sweep to CH4 (초기비용 + 최악의 손실)**

Keep the 초기비용 `SourceBackedTable`, the 최악의 손실 table, `HiddenCostList`, `DecisionChecklist id="pre-open"`, the top illustrative `Caveat`, and the `CtaLink` → ch5. Confirm all 만 원 ranges are inside the source-bound tables (with `illustrative`); move any stray figure in. Tighten prose around the tables.

- [ ] **Step 4: Keep tests green**

Run: `npx vitest run src/content/learn/Chapter3.test.tsx src/content/learn/Chapter4.test.tsx`
Expected: PASS (update asserted strings if text changed).

- [ ] **Step 5: Full suite + build**

Run: `npm test` then `npm run build` — both PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/learn/Chapter3.tsx src/content/learn/Chapter3.test.tsx src/content/learn/Chapter4.tsx src/content/learn/Chapter4.test.tsx
git commit -m "content(learn): readability + safety polish for CH3, CH4

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Readability + safety pass — CH5 & CH6

**Files:** `src/content/learn/Chapter5.tsx`, `Chapter6.tsx` (+ tests if needed)

- [ ] **Step 1: Read both chapters and their tests**

Run: `cat src/content/learn/Chapter5.tsx src/content/learn/Chapter5.test.tsx src/content/learn/Chapter6.tsx src/content/learn/Chapter6.test.tsx`

- [ ] **Step 2: Apply rubric + safety sweep to CH5 (돈의 흐름 — the heaviest chapter)**

Keep `CashflowWaterfall`, `CashflowCalendar` (tax/insurance timing), the three `MoneyScenario` cards (all `illustrative`), `HiddenCostList`, and the VAT/소득세 `NumericClaim`s with their mechanism-only `basis`. This chapter has the most figures — every won/%/시기 figure must already be in a primitive; confirm none leaked into the surrounding `<p>`/`<Callout>` text and move any in. Tighten the connective prose between the components so the flow reads top-to-bottom.

- [ ] **Step 3: Apply rubric + safety sweep to CH6 (운영 기본기)**

Keep the 손익분기 `SourceBackedTable` (`illustrative`, from the earlier fix), the 최저임금/주휴수당 `NumericClaim`s (mechanism + "4주 평균 1주 15시간" wording), and `DecisionChecklist id="monthly"`. Ensure the breakeven worked numbers stay in the table, not the Callout. Tighten prose.

- [ ] **Step 4: Keep tests green**

Run: `npx vitest run src/content/learn/Chapter5.test.tsx src/content/learn/Chapter6.test.tsx`
Expected: PASS (update asserted strings if text changed).

- [ ] **Step 5: Full suite + build**

Run: `npm test` then `npm run build` — both PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/learn/Chapter5.tsx src/content/learn/Chapter5.test.tsx src/content/learn/Chapter6.tsx src/content/learn/Chapter6.test.tsx
git commit -m "content(learn): readability + safety polish for CH5, CH6

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Readability + safety pass — CH7 & CH8

**Files:** `src/content/learn/Chapter7.tsx`, `Chapter8.tsx` (+ tests if needed)

- [ ] **Step 1: Read both chapters and their tests**

Run: `cat src/content/learn/Chapter7.tsx src/content/learn/Chapter7.test.tsx src/content/learn/Chapter8.tsx src/content/learn/Chapter8.test.tsx`

- [ ] **Step 2: Apply rubric + safety sweep to CH7 (매출 안 나올 때)**

Keep the 진단 순서 (매출→원가→고정비), the 줄여도 되는/줄이면 안 되는 비용 contrast, the 버티기 vs 손절 section with the `CtaLink` → ch4 (worst-case loss), and the 폐업/양도 절차. CH7 is principle-based (general source) — make the diagnosis order and the cost contrast scannable (lists/two-column), tighten prose. No hard numbers expected; confirm none leaked in.

- [ ] **Step 3: Apply rubric + safety sweep to CH8 (매출 잘 나올 때)**

Keep the 종합소득세 누진 `NumericClaim` (mechanism only, no rates), the 재투자 vs 저축 / 2호점 함정 / 번아웃 sections, and the closing `CtaLink` → `#compare`. Tighten prose; ensure the 누진 mechanism stays in the `NumericClaim` and no rate/threshold is asserted in prose.

- [ ] **Step 4: Keep tests green**

Run: `npx vitest run src/content/learn/Chapter7.test.tsx src/content/learn/Chapter8.test.tsx`
Expected: PASS (update asserted strings if text changed).

- [ ] **Step 5: Full suite + build**

Run: `npm test` then `npm run build` — both PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/learn/Chapter7.tsx src/content/learn/Chapter7.test.tsx src/content/learn/Chapter8.tsx src/content/learn/Chapter8.test.tsx
git commit -m "content(learn): readability + safety polish for CH7, CH8

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Whole-curriculum consistency + visual sanity

**Files:** none expected (verification); small fixups allowed if inconsistencies surface.

- [ ] **Step 1: Cross-chapter consistency scan**

Run: `grep -nE "만 원|[0-9]+%|[0-9]+배" src/content/learn/Chapter*.tsx`
Review each hit: confirm it is inside a source-bound primitive's props (label/value/rows/lines/steps/entries), NOT in a `<p>`/`<li>`/`<Callout>`/`<Caveat>` free-text run. If any figure is in free text, move it into the appropriate primitive (no new sources/numbers) and re-run that chapter's test. List anything you moved.

- [ ] **Step 2: Tone consistency**

Skim all 8 chapters for consistent voice (plain, beginner, no investment-advice phrasing), consistent `TermExplainer` usage for repeated jargon, and consistent `Caveat` placement on sensitive claims. Fix obvious drift only.

- [ ] **Step 3: Verify everything green**

Run: `npm test` then `npm run build`
Expected: both PASS (full suite, all chapter render tests green).

- [ ] **Step 4: Visual sanity (manual, mobile + desktop)**

Run the app (`npm run dev`) and open a couple of chapters at mobile width (390px) and desktop. Confirm paragraphs are short, figures are in boxes, and the reading flow is clean. Capture before/after screenshots if convenient. (No code gate; this is a human/visual check.)

- [ ] **Step 5: Commit any fixups**

```bash
git add -A
git commit -m "content(learn): cross-chapter consistency + safety sweep fixups

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(If Step 1–2 found nothing to fix, skip the commit and note "no fixups needed.")

---

## Self-Review (completed by plan author)

- **Spec coverage:** §6 readability (lead-with-conclusion, split paragraphs, scannable, plain language) → applied per chapter in Tasks 1–4 via the rubric. §7.1 safety pass (every concrete figure source-bound; soften assertive unreviewed claims; keep draft status + warnings) → safety-sweep step in every task + the whole-curriculum grep in Task 5. All 8 chapters covered (CH1-2, CH3-4, CH5-6, CH7-8).
- **Placeholder scan:** no TBD/TODO. The editorial steps give a concrete rubric + a worked before/after example + explicit per-chapter constraints (which primitives/sources/CTAs to preserve) rather than describing vaguely; exact paragraph rewrites are intentionally left to the implementer because they depend on the current prose, which the implementer reads in Step 1 — reproducing all 1,852 lines verbatim in the plan would be duplicative. Hard constraints forbid new facts/numbers/sources.
- **Consistency:** every task preserves the same invariants — component names, `sourceId`s, source-bound primitives, CTAs — and is gated by the existing per-chapter render test (which throws on any unresolved `sourceId`), the full unit suite, and `npm run build`.
