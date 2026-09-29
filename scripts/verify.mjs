import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = process.env.VERIFY_URL || 'http://127.0.0.1:4322/company-site/';
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const routes = ['', 'solutions/', 'industries/', 'products/', 'about/', 'contact/', 'en/', 'en/solutions/', 'en/industries/', 'en/products/', 'en/about/', 'en/contact/'];
const results = [];
await mkdir('artifacts', { recursive: true });
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: theme, viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await context.addInitScript(theme => localStorage.setItem('company-site-theme', theme), theme);
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    page.on('request', request => { if (new URL(request.url()).origin !== new URL(origin).origin) failures.push(`External request: ${request.url()}`); });
    for (const route of routes) {
      const url = new URL(route, origin).href;
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, url);
      assert.equal(await page.locator('html').getAttribute('lang'), route.startsWith('en') ? 'en' : 'zh-CN');
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('form, iframe, img').count(), 0);
      assert.equal(await page.locator('.main-nav [aria-current="page"]').count(), route==='' || route==='en/' ? 0 : 1);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        assert.ok(overflow.scroll <= width, `Horizontal overflow at ${width}px: ${url}, ${theme}, ${overflow.scroll}`);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      if (route === '' || route === 'en/') {
        const lang = route ? 'en' : 'zh';
        assert.equal(await page.locator('.product-grid > article').count(), 3);
        for (const status of await page.locator('.product-grid > article').first().locator('.feature-list [data-status]').evaluateAll(nodes => nodes.map(n => n.dataset.status))) assert.equal(status, 'development');
        for (const status of await page.locator('.product-grid > article').last().locator('.feature-list [data-status]').evaluateAll(nodes => nodes.map(n => n.dataset.status))) assert.equal(status, 'planned');
        const instrument = page.locator('.product-grid > article').nth(1);
        assert.equal(await instrument.locator('.feature-list [data-status="available"]').count(), 1);
        assert.equal(await instrument.locator('.feature-list [data-status="planned"]').count(), 2);
        await page.screenshot({ path: `artifacts/${lang}-${theme}-mobile.png`, fullPage: true });
        await page.screenshot({ path: `artifacts/${lang}-${theme}-mobile-top.png` });
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({ path: `artifacts/${lang}-${theme}-desktop.png`, fullPage: true });
        await page.screenshot({ path: `artifacts/${lang}-${theme}-desktop-top.png` });
        await page.setViewportSize({ width: 390, height: 844 });
      }
      if (route.endsWith('products/')) {
        assert.equal(await page.locator('.product-detail').count(), 3);
        for (const id of ['dataviewer', 'instrument-workbench', 'agent-interface']) assert.equal(await page.locator(`#${id} .detail-sections section`).count(), 3);
      }
      if (route.endsWith('contact/')) {
        assert.equal(await page.locator('a[href="mailto:{{联系邮箱}}"]', { strict: false }).count(), 2);
      }
      const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href));
      for (const link of new Set(links.filter(link => link.startsWith(new URL(origin).origin)))) {
        const target = new URL(link);
        const check = await context.request.get(target.origin + target.pathname);
        assert.equal(check.status(), 200, `Broken link: ${link}`);
        if (target.hash && target.pathname === new URL(url).pathname) assert.equal(await page.locator(`[id="${decodeURIComponent(target.hash.slice(1))}"]`).count(), 1);
      }
      results.push({ route: `/${route}`, theme, widths: [320,390,768,1440], passed: true });
    }
    await context.close();
    assert.deepEqual(failures, [], 'Browser / resource / external request errors');
  }
  const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(origin);
  await page.locator('.theme-toggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('.language-link').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('.main-nav a').nth(2).click();
  assert.ok(page.url().endsWith('/en/products/'));
  await page.locator('.language-link').click();
  assert.ok(page.url().endsWith('/products/'));
  await context.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(origin);
  assert.equal(await staticPage.locator('.product-grid > article').count(), 3);
  await staticPage.locator('.main-nav a').nth(2).click();
  assert.ok(staticPage.url().endsWith('/products/'));
  await noJs.close();
  await writeFile('artifacts/verification.json', JSON.stringify({ origin, checkedAt: new Date().toISOString(), browser: browser.version(), results, interactions: ['theme toggle', 'theme persistence', 'language preserves page', 'navigation without JavaScript'], errors: [] }, null, 2));
  console.log(`Verified ${results.length} route/theme combinations at four widths, status labels, links, no external page requests, and theme/language interactions.`);
} finally { await browser.close(); }
