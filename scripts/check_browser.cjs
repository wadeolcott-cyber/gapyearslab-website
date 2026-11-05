// Optional development check; Playwright is never shipped with the website.
const { chromium } = require('playwright');
const origin = process.env.SITE_URL || 'http://127.0.0.1:8000';
const paths = ['/', '/planning-tools/', '/planner/', '/learn/', '/about/',
  '/methodology/', '/privacy/', '/disclaimer/', '/contact/'];

(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    headless: true,
    args: ['--no-sandbox'],
  });
  let checks = 0;
  try {
    for (const width of [360, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      for (const path of paths) {
        const response = await page.goto(origin + path);
        if (response.status() !== 200) throw Error(`${path}: HTTP ${response.status()}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (overflow) throw Error(`${path}: horizontal overflow at ${width}px`);
        if (await page.locator('h1').count() !== 1) throw Error(`${path}: primary heading count`);
        checks++;
      }
      await page.goto(origin + '/');
      await page.keyboard.press('Tab');
      if (await page.locator(':focus').textContent() !== 'Skip to content') {
        throw Error('Skip link is not the first keyboard target');
      }
      await page.keyboard.press('Enter');
      if (await page.evaluate(() => location.hash) !== '#main') throw Error('Skip link destination');
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `/tmp/gapyears-${width}.png`, fullPage: true });
      }
      await page.close();
    }
    console.log(`PASS: ${checks} page/viewport checks; no horizontal overflow; keyboard skip navigation works.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
