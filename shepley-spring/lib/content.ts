// Content transcribed from shepleyspring.co.uk (crawled 15 October 2026), lightly edited for
// tone. Nothing here is invented: see lib/site.ts `claims` for sources.

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  leadership?: boolean;
};

export const team: TeamMember[] = [
  {
    slug: "james-smith",
    name: "James Smith",
    role: "Managing Director",
    image: "/images/team/james.jpg",
    leadership: true,
    bio: "Part of the Smith family that founded Shepley Spring, James is a former Royal Air Force officer and has been Managing Director since 2007. He sits on the board of the industry’s trade body and, since 2025, on the board of the UK Deposit Management Organisation.",
  },
  {
    slug: "lynzie-hardcastle",
    name: "Lynzie Hardcastle",
    role: "Commercial Director",
    image: "/images/team/lynzie.jpg",
    leadership: true,
    bio: "Lynzie leads sales and revenue growth, bringing more than 20 years of commercial experience with renowned global brands to keep our water in demand with customers across the UK.",
  },
  {
    slug: "jeff-corey",
    name: "Jeff Corey",
    role: "Operations Director",
    image: "/images/team/jeff.jpg",
    leadership: true,
    bio: "Jeff runs manufacturing and heads up factory innovation. Twenty years in senior operational roles at blue-chip FMCG businesses give him deep experience of large-scale production.",
  },
  {
    slug: "andrew-rudge",
    name: "Andrew Rudge",
    role: "Senior National Account Manager",
    image: "/images/team/andrew.jpg",
    leadership: true,
    bio: "Andrew develops and delivers our sales strategy. With more than 15 years in retail and wholesale, he puts customer service first and keeps our customers’ shelves full.",
  },
  {
    slug: "paramjit-bahia",
    name: "Paramjit Bahia",
    role: "Head of Technical",
    image: "/images/team/pam.jpg",
    bio: "Pam leads quality and compliance, upholding industry standards and making sure every bottle we produce meets the strictest benchmarks.",
  },
  {
    slug: "paraic-russell",
    name: "Paraic Russell",
    role: "Head of Operations",
    image: "/images/team/paraic.jpg",
    bio: "A supply chain and technical specialist, Paraic set up our newest manufacturing site and manages our expansion projects.",
  },
  {
    slug: "adam-hadfield",
    name: "Adam Hadfield",
    role: "Head of Finance",
    image: "/images/team/adam.jpg",
    bio: "Adam oversees budgeting, forecasting and financial analysis, supporting profitable, sustainable growth and sound investment.",
  },
  {
    slug: "danielle-nixon",
    name: "Danielle Nixon",
    role: "Senior People Manager",
    image: "/images/team/danielle.jpg",
    bio: "With more than 10 years across FMCG and manufacturing, Danielle shapes our people strategy: attracting, developing and retaining the talent behind our growth.",
  },
  {
    slug: "gareth-wright",
    name: "Gareth Wright",
    role: "Financial Controller",
    image: "/images/team/gareth.jpg",
    bio: "Gareth oversees financial operations and analysis that inform the company’s strategic decisions and support its growth.",
  },
  {
    slug: "damian-fenton",
    name: "Damian Fenton",
    role: "Procurement Manager",
    image: "/images/team/damian.jpg",
    bio: "Twenty-six years with Shepley Spring give Damian unrivalled knowledge of our long-standing supplier relationships, keeping costs down and quality up.",
  },
  {
    slug: "kelly-brook",
    name: "Kelly Brook",
    role: "Transport Manager",
    image: "/images/team/kelly.jpg",
    bio: "Kelly makes sure our water flows from source to shelf, running logistics efficiently while maintaining the standards we are proud of.",
  },
  {
    slug: "mark-stelling",
    name: "Mark Stelling",
    role: "Site Factory Manager, Harrogate",
    image: "/images/team/mark.jpg",
    bio: "Mark oversees daily operations at Harrogate, balancing schedules, quality, safety and efficiency across the site.",
  },
  {
    slug: "david-hustler",
    name: "David Hustler",
    role: "Factory Manager, Nights",
    image: "/images/team/dave.jpg",
    bio: "With Shepley Spring since the very beginning, Dave keeps bottling running smoothly through the night shift.",
  },
  {
    slug: "chris-smyth",
    name: "Chris Smyth",
    role: "Engineering Manager",
    image: "/images/team/chris.jpg",
    bio: "Chris leads our engineering team, overseeing equipment maintenance and improvements to production efficiency.",
  },
  {
    slug: "tony-kirk",
    name: "Tony Kirk",
    role: "IT Manager",
    image: "/images/team/tony.jpg",
    bio: "Tony keeps Shepley Spring’s systems and infrastructure running across all three sites.",
  },
];

