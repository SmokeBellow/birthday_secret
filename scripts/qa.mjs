// Headless QA: plays every level via Playwright and checks overflow / console errors.
// usage: node scripts/qa.mjs [baseUrl] [width] [height] [outDir]
import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4173';
const W = +(process.argv[3] ?? 390), H = +(process.argv[4] ?? 844);
const out = process.argv[5] ?? '/tmp/qa';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, hasTouch: true });
const results = [];

async function clickAll(page, sel, n) {
  for (let i = 0; i < n; i++) { await page.locator(sel).nth(0).click({ force: true }); await page.waitForTimeout(120); }
}
const seq = async (page, n) => { for (let i = 0; i < n; i++) { await page.locator('.controls .btn-primary').first().click({ force: true }); await page.waitForTimeout(150); } };


// Plays whatever action panel (ActionPanel in src/mechanics/stages.tsx) is on screen until `steps` of them are done.
async function playActions(p, steps) {
  for (let s = 0; s < steps; s++) {
    const el = await p.waitForSelector('[data-kind]', { timeout: 6000 });
    const kind = await el.getAttribute('data-kind');
    await p.waitForTimeout(200);
    if (kind === 'swipe') {
      const b = await p.locator('.swipe-area').boundingBox();
      const diag = (await el.getAttribute('data-dir')) === 'diag';
      const [x0, y0, x1, y1] = diag ? [b.x + 30, b.y + b.height - 20, b.x + b.width - 30, b.y + 20] : [b.x + 25, b.y + b.height / 2, b.x + b.width - 25, b.y + b.height / 2];
      await p.mouse.move(x0, y0); await p.mouse.down(); await p.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, { steps: 4 }); await p.mouse.move(x1, y1, { steps: 4 }); await p.mouse.up();
    } else if (kind === 'hold') {
      const b = await p.locator('.hold-wrap .tap-target').boundingBox();
      await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await p.mouse.down(); await p.waitForTimeout(2300); await p.mouse.up();
    } else if (kind === 'taps') {
      const txt = await p.locator('.taps-wrap .tap-core').innerText();
      const n = +txt.split('/')[1];
      for (let i = 0; i < n; i++) { await p.locator('.taps-wrap .tap-target').click({ force: true }); await p.waitForTimeout(80); }
    } else if (kind === 'timing') {
      for (let i = 0; i < 500; i++) {
        const [l, w] = await p.locator('.timing-zone').evaluate((e) => [parseFloat(e.style.left), parseFloat(e.style.width)]);
        const m = await p.locator('.timing-marker').evaluate((e) => parseFloat(e.style.left));
        if (m > l + 4 && m < l + w - 4) { await p.locator('.timing-wrap .tap-target').click({ force: true }); break; }
        await p.waitForTimeout(20);
      }
    } else if (kind === 'catch') {
      const n = await p.locator('.catch-count i').count();
      for (let i = 0; i < n; i++) { await p.locator('.catch-target').click({ force: true }); await p.waitForTimeout(150); }
    }
    await p.waitForTimeout(250);
  }
}

