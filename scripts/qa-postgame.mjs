// Plays Level 30 -> achievement -> every post-game step (bonus mission must arrive by itself after the calm beat).
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4173';
const out = process.argv[3] ?? '/tmp/qa';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(`${base}/?dev=1&level=30&seed=1`);
await p.waitForSelector('.level-screen');
for (let i = 0; i < 6; i++) { await p.locator('.build-slot:not(.active)').first().click({ force: true }); await p.waitForTimeout(150); }
await p.locator('.done-panel .btn-primary').click();
await p.locator('.ach-screen .btn-primary').click();
await p.waitForSelector('.post-summary'); await p.waitForTimeout(1600);
await p.screenshot({ path: `${out}/pg_summary.png` });
await p.locator('.post-screen .btn-primary').click();
await p.waitForSelector('.post-stats'); await p.waitForTimeout(2600); await p.screenshot({ path: `${out}/pg_stats.png` });
await p.locator('.post-screen .btn-primary').click();
await p.waitForSelector('.post-calm'); await p.screenshot({ path: `${out}/pg_calm.png` });
const t0 = Date.now();
await p.waitForSelector('.post-bonus', { timeout: 6000 });
console.log('bonus arrived by itself after', Date.now() - t0, 'ms');
await p.waitForTimeout(900); await p.screenshot({ path: `${out}/pg_bonus.png` });
for (const s of ['pass', 'certificate', 'accepted', 'plus']) {
  await p.locator('.post-screen .btn-primary').last().click();
  await p.waitForSelector('.post-' + s); await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/pg_${s}.png` });
}
await p.locator('.post-screen .btn-ghost').click();
await p.waitForSelector('.gallery-screen');
console.log('gallery items', await p.locator('.gallery-item.on').count(), 'of', await p.locator('.gallery-item').count());
await p.screenshot({ path: `${out}/pg_gallery.png`, fullPage: true });
console.log('overflow', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errors', errors);
await b.close();