export type StaffVoice = { role: string; image?: string; quote: string; growth: string };

export const staffVoices: StaffVoice[] = [
  {
    role: "Electrical Engineer, Apprentice",
    image: "/images/people/apprentice.jpg",
    quote: "Every day is different. As part of the engineering team, I enjoy different challenges and the opportunity to be involved in multiple projects.",
    growth: "I started as an operator, joined the engineering team as an apprentice and have now almost completed my Engineering Apprenticeship.",
  },
  {
    role: "Production Operative",
    image: "/images/people/operative.jpg",
    quote: "No two days are ever the same. The company is always evolving and improving, particularly within its green initiatives.",
    growth: "I have been encouraged to obtain many different skills and qualifications. It’s a very tight unit and group of people.",
  },
  {
    role: "Electrical Engineer",
    image: "/images/people/electrical-engineer.jpg",
    quote: "Working at Shepley Spring is both challenging and rewarding. It’s family orientated and offers a good work–life balance.",
    growth: "My skills have become more in-depth and specialised, and the business has invested in external training and development.",
  },
  {
    role: "Production Supervisor",
    quote: "A refreshing change to be part of such a progressive company. A company I can take pride in working for.",
    growth: "I was recognised for my hard work and offered the opportunity to progress into production management.",
  },
  {
    role: "Head of Technical",
    image: "/images/people/technical.jpg",
    quote: "The company creates an inclusive work culture and has a strong focus on sustainability as well as food safety throughout the business.",
    growth: "I continue to build my knowledge and to lead, coach and develop my team.",
  },
  {
    role: "Procurement Manager",
    image: "/images/people/procurement.jpg",
    quote: "Every day brings a blend of innovation and camaraderie.",
    growth: "My skills have developed through a diverse range of challenges and opportunities.",
  },
];

export type Vacancy = {
  slug: string;
  title: string;
  shift?: "Days" | "Nights";
  sites: ("Shepley" | "Kirkburton" | "Harrogate")[];
  summary: string;
  department: "Production" | "Engineering" | "Warehouse" | "Health & Safety" | "Supply Chain" | "Hygiene";
  sourceUrl: string;
};

const V = "https://shepleyspring.co.uk/current-vacancies/";

