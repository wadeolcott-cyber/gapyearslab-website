// External Playwright/Chromium only; never shipped to visitors.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.SITE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext();
    // Existing analytics is preserved, but tests do not submit live analytics.
    await context.route('https://static.cloudflareinsights.com/**', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
    const page = await context.newPage(), requests = [], errors = [];
    page.on('request', r => requests.push(r.url())); page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '/retirement-calculator/'); await page.waitForLoadState('networkidle');
    const beforeRequests = requests.length;
    const comparison = page.locator('.withdrawal-comparison'), table = comparison.locator('table');
    const overall = page.locator('.funding-section').nth(0), bridge = page.locator('.funding-section').nth(1);
    const targetCells = () => table.locator('tbody tr td:first-of-type').allTextContents();
    const values = () => page.locator('#calculator-form input').evaluateAll(es => es.map(e => e.value));
    const load = () => page.getByRole('button', { name: 'Load example', exact: true }).click();
    assert.equal(await comparison.count(), 0);
    await load(); assert.equal(await page.locator('#withdrawal').inputValue(), '4');
    assert.equal(await comparison.evaluate(e => e.open), false);
    assert.equal(await table.isVisible(), false);
    const initial = await values();
    await comparison.locator('summary').focus(); await page.keyboard.press('Enter');
    assert.equal(await comparison.evaluate(e => e.open), true); assert.deepEqual(await values(), initial);
    assert.deepEqual(await targetCells(), ['$1,166,667', '$1,071,429', '$1,000,000']);
    assert.deepEqual(await table.locator('tbody th').allTextContents(), ['3.0%', '3.5%', '4.0% (entered)']);
    assert.deepEqual(await table.locator('tbody td:nth-child(3)').allTextContents(), ['$66,667Below target', '$28,571Above target', '$100,000Above target']);
    assert.equal(await overall.locator('.funding-scenario').first().locator('dd').nth(1).innerText(), '$1,000,000');
    assert.equal(await bridge.locator('.funding-scenario').first().locator('dd').nth(2).innerText(), '$350,000');
    assert.equal(await page.locator('.coverage-bar').count(), 2);
    await page.locator('#withdrawal').fill('3.25');
    assert.equal(await comparison.evaluate(e => e.open), true); // Keep it open while exploring inputs.
    assert.equal(await page.locator('#withdrawal').inputValue(), '3.25');
    assert.deepEqual(await table.locator('tbody th').allTextContents(), ['3.0%', '3.25% (entered)', '3.5%', '4.0%']);
    assert.equal(await overall.locator('.funding-scenario').first().locator('dd').nth(1).innerText(), '$1,115,385');
    assert.equal(await bridge.locator('.funding-scenario').first().locator('dd').nth(2).innerText(), '$350,000');
    await page.locator('#withdrawal').fill('3.5'); assert.equal(await table.locator('tbody tr').count(), 3);
    await page.locator('#withdrawal').fill('4'); await page.locator('#realReturn').fill('3');
    assert.deepEqual(await targetCells(), ['$935,368', '$864,502', '$811,352']);
    assert.match(await table.locator('caption').innerText(), /3% annual real return/);
    assert.equal(await overall.locator('.funding-scenario').count(), 2);
    assert.equal(await overall.locator('.funding-scenario').nth(0).locator('dd').nth(1).innerText(), '$1,000,000');
    assert.equal(await overall.locator('.funding-scenario').nth(1).locator('dd').nth(1).innerText(), '$811,352');
    assert.equal(await bridge.locator('.funding-scenario').nth(0).locator('dd').nth(2).innerText(), '$350,000');
    assert.equal(await bridge.locator('.funding-scenario').nth(1).locator('dd').nth(2).innerText(), '$320,860');
    assert.equal(await page.locator('.coverage-bar').count(), 4);
    await page.locator('#income').fill('75000');
    assert.equal(await table.count(), 0); assert.match(await comparison.innerText(), /No portfolio funding needed/);
    await load(); await page.locator('#socialSecurity').fill('0'); await page.locator('#bridgeYears').fill('0');
    await page.locator('#income').fill('0'); await page.locator('#spending').fill('1e307'); await page.locator('#withdrawal').fill('100');
    assert.equal(await comparison.count(), 1);
    assert.equal(await table.locator('.calculation-limitation').count(), 3); // Other rates exceed finite model limits.
    assert.equal(await table.locator('tbody tr').count(), 4);
    assert.doesNotMatch(await table.textContent(), /NaN|Infinity/);
    await page.locator('#income').fill(''); assert.equal(await comparison.count(), 0);
    assert.equal(await page.locator('#calculator-errors').isVisible(), true);
    await load(); await page.locator('#withdrawal').fill('0'); assert.equal(await comparison.count(), 0);
    await load(); await page.locator('#realReturn').fill('');
    await comparison.locator('summary').click(); assert.match(await table.locator('caption').innerText(), /0% annual real return/);
    await page.locator('#realReturn').fill('-3'); assert.equal(await table.locator('tbody tr').count(), 3);
    assert.doesNotMatch(await comparison.innerText(), /NaN|Infinity/);
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await comparison.count(), 0); assert.equal(await page.locator('#withdrawal').inputValue(), '4');
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 }); await load();
      assert.equal(await comparison.evaluate(e => e.open), false);
      await overall.screenshot({ path: `/tmp/withdrawal-comparison-collapsed-${width}.png` });
      await comparison.locator('summary').focus(); await page.keyboard.press('Enter');
      assert.equal(await comparison.evaluate(e => e.open), true);
      assert.equal(await comparison.locator('summary').evaluate(e => getComputedStyle(e).outlineStyle), 'solid');
      assert.equal(await table.locator('caption').count(), 1);
      assert.equal(await table.locator('thead th[scope="col"]').count(), 3);
      assert.equal(await table.locator('tbody th[scope="row"]').count(), 3);
      assert.equal(await table.evaluate(e => e.scrollWidth > e.clientWidth), false);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await overall.screenshot({ path: `/tmp/withdrawal-comparison-expanded-${width}.png` });
      await bridge.screenshot({ path: `/tmp/taxable-bridge-guidance-${width}.png` });
      await comparison.locator('summary').press('Enter');
    }
    // All financial interactions, including disclosure toggles, stay in memory.
    assert.equal(requests.length, beforeRequests);
    assert.deepEqual(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })), { local: [], session: [] });
    assert.equal((await context.cookies()).length, 0); assert.equal(page.url(), origin + '/retirement-calculator/');
    await page.reload(); assert.equal(await page.locator('#spending').inputValue(), ''); assert.equal(await comparison.count(), 0);
    await load();
    assert.equal(await page.locator('.bridge-guidance a.button').count(), 0);
    const links = [
      ['Learn how capital gains can affect ACA subsidies', '/learn/zero-percent-capital-gains-aca-subsidy-cliff/'],
      ['Why taxable savings matter for early retirement', '/learn/why-taxable-brokerage-matters-early-retirement/'],
      ['Explore income and healthcare tradeoffs', 'https://app.gapyearslab.com/'],
    ];
    await page.route('https://app.gapyearslab.com/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>App navigation test</title>' }));
    for (const [name, destination] of links) {
      const link = page.getByRole('link', { name, exact: true }); assert.equal(await link.count(), 1);
      assert.equal(await link.getAttribute('href'), destination); assert.equal(await link.getAttribute('target'), null);
      await link.click(); assert.equal(page.url(), destination.startsWith('https:') ? destination : origin + destination);
      await page.goto(origin + '/retirement-calculator/'); await load();
    }
    assert.equal(await page.getByRole('link', { name: 'Open the Income Planner', exact: true }).count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS: sensitivity references/custom rates, constant entered return, unchanged main/bridge values, zero/invalid handling, native disclosure and semantic tables, educational links, no interaction requests/storage/cookies/URL changes, responsive screenshots.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
