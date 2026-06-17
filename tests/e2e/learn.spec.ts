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
