export const site = {
  name: "Shepley Spring",
  legalName: "Shepley Spring Ltd",
  // The deployed concept's own address. Set NEXT_PUBLIC_SITE_URL on Vercel.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shepley-spring-concept.vercel.app",
  officialUrl: "https://shepleyspring.co.uk",
  description:
    "Shepley Spring is a family-owned Yorkshire business bottling own label and branded spring water for the UK grocery and FMCG sector since 1996.",
  phone: "01484 609330",
  phoneHref: "tel:+441484609330",
  linkedin: "https://www.linkedin.com/company/shepley-spring-limited/",
  founded: "1996",
};

export type Location = {
  key: string;
  name: string;
  role: string;
  street: string;
  locality: string;
  town: string;
  postcode: string;
  note?: string;
};

export const locations: Location[] = [
  {
    key: "shepley",
    name: "Shepley",
    role: "Head office and source",
    street: "The Knowle",
    locality: "Shepley",
    town: "Huddersfield",
    postcode: "HD8 8EA",
    note: "Renamed Shepley Spring Selwyn in 2024",
  },
  {
    key: "brookfield",
    name: "Brookfield",
    role: "Production",
    street: "44 Penistone Road",
    locality: "Kirkburton",
    town: "Huddersfield",
    postcode: "HD8 0PE",
    note: "Home of our first multi-format line (2024)",
  },
  {
    key: "harrogate",
    name: "Harrogate",
    role: "Production",
    street: "Flaxby Industrial Estate",
    locality: "Flaxby",
    town: "Harrogate",
    postcode: "HG5 0XJ",
    note: "Our third site, opened in 2024",
  },
];

export type NavItem = { href: string; label: string; description?: string };
export type NavGroup = { label: string; href: string; items: NavItem[] };

export const nav: NavGroup[] = [
  {
    label: "Company",
    href: "/about",
    items: [
      { href: "/about", label: "About Shepley Spring", description: "Our story, from textile mill to spring water" },
      { href: "/people", label: "Our people", description: "The team behind the business" },
      { href: "/community", label: "Community", description: "Partners, charities and sponsorship" },
      { href: "/news", label: "News", description: "The latest from Shepley" },
    ],
  },
  {
    label: "Own Label",
    href: "/own-label",
    items: [],
  },
  {
    label: "Our Brands",
    href: "/brands",
    items: [
      { href: "/brands", label: "Our brands", description: "Two lifestyle brands for independents" },
      { href: "/brands/ice-valley", label: "Ice Valley", description: "Welcome to the Valley of Refreshment" },
      { href: "/brands/white-rock", label: "White Rock", description: "Refreshing still spring water" },
    ],
  },
  {
    label: "Sustainability",
    href: "/sustainability",
    items: [
      { href: "/sustainability", label: "Sustainability", description: "A light touch on the planet" },
      { href: "/sustainability/tethered-caps", label: "Tethered caps", description: "Why the cap stays on" },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    items: [
      { href: "/careers", label: "Careers", description: "Grow with a business on the move" },
      { href: "/careers/vacancies", label: "Current vacancies", description: "Roles across all three sites" },
    ],
  },
];

export const legalLinks: NavItem[] = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/cookies-policy", label: "Cookies policy" },
  { href: "/modern-slavery-statement", label: "Modern slavery statement" },
];

export const values = ["Sustainability", "Transparency", "Excellence", "Teamwork", "Safety", "Equality"];

/**
 * Every factual claim the concept makes, with where it came from.
 * Shown on /concept so the company can approve or correct each one.
 */
export type Claim = { claim: string; source: string; sourceUrl: string; status: "sourced" | "confirm" };

