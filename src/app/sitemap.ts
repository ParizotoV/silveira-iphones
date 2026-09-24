import type { MetadataRoute } from "next";
import { getProducts } from "@/data/repository";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/iphones"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...products.map((p) => ({
      url: absoluteUrl(`/iphones/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/sobre"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contato"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
