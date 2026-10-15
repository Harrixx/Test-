// Visual QA: captures desktop, tablet and mobile screenshots of every route.
// Usage: node scripts/screenshots.mjs [baseUrl] [route ...]
// Scrolls each page first so scroll-triggered reveals have played.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
}

const base = process.argv[2] ?? "http://localhost:3000";
const defaultRoutes = [
  "/", "/about", "/own-label", "/brands", "/brands/ice-valley", "/brands/white-rock",
  "/sustainability", "/sustainability/tethered-caps", "/people", "/careers", "/careers/vacancies",
  "/news", "/news/celebrating-selwyn-smith", "/community", "/contact", "/concept",
  "/privacy-policy", "/cookies-policy", "/modern-slavery-statement", "/this-page-does-not-exist",
];
const routes = process.argv.length > 3 ? process.argv.slice(3) : defaultRoutes;
const only = process.env.VIEWPORTS?.split(",");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
].filter((v) => !only || only.includes(v.name));

const out = new URL("../qa/screenshots/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const errors = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${vp.name} ${page.url()}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${vp.name} ${page.url()} console: ${m.text()}`));
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    const slug = r === "/" ? "home" : r.slice(1).replace(/\//g, "_");
    await page.screenshot({ path: `${out}${vp.name}-${slug}-fold.png` });
    // Walk down the page a screen at a time, as a visitor would, so sticky sections and
    // scroll-triggered reveals behave as they do for real. Each screen is saved separately.
    if (process.env.FULL !== "0") {
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      let i = 0;
      for (let y = vp.height; y < total && i < 40; y += vp.height, i++) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${out}${vp.name}-${slug}-s${String(i + 1).padStart(2, "0")}.png` });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "No page errors.");
