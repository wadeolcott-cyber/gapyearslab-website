// Run against a local build. Playwright is a development-only external dependency.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.SITE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    headless: true, args: ['--no-sandbox'],
  });
  try {
    const context = await browser.newContext();
    // Preserve production snippet; tests do not submit analytics or financial inputs.
    await context.route('https://static.cloudflareinsights.com/**', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
    const page = await context.newPage();
    const requests = [];
    page.on('request', r => requests.push({ url: r.url(), body: r.postData() }));
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '/retirement-calculator/');
    await page.waitForFunction(() => document.querySelector('#load-example'));
    await page.waitForLoadState('networkidle');
    for (const id of ['spending', 'income', 'socialSecurity', 'socialYears', 'taxable', 'retirement', 'bridgeYears']) assert.equal(await page.locator('#'+id).inputValue(), '');
    assert.equal(await page.locator('#withdrawal').inputValue(), '4');
    assert.equal(await page.locator('#realReturn').inputValue(), '0');
    assert.equal(await page.locator('#calculator-errors').isVisible(), false);
    assert.equal(await page.locator('#calculator-results').isVisible(), false);
    const beforeRequests = requests.length;
    await page.getByRole('button', { name: 'Load example', exact: true }).click();
    await page.locator('.funding-scenario').first().waitFor();
    const overall = page.locator('.funding-section').nth(0), bridge = page.locator('.funding-section').nth(1);
    assert.match(await overall.innerText(), /\$1,000,000/); assert.match(await overall.innerText(), /\$100,000/);
    assert.match(await overall.innerText(), /110%/); assert.match(await bridge.innerText(), /\$350,000/);
    assert.match(await bridge.innerText(), /\$100,000/); assert.match(await bridge.innerText(), /71\.4%/);
    assert.equal(await page.locator('.coverage-bar').count(), 2);
    const inputValues = await page.locator('#calculator-form input:not(#realReturn)').evaluateAll(es => es.map(e => e.value));
    await page.locator('#realReturn').fill('3');
    assert.equal(await page.locator('.coverage-bar').count(), 4);
    assert.match(await overall.innerText(), /\$1,000,000/); assert.match(await overall.innerText(), /\$811,352/);
    assert.match(await bridge.innerText(), /\$350,000/); assert.match(await bridge.innerText(), /\$320,860/);
    assert.deepEqual(await page.locator('#calculator-form input:not(#realReturn)').evaluateAll(es => es.map(e => e.value)), inputValues);
    for (const section of [overall, bridge]) {
      const markers = await section.locator('.coverage-marker').evaluateAll(es => es.map(e => e.getBoundingClientRect().x));
      assert.ok(Math.abs(markers[0] - markers[1]) < 1, '100% markers align within a comparison');
    }
    await page.locator('#taxable').fill('1000000000000');
    assert.match(await overall.innerText(), /visual scale limit/);
    assert.match(await overall.innerText(), /1,000,000,850,000/);
    await page.getByRole('button', { name: 'Load example', exact: true }).click();
    await page.locator('#socialSecurity').fill('0');
    assert.equal(await page.locator('#socialYears').isDisabled(), true);
    assert.equal(await page.locator('#socialYears').inputValue(), '10');
    assert.match(await overall.innerText(), /\$1,250,000/);
    assert.match(await bridge.innerText(), /\$350,000/);
    await page.locator('#bridgeYears').fill('0');
    assert.match(await bridge.innerText(), /No taxable bridge funding needed/);
    await page.locator('#spending').fill('0');
    assert.match(await overall.innerText(), /No portfolio funding needed for this estimate/);
    assert.equal(await page.locator('.coverage-bar').count(), 0);
    await page.getByRole('button', { name: 'Load example', exact: true }).click();
    await page.locator('#socialYears').fill('0');
    assert.match(await overall.innerText(), /\$500,000/); assert.match(await bridge.innerText(), /\$140,000/);
    await page.locator('#realReturn').fill('-100');
    assert.match(await page.locator('#calculator-errors').innerText(), /greater than −100%/);
    await page.locator('#realReturn').fill('-99'); await page.locator('#socialYears').fill('10000');
    assert.ok(await page.locator('.calculation-limitation').count() >= 1);
    assert.doesNotMatch(await page.locator('#calculator-results').innerText(), /NaN|Infinity/);
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await page.locator('#calculator-errors').isVisible(), false);
    assert.equal(await page.locator('#calculator-results').isVisible(), false);
    await page.locator('#income').fill('-1');
    await page.getByRole('button', { name: 'Calculate estimates', exact: true }).click();
    const summary = await page.locator('#calculator-errors').innerText();
    assert.match(summary, /Expected annual spending/); assert.match(summary, /Dependable annual income/); assert.match(summary, /Taxable savings/);
    assert.equal(await page.locator('#income').inputValue(), '-1');
    assert.equal(await page.locator('#calculator-errors').evaluate(e => e===document.activeElement), true);
    await page.locator('#calculator-errors a[href="#spending"]').click();
    assert.equal(await page.locator('#spending').evaluate(e => e===document.activeElement), true);
    await page.getByRole('button', { name: 'Load example', exact: true }).click();
    await page.locator('#realReturn').fill('');
    assert.equal(await page.locator('.coverage-bar').count(), 2);
    assert.equal(requests.length, beforeRequests, 'calculator interactions make no network requests');
    assert.deepEqual(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })), { local: [], session: [] });
    assert.equal((await context.cookies()).length, 0);
    assert.equal(page.url(), origin + '/retirement-calculator/');
    const appLink = page.getByRole('link', { name: 'Open the Income Planner', exact: true });
    assert.equal(await appLink.getAttribute('href'), 'https://app.gapyearslab.com/');
    assert.equal(await appLink.getAttribute('target'), null);
    await page.reload();
    assert.equal(await page.locator('#spending').inputValue(), '');
    assert.equal(await page.locator('#calculator-results').isVisible(), false);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.getByRole('button', { name: 'Load example', exact: true }).click();
      await page.locator('#realReturn').fill('3');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: `/tmp/retirement-calculator-${width}.png`, fullPage: true });
    }
    assert.deepEqual(errors, []);
    await browser.close();
    console.log('PASS: initial/example/reset states; independent timing; immediate 0%/3% comparisons; aligned charts and >100% labels; zero/invalid/extreme inputs; keyboard errors; no network/storage/cookie/URL persistence; responsive screenshots.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
