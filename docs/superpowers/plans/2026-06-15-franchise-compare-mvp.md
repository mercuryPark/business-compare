# Franchise Compare MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Korean franchise comparison dashboard MVP for the 10 curated brands using structured manual data, benchmark-relative grades, source/confidence display, and a preset-first net-profit simulator.

**Architecture:** Use a client-side React app with a typed domain layer. Keep business logic in pure TypeScript modules with Vitest coverage, and keep UI components thin. The first release uses local structured data so the product can validate the dashboard experience before adding crawling, APIs, accounts, or address-level trade-area scoring.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, Recharts, Lucide React, Vitest, Testing Library, Playwright.

---

## Scope

This plan implements the first usable prototype:

- 10 curated brands only.
- Home dashboard with benchmark-relative grades, risk badges, freshness, P0 verification state, and mobile-first cards.
- Category-first comparison flow for 2 to 4 brands.
- Brand detail report with source/confidence, P0/P1/P2 limitations, public-brand risk controls, and correction request CTA.
- Preset-first simulator with progressive disclosure for advanced assumptions.
- Pure calculation/scoring modules with tests.

This plan does not implement:

- Real-time crawling.
- User accounts.
- Paid reports.
- Backend persistence.
- Nationwide search.
- Address-level commercial-area scoring.

## File Structure

Create these files:

- `package.json`: scripts and dependencies.
- `index.html`: Vite entry point.
- `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.config.ts`, `postcss.config.js`, `tailwind.config.ts`: project tooling.
- `src/main.tsx`: React bootstrap.
- `src/App.tsx`: app shell and state orchestration.
- `src/styles.css`: Tailwind imports and global design tokens.
- `src/domain/types.ts`: shared domain types.
- `src/domain/brands.ts`: curated brand dataset with transparent prototype sample values and source/confidence metadata.
- `src/domain/scoring.ts`: benchmark-relative grading and labels.
- `src/domain/simulator.ts`: profit simulator formulas.
- `src/domain/qa.ts`: P0 verification, freshness, legal/wording guard helpers.
- `src/domain/__tests__/scoring.test.ts`: scoring tests.
- `src/domain/__tests__/simulator.test.ts`: simulator tests.
- `src/domain/__tests__/qa.test.ts`: QA helper tests.
- `src/components/Dashboard.tsx`: home dashboard.
- `src/components/BrandCard.tsx`: brand summary card.
- `src/components/ComparePanel.tsx`: category-first comparison UI.
- `src/components/BrandDetail.tsx`: detailed report UI.
- `src/components/Simulator.tsx`: preset-first simulator UI.
- `src/components/MetricBar.tsx`: reusable score/grade row.
- `src/components/Badge.tsx`: reusable status badge.
- `src/components/SourcePanel.tsx`: source/confidence/audit display.
- `src/components/CorrectionCta.tsx`: correction request CTA.
- `tests/e2e/app.spec.ts`: Playwright smoke tests.
- `playwright.config.ts`: Playwright config.
- `.gitignore`: ignored generated files.
- `README.md`: local run, test, and data caveat instructions.

## Data Caveat

The first implementation should include structured sample values that clearly mark their status as prototype data. Do not present sample values as completed real research. Each brand card must show a `prototype data` or `needs P0 verification` state until actual researched values are entered and checked.

---

### Task 1: Scaffold The React/TypeScript Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "business-compare",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "lucide-react": "^0.468.0",
    "recharts": "^2.15.0",
    "vite": "^6.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create tooling config**

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>프랜차이즈 비교 대시보드</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "tests", "vite.config.ts", "vitest.config.ts", "playwright.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "playwright.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

Create `vitest.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172026',
        muted: '#667085',
        paper: '#f7f8fa',
        line: '#d8dde3',
        safe: '#0f8a5f',
        watch: '#b26a00',
        danger: '#c83232',
        info: '#2f6fed',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Create `.gitignore`:

```gitignore
node_modules
dist
coverage
playwright-report
test-results
.DS_Store
```

- [ ] **Step 3: Create React entry and initial app**

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">프랜차이즈 비교 대시보드</h1>
        <p className="mt-2 text-sm text-muted">프로토타입을 준비 중입니다.</p>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

html {
  background: #f7f8fa;
}

body {
  margin: 0;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

button,
input,
select {
  font: inherit;
}
```

- [ ] **Step 4: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 5: Verify scaffold builds**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build complete with exit code 0.

- [ ] **Step 6: Commit**

If the folder is a git repository, run:

```bash
git add .
git commit -m "chore: scaffold franchise dashboard app"
```

Expected: commit succeeds. If not in git, skip commit and note it in the task log.

---

### Task 2: Add Domain Types And Curated Prototype Data

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/brands.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create domain types**

Create `src/domain/types.ts`:

