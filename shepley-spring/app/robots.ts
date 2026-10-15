import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// The concept is kept out of search engines so it never competes with shepleyspring.co.uk.
// At launch, replace with `rules: { userAgent: "*", allow: "/" }`.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
