# Shepley Spring: website redesign concept

An independently developed, **unofficial** redesign of [shepleyspring.co.uk](https://shepleyspring.co.uk), built as a working demonstration for Shepley Spring Ltd's senior management. It is not affiliated with or endorsed by the company, and it does not change the existing website.

Every page carries a "Concept" banner, the whole build is set to `noindex`, and `/concept` inside the site explains the proposal, lists every factual claim with its source, and sets out what is needed to go live.

## Creative direction

**"Spring water, 300 million years in the making."** The business has two stories that most competitors can't tell: deep geological time (the Greenmoor rock is around 304 million years old) and thirty years as a family business in one Yorkshire village. The design sets them against each other.

- **Palette:** deep navy and abyss blue for authority, glacier blue and white for purity, silver hairlines for precision. Brand colours (Ice Valley cyan, White Rock indigo and gold) appear only inside each brand's own sections.
- **Type:** Newsreader, an editorial serif, set large with italic emphasis, paired with Inter Tight for interface and body text.
- **Imagery:** the company's own photography (the founder at the borehole, the Knowle mill, the line, the fleet, the team), given a consistent treatment and room to breathe. Nothing is AI-generated or stock. Where real photography doesn't exist yet, a clearly labelled placeholder says what to commission.
- **Motion:** a code-rendered water-caustics hero (a single WebGL shader, a few kilobytes, paused off-screen), masked headline entrances, clip-mask image reveals, sticky scroll storytelling for manufacturing, gentle parallax and a scroll-linked timeline. Reduced-motion preferences are respected throughout, and above-the-fold motion is CSS so it never delays the first paint.
- **Logo:** the official SVG wordmark, reproduced path for path. Only its colour changes.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, story, manufacturing (sticky scroll), brands, sustainability, people, news |
| `/about` | Founder, scroll-linked timeline, family leadership, values, three sites and map |
| `/own-label` | Channels, formats drawn to scale, capabilities, fleet, sales CTA |
| `/brands`, `/brands/ice-valley`, `/brands/white-rock` | Hub plus a page in each brand's own visual language |
| `/sustainability`, `/sustainability/tethered-caps` | Mission, commitments, estate, circular economy; how tethered caps work |
| `/people` | Leadership and heads of department |
| `/careers`, `/careers/vacancies` | Culture, staff voices; filterable vacancies across three sites |
| `/news`, `/news/[slug]` | All seven articles from the current site |
| `/community` | Donations, partners and causes, GroceryAid award |
| `/contact` | Accessible enquiry form (not connected), sites, FAQ |
| `/privacy-policy`, `/cookies-policy`, `/modern-slavery-statement` | Transcribed from the current site |
| `/concept` | Presentation notes: before and after, claims register, approvals, route to production, redirect map |

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Quality checks:

```bash
npm run lint && npm run typecheck
node scripts/qa.mjs http://localhost:3000           # link crawl, axe WCAG 2.2 AA, interactions, metadata
node scripts/screenshots.mjs http://localhost:3000  # desktop, tablet and mobile screenshots into qa/screenshots
```

### Deploying the demo to Vercel

Create a new Vercel project from this repository with **Root Directory** set to `shepley-spring` (the framework is detected automatically), and set `NEXT_PUBLIC_SITE_URL` to the deployment's address. Do not point it at the shepleyspring.co.uk domain.

## Stack

Next.js 16 (App Router, all 31 routes statically generated), React 19, TypeScript, Tailwind CSS 4, Framer Motion 12. Fonts are self-hosted. There is no tracking, cookies or third-party script.

## Quality results (15 October 2026)

- `next build`, ESLint and TypeScript: clean.
- Link crawl: 25 internal pages, no broken links or anchors. 41 external links checked; 38 return 200, and GroceryAid and the Natural Source Waters Association reject automated requests (403/406) but are the same URLs the current site uses.
- Accessibility: zero axe violations (WCAG 2.0/2.1/2.2 A and AA) on every page at 1440px and 390px. Also covered: keyboard dropdowns, skip link, focus-managed form errors, a mobile menu that closes with Escape, scrollable regions reachable by keyboard, and pages that still read in full with JavaScript disabled.
- Performance, under simulated slow 3G and 4× CPU throttling: Largest Contentful Paint about 1.0s, Cumulative Layout Shift ≤ 0.02 on the pages measured.
- Every page has a unique title and description, one `h1`, `lang="en-GB"` and `noindex`. Organization, NewsArticle and FAQPage structured data, sitemap, robots and a generated Open Graph image are included.

## Content and claims

All content comes from shepleyspring.co.uk, ice-valley.com and whiterockwater.co.uk, crawled on 15 October 2026. The full claims register, with sources and approval status, is in `lib/site.ts` and on `/concept`.

**Needs confirming with the company:** the 1.2 million bottles a day figure (published before the 2024 expansion), 30% vs 30–51% recycled PET, "all production waste is recycled", 200,000 bottles donated a year, the White Rock Circana figures, the sport sponsorships, and using retailer names on the own label page.

**Deliberately left out until evidenced:** "UK's leading", "largest family-owned bottled water manufacturer in the UK", "lightest bottles on the market", "fastest and most efficient production line in the world", "UK's fastest growing water brand", "highest distributed wholesale brand", the unsourced life-cycle comparison chart, and a White Rock campaign image carrying a "Top 5 UK water brand" badge.

**Inconsistencies on the current site:** 20 vs 30 years in the homepage metadata; Danielle Nixon's job title differs between pages; the Brookfield postcode is printed "HD8 OPE" (corrected here to HD8 0PE).

**Copy written for this concept (for approval):** supporting lines for the six company values, condensed and more formal team biographies, and section headlines.

## Moving into production

1. Headless CMS for news, vacancies, team and partners.
2. Vacancies fed from the applicant tracking system, with JobPosting structured data.
3. Contact form connected to email or a CRM, with spam protection and routing by topic.
4. A one-day photography shoot across the three sites, plus an optional film loop for the hero.
5. Master vector logos and high-resolution product renders for all three brands.
6. A UK GDPR and PECR consent banner before any analytics, and an updated cookies policy.
7. Legal review of the privacy policy (it cites EU law and the CCPA) and the modern slavery statement.
8. Launch: apply the redirect map on `/concept`, remove the concept banner and `noindex`, submit the sitemap.
9. Optional: switch Framer Motion to `LazyMotion` to trim roughly 25KB of JavaScript.

## Project structure

```
app/            routes, metadata, sitemap, robots, OG image, error and 404 pages
components/     Header, Footer, Logo, motion primitives, WaterCanvas, page sections
lib/            site facts and claims register, content, news, legal text
public/         company and brand assets (from the existing websites)
scripts/        QA and screenshot tooling (Playwright)
```
