import type { MetadataRoute } from "next";
import { articles } from "@/lib/news";
import { site } from "@/lib/site";

const pages = [
  "", "/about", "/own-label", "/brands", "/brands/ice-valley", "/brands/white-rock", "/sustainability",
  "/sustainability/tethered-caps", "/people", "/careers", "/careers/vacancies", "/news", "/community", "/contact",
  "/privacy-policy", "/cookies-policy", "/modern-slavery-statement",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: (p === "" || p.startsWith("/news") || p.startsWith("/careers") ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: p === "" ? 1 : p === "/own-label" || p === "/brands" ? 0.9 : 0.6,
    })),
    ...articles.map((a) => ({ url: `${site.url}/news/${a.slug}`, lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
