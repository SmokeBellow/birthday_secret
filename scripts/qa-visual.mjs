// Mobile-emulated visual pass: iPhone-like viewport + touch, screenshots of every level (start / mid / done) and
// a motion check (two frames of the stage 700 ms apart must differ for levels that animate).
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:4173';
const out = process.argv[3] ?? '/tmp/vis';
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const res = [];
for (let n = 1; n <= 30; n++) {
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${base}/?dev=1&level=${n}&seed=1`);
  await p.waitForSelector('.level-screen');
  await p.waitForTimeout(900);
  const stage = p.locator('.stage').first();
  const a = await stage.screenshot();
  await p.waitForTimeout(700);
  const c = await stage.screenshot();
  fs.writeFileSync(`${out}/L${String(n).padStart(2, '0')}_t0.png`, a);
  fs.writeFileSync(`${out}/L${String(n).padStart(2, '0')}_t1.png`, c);
  const moved = Buffer.compare(a, c) !== 0;
  const anim = await p.evaluate(() => document.getAnimations().filter((x) => x.playState === 'running').length);
  const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  res.push({ n, moved, runningCssAnimations: anim, overflow: over, errs });
  await p.close();
}
console.log(JSON.stringify(res));
await b.close();
