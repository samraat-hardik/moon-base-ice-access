import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/site-config";

const title = "South Pole regions | Moon PSR Explorer";
const description =
  "Sortable list of lunar South Pole PSRs and Artemis III candidate landing regions.";
const canonical = SITE_BASE_URL ? `${SITE_BASE_URL}/regions` : undefined;

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical ? { canonical } : undefined,
  openGraph: { title, description, url: canonical, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title, description },
};

export default function RegionsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