export const vacancies: Vacancy[] = [
  { slug: "hse-manager", title: "HSE Manager", sites: ["Harrogate", "Kirkburton", "Shepley"], department: "Health & Safety", summary: "Lead the development and implementation of health, safety and environmental standards across all three manufacturing sites.", sourceUrl: V + "hse-manager/" },
  { slug: "multi-skilled-engineer", title: "Multi-Skilled Engineer", sites: ["Harrogate"], department: "Engineering", summary: "Ensure the smooth operation, maintenance and repair of production equipment and machinery across the site.", sourceUrl: V + "multi-skilled-engineer-2/" },
  { slug: "production-supervisor", title: "Production Supervisor", sites: ["Harrogate"], department: "Production", summary: "Oversee and coordinate all activities of the team engaged in production operations.", sourceUrl: V + "production-supervisor/" },
  { slug: "customer-supply-chain-coordinator", title: "Customer Supply Chain Co-ordinator", sites: ["Shepley"], department: "Supply Chain", summary: "Process customer orders and organise transport collection requests across all three sites.", sourceUrl: V + "customer-supply-chain-coordinator/" },
  { slug: "injection-operative-days", title: "Injection Moulding Operative", shift: "Days", sites: ["Shepley"], department: "Production", summary: "Support the efficient operation of injection moulding machinery, making sure products are manufactured safely, accurately and to the required quality.", sourceUrl: V + "injection-operative-days/" },
  { slug: "injection-operative-nights", title: "Injection Moulding Operative", shift: "Nights", sites: ["Shepley"], department: "Production", summary: "Support the efficient operation of injection moulding machinery, making sure products are manufactured safely, accurately and to the required quality.", sourceUrl: V + "injection-operative-nights/" },
  { slug: "production-operative-days", title: "Production Operative", shift: "Days", sites: ["Kirkburton"], department: "Production", summary: "Play a vital role in the smooth running of our production lines.", sourceUrl: V + "production-operative-days/" },
  { slug: "production-operative-nights", title: "Production Operative", shift: "Nights", sites: ["Kirkburton"], department: "Production", summary: "Play a vital role in the smooth running of our production lines.", sourceUrl: V + "production-operative-nights/" },
  { slug: "production-operative-harrogate", title: "Production Operative", sites: ["Harrogate"], department: "Production", summary: "Assist in the smooth running of the production process across the site.", sourceUrl: V + "production-operative-2/" },
  { slug: "flt-operative-days", title: "FLT Operative", shift: "Days", sites: ["Kirkburton"], department: "Warehouse", summary: "Load, unload, move and stack materials within the warehouse and production areas.", sourceUrl: V + "flt-operative-days/" },
  { slug: "flt-operative-nights", title: "FLT Operative", shift: "Nights", sites: ["Kirkburton"], department: "Warehouse", summary: "Load, unload, move and stack materials within the warehouse and production areas.", sourceUrl: V + "flt-operative-nights-2/" },
  { slug: "flt-operative-harrogate", title: "FLT Operative", sites: ["Harrogate"], department: "Warehouse", summary: "Load, unload, move and stack materials within the warehouse and production areas.", sourceUrl: V + "flt-operative/" },
  { slug: "industrial-cleaner", title: "Industrial Cleaner", sites: ["Harrogate"], department: "Hygiene", summary: "Maintain the hygiene, cleanliness and food safety standards that our manufacturing depends on.", sourceUrl: V + "industrial-cleaner/" },
];

export type Partner = { name: string; kind: string; body: string; url: string };

export const partners: Partner[] = [
  {
    name: "The UK Plastics Pact",
    kind: "Industry commitment · WRAP",
    body: "Shepley Spring is a founder signatory to the UK Plastics Pact, which brings businesses across the plastics value chain together with UK governments and NGOs to build a circular economy for plastics.",
    url: "https://www.wrap.ngo/taking-action/plastic-packaging/initiatives/the-uk-plastics-pact",
  },
  {
    name: "Natural Source Waters Association",
    kind: "Trade body",
    body: "As a member of the board, we promote natural source waters and the healthy choice they give consumers.",
    url: "https://naturalsourcewaters.org.uk",
  },
  {
    name: "Yorkshire Air Ambulance",
    kind: "Charity sponsorship",
    body: "A proud, long-standing sponsor of the Yorkshire Air Ambulance, which saves lives across the county every day.",
    url: "https://www.yorkshireairambulance.org.uk",
  },
  {
    name: "GroceryAid",
    kind: "Industry charity",
    body: "Partners since 2024, supporting the people who keep the grocery industry going, from financial help to mental health resources. Awarded GroceryAid Silver for 2026.",
    url: "https://www.groceryaid.org.uk",
  },
  {
    name: "Huddersfield Town & Huddersfield Giants",
    kind: "Sport sponsorship",
    body: "Ice Valley is the official water of Huddersfield Town Football Club. White Rock is the official water of Huddersfield Giants Rugby League.",
    url: "/news/sport-sponsorship",
  },
  {
    name: "Company Shop",
    kind: "Surplus redistribution",
    body: "Surplus stock goes to Company Shop, reaching their members, including key workers, armed forces, NHS staff and people receiving welfare support, at a discount, instead of going to waste.",
    url: "https://www.companyshopgroup.co.uk",
  },
  {
    name: "The Ocean Cleanup",
    kind: "Environmental partner",
    body: "Through Big Blue Ocean Cleanup, we help provide volunteer teams for beach cleans and raise awareness of ocean pollution.",
    url: "https://theoceancleanup.com",
  },
  {
    name: "B1G1",
    kind: "Giving initiative",
    body: "Through our partnership with Walker & Sutcliffe and B1G1, we have provided 700 days of clean water access to a community in Tanzania.",
    url: "https://b1g1.com",
  },
];