```ts
export type BrandCategory = 'coffee' | 'lunchbox' | 'chicken' | 'dessert' | 'toast-burger';

export type Priority = 'P0' | 'P1' | 'P2';
export type Confidence = 'high' | 'medium' | 'low';
export type Freshness = 'current' | 'needs-update' | 'outdated';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'insufficient-data';
export type RiskLevel = 'good' | 'normal' | 'watch' | 'high' | 'insufficient-data';
export type FitLabel = '적합' | '조건부' | '주의' | '자료 부족';

export interface SourceRef {
  type: 'official-disclosure' | 'franchisor' | 'ftc' | 'news' | 'review' | 'manual-assumption';
  title: string;
  url?: string;
  referenceYear?: number;
  capturedAt: string;
  confidence: Confidence;
}

export interface AuditState {
  p0Verified: boolean;
  researcher: string;
  reviewer?: string;
  lastVerifiedAt?: string;
  nextReviewMonth: string;
  correctionStatus?: 'none' | 'under-review';
}

export interface CostData {
  startupTotalM: number;
  franchiseFeeM: number;
  trainingFeeM: number;
  depositM: number;
  interiorM: number;
  equipmentM: number;
  otherStartupM: number;
  recurringRoyaltyRate: number;
  adFeeRate: number;
  requiredPurchaseBurdenRate: number;
  renewalReserveM: number;
}

export interface SalesData {
  averageAnnualSalesM: number;
  salesPerAreaM: number;
  regionalLowAnnualSalesM?: number;
  regionalHighAnnualSalesM?: number;
  averageSalesCaveat: string;
}

export interface StabilityData {
  currentStores: number;
  directStores: number;
  storeChange3y: number;
  openings3y: number;
  closures3y: number;
  terminations3y: number;
  expirations3y: number;
  ownershipTransfers3y?: number;
  averageOperatingYears?: number;
}

export interface SimulatorDefaults {
  monthlySalesM: number;
  monthlyRentM: number;
  deliveryRatio: number;
  laborCostM: number;
  ownerLaborM: number;
  cogsRate: number;
  deliveryCommissionRate: number;
  deliveryAgencyRate: number;
  packagingRate: number;
  cardFeeRate: number;
  loanPrincipalM: number;
  annualInterestRate: number;
  loanYears: number;
  taxReserveRate: number;
  utilitiesM: number;
  otherOpexM: number;
}

export interface Brand {
  id: string;
  name: string;
  operator: string;
  category: BrandCategory;
  categoryLabel: string;
  launchYear: number;
  franchiseStartYear: number;
  fitLabel: FitLabel;
  oneLine: string;
  suitableFor: string;
  cautionFor: string;
  cost: CostData;
  sales: SalesData;
  stability: StabilityData;
  simulatorDefaults: SimulatorDefaults;
  trendDriven: boolean;
  tradeAreaFit: string[];
  tradeAreaAvoid: string[];
  keyRisks: string[];
  sources: SourceRef[];
  audit: AuditState;
  freshness: Freshness;
}
```

- [ ] **Step 2: Create prototype brand data**

Create `src/domain/brands.ts`:

```ts
import type { Brand } from './types';

const capturedAt = '2026-06-15';
const prototypeSource = {
  type: 'manual-assumption' as const,
  title: 'Prototype sample data for UI and model validation',
  capturedAt,
  confidence: 'low' as const,
};

export const brands: Brand[] = [
  ['hansot', '한솥도시락', '한솥', 'lunchbox', '도시락', 1993, 1993, 850, 12],
  ['isaac', '이삭토스트', '이삭', 'toast-burger', '토스트/버거', 1995, 2003, 900, 11],
  ['mega', '메가커피', '앤하우스', 'coffee', '커피', 2015, 2016, 3000, 9],
  ['momstouch', '맘스터치', '맘스터치앤컴퍼니', 'toast-burger', '토스트/버거', 2004, 2004, 1400, 8],
  ['yoajung', '요아정', '요아정', 'dessert', '디저트', 2021, 2022, 350, 3],
  ['bondosirak', '본도시락', '본아이에프', 'lunchbox', '도시락', 2012, 2012, 420, 8],
  ['baskin', '베스킨라빈스', '비알코리아', 'dessert', '디저트', 1985, 1985, 1700, 20],
  ['compose', '컴포즈커피', '컴포즈커피', 'coffee', '커피', 2014, 2014, 2500, 8],
  ['kyochon', '교촌치킨', '교촌에프앤비', 'chicken', '치킨', 1991, 1991, 1350, 22],
  ['ediya', '이디야커피', '이디야', 'coffee', '커피', 2001, 2001, 3000, 18],
].map(([id, name, operator, category, categoryLabel, launchYear, franchiseStartYear, stores, age]) => {
  const storeCount = Number(stores);
  const years = Number(age);
  const baseSales = category === 'coffee' ? 300 : category === 'chicken' ? 650 : category === 'dessert' ? 430 : 380;
  const startup = category === 'chicken' ? 160 : category === 'dessert' ? 140 : category === 'coffee' ? 110 : 95;

  return {
    id: String(id),
    name: String(name),
    operator: String(operator),
    category: category as Brand['category'],
    categoryLabel: String(categoryLabel),
    launchYear: Number(launchYear),
    franchiseStartYear: Number(franchiseStartYear),
    fitLabel: '자료 부족',
    oneLine: '프로토타입 데이터입니다. 실제 정보공개서 검증 전까지 판단 라벨은 제한적으로 표시합니다.',
    suitableFor: 'P0 검증 후 업데이트',
    cautionFor: '공개자료 검증 전 수익성 판단 금지',
    cost: {
      startupTotalM: startup,
      franchiseFeeM: 10,
      trainingFeeM: 5,
      depositM: 10,
      interiorM: startup * 0.42,
      equipmentM: startup * 0.28,
      otherStartupM: startup * 0.12,
      recurringRoyaltyRate: 0.02,
      adFeeRate: 0.01,
      requiredPurchaseBurdenRate: 0.08,
      renewalReserveM: 1.2,
    },
    sales: {
      averageAnnualSalesM: baseSales,
      salesPerAreaM: baseSales / 20,
      regionalLowAnnualSalesM: baseSales * 0.65,
      regionalHighAnnualSalesM: baseSales * 1.35,
      averageSalesCaveat: '평균 매출은 점포별 편차를 가릴 수 있어 지역별 편차와 보수 시나리오를 함께 봐야 합니다.',
    },
    stability: {
      currentStores: storeCount,
      directStores: 0,
      storeChange3y: Math.round(storeCount * 0.08),
      openings3y: Math.round(storeCount * 0.16),
      closures3y: Math.round(storeCount * 0.06),
      terminations3y: Math.round(storeCount * 0.015),
      expirations3y: Math.round(storeCount * 0.02),
      ownershipTransfers3y: Math.round(storeCount * 0.03),
      averageOperatingYears: years,
    },
    simulatorDefaults: {
      monthlySalesM: baseSales / 12,
      monthlyRentM: category === 'coffee' ? 4.5 : category === 'chicken' ? 6.5 : 5.5,
      deliveryRatio: category === 'chicken' ? 0.55 : category === 'lunchbox' ? 0.35 : 0.2,
      laborCostM: category === 'chicken' ? 9 : 6,
      ownerLaborM: 3,
      cogsRate: category === 'coffee' ? 0.35 : 0.42,
      deliveryCommissionRate: 0.09,
      deliveryAgencyRate: 0.07,
      packagingRate: 0.025,
      cardFeeRate: 0.018,
      loanPrincipalM: startup * 0.5,
      annualInterestRate: 0.055,
      loanYears: 5,
      taxReserveRate: 0.08,
      utilitiesM: 1.2,
      otherOpexM: 1.5,
    },
    trendDriven: id === 'yoajung',
    tradeAreaFit: ['역세권', '주거지형'],
    tradeAreaAvoid: ['임대료가 과도한 특수상권'],
    keyRisks: ['P0 미검증', '평균 매출 착시 주의', '필수구매 부담 확인 필요'],
    sources: [prototypeSource],
    audit: {
      p0Verified: false,
      researcher: 'prototype',
      nextReviewMonth: '2026-07',
      correctionStatus: 'none',
    },
    freshness: 'needs-update',
  } satisfies Brand;
});

export const categories = Array.from(new Set(brands.map((brand) => brand.category)));
```

