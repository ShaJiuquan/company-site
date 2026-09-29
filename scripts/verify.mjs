import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = process.env.VERIFY_URL || 'http://127.0.0.1:4322/company-site/';
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const routes = ['', 'products/', 'about/', 'en/', 'en/products/', 'en/about/'];
// Honesty guards: illustrative / development visuals must stay labeled as such.
const labels = {
  zh: { record: '示意数据', build: '开发版界面', concept: '概念示意', render: '三维设计渲染' },
  en: { record: 'Illustrative data', build: 'Development build', concept: 'Concept', render: '3D design render' },
};
const results = [];

async function revealAll(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

await mkdir('artifacts', { recursive: true });
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: theme, viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await context.addInitScript((t) => localStorage.setItem('company-site-theme', t), theme);
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(origin).origin) failures.push(`External request: ${request.url()}`); });
    for (const route of routes) {
      const url = new URL(route, origin).href;
      const lang = route.startsWith('en') ? 'en' : 'zh';
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, url);
      assert.equal(await page.locator('html').getAttribute('lang'), lang === 'en' ? 'en' : 'zh-CN');
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      assert.equal(await page.locator('h1').count(), 1, `one h1: ${url}`);
      assert.equal(await page.locator('form, iframe').count(), 0);
      for (const img of await page.locator('img').evaluateAll((nodes) => nodes.map((n) => ({ alt: n.alt, w: n.getAttribute('width'), h: n.getAttribute('height') })))) {
        assert.ok(img.alt && img.w && img.h, `img needs alt + intrinsic size: ${url}`);
      }
      const isHome = route === '' || route === 'en/';
      assert.equal(await page.locator('.nav [aria-current="page"]').count(), isHome ? 0 : 1);
      assert.ok(await page.locator('a[href^="mailto:"]').count() >= 2, `mailto entry points: ${url}`);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        assert.ok(overflow.scroll <= width, `Horizontal overflow at ${width}px: ${url}, ${theme}, ${overflow.scroll}`);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      if (isHome) {
        const text = await page.locator('main').innerText();
        for (const label of Object.values(labels[lang])) assert.ok(text.includes(label), `missing honesty label "${label}" on ${url}`);
        const tabs = page.locator('[role="tab"]');
        assert.equal(await tabs.count(), 4);
        await tabs.nth(1).click();
        assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('[role="tabpanel"]:not([hidden])').count(), 1);
        await tabs.nth(0).click();
        await revealAll(page);
        await page.screenshot({ path: `artifacts/${lang}-${theme}-mobile.png`, fullPage: true });
        await page.screenshot({ path: `artifacts/${lang}-${theme}-mobile-top.png` });
        await page.setViewportSize({ width: 1440, height: 900 });
        await revealAll(page);
        await page.screenshot({ path: `artifacts/${lang}-${theme}-desktop.png`, fullPage: true });
        await page.screenshot({ path: `artifacts/${lang}-${theme}-desktop-top.png` });
        await page.setViewportSize({ width: 390, height: 844 });
      }
      if (route.endsWith('products/')) {
        for (const id of ['dataviewer', 'instruments', 'transfer', 'simulation', 'agent', 'roadmap']) assert.equal(await page.locator(`#${id}`).count(), 1, `#${id} on ${url}`);
        const productText = await page.locator('main').innerText();
        for (const label of [labels[lang].build, labels[lang].render, lang === 'zh' ? '示意：' : 'Illustration:']) assert.ok(productText.includes(label), `missing "${label}" on ${url}`);
      }
      const links = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => node.href));
      for (const link of new Set(links.filter((l) => l.startsWith(new URL(origin).origin)))) {
        const target = new URL(link);
        const check = await context.request.get(target.origin + target.pathname);
        assert.equal(check.status(), 200, `Broken link: ${link}`);
        if (target.hash && target.pathname === new URL(url).pathname) assert.equal(await page.locator(`[id="${decodeURIComponent(target.hash.slice(1))}"]`).count(), 1);
      }
      results.push({ route: `/${route}`, theme, widths: [320, 390, 768, 1440], passed: true });
    }
    await context.close();
    assert.deepEqual(failures, [], 'Browser / resource / external request errors');
  }

  const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1280, height: 844 } });
  const page = await context.newPage();
  await page.goto(origin);
  await page.locator('.theme-btn').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('.nav a').first().click();
  assert.ok(page.url().endsWith('/products/'));
  await page.locator('.lang-link').click();
  assert.ok(page.url().endsWith('/en/products/'));
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.menu-btn').click();
  assert.equal(await page.locator('.menu-btn').getAttribute('aria-expanded'), 'true');
  assert.ok(await page.locator('#mobile-nav').isVisible());
  await context.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(origin);
  assert.ok(await staticPage.locator('h1').isVisible());
  assert.ok(await staticPage.locator('.cards-3 .card').first().isVisible(), 'content must not depend on the reveal script');
  await staticPage.locator('.nav a').first().click();
  assert.ok(staticPage.url().endsWith('/products/'));
  await noJs.close();

  await writeFile('artifacts/verification.json', JSON.stringify({ origin, checkedAt: new Date().toISOString(), browser: browser.version(), results, interactions: ['tabs', 'theme toggle + persistence', 'language switch keeps page and theme', 'mobile menu', 'navigation without JavaScript'], errors: [] }, null, 2));
  console.log(`Verified ${results.length} route/theme combinations at four widths, honesty labels, images, links, tabs, no external requests, and theme/language/menu interactions.`);
} finally { await browser.close(); }
