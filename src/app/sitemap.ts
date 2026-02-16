import { SITE_BASE_URL } from "@/lib/site-config";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_BASE_URL || "https://example.com";
  const routes = ["", "/about", "/compare", "/regions", "/globe", "/globe/south-pole"];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