- [ ] **Step 3: Wire data count into app**

Replace `src/App.tsx`:

```tsx
import { brands } from './domain/brands';

export default function App() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">프랜차이즈 비교 대시보드</h1>
        <p className="mt-2 text-sm text-muted">
          지정 브랜드 {brands.length}개를 기준으로 한 프로토타입입니다.
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Verify build**

Run:

```bash
npm run build
```

Expected: exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/domain src/App.tsx
git commit -m "feat: add franchise domain data"
```

If not in git, skip commit and note it.

---

### Task 3: Implement Scoring And QA Logic With Tests

**Files:**
- Create: `src/domain/scoring.ts`
- Create: `src/domain/qa.ts`
- Create: `src/domain/__tests__/scoring.test.ts`
- Create: `src/domain/__tests__/qa.test.ts`

- [ ] **Step 1: Write scoring tests**

Create `src/domain/__tests__/scoring.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { brands } from '../brands';
import { calculateBrandScore, gradeFromScore } from '../scoring';

describe('scoring', () => {
  it('returns insufficient-data when P0 is not verified', () => {
    const result = calculateBrandScore(brands[0]);
    expect(result.grade).toBe('insufficient-data');
    expect(result.confidence).toBe('low');
  });

  it('maps score ranges to benchmark-relative grades', () => {
    expect(gradeFromScore(92)).toBe('A');
    expect(gradeFromScore(78)).toBe('B');
    expect(gradeFromScore(63)).toBe('C');
    expect(gradeFromScore(48)).toBe('D');
    expect(gradeFromScore(24)).toBe('E');
  });
});
```

- [ ] **Step 2: Write QA tests**

Create `src/domain/__tests__/qa.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { brands } from '../brands';
import { getFreshnessLabel, getP0Limitations, isNegativeLabelAllowed } from '../qa';

describe('qa helpers', () => {
  it('lists P0 limitation when prototype data is not verified', () => {
    expect(getP0Limitations(brands[0])).toContain('P0 데이터 검증 전');
  });

  it('maps freshness to Korean labels', () => {
    expect(getFreshnessLabel('current')).toBe('최신 검토');
    expect(getFreshnessLabel('needs-update')).toBe('업데이트 필요');
    expect(getFreshnessLabel('outdated')).toBe('오래된 자료');
  });

  it('allows only source-driven negative labels', () => {
    expect(isNegativeLabelAllowed({ hasSource: true, hasRule: true })).toBe(true);
    expect(isNegativeLabelAllowed({ hasSource: false, hasRule: true })).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
npm test -- src/domain/__tests__/scoring.test.ts src/domain/__tests__/qa.test.ts
```

Expected: fail because `scoring.ts` and `qa.ts` do not exist.

- [ ] **Step 4: Implement scoring**

Create `src/domain/scoring.ts`:

