// Optional external Playwright/Chromium; not part of the public build.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.SITE_URL || 'http://127.0.0.1:8000';
const path = '/learn/roth-conversion-aca-subsidy-cost/';
(async () => {
  const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // Keep the production snippet intact without recording live test analytics.
    await page.route('https://static.cloudflareinsights.com/**', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
    await page.route('https://app.gapyearslab.com/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>App navigation test</title>' }));
    await page.goto(origin + '/learn/');
    await page.getByRole('link', { name: 'The Hidden Cost of Roth Conversions in Early Retirement', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, path);
    assert.equal(await page.locator('script[src*="beacon.min.js"]').count(), 1);
    const table = page.locator('table');
    assert.equal(await table.locator('caption').count(), 1);
    assert.equal(await table.locator('thead th[scope="col"]').count(), 3);
    assert.equal(await table.locator('tbody th[scope="row"]').count(), 4);
    assert.deepEqual(await table.locator('tbody td').allTextContents(), ['$65,000', '$75,000', '$1,780', '$2,840', '$4,074', '$5,070', '$5,854', '$7,910']);
    const details = page.locator('details').filter({ has: page.getByText('Example assumptions and limitations', { exact: true }) });
    assert.equal(await details.count(), 1); assert.equal(await details.evaluate(e => e.open), false);
    // Payment timing and scope qualifiers are visible without expanding assumptions.
    assert.equal(await page.getByText('In this example, the household receives $0 in advance premium tax credits.', { exact: false }).isVisible(), true);
    assert.equal(await page.getByText("The planner evaluates annual outcomes. It doesn't calculate lifetime Roth conversion benefits or recommend an optimal conversion strategy.", { exact: true }).isVisible(), true);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await table.evaluate(e => e.scrollWidth > e.clientWidth), false);
      await details.locator('summary').focus(); await page.keyboard.press('Enter');
      assert.equal(await details.evaluate(e => e.open), true);
      await page.keyboard.press('Enter'); assert.equal(await details.evaluate(e => e.open), false);
      await page.screenshot({ path: `/tmp/roth-article-${width}.png`, fullPage: true });
      await table.screenshot({ path: `/tmp/roth-table-${width}.png` });
    }
    const links = [
      ['Learn how capital gains can also affect ACA subsidies', '/learn/zero-percent-capital-gains-aca-subsidy-cliff/'],
      ['Why a Taxable Brokerage Account Is Essential for Early Retirement', '/learn/why-taxable-brokerage-matters-early-retirement/'],
      ['GapYears Lab — Methodology', '/methodology/'],
      ['Explore the Income Planner — Public Beta', 'https://app.gapyearslab.com/'],
    ];
    for (const [name, href] of links) {
      const link = page.getByRole('link', { name, exact: true }); assert.equal(await link.getAttribute('href'), href);
      assert.equal(await link.getAttribute('target'), null);
      await link.click(); assert.equal(page.url(), href.startsWith('https:') ? href : origin + href);
      await page.goto(origin + path);
    }
    await page.goto(origin + '/learn/zero-percent-capital-gains-aca-subsidy-cliff/');
    await page.getByRole('link', { name: 'See how a $10,000 conversion affects both federal taxes and premium tax credits', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, path);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://gapyearslab.com' + path);
    assert.deepEqual(errors, []);
    console.log('PASS: Learn/reciprocal/related/app links, exact financial table, visible timing/scope qualifiers, collapsed keyboard disclosure, responsive article/table screenshots at 390/768/1440, no overflow or page errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
