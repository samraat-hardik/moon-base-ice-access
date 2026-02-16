import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/site-config";

const title = "About | Moon PSR Explorer";
const description =
  "Mission context, data sources, and glossary for the Water Ice & PSR Explorer — lunar South Pole and Artemis/ISRU planning.";
const canonical = SITE_BASE_URL ? `${SITE_BASE_URL}/about` : undefined;

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical ? { canonical } : undefined,
  openGraph: { title, description, url: canonical, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title, description },
};

export default function AboutLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
