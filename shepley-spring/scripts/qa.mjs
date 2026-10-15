// Functional QA: crawls every internal link, runs axe (WCAG 2.2 AA) on every page at
// desktop and mobile widths, and exercises the interactive parts of the site.
// Usage: node scripts/qa.mjs [baseUrl]
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
}
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const problems = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  problems.push(msg);
  console.log(`  ✗ ${msg}`);
};

// 1. Crawl internal links
console.log("Link crawl");
const ctx = await browser.newContext({ reducedMotion: "reduce" });
const page = await ctx.newPage();
const seen = new Set();
const queue = ["/"];
const external = new Set();
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await page.goto(base + path, { waitUntil: "domcontentloaded" });
  if (!res || res.status() !== 200) fail(`${path} returned ${res?.status()}`);
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    if (!h) continue;
    if (h.startsWith("http")) external.add(h);
    else if (h.startsWith("/")) {
      const clean = h.split("#")[0].split("?")[0] || "/";
      if (!seen.has(clean)) queue.push(clean);
    }
  }
  // In-page anchors must resolve
  const missing = await page.$$eval("a[href^='#']", (as) =>
    as.map((a) => a.getAttribute("href").slice(1)).filter((id) => id && !document.getElementById(id)),
  );
  missing.forEach((id) => fail(`${path}: anchor #${id} has no target`));
}
ok(`${seen.size} internal pages crawled`);
console.log(`  ${external.size} unique external links (checked separately)`);

// 2. Accessibility
console.log("\nAccessibility (axe, WCAG 2.2 A/AA)");
const routes = [...seen].sort();
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const c = await browser.newContext({ viewport: vp, reducedMotion: "reduce" });
  const p = await c.newPage();
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(800); // let any in-flight fades finish
    await p.addScriptTag({ content: axeSource });
    const result = await p.evaluate(async () =>
      // eslint-disable-next-line no-undef
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } }),
    );
    for (const v of result.violations) {
      fail(`${vp.name} ${r}: [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length}×) e.g. ${v.nodes[0].target.join(" ")}`);
    }
  }
  await c.close();
}
if (!problems.some((p) => p.includes("["))) ok("no axe violations on any page");

// 3. Interactions
console.log("\nInteractions");
{
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Open menu" }).click();
  await p.waitForTimeout(900);
  const dialog = p.getByRole("dialog", { name: "Menu" });
  (await dialog.isVisible()) ? ok("mobile menu opens") : fail("mobile menu did not open");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(900);
  (await dialog.count()) === 0 ? ok("mobile menu closes with Escape") : fail("mobile menu did not close");
  await p.getByRole("button", { name: "Open menu" }).click();
  await p.waitForTimeout(900);
  await dialog.getByRole("link", { name: "Own Label", exact: true }).click();
  await p.waitForURL("**/own-label");
  await p.waitForTimeout(1500);
  (await p.getByRole("dialog").count()) === 0 ? ok("mobile menu navigates and closes") : fail("menu stayed open after navigating");
  await c.close();
}
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  // Keyboard: skip link first, then into the navigation
  await p.keyboard.press("Tab");
  const first = await p.evaluate(() => document.activeElement?.textContent?.trim());
  first === "Skip to content" ? ok("skip link is the first tab stop") : fail(`first tab stop was "${first}"`);
  const btn = p.getByRole("button", { name: "Company" });
  await btn.focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(500);
  (await btn.getAttribute("aria-expanded")) === "true" ? ok("dropdown opens from the keyboard") : fail("dropdown did not open");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  (await btn.getAttribute("aria-expanded")) === "false" ? ok("dropdown closes with Escape") : fail("dropdown did not close");

  await p.goto(base + "/contact?topic=sales", { waitUntil: "networkidle" });
  (await p.locator("select[name=topic]").inputValue()) === "sales" ? ok("contact topic preselected from URL") : fail("topic not preselected");
  await p.getByRole("button", { name: /Send message/ }).click();
  await p.waitForTimeout(400);
  const alert = p.locator("div[role=alert][tabindex='-1']");
  (await alert.isVisible()) && (await p.evaluate(() => document.activeElement?.getAttribute("role"))) === "alert"
    ? ok("empty form shows a focused error summary")
    : fail("error summary missing or not focused");
  const invalid = await p.locator("[aria-invalid=true]").count();
  invalid === 4 ? ok("4 invalid fields flagged (name, email, message, consent)") : fail(`${invalid} fields flagged invalid`);
  await p.fill("input[name=name]", "Test Buyer");
  await p.fill("input[name=email]", "buyer@example.com");
  await p.fill("textarea[name=message]", "We would like to discuss a 500ml own label programme.");
  await p.check("input[name=consent]");
  await p.getByRole("button", { name: /Send message/ }).click();
  await p.waitForTimeout(600);
  (await p.getByText("Your message is ready to send.").isVisible()) ? ok("valid form shows the concept confirmation") : fail("no confirmation after valid submit");

  await p.goto(base + "/careers/vacancies", { waitUntil: "networkidle" });
  await p.getByText("Harrogate", { exact: true }).first().click();
  await p.waitForTimeout(700);
  const status = await p.getByRole("status").first().textContent();
  status?.includes("in Harrogate") ? ok(`vacancy filter works ("${status.trim()}")`) : fail(`vacancy filter status: ${status}`);

  const r404 = await p.goto(base + "/no-such-page");
  r404?.status() === 404 ? ok("unknown routes return 404 with the custom page") : fail(`404 route returned ${r404?.status()}`);

  for (const [path, want] of [["/robots.txt", "Disallow: /"], ["/sitemap.xml", "<urlset"]]) {
    const res = await p.goto(base + path);
    (await res.text()).includes(want) ? ok(`${path} served`) : fail(`${path} unexpected content`);
  }
  const og = await p.goto(base + "/opengraph-image");
  og?.headers()["content-type"]?.includes("image/png") ? ok("Open Graph image renders") : fail("OG image not served");

  // Metadata on every page
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: "domcontentloaded" });
    const meta = await p.evaluate(() => ({
      title: document.title,
      desc: document.querySelector("meta[name=description]")?.getAttribute("content"),
      h1: document.querySelectorAll("h1").length,
      robots: document.querySelector("meta[name=robots]")?.getAttribute("content"),
      lang: document.documentElement.lang,
    }));
    if (!meta.title || !meta.desc) fail(`${r}: missing title or description`);
    if (meta.h1 !== 1) fail(`${r}: ${meta.h1} h1 elements`);
    if (!meta.robots?.includes("noindex")) fail(`${r}: not noindex`);
    if (meta.lang !== "en-GB") fail(`${r}: lang ${meta.lang}`);
  }
  ok("every page has a title, description, one h1, en-GB and noindex");
  await c.close();
}

await browser.close();
console.log(`\nExternal links:\n${[...external].sort().join("\n")}`);
console.log(problems.length ? `\n${problems.length} problem(s) found.` : "\nAll checks passed.");
process.exit(problems.length ? 1 : 0);
