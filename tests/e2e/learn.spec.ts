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