```ts
import type { Brand, Confidence, Grade, RiskLevel } from './types';

export interface BrandScore {
  grade: Grade;
  score: number | null;
  confidence: Confidence;
  closureRisk: RiskLevel;
  drivers: string[];
}

export function gradeFromScore(score: number): Exclude<Grade, 'insufficient-data'> {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'E';
}

export function calculateClosureRate(brand: Brand): number {
  const denominator = Math.max(brand.stability.currentStores, 1);
  return brand.stability.closures3y / denominator;
}

export function calculateBrandScore(brand: Brand): BrandScore {
  if (!brand.audit.p0Verified) {
    return {
      grade: 'insufficient-data',
      score: null,
      confidence: 'low',
      closureRisk: 'insufficient-data',
      drivers: ['P0 데이터 검증 전'],
    };
  }

  const profitScore = clamp(100 - brand.cost.requiredPurchaseBurdenRate * 180 - brand.cost.startupTotalM * 0.15);
  const closureRate = calculateClosureRate(brand);
  const closureScore = clamp(100 - closureRate * 650);
  const stabilityScore = clamp(55 + Math.min(brand.stability.averageOperatingYears ?? 0, 20) * 2);
  const riskScore = brand.trendDriven ? 58 : 74;
  const startupScore = clamp(100 - brand.cost.startupTotalM * 0.25);
  const operationScore = clamp(78 - brand.simulatorDefaults.deliveryRatio * 25);

  const score =
    profitScore * 0.3 +
    closureScore * 0.2 +
    stabilityScore * 0.15 +
    riskScore * 0.15 +
    startupScore * 0.1 +
    operationScore * 0.1;

  return {
    grade: gradeFromScore(score),
    score: Math.round(score),
    confidence: 'medium',
    closureRisk: closureRate >= 0.12 ? 'high' : closureRate >= 0.07 ? 'watch' : 'normal',
    drivers: [
      `폐점률 추정 ${(closureRate * 100).toFixed(1)}%`,
      `필수구매 부담 ${(brand.cost.requiredPurchaseBurdenRate * 100).toFixed(1)}%`,
    ],
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
```

- [ ] **Step 5: Implement QA helpers**

Create `src/domain/qa.ts`:

```ts
import type { Brand, Freshness } from './types';

export function getP0Limitations(brand: Brand): string[] {
  const limitations: string[] = [];

  if (!brand.audit.p0Verified) {
    limitations.push('P0 데이터 검증 전');
  }

  if (brand.sources.some((source) => source.type === 'manual-assumption')) {
    limitations.push('프로토타입 수동 가정 포함');
  }

  if (brand.freshness !== 'current') {
    limitations.push(getFreshnessLabel(brand.freshness));
  }

  return limitations;
}

export function getFreshnessLabel(freshness: Freshness): string {
  const labels: Record<Freshness, string> = {
    current: '최신 검토',
    'needs-update': '업데이트 필요',
    outdated: '오래된 자료',
  };
  return labels[freshness];
}

export function isNegativeLabelAllowed(input: { hasSource: boolean; hasRule: boolean }): boolean {
  return input.hasSource && input.hasRule;
}
```

- [ ] **Step 6: Run tests and verify pass**

Run:

```bash
npm test -- src/domain/__tests__/scoring.test.ts src/domain/__tests__/qa.test.ts
```

Expected: both test files pass.

- [ ] **Step 7: Commit**

```bash
git add src/domain
git commit -m "feat: add scoring and data QA logic"
```

If not in git, skip commit and note it.

---

### Task 4: Implement Profit Simulator With Tests

**Files:**
- Create: `src/domain/simulator.ts`
- Create: `src/domain/__tests__/simulator.test.ts`

- [ ] **Step 1: Write simulator tests**

Create `src/domain/__tests__/simulator.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { brands } from '../brands';
import { calculateMonthlyLoanPaymentM, runSimulation } from '../simulator';

describe('simulator', () => {
  it('calculates monthly loan payment in million KRW', () => {
    const payment = calculateMonthlyLoanPaymentM(60, 0.06, 5);
    expect(payment).toBeGreaterThan(1);
    expect(payment).toBeLessThan(1.3);
  });

  it('subtracts owner labor, loan payment, and tax reserve from cash left', () => {
    const result = runSimulation(brands[2], brands[2].simulatorDefaults);
    expect(result.operatingProfitBeforeOwnerLaborM).toBeGreaterThan(result.operatingProfitAfterOwnerLaborM);
    expect(result.operatingProfitAfterOwnerLaborM).toBeGreaterThan(result.cashLeftM);
    expect(result.topCostDrivers.length).toBe(3);
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```bash
npm test -- src/domain/__tests__/simulator.test.ts
```

Expected: fail because `simulator.ts` does not exist.

- [ ] **Step 3: Implement simulator**

Create `src/domain/simulator.ts`:

```ts
import type { Brand, SimulatorDefaults } from './types';

export interface SimulationResult {
  operatingProfitBeforeOwnerLaborM: number;
  operatingProfitAfterOwnerLaborM: number;
  cashLeftM: number;
  netMargin: number;
  breakEvenSalesM: number;
  paybackMonths: number | null;
  topCostDrivers: Array<{ label: string; valueM: number }>;
  warnings: string[];
}

