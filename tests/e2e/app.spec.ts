import { expect, test } from '@playwright/test';

test('loads dashboard with core brand cards', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '내 조건에 맞는 프랜차이즈 찾기' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '한눈에 보는 창업 지도' })).toBeVisible();
  await expect(page.getByText('초보자용 읽는 법')).toBeVisible();
  await expect(page.getByRole('heading', { name: '메가커피', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '교촌치킨', exact: true })).toBeVisible();
});

test('selects two brands and shows the comparison table', async ({ page }) => {
  await page.goto('/');

  await selectBrandForComparison(page, '메가커피');
  await selectBrandForComparison(page, '교촌치킨');

  await expect(page.getByRole('heading', { name: '담은 브랜드 비교' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '브랜드' })).toBeVisible();
});

test('reveals advanced simulator controls progressively', async ({ page }) => {
  await page.goto('/');

  const hansotReport = page.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });

  await expect(hansotReport.getByRole('heading', { name: '숫자로 보는 위치' })).toBeVisible();
  await expect(hansotReport.getByRole('heading', { name: '월매출에서 순수익까지' })).toBeVisible();
  await expect(hansotReport.getByLabel('대출 원금')).toHaveCount(0);
  await hansotReport.getByRole('button', { name: '비용 자세히 조정' }).click();

  await expect(hansotReport.getByLabel('대출 원금')).toBeVisible();
});

test('analyzes a candidate location against break-even sales', async ({ page }) => {
  await page.goto('/');

  const hansotReport = page.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });

  await hansotReport.getByLabel('후보지 상권명').fill('강남역');
  await hansotReport.getByLabel('후보지 월 임대료').fill('520');

  await expect(hansotReport.getByText('서울 강남역')).toBeVisible();
  await expect(hansotReport.getByText('예시 상권 데이터', { exact: true })).toBeVisible();
  await expect(hansotReport.getByText('후보지 기대 월매출')).toBeVisible();
  await expect(hansotReport.getByText(/월 예상 (잔여금|부족액)/)).toBeVisible();
  await expect(hansotReport.getByText('손익분기 월매출')).toBeVisible();
  await expect(hansotReport.getByText('반경 500m 경쟁 현황')).toBeVisible();
  await expect(hansotReport.getByText('사장 인건비·대출 포함 기준')).toBeVisible();
});

test('does not analyze an unknown candidate area with fallback numbers', async ({ page }) => {
  await page.goto('/');

  const hansotReport = page.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });

  await hansotReport.getByLabel('후보지 상권명').fill('부산 서면');

  await expect(hansotReport.getByText('해당 상권 데이터 없음', { exact: true })).toBeVisible();
  await expect(hansotReport.getByText('예: 강남, 홍대, 성수')).toBeVisible();
  await expect(hansotReport.getByText('손익분기 월매출')).toHaveCount(0);
});

test('opens a collapsed detail report from its dashboard card', async ({ page }) => {
  await page.goto('/');

  const megaReport = page.getByRole('region', { name: '메가커피 창업 판단 리포트' });
  await expect(megaReport).toHaveCount(0);

  const megaCard = page.locator('article').filter({
    has: page.getByRole('heading', { name: '메가커피' }),
  });
  await megaCard.getByRole('button', { name: '자세히 보기' }).click();

  await expect(page.getByRole('region', { name: '메가커피 창업 판단 리포트' })).toBeVisible();
  await expect(page.getByRole('region', { name: '한솥도시락 창업 판단 리포트' })).toHaveCount(0);
});

async function selectBrandForComparison(page: import('@playwright/test').Page, brandName: string) {
  const brandCard = page.locator('article').filter({
    has: page.getByRole('heading', { name: brandName }),
  });

  await brandCard.getByRole('button', { name: '비교 담기' }).click();
}
