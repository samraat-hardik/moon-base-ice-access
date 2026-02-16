/** Base URL for canonical, OG, sitemap. Set NEXT_PUBLIC_APP_URL in production. */
export const SITE_BASE_URL =
  typeof process.env.NEXT_PUBLIC_APP_URL === "string" && process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
    : typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "";

export const SITE_NAME = "Moon PSR Explorer";
export const SITE_DESCRIPTION =
  "Explore lunar South Pole PSRs and ice access for SpaceX Starship base siting and ISRU planning.";
