/**
 * SW-FE-05F: read-only public REST + local Next.js API-mode Chromium acceptance.
 * Runs only in an isolated GitHub Actions job after an API-mode build.
 * Requires temporarily installed playwright@1.56.1 and Chromium on that runner.
 * Never writes to WordPress or changes production deployment settings.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const origin = process.env.SCREENWHY_05F_ORIGIN ?? 'http://127.0.0.1:3120';
const rest = process.env.SCREENWHY_05F_REST ?? 'https://cms.screenwhy.com/wp-json/screenwhy/v1';
const outDir = path.resolve('.qa-05f');
const checks = [];
const started = new Date().toISOString();
const routeSpecs = [
  ['home', '/', 200],
  ['explanation', '/explain/triangle-2009/', 200],
  ['triangle-legacy', '/triangle-2009-preview/', 200],
  ['triangle-hub', '/movies/triangle/', 200],
  ['movies', '/movies/', 200],
  ['explanations', '/explanations/', 200],
  ['ending-explained', '/explanations/ending-explained/', 200],
  ['search', '/search/?q=triangle', 200],
  ['unknown-explanation', '/explain/screenwhy-05f-nonexistent/', 404],
];

function record(area, name, passed, detail = '') {
  const item = { area, name, status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(item);
  console.log(`${item.status} [${area}] ${name}${detail ? ` — ${detail}` : ''}`);
  return passed;
}
function summarizeError(error) { return error instanceof Error ? error.message : String(error); }
async function writeReport() {
  await writeFile(path.join(outDir, 'SW-FE-05F-API-Browser-QA.json'), JSON.stringify({
    task: 'SW-FE-05F', started, completed: new Date().toISOString(),
    source: process.env.GITHUB_SHA ?? 'local', origin, rest, dataSource: 'api',
    checks, totals: {
      passed: checks.filter(x => x.status === 'PASS').length,
      failed: checks.filter(x => x.status === 'FAIL').length,
    },
    acceptanceLimits: [
      'Only PUBLIC unauthenticated CMS resources were queried',
      'No populated DTO acceptance from empty CMS collections',
      'Browser runs on an isolated runner, not the production hostname',
      'Manual keyboard/screen-reader and owner browser review remain separate gates',
    ],
  }, null, 2) + '\n');
}
async function inspectRealRest() {
  const endpoints = [
    ['titles', '/titles'],
    ['explanations', '/explanations'],
    ['characters', '/characters'],
    ['source-works', '/source-works'],
    ['search-triangle', '/search?q=triangle'],
    ['triangle-title', '/titles/movies/triangle'],
    ['triangle-hub', '/title-hubs/movies/triangle'],
  ];
  for (const [name, suffix] of endpoints) {
    try {
      const response = await fetch(rest + suffix, {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();
      const detailRoute = name === 'triangle-title' || name === 'triangle-hub';
      const statusOkay = detailRoute ? [200, 404].includes(response.status) : response.status === 200;
      let envelopeOkay = false;
      let totalItems = null;
      if (response.status === 200 && !detailRoute) {
        const hasData = Boolean(result && Array.isArray(result.data));
        const pagination = result?.pagination;
        envelopeOkay = hasData && pagination && Number.isInteger(pagination.totalItems) && pagination.totalItems >= 0
          && pagination.totalItems >= result.data.length && result?.meta?.apiVersion === '1';
        if (envelopeOkay) totalItems = pagination.totalItems;
      } else if (response.status === 404 && detailRoute) {
        envelopeOkay = result?.code === 'screenwhy_not_found';
      } else if (response.status === 200 && detailRoute) {
        envelopeOkay = Boolean(result && typeof result === 'object' && result.data);
      }
      record('real-rest', name, statusOkay && envelopeOkay,
        `HTTP ${response.status}${totalItems === null ? '' : `; public total=${totalItems}`}`);
    } catch (error) {
      record('real-rest', name, false, summarizeError(error));
    }
  }
}
async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(origin + '/robots.txt', { signal: AbortSignal.timeout(1800) });
      if (res.status < 500) return;
    } catch { /* Next.js is still starting */ }
    await new Promise(resolve => setTimeout(resolve, 950));
  }
  throw new Error('API-mode Next.js start timed out');
}
async function inspectBrowser() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    for (const [device, viewport, isMobile] of [
      ['mobile390', { width: 390, height: 844 }, true],
      ['desktop1440', { width: 1440, height: 900 }, false],
    ]) {
      const context = await browser.newContext({ viewport, isMobile, deviceScaleFactor: 1 });
      for (const [name, route, expectedStatus] of routeSpecs) {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', err => errors.push(summarizeError(err)));
        try {
          const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 50000 });
          await page.waitForTimeout(600);
          const code = response?.status() ?? 0;
          // Next.js App Router may stream a notFound() page with HTTP 200 after
          // headers are committed. Accept only with verified not-found + noindex.
          const streamedNotFound = name === 'unknown-explanation' && code === 200;
          record('browser-' + device, name + '-http', code === expectedStatus || streamedNotFound,
            `HTTP ${code}; expected ${expectedStatus}${streamedNotFound ? ' (streamed notFound candidate)' : ''}`);
          const title = await page.title();
          record('browser-' + device, name + '-document', title.length > 0, title.slice(0, 100));
          const horizontal = await page.evaluate(() => ({
            sw: document.documentElement.scrollWidth,
            vw: document.documentElement.clientWidth,
          }));
          record('browser-' + device, name + '-horizontal-overflow',
            horizontal.sw <= horizontal.vw + 4, `${horizontal.sw}/${horizontal.vw}`);
          const robots = await page.locator('meta[name="robots"]').first().getAttribute('content').catch(() => null);
          record('browser-' + device, name + '-noindex', Boolean(robots?.includes('noindex')), String(robots));
          if (streamedNotFound) {
            record('browser-' + device, name + '-streamed-404-safety',
              title.toLowerCase().includes('not found') && Boolean(robots?.includes('noindex')),
              'HTTP 200 is allowed here only for the framework streaming notFound response');
          }
          record('browser-' + device, name + '-client-error', errors.length === 0, errors.slice(0, 2).join(' | '));
          if (name === 'home') {
            const link = page.locator('a[href*="/explain/triangle-2009/"]');
            record('browser-' + device, 'triangle-home-discovery', (await link.count()) > 0,
              `links: ${await link.count()}`);
          }
          if (name === 'search') {
            const heading = page.getByText('Triangle (2009) Explained', { exact: true });
            record('browser-' + device, 'triangle-search-preview', (await heading.count()) > 0,
              `preview text count: ${await heading.count()}`);
          }
          if (name === 'triangle-hub') {
            const detail = page.locator('a[href*="/explain/triangle-2009/"]');
            record('browser-' + device, 'triangle-hub-article-link', (await detail.count()) > 0,
              `links: ${await detail.count()}`);
          }
          if (name === 'explanation') {
            const heading = page.locator('h1');
            const fullText = await page.locator('main').innerText().catch(() => '');
            record('browser-' + device, 'triangle-article-body',
              (await heading.count()) > 0 && fullText.length > 4000,
              `main content characters: ${fullText.length}`);
          }
          if (name === 'home' || name === 'search' || name === 'triangle-hub' || name === 'explanation') {
            await page.screenshot({ path: path.join(outDir, `${device}-${name}.png`), fullPage: name !== 'explanation' });
          }
        } catch (error) {
          record('browser-' + device, name + '-navigation', false, summarizeError(error));
        } finally {
          await page.close();
        }
      }
      const page = await context.newPage();
      try {
        await page.goto(origin + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.keyboard.press('Tab');
        const active = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase() ?? 'none');
        record('accessibility-' + device, 'keyboard-tab-focus',
          ['a', 'button', 'input', 'summary'].includes(active), `focused tag: ${active}`);
      } catch (error) {
        record('accessibility-' + device, 'keyboard-tab-focus', false, summarizeError(error));
      } finally {
        await page.close();
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
async function main() {
  await mkdir(outDir, { recursive: true });
  await inspectRealRest();
  const child = spawn(process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3120'],
    { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => {
    logs += chunk.toString().slice(0, 16000);
    if (logs.length > 120000) logs = logs.slice(-120000);
  });
  try {
    await waitForServer();
    record('runtime', 'api-mode-next-server-start', true);
    await inspectBrowser();
  } catch (error) {
    record('runtime', 'api-mode-browser-execution', false, summarizeError(error));
  } finally {
    child.kill('SIGTERM');
    await writeFile(path.join(outDir, 'next-api-mode-server.log'), logs.slice(-18000));
    await writeReport();
  }
  const failed = checks.filter(x => x.status === 'FAIL');
  console.log(`SW-FE-05F: ${checks.length - failed.length}/${checks.length} checks passed; ${failed.length} failed`);
  if (failed.length) process.exitCode = 1;
}
await main();