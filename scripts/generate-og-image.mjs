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