export const faqs: { q: string; a: string; href?: string }[] = [
  { q: "Is your water from a groundwater source, and where is it drawn from?", a: "Yes. The Shepley Spring source is in Shepley, a village close to the Peak District National Park." },
  { q: "Does your water contain fluoride?", a: "Only natural calcium fluoride, which occurs like any other mineral found in water. Sodium fluoride, the kind added to toothpaste, is man-made, and we don’t add it." },
  { q: "Is your water hard? Will it leave scale in my kettle?", a: "Yes. Our source has a high mineral content, which can precipitate and leave a residue if the water is boiled or frozen." },
  { q: "Why does bottled water have a shelf life?", a: "Once water leaves the ground and is exposed to air and light it can start to lose its freshness. PET bottles are microporous and let a little air in, so every bottle carries a best-before date." },
  { q: "Are your bottles recyclable?", a: "Yes. Our PET bottles and HDPE caps are all recyclable. Please recycle the bottle with the cap on." },
  { q: "Do you use recycled plastic in your bottles?", a: "Yes, our bottles use 30% recycled PET (polyethylene terephthalate)." },
  { q: "Are your bottles BPA free?", a: "Yes. Our bottles are made from PET and our caps from high-density polyethylene (HDPE), food-grade plastics approved by the US FDA for many kinds of food container. We don’t use BPA in any of our products." },
  { q: "Why do your bottles have tethered caps?", a: "Tethered caps keep the cap and bottle together so they are recycled together, and the cap can’t be lost as litter.", href: "/sustainability/tethered-caps" },
  { q: "Will you sponsor us or donate water?", a: "We support designated charities and events, donating over 200,000 bottles a year. Get in touch and tell us about your cause." },
  { q: "I’d like to become a supplier to Shepley Spring.", a: "Please use the contact form, choosing “Becoming a supplier”, and the right person will reply." },
];

export const timeline = [
  { year: "c. 304m BC", title: "The Greenmoor rock forms", body: "The mineral-rich Greenmoor rock forms beneath what is now the Pennines. Rain filtering through it gives our water its refreshing taste." },
  { year: "1970s", title: "Selwyn Smith buys the mill", body: "Selwyn buys a former textile mill on the Knowle in Shepley. As Shepley Textiles, it supplies reconditioned machinery all over the world." },
  { year: "1995", title: "A drought reveals the source", body: "During the drought, the mill’s borehole is found to deliver water of exceptionally high quality." },
  { year: "1996", title: "Shepley Spring is founded", body: "The business turns from textiles to bottled water, supplying retailers. Many of the mill’s staff come too." },
  { year: "2007", title: "The next generation", body: "James Smith, Selwyn’s son and a former RAF officer, becomes Managing Director." },
  { year: "2024", title: "A year of growth", body: "Our first multi-format line runs at Brookfield in May, and a third site opens in Harrogate. The head office is renamed Shepley Spring Selwyn in his honour." },
  { year: "2026", title: "Thirty years of bottling", body: "Still family-owned, still in Shepley, and still making a good product at a good price." },
];

export const formats = [
  { size: "330ml", closure: "Sports cap" },
  { size: "500ml", closure: "Screw cap" },
  { size: "500ml", closure: "Sports cap" },
  { size: "750ml", closure: "Sports cap" },
  { size: "2 litre", closure: "Screw cap" },
];

export const sectors = [
  "Leading retail multiples",
  "Convenience",
  "Forecourt operators",
  "Wholesalers and independents",
  "Sports and leisure",
];
