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
    for (const width of [320, 360, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      for (const path of paths) {
        const response = await page.goto(origin + path);
        if (response.status() !== 200) throw Error(`${path}: HTTP ${response.status()}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (overflow) throw Error(`${path}: horizontal overflow at ${width}px`);
        if (await page.locator('h1').count() !== 1) throw Error(`${path}: primary heading count`);
        const issues = await page.evaluate(() => {
          const errors = [];
          if (document.querySelectorAll('main').length !== 1) errors.push('main landmark');
          for (const nav of document.querySelectorAll('nav')) {
            if (!nav.getAttribute('aria-label')) errors.push('unnamed navigation');
          }
          let previous = 0;
          for (const heading of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
            const level = Number(heading.tagName[1]);
            if (level > previous + 1) errors.push('skipped heading level: ' + heading.textContent);
            previous = level;
          }
          for (const control of document.querySelectorAll('a,button')) {
            if (!(control.getAttribute('aria-label') || control.textContent).trim()) errors.push('unnamed control');
          }
          return errors;
        });
        if (issues.length) throw Error(`${path}: ${issues.join(', ')}`);
        checks++;
      }
      await page.goto(origin + '/');
      await page.keyboard.press('Tab');
      if (await page.locator(':focus').textContent() !== 'Skip to content') {
        throw Error('Skip link is not the first keyboard target');
      }
      await page.keyboard.press('Enter');
      if (await page.evaluate(() => location.hash) !== '#main') throw Error('Skip link destination');
      if (!(await page.locator('#main').evaluate(el => el === document.activeElement))) {
        throw Error('Skip link does not move focus to main');
      }
      await page.getByRole('link', { name: 'Preview Planner', exact: true }).click();
      if (new URL(page.url()).pathname !== '/planner/') throw Error('Preview CTA destination');
      await page.goto(origin + '/');
      await page.getByRole('link', { name: 'How It Works' }).click();
      if (new URL(page.url()).hash !== '#how-it-works') throw Error('How It Works destination');
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
