import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/site-config";

const title = "3D Globe — South Pole | Moon PSR Explorer";
const description =
  "Interactive 3D Moon globe focused on the South Pole with PSR and ice-priority markers.";
const canonical = SITE_BASE_URL ? `${SITE_BASE_URL}/globe/south-pole` : undefined;

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical ? { canonical } : undefined,
  openGraph: { title, description, url: canonical, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title, description },
};

export default function SouthPoleLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