const play = {
  1: (p) => clickAll(p, '.tap-target', 3),
  2: async (p) => { for (let i = 0; i < 3; i++) { await p.locator('.fact-card:not(.open)').first().click(); await p.waitForTimeout(100);} },
  3: (p) => playActions(p, 3),
  4: async (p) => { await p.locator('.controls .btn').nth(0).click(); await p.locator('.sq.move').first().click(); },
  5: (p) => p.locator('.controls .btn').first().click(),
  6: async (p) => { for (let i = 0; i < 4; i++) { await p.locator('.hidden-spot:not(.found)').first().click({ force: true }); await p.waitForTimeout(120);} },
  7: async (p) => { const f = p.locator('.duck-field'); const b = await f.boundingBox(); for (let i = 0; i < 3; i++) { await p.mouse.click(b.x + b.width * (0.3 + 0.2 * i), b.y + b.height * (0.3 + 0.2 * i)); await p.waitForTimeout(500);} await p.waitForTimeout(900); },
  8: (p) => clickAll(p, '.tap-target', 5),
  9: async (p) => { for (let i = 0; i < 4; i++) { await p.locator('.pack-item:not(.taken)').first().click({ force: true }); await p.waitForTimeout(150);} },
  10: async (p) => {
    for (let i = 0; i < 400; i++) {
      const left = await p.locator('.timing-marker').evaluate((e) => parseFloat(e.style.left));
      if (left > 63 && left < 76) { await p.locator('.tap-target').click({ force: true }); break; }
      await p.waitForTimeout(25);
    }
  },
  11: (p) => p.locator('.controls .btn').nth(1).click(),
  12: async (p) => {
    const b = await p.locator('.tap-target.hold').boundingBox();
    await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    let down = false;
    for (let i = 0; i < 600; i++) {
      if (await p.locator('.done-panel').count()) break;
      const h = await p.locator('.gauge-needle').evaluate((e) => parseFloat(e.style.bottom));
      if (h < 52 && !down) { await p.mouse.down(); down = true; }
      if (h > 60 && down) { await p.mouse.up(); down = false; }
      await p.waitForTimeout(30);
    }
    if (down) await p.mouse.up();
  },
  13: async (p) => { for (let i = 0; i < 4; i++) { const it = p.locator('.tray-item').first(); const id = await it.getAttribute('aria-label'); await it.click({ force: true }); await p.locator(`.save-slot[aria-label=${id}]`).click({ force: true }); await p.waitForTimeout(120);} },
  14: (p) => clickAll(p, '.wiki-link', 4),
  15: (p) => p.locator('.controls .btn').nth(1).click(),
  16: (p) => playActions(p, 4),
  17: async (p) => { const n = await p.locator('.dbg-cell').count(); for (let i = 0; i < n; i++) { if (await p.locator('.done-panel').count()) break; await p.locator('.dbg-cell').nth(i).click(); await p.waitForTimeout(150);} },
  18: async (p) => { for (let i = 0; i < 3; i++) { await p.locator('.quiz-card').first().click(); await p.waitForTimeout(100); await p.locator('.quiz .btn-primary').click(); await p.waitForTimeout(100);} },
  19: (p) => seq(p, 6),
  20: async (p) => { await p.locator('.controls .btn').nth(0).click(); await p.waitForTimeout(200); await p.locator('.controls .btn').nth(1).click(); },
  21: async (p) => {
    for (let i = 0; i < 3; i++) {
      const el = await p.waitForSelector('.lapka-bubble[data-need]:not([data-need=""])', { timeout: 6000 });
      const need = await el.getAttribute('data-need');
      await p.locator(`.act-btn[aria-label=${need}]`).click({ force: true });
      await p.waitForTimeout(1100);
    }
  },
  22: async (p) => { for (let i = 0; i < 4; i++) { await p.locator('.home-spot:not(.found)').first().click({ force: true }); await p.waitForTimeout(120);} },
  23: (p) => clickAll(p, '.lapka-tap', 4),
  24: (p) => playActions(p, 4),
  25: async (p) => { for (let s = 0; s < 3; s++) { for (let c = 0; c < 2; c++) { if (await p.locator('.done-panel').count()) break; await p.locator('.route-card').nth(c).click(); await p.waitForTimeout(150);} } },
  26: async (p) => { await p.locator('.btn-element').nth(0).click(); await p.locator('.btn-element').nth(2).click(); await p.waitForTimeout(800); },
  27: async (p) => { await p.locator('.controls .btn').nth(0).click(); await p.waitForTimeout(300); await p.locator('.controls .btn').nth(1).click(); },
  28: (p) => seq(p, 4),
  29: async (p) => { for (let i = 0; i < 4; i++) { await p.locator('.fact-card:not(.open)').first().click(); await p.waitForTimeout(100);} },
  30: async (p) => { for (let i = 0; i < 6; i++) { await p.locator('.build-slot:not(.active)').first().click({ force: true }); await p.waitForTimeout(150); } },
};

const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : Array.from({ length: 30 }, (_, i) => i + 1);
for (const n of only) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
  page.on('requestfailed', (r) => errors.push('reqfail: ' + r.url()));
  await page.goto(`${base}/?dev=1&level=${n}&seed=1`);
  await page.waitForSelector('.level-screen');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/L${String(n).padStart(2, '0')}_a.png`, fullPage: true });
  let ok = false, note = '';
  try {
    await play[n](page);
    await page.waitForSelector('.done-panel', { timeout: 4000 });
    ok = true;
  } catch (e) { note = String(e.message).split('\n')[0]; }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/L${String(n).padStart(2, '0')}_b.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  if (ok) {
    await page.locator('.done-panel .btn-primary').click();
    await page.waitForSelector('.ach-screen');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/L${String(n).padStart(2, '0')}_c.png`, fullPage: true });
  }
  results.push({ n, ok, note, overflow, broken: broken.length, errors: errors.filter((e) => !e.includes('[assets]')) });
  await page.close();
}
console.log(JSON.stringify(results.filter((r) => !r.ok || r.overflow > 0 || r.broken || r.errors.length), null, 1));
console.log(`passed ${results.filter((r) => r.ok).length}/${results.length}`);
await browser.close();