export function calculateMonthlyLoanPaymentM(principalM: number, annualRate: number, years: number): number {
  if (principalM <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  if (monthlyRate === 0) return principalM / months;
  return (principalM * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export function runSimulation(brand: Brand, input: SimulatorDefaults): SimulationResult {
  const deliverySalesM = input.monthlySalesM * input.deliveryRatio;
  const cogsM = input.monthlySalesM * input.cogsRate;
  const requiredPurchaseM = input.monthlySalesM * brand.cost.requiredPurchaseBurdenRate;
  const deliveryFeesM = deliverySalesM * (input.deliveryCommissionRate + input.deliveryAgencyRate + input.packagingRate);
  const cardFeesM = input.monthlySalesM * input.cardFeeRate;
  const royaltyM = input.monthlySalesM * brand.cost.recurringRoyaltyRate;
  const adFeeM = input.monthlySalesM * brand.cost.adFeeRate;
  const reserveM = brand.cost.renewalReserveM;
  const loanPaymentM = calculateMonthlyLoanPaymentM(input.loanPrincipalM, input.annualInterestRate, input.loanYears);

  const operatingCostsBeforeOwnerLaborM =
    cogsM +
    requiredPurchaseM +
    deliveryFeesM +
    cardFeesM +
    royaltyM +
    adFeeM +
    input.monthlyRentM +
    input.laborCostM +
    input.utilitiesM +
    input.otherOpexM +
    reserveM;

  const operatingProfitBeforeOwnerLaborM = input.monthlySalesM - operatingCostsBeforeOwnerLaborM;
  const operatingProfitAfterOwnerLaborM = operatingProfitBeforeOwnerLaborM - input.ownerLaborM;
  const taxReserveM = Math.max(0, operatingProfitAfterOwnerLaborM * input.taxReserveRate);
  const cashLeftM = operatingProfitAfterOwnerLaborM - loanPaymentM - taxReserveM;
  const fixedMonthlyM = input.monthlyRentM + input.laborCostM + input.utilitiesM + input.otherOpexM + reserveM + input.ownerLaborM;
  const variableRate =
    input.cogsRate +
    brand.cost.requiredPurchaseBurdenRate +
    input.cardFeeRate +
    brand.cost.recurringRoyaltyRate +
    brand.cost.adFeeRate +
    input.deliveryRatio * (input.deliveryCommissionRate + input.deliveryAgencyRate + input.packagingRate);

  return {
    operatingProfitBeforeOwnerLaborM: round(operatingProfitBeforeOwnerLaborM),
    operatingProfitAfterOwnerLaborM: round(operatingProfitAfterOwnerLaborM),
    cashLeftM: round(cashLeftM),
    netMargin: round(cashLeftM / input.monthlySalesM),
    breakEvenSalesM: round(fixedMonthlyM / Math.max(0.05, 1 - variableRate)),
    paybackMonths: cashLeftM > 0 ? Math.ceil(brand.cost.startupTotalM / cashLeftM) : null,
    topCostDrivers: [
      { label: '원가/필수구매', valueM: round(cogsM + requiredPurchaseM) },
      { label: '인건비/사장노동', valueM: round(input.laborCostM + input.ownerLaborM) },
      { label: '배달/포장 수수료', valueM: round(deliveryFeesM) },
    ].sort((a, b) => b.valueM - a.valueM),
    warnings: buildWarnings(input.deliveryRatio, brand.cost.requiredPurchaseBurdenRate),
  };
}

function buildWarnings(deliveryRatio: number, requiredPurchaseRate: number): string[] {
  const warnings = [
    '이 계산은 공개자료와 업종 평균 가정을 바탕으로 한 예비 시뮬레이션입니다.',
    '사장 직접 근무에도 노동시간 비용을 반영합니다.',
  ];

  if (deliveryRatio >= 0.5) {
    warnings.push('배달 비중이 높아 수수료와 포장비가 순이익률을 낮출 수 있습니다.');
  }

  if (requiredPurchaseRate >= 0.08) {
    warnings.push('필수구매품목 평균 부담은 실제 점포별 부담과 다를 수 있습니다.');
  }

  return warnings;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
```

- [ ] **Step 4: Run simulator tests**

Run:

```bash
npm test -- src/domain/__tests__/simulator.test.ts
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/domain/simulator.ts src/domain/__tests__/simulator.test.ts
git commit -m "feat: add profit simulator"
```

If not in git, skip commit and note it.

---

### Task 5: Build Dashboard, Cards, And Shared UI Components

**Files:**
- Create: `src/components/Badge.tsx`
- Create: `src/components/MetricBar.tsx`
- Create: `src/components/BrandCard.tsx`
- Create: `src/components/Dashboard.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create shared badge component**

Create `src/components/Badge.tsx`:

```tsx
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'good' | 'watch' | 'danger' | 'info';

const toneClass: Record<Tone, string> = {
  neutral: 'border-line bg-white text-ink',
  good: 'border-safe/30 bg-safe/10 text-safe',
  watch: 'border-watch/30 bg-watch/10 text-watch',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-info/30 bg-info/10 text-info',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create metric bar**

Create `src/components/MetricBar.tsx`:

```tsx
export function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-ink">{value}</span>
      </div>
      <div className="h-2 rounded bg-line">
        <div className="h-2 rounded bg-info" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create brand card**

Create `src/components/BrandCard.tsx`:

```tsx
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Brand } from '../domain/types';
import { calculateBrandScore } from '../domain/scoring';
import { getFreshnessLabel, getP0Limitations } from '../domain/qa';
import { Badge } from './Badge';

export function BrandCard({
  brand,
  selected,
  onSelect,
  onOpen,
}: {
  brand: Brand;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const score = calculateBrandScore(brand);
  const limitations = getP0Limitations(brand);

  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">{brand.categoryLabel}</p>
          <h2 className="mt-1 text-lg font-semibold">{brand.name}</h2>
        </div>
        <Badge tone={score.grade === 'insufficient-data' ? 'watch' : 'info'}>
          {score.grade === 'insufficient-data' ? '자료 부족' : `${score.grade} 등급`}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{brand.oneLine}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded border border-line p-2">
          <p className="text-xs text-muted">실수령 추정</p>
          <p className="font-semibold">{brand.simulatorDefaults.monthlySalesM.toFixed(1)}백만원 매출 기준</p>
        </div>
        <div className="rounded border border-line p-2">
          <p className="text-xs text-muted">폐점 리스크</p>
          <p className="font-semibold">{score.closureRisk === 'insufficient-data' ? '자료 부족' : score.closureRisk}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={brand.audit.p0Verified ? 'good' : 'watch'}>
          {brand.audit.p0Verified ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertTriangle className="mr-1 h-3 w-3" />}
          {brand.audit.p0Verified ? 'P0 검증 완료' : 'P0 검증 전'}
        </Badge>
        <Badge tone="neutral">{getFreshnessLabel(brand.freshness)}</Badge>
        {brand.trendDriven && <Badge tone="watch">트렌드 시차 주의</Badge>}
      </div>

      {limitations.length > 0 && (
        <p className="mt-3 text-xs leading-5 text-watch">{limitations.join(' · ')}</p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onSelect}
          className={`flex-1 rounded border px-3 py-2 text-sm font-medium ${
            selected ? 'border-info bg-info text-white' : 'border-line bg-white text-ink'
          }`}
        >
          {selected ? '비교 선택됨' : '비교 선택'}
        </button>
        <button type="button" onClick={onOpen} className="flex-1 rounded bg-ink px-3 py-2 text-sm font-medium text-white">
          상세 보기
        </button>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Create dashboard**

Create `src/components/Dashboard.tsx`:

```tsx
import type { Brand, BrandCategory } from '../domain/types';
import { BrandCard } from './BrandCard';

const categoryLabels: Array<{ value: BrandCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'coffee', label: '커피' },
  { value: 'lunchbox', label: '도시락' },
  { value: 'chicken', label: '치킨' },
  { value: 'dessert', label: '디저트' },
  { value: 'toast-burger', label: '토스트/버거' },
];

export function Dashboard({
  brands,
  category,
  selectedIds,
  onCategoryChange,
  onToggleSelect,
  onOpenBrand,
}: {
  brands: Brand[];
  category: BrandCategory | 'all';
  selectedIds: string[];
  onCategoryChange: (category: BrandCategory | 'all') => void;
  onToggleSelect: (brandId: string) => void;
  onOpenBrand: (brandId: string) => void;
}) {
  const filtered = category === 'all' ? brands : brands.filter((brand) => brand.category === category);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-line bg-white p-4">
        <p className="text-xs font-medium text-info">프로토타입</p>
        <h1 className="mt-1 text-2xl font-semibold">프랜차이즈 창업 비교</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          공식자료와 수동 리서치 구조를 기준으로 브랜드별 수익성, 폐점 리스크, 필수구매 부담, 실수령 추정을 비교합니다.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categoryLabels.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onCategoryChange(item.value)}
            className={`whitespace-nowrap rounded border px-3 py-2 text-sm ${
              category === item.value ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            selected={selectedIds.includes(brand.id)}
            onSelect={() => onToggleSelect(brand.id)}
            onOpen={() => onOpenBrand(brand.id)}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Replace app shell**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react';
import { brands } from './domain/brands';
import type { BrandCategory } from './domain/types';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [category, setCategory] = useState<BrandCategory | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleSelect(brandId: string) {
    setSelectedIds((current) => {
      if (current.includes(brandId)) return current.filter((id) => id !== brandId);
      if (current.length >= 4) return current;
      return [...current, brandId];
    });
  }

  function openBrand(brandId: string) {
    document.getElementById(`brand-${brandId}`)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-4 py-4 md:py-6">
        <Dashboard
          brands={brands}
          category={category}
          selectedIds={selectedIds}
          onCategoryChange={setCategory}
          onToggleSelect={toggleSelect}
          onOpenBrand={openBrand}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Verify build**

Run:

```bash
npm run build
```

Expected: exit code 0.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add dashboard brand cards"
```

If not in git, skip commit and note it.

---

### Task 6: Add Comparison, Detail Report, Simulator UI, And Source Controls

**Files:**
- Create: `src/components/ComparePanel.tsx`
- Create: `src/components/BrandDetail.tsx`
- Create: `src/components/Simulator.tsx`
- Create: `src/components/SourcePanel.tsx`
- Create: `src/components/CorrectionCta.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create source and correction components**

Create `src/components/SourcePanel.tsx`:

```tsx
import type { Brand } from '../domain/types';

export function SourcePanel({ brand }: { brand: Brand }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h3 className="text-base font-semibold">출처와 검증 상태</h3>
      <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        <div>
          <dt className="text-muted">P0 검증</dt>
          <dd className="font-medium">{brand.audit.p0Verified ? '완료' : '검증 전'}</dd>
        </div>
        <div>
          <dt className="text-muted">다음 검토</dt>
          <dd className="font-medium">{brand.audit.nextReviewMonth}</dd>
        </div>
      </dl>
      <ul className="mt-3 space-y-2 text-sm">
        {brand.sources.map((source) => (
          <li key={`${source.title}-${source.capturedAt}`} className="rounded border border-line p-2">
            <p className="font-medium">{source.title}</p>
            <p className="text-xs text-muted">
              {source.type} · 신뢰도 {source.confidence} · 수집일 {source.capturedAt}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Create `src/components/CorrectionCta.tsx`:

```tsx
import { FilePenLine } from 'lucide-react';

export function CorrectionCta({ brandName }: { brandName: string }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <FilePenLine className="mt-0.5 h-5 w-5 text-info" />
        <div>
          <h3 className="text-base font-semibold">자료 정정 요청</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            {brandName} 관련 수치나 출처가 다르다고 판단되면 disputed field, 근거 자료, 요청 내용을 기록해 검토하는 흐름이 필요합니다.
            프로토타입에서는 요청 경로만 표시합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create simulator UI**

Create `src/components/Simulator.tsx`:

```tsx
import { useMemo, useState } from 'react';
import type { Brand, SimulatorDefaults } from '../domain/types';
import { runSimulation } from '../domain/simulator';

export function Simulator({ brand }: { brand: Brand }) {
  const [input, setInput] = useState<SimulatorDefaults>(brand.simulatorDefaults);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const result = useMemo(() => runSimulation(brand, input), [brand, input]);

  function update<K extends keyof SimulatorDefaults>(key: K, value: SimulatorDefaults[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h3 className="text-base font-semibold">순수익 계산기</h3>
      <p className="mt-1 text-sm text-muted">기본값으로 바로 결과를 보고, 필요한 경우 상세 비용을 조정하세요.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm">
          월매출(백만원)
          <input className="mt-1 w-full rounded border border-line px-3 py-2" type="number" value={input.monthlySalesM} onChange={(event) => update('monthlySalesM', Number(event.target.value))} />
        </label>
        <label className="text-sm">
          월임대료(백만원)
          <input className="mt-1 w-full rounded border border-line px-3 py-2" type="number" value={input.monthlyRentM} onChange={(event) => update('monthlyRentM', Number(event.target.value))} />
        </label>
        <label className="text-sm">
          배달비중
          <input className="mt-1 w-full" type="range" min="0" max="0.9" step="0.05" value={input.deliveryRatio} onChange={(event) => update('deliveryRatio', Number(event.target.value))} />
          <span className="text-xs text-muted">{Math.round(input.deliveryRatio * 100)}%</span>
        </label>
      </div>

      <button type="button" className="mt-3 rounded border border-line px-3 py-2 text-sm" onClick={() => setAdvancedOpen((open) => !open)}>
        상세 비용 조정
      </button>

      {advancedOpen && (
        <div className="mt-3 grid gap-3 border-t border-line pt-3 md:grid-cols-3">
          <label className="text-sm">
            대출액(백만원)
            <input className="mt-1 w-full rounded border border-line px-3 py-2" type="number" value={input.loanPrincipalM} onChange={(event) => update('loanPrincipalM', Number(event.target.value))} />
          </label>
          <label className="text-sm">
            사장 인건비(백만원)
            <input className="mt-1 w-full rounded border border-line px-3 py-2" type="number" value={input.ownerLaborM} onChange={(event) => update('ownerLaborM', Number(event.target.value))} />
          </label>
          <label className="text-sm">
            세금/4대보험 적립률
            <input className="mt-1 w-full" type="range" min="0" max="0.2" step="0.01" value={input.taxReserveRate} onChange={(event) => update('taxReserveRate', Number(event.target.value))} />
            <span className="text-xs text-muted">{Math.round(input.taxReserveRate * 100)}%</span>
          </label>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Result label="사장 인건비 전" value={result.operatingProfitBeforeOwnerLaborM} />
        <Result label="사장 인건비 후" value={result.operatingProfitAfterOwnerLaborM} />
        <Result label="대출/세금 반영 후" value={result.cashLeftM} emphasis />
      </div>

      <ul className="mt-3 space-y-1 text-xs text-watch">
        {result.warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </section>
  );
}

function Result({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div className={`rounded border p-3 ${emphasis ? 'border-info bg-info/10' : 'border-line'}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value.toFixed(1)}백만원</p>
    </div>
  );
}
```

- [ ] **Step 3: Create detail report**

Create `src/components/BrandDetail.tsx`:

```tsx
import type { Brand } from '../domain/types';
import { calculateBrandScore } from '../domain/scoring';
import { Badge } from './Badge';
import { CorrectionCta } from './CorrectionCta';
import { Simulator } from './Simulator';
import { SourcePanel } from './SourcePanel';

export function BrandDetail({ brand }: { brand: Brand }) {
  const score = calculateBrandScore(brand);

  return (
    <section id={`brand-${brand.id}`} className="space-y-3 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{brand.categoryLabel}</p>
          <h2 className="text-xl font-semibold">{brand.name} 상세 리포트</h2>
        </div>
        <Badge tone={score.grade === 'insufficient-data' ? 'watch' : 'info'}>
          {score.grade === 'insufficient-data' ? '자료 부족' : `${score.grade} 등급`}
        </Badge>
      </div>

      <p className="text-sm leading-6 text-muted">{brand.oneLine}</p>

      <div className="grid gap-3 md:grid-cols-3">
        <Info label="초보자 적합도" value={brand.fitLabel} />
        <Info label="창업비" value={`${brand.cost.startupTotalM.toFixed(0)}백만원`} />
        <Info label="평균매출 주의" value="지역 편차 proxy 확인" />
      </div>

      <Simulator brand={brand} />
      <SourcePanel brand={brand} />
      <CorrectionCta brandName={brand.name} />
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
```

- [ ] **Step 4: Create compare panel**

Create `src/components/ComparePanel.tsx`:

```tsx
import type { Brand } from '../domain/types';
import { calculateBrandScore } from '../domain/scoring';

export function ComparePanel({ brands }: { brands: Brand[] }) {
  if (brands.length < 2) {
    return (
      <section className="rounded-lg border border-line bg-white p-4 text-sm text-muted">
        비교할 브랜드를 2개 이상 선택하세요. 같은 업종 비교가 가장 신뢰도 높습니다.
      </section>
    );
  }

  const mixedCategory = new Set(brands.map((brand) => brand.category)).size > 1;

  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">선택 브랜드 비교</h2>
        {mixedCategory && <span className="rounded border border-watch/30 bg-watch/10 px-2 py-1 text-xs text-watch">업종이 달라 참고용 비교</span>}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="p-2">브랜드</th>
              <th className="p-2">등급</th>
              <th className="p-2">창업비</th>
              <th className="p-2">평균매출</th>
              <th className="p-2">폐점 리스크</th>
              <th className="p-2">필수구매 부담</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => {
              const score = calculateBrandScore(brand);
              return (
                <tr key={brand.id} className="border-b border-line">
                  <td className="p-2 font-medium">{brand.name}</td>
                  <td className="p-2">{score.grade === 'insufficient-data' ? '자료 부족' : score.grade}</td>
                  <td className="p-2">{brand.cost.startupTotalM.toFixed(0)}백만원</td>
                  <td className="p-2">{brand.sales.averageAnnualSalesM.toFixed(0)}백만원/년</td>
                  <td className="p-2">{score.closureRisk}</td>
                  <td className="p-2">{Math.round(brand.cost.requiredPurchaseBurdenRate * 100)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire comparison and details into app**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react';
import { brands } from './domain/brands';
import type { BrandCategory } from './domain/types';
import { BrandDetail } from './components/BrandDetail';
import { ComparePanel } from './components/ComparePanel';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [category, setCategory] = useState<BrandCategory | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedBrands = brands.filter((brand) => selectedIds.includes(brand.id));

  function toggleSelect(brandId: string) {
    setSelectedIds((current) => {
      if (current.includes(brandId)) return current.filter((id) => id !== brandId);
      if (current.length >= 4) return current;
      return [...current, brandId];
    });
  }

  function openBrand(brandId: string) {
    document.getElementById(`brand-${brandId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-4 md:py-6">
        <Dashboard
          brands={brands}
          category={category}
          selectedIds={selectedIds}
          onCategoryChange={setCategory}
          onToggleSelect={toggleSelect}
          onOpenBrand={openBrand}
        />
        <ComparePanel brands={selectedBrands} />
        <div className="space-y-4">
          {brands.map((brand) => (
            <BrandDetail key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Verify build**

Run:

```bash
npm run build
```

Expected: exit code 0.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: add comparison detail reports and simulator UI"
```

If not in git, skip commit and note it.

---

### Task 7: Add Playwright Smoke Tests And README

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/app.spec.ts`
- Create: `README.md`

- [ ] **Step 1: Create Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});
```

- [ ] **Step 2: Create e2e tests**

Create `tests/e2e/app.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('loads dashboard and shows curated brands', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '프랜차이즈 창업 비교' })).toBeVisible();
  await expect(page.getByText('메가커피')).toBeVisible();
  await expect(page.getByText('교촌치킨')).toBeVisible();
});

test('selects two brands and shows comparison table', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '비교 선택' }).nth(0).click();
  await page.getByRole('button', { name: '비교 선택' }).nth(0).click();
  await expect(page.getByRole('heading', { name: '선택 브랜드 비교' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '브랜드' })).toBeVisible();
});

test('simulator exposes advanced controls progressively', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('대출액(백만원)').first()).not.toBeVisible();
  await page.getByRole('button', { name: '상세 비용 조정' }).first().click();
  await expect(page.getByText('대출액(백만원)').first()).toBeVisible();
});
```

- [ ] **Step 3: Create README**

Create `README.md`:

```md
# Business Compare

한국 프랜차이즈 예비창업자를 위한 비교 대시보드 프로토타입입니다.

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm test
npm run build
npm run e2e
```

## 데이터 상태

현재 브랜드 데이터는 UI와 모델 검증을 위한 프로토타입 값입니다. 실제 공개 전에는 각 브랜드의 P0 데이터가 정보공개서 원문과 2차 검수를 통과해야 합니다.

## P0 검증 대상

- 정보공개서 기준연도
- 가맹점 수와 최근 3년 증감
- 신규 개점, 폐점, 계약종료/해지
- 평균 매출과 지역별 평균매출 편차
- 창업비용
- 차액가맹금/필수구매 부담
- 로열티와 광고비
- 데이터 신선도

## 공개 전 필수 절차

- P0 데이터 2차 검수
- 모델 QA 테이블 검토
- 부정 라벨 출처/규칙 확인
- 정정 요청 경로 확인
- 최종 문구 법률 검토
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm test
npm run build
npm run e2e
```

Expected:

- Vitest tests pass.
- Production build exits 0.
- Playwright desktop and mobile smoke tests pass.

- [ ] **Step 5: Commit**

```bash
git add README.md playwright.config.ts tests
git commit -m "test: add dashboard smoke tests"
```

If not in git, skip commit and note it.

---

## Self-Review Checklist

- Spec coverage:
  - Curated 10 brands: Task 2.
  - Dashboard cards: Task 5.
  - Category-first comparison and mixed-category warning: Task 6.
  - Detail report: Task 6.
  - Net-profit simulator with owner labor, loan repayment, tax reserve, required-purchase burden: Tasks 4 and 6.
  - P0/P1/P2, freshness, source/confidence: Tasks 2, 3, and 6.
  - Data QA and model QA are represented in domain helpers, README release checklist, and UI labels. Full operational workflows remain process requirements, not app automation in this MVP.
  - Public brand risk controls are represented with source panels, correction CTA, and README release checklist.
  - Mobile-first layout is covered by responsive component classes and Playwright mobile smoke test.

- Known MVP limitations:
  - Brand data values are prototype samples until real P0 research is entered.
  - Correction request is a CTA, not a submitted backend form.
  - Data QA workflow is documented and surfaced, not fully automated.
  - Model QA table is not a separate admin screen in this MVP.

- Commands to run before handoff:
  - `npm test`
  - `npm run build`
  - `npm run e2e`
