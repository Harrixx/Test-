// News articles from shepleyspring.co.uk, with their original publish dates.

export type Article = {
  slug: string;
  title: string;
  date: string; // ISO
  category: "Company" | "Sustainability" | "Community" | "Operations";
  excerpt: string;
  image?: { src: string; alt: string; width: number; height: number };
  body: string[];
  quote?: { text: string; by: string };
  link?: { href: string; label: string };
};

export const articles: Article[] = [
  {
    slug: "groceryaid-silver-award",
    title: "Shepley Spring awarded the GroceryAid Silver Award",
    date: "2026-04-01",
    category: "Community",
    excerpt: "Recognition of our ongoing commitment to the vital work GroceryAid does for the grocery industry and its people.",
    image: { src: "/images/news/groceryaid.jpg", alt: "GroceryAid Awards Silver Award artwork with Ice Valley and White Rock bottles", width: 1000, height: 667 },
    body: [
      "In 2024, Shepley Spring Ltd partnered with GroceryAid, combining our commitment to high-quality bottled water with support for the people who keep the grocery industry going.",
      "We are delighted to have been awarded the GroceryAid Silver Award for 2026.",
      "We believe in giving back and in being part of a community that cares for its members, especially in challenging times. This recognition reflects our ongoing commitment to supporting the vital work GroceryAid does for the grocery industry and its people.",
      "A huge thank you to everyone in our team who contributed to making this possible. Your hard work and dedication are the foundation of our success, and we look forward to continuing to support our team members through the fantastic work GroceryAid does.",
    ],
    link: { href: "https://www.groceryaid.org.uk/", label: "Visit GroceryAid" },
  },
  {
    slug: "james-smith-uk-dmo-board",
    title: "James Smith appointed to the UK DMO Board of Directors",
    date: "2025-06-06",
    category: "Company",
    excerpt: "Our Managing Director joins the board of the new administrator for the UK’s Deposit Return Scheme.",
    image: { src: "/images/news/james-smith-dmo.jpg", alt: "James Smith, Managing Director of Shepley Spring", width: 1000, height: 667 },
    body: [
      "We are proud to share that our Managing Director, James Smith, has been appointed to the board of directors of the UK Deposit Management Organisation (UK DMO), the new administrator for the UK’s Deposit Return Scheme.",
      "Nominated by the Natural Source Waters Association, James joins a board selected by leading industry trade bodies to help lead this major environmental initiative.",
      "The UK DMO is a not-for-profit, industry-led organisation that will deliver the Deposit Return Scheme across England, Northern Ireland and Scotland. The scheme aims to significantly reduce waste, boost recycling and cut carbon emissions.",
    ],
    link: { href: "https://ukdmo.co.uk", label: "Find out more about UK DMO" },
  },
  {
    slug: "new-production-line-increases-capacity",
    title: "New production line increases capacity",
    date: "2025-01-24",
    category: "Operations",
    excerpt: "In May 2024 the first bottle ran down our new production line at Brookfield, our first multi-format line.",
    image: { src: "/images/production-line.jpg", alt: "Ice Valley bottles moving along a conveyor on the production line", width: 1000, height: 667 },
    body: [
      "In May 2024 we successfully ran the first bottle down our new production line at our Brookfield factory. It follows years of planning and hard work, and marks another landmark in the significant investment we are making in the business to keep delivering for our customers and consumers.",
      "It is our first multi-format line, letting us offer a broader range and increase our capacity to keep UK consumers hydrated all year round.",
      "We are incredibly proud of the planning, installation and manufacturing teams who made this happen and who continue to run the new line.",
    ],
  },
  {
    slug: "celebrating-selwyn-smith",
    title: "Celebrating the legacy of Selwyn Smith",
    date: "2024-08-29",
    category: "Company",
    excerpt: "Family, friends, customers, suppliers and staff gathered at the Knowle to pay tribute to our founder.",
    image: { src: "/images/news/selwyn-banner.jpg", alt: "Banner spelling SELWYN, each letter made from images from his life", width: 1000, height: 667 },
    body: [
      "On Thursday 29 August 2024, family, friends, customers, suppliers and staff gathered at Shepley Spring, on the Knowle, to celebrate and pay tribute to our founder, Selwyn Smith.",
      "Our head office was renamed Shepley Spring Selwyn, and the new sign was unveiled by road and track cyclist Ed Clancy OBE, Olympic gold medallist and the most successful team pursuit cyclist in history.",
      "In the loading bay, our Managing Director James, one of Selwyn’s sons, spoke about the business and gave a personal insight into his father’s character. A banner spelled out Selwyn’s name, each letter made from images of his life, and a cake was made to match it.",
      "Selwyn was born in 1942 and lived in Shepley all his life. His first business, J Selwyn Smith (Shepley) Ltd, was founded in 1974 and still operates today as Penmoor UK Ltd.",
      "Our premises, a former textile mill, were bought by Selwyn fifty years ago and became Shepley Textiles, supplying reconditioned machinery all over the world. In the drought of 1995 the water from the mill’s borehole was found to be of extremely high quality, and in 1996 a new business was founded to supply bottled water to retailers. Selwyn led the move away from textiles, taking many of the staff with him: a testament to his commitment to his workers and their loyalty to him.",
      "He believed in producing “a good product at a good price”, a principle that has helped sustain Shepley Spring’s long-standing relationships with leading retailers. The business continues to grow, opening its third site in Harrogate in 2024: proof that the values he put in place are as relevant as ever.",
      "Selwyn was a family man, with five children, eleven grandchildren and three great-grandchildren, and his family values extended into the business. He died in May 2023, and his legacy lives on in the company. His father’s name is on the Shepley war memorial; now Selwyn’s is on the side of the building where he worked until his last day.",
    ],
    quote: {
      text: "He was an honest, decent, hardworking man, an engineer, a perfectionist and an entrepreneur. He wasn’t afraid to take a risk and used to say that as long as we ‘get more right than we get wrong, we will be okay’.",
      by: "James Smith, Managing Director",
    },
  },
  {
    slug: "100-recycled-plastic-bottle-trials",
    title: "100% recycled plastic bottle trials",
    date: "2024-07-15",
    category: "Sustainability",
    excerpt: "We have successfully trialled a new super-light bottle made from 100% recycled plastic.",
    body: [
      "As part of our commitment to a circular economy, we have successfully trialled our new super-light bottle made from 100% recycled plastic (rPET).",
      "A slight opaque colour can be seen, but the bottle performed perfectly and went to market with no negative customer feedback. Watch this space for more developments.",
    ],
  },
  {
    slug: "sport-sponsorship",
    title: "Sport sponsorship",
    date: "2024-07-15",
    category: "Community",
    excerpt: "Proud water sponsor of Huddersfield Giants Rugby League and Huddersfield Town Football Club.",
    body: [
      "Shepley Spring is a proud water sponsor of Huddersfield Giants Rugby League and Huddersfield Town Football Club.",
      "Ice Valley is the official water of Huddersfield Town Football Club, and White Rock is the official water of the Huddersfield Giants.",
    ],
  },
  {
    slug: "air-ambulance-sponsorship",
    title: "Air ambulance sponsorship",
    date: "2024-07-15",
    category: "Community",
    excerpt: "A proud, long-standing sponsor of the Yorkshire Air Ambulance.",
    body: [
      "Shepley Spring is a proud, long-standing sponsor of the Yorkshire Air Ambulance. The charity saves lives across Yorkshire every day, and we are proud to support its cause.",
    ],
    link: { href: "https://www.yorkshireairambulance.org.uk", label: "Visit Yorkshire Air Ambulance" },
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