export const claims: Claim[] = [
  {
    claim: "Bottling business founded in 1996, after high-quality water was found in the textile mill's borehole during the 1995 drought",
    source: "News: Celebrating the legacy of Selwyn Smith",
    sourceUrl: "https://shepleyspring.co.uk/celebrating-selwyn-day-29th-august-2024/",
    status: "sourced",
  },
  {
    claim: "30 years of own label and branded water bottling",
    source: "Homepage hero (the homepage meta description still says 20 years)",
    sourceUrl: "https://shepleyspring.co.uk/",
    status: "sourced",
  },
  {
    claim: "Still led by the founding family; James Smith (Selwyn's son) has been Managing Director since 2007",
    source: "Meet the team",
    sourceUrl: "https://shepleyspring.co.uk/meet-the-team/",
    status: "sourced",
  },
  {
    claim: "Modern bottling plants capable of filling 1.2 million bottles per day",
    source: "Own label page (written before the 2024 Brookfield line and Harrogate site; current figure to confirm)",
    sourceUrl: "https://shepleyspring.co.uk/experts-in-own-label-water-bottling/",
    status: "confirm",
  },
  {
    claim: "Formats: 330ml sports cap, 500ml screw cap, 500ml sports cap, 750ml sports cap, 2 litre screw cap",
    source: "Own label page",
    sourceUrl: "https://shepleyspring.co.uk/experts-in-own-label-water-bottling/",
    status: "sourced",
  },
  {
    claim: "Own label supply to Morrisons, Lidl, Booker, Tesco and Iceland",
    source: "Own label page. Retailer names are shown as text only; permission needed before using logos.",
    sourceUrl: "https://shepleyspring.co.uk/experts-in-own-label-water-bottling/",
    status: "confirm",
  },
  {
    claim: "Vertically integrated production, from pellet to preform to finished product",
    source: "Ice Valley and White Rock websites; injection moulding vacancies",
    sourceUrl: "https://ice-valley.com/",
    status: "sourced",
  },
  {
    claim: "Own delivery fleet; central location close to the motorway network",
    source: "Own label page",
    sourceUrl: "https://shepleyspring.co.uk/experts-in-own-label-water-bottling/",
    status: "sourced",
  },
  {
    claim: "First multi-format production line ran its first bottle at Brookfield in May 2024",
    source: "News: New production line increases capacity",
    sourceUrl: "https://shepleyspring.co.uk/new-production-line-increases-capacity/",
    status: "sourced",
  },
  {
    claim: "Third site opened in Harrogate in 2024",
    source: "News: Celebrating the legacy of Selwyn Smith",
    sourceUrl: "https://shepleyspring.co.uk/celebrating-selwyn-day-29th-august-2024/",
    status: "sourced",
  },
  {
    claim: "Bottles use 30% recycled PET",
    source: "Homepage FAQ. The brand websites say 30%–51% rPET; one figure should be agreed.",
    sourceUrl: "https://shepleyspring.co.uk/",
    status: "confirm",
  },
  {
    claim: "Successful trial of a lightweight bottle made from 100% recycled plastic (rPET)",
    source: "News: 100% recycled plastic bottle trials",
    sourceUrl: "https://shepleyspring.co.uk/100-recycled-plastic-bottle-trials/",
    status: "sourced",
  },
  {
    claim: "All production waste is recycled",
    source: "Ice Valley and White Rock websites",
    sourceUrl: "https://whiterockwater.co.uk/",
    status: "confirm",
  },
  {
    claim: "50 acres of organically farmed land, 3 lakes, 2 woods and a communal nature reserve in Shepley",
    source: "Ice Valley and White Rock websites",
    sourceUrl: "https://ice-valley.com/",
    status: "sourced",
  },
  {
    claim: "Founder signatory to the UK Plastics Pact",
    source: "Community page",
    sourceUrl: "https://shepleyspring.co.uk/making-a-difference-within-our-communities/",
    status: "sourced",
  },
  {
    claim: "Board member of the Natural Source Waters Association",
    source: "Community page",
    sourceUrl: "https://shepleyspring.co.uk/making-a-difference-within-our-communities/",
    status: "sourced",
  },
  {
    claim: "James Smith appointed to the UK Deposit Management Organisation board (June 2025)",
    source: "News: James Smith appointed to UK DMO board",
    sourceUrl: "https://shepleyspring.co.uk/james-smith-appointed-to-uk-dmo-board-of-directors/",
    status: "sourced",
  },
  {
    claim: "Over 200,000 bottles donated to charities and events each year",
    source: "Homepage FAQ",
    sourceUrl: "https://shepleyspring.co.uk/",
    status: "confirm",
  },
  {
    claim: "B1G1 partnership (with Walker & Sutcliffe) has provided 700 days of clean water access to a community in Tanzania",
    source: "Community page",
    sourceUrl: "https://shepleyspring.co.uk/making-a-difference-within-our-communities/",
    status: "sourced",
  },
  {
    claim: "GroceryAid Silver Award for 2026",
    source: "News: Shepley Spring awarded GroceryAid Silver Award",
    sourceUrl: "https://shepleyspring.co.uk/shepley-spring-awarded-groceryaid-silver-award/",
    status: "sourced",
  },
  {
    claim: "White Rock: over 110 million litres consumed per year; the brand has doubled in size in three years (Circana MAT 06.07.2025)",
    source: "White Rock website, citing Circana",
    sourceUrl: "https://whiterockwater.co.uk/",
    status: "confirm",
  },
  {
    claim: "Ice Valley is available exclusively through Tesco and Booker Wholesale",
    source: "Ice Valley website",
    sourceUrl: "https://ice-valley.com/",
    status: "sourced",
  },
  {
    claim: "Ice Valley is the official water of Huddersfield Town; White Rock of Huddersfield Giants",
    source: "News: Sport sponsorship",
    sourceUrl: "https://shepleyspring.co.uk/sport-sponsorship/",
    status: "confirm",
  },
];

/** Claims on the current website that this concept deliberately leaves out until evidenced. */
export const omittedClaims = [
  "“UK’s leading own label and branded water bottler” (homepage title)",
  "“The largest family-owned bottled water manufacturer in the UK” (Selwyn article)",
  "“Our bottles are the lightest on the market” (sustainability page)",
  "“The fastest and most efficient production line in the world” (brand websites)",
  "“The UK’s fastest growing water brand” and “highest distributed wholesale brand” (brands page)",
  "The life-cycle comparison chart against cans, cartons and glass (no methodology or source given)",
];
