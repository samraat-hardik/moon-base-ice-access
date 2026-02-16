import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/site-config";

const title = "Compare base sites | Moon PSR Explorer";
const description =
  "Compare two lunar base candidate sites by ice access score, PSR proximity, and Artemis III regions.";
const canonical = SITE_BASE_URL ? `${SITE_BASE_URL}/compare` : undefined;

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical ? { canonical } : undefined,
  openGraph: { title, description, url: canonical, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title, description },
};

export default function CompareLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
