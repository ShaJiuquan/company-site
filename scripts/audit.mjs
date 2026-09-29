import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.VERIFY_URL || 'http://127.0.0.1:4322/company-site/';
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chrome = await launch({ chromePath, chromeFlags: ['--headless', '--disable-gpu', '--no-first-run', '--disable-background-networking'] });
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
const routes = ['', 'solutions/', 'industries/', 'products/', 'about/', 'contact/', 'en/', 'en/solutions/', 'en/industries/', 'en/products/', 'en/about/', 'en/contact/'];
const results = [];
await mkdir('artifacts', { recursive: true });
try {
  for (const theme of ['light','dark']) {
    for (const route of routes) {
      const url = new URL(route, origin).href;
      const page = await browser.contexts()[0].newPage();
      await page.goto(url);
      await page.evaluate(theme => localStorage.setItem('company-site-theme', theme), theme);
      await page.close();
      const result = await lighthouse(url, { port: chrome.port, onlyCategories: ['performance','accessibility'], output: ['json','html'], logLevel: 'error', disableStorageReset: true });
      const filename = `${route.replaceAll('/','-') || 'zh-home-'}${theme}`;
      await writeFile(`artifacts/${filename}-full.json`, result.report[0]);
      await writeFile(`artifacts/${filename}.html`, result.report[1]);
      const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value]) => [key, Math.round(value.score * 100)]));
      const failedAudits = Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < 1 && a.details?.items?.length).map(a => ({ id: a.id, title: a.title, score: a.score, details: a.details }));
      const row = { route: `/${route}`, theme, ...scores, failedAudits };
      results.push(row);
      console.log(`${row.route} ${theme}: performance ${scores.performance}, accessibility ${scores.accessibility}`);
    }
  }
  await writeFile('artifacts/lighthouse-summary.json', JSON.stringify({ origin, checkedAt: new Date().toISOString(), lighthouseVersion: (await import('lighthouse/package.json', { with: { type: 'json' } })).default.version, mode: 'mobile / simulated throttling / default Lighthouse screen', results }, null, 2));
  if (results.some(r => r.performance < 90 || r.accessibility < 90)) process.exitCode = 1;
} finally { await browser.close(); await chrome.kill(); }
