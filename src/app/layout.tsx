import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE_BASE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

const title = "Water Ice & PSR Explorer | Lunar Base ISRU";
const canonical = SITE_BASE_URL ? `${SITE_BASE_URL}/` : undefined;

export const metadata: Metadata = {
  title,
  description: SITE_DESCRIPTION,
  metadataBase: SITE_BASE_URL ? new URL(SITE_BASE_URL) : undefined,
  alternates: canonical ? { canonical } : undefined,
  openGraph: {
    type: "website",
    title,
    description: SITE_DESCRIPTION,
    url: canonical,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE_DESCRIPTION,
  },
};

function JsonLdScript() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_BASE_URL || undefined,
    applicationCategory: "EducationalApplication",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <JsonLdScript />
        <header className="sticky top-0 z-10 border-b border-white/10 bg-lunar-surface/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between shrink-0">
          <Link href="/" className="text-lg font-bold text-white hover:text-lunar-ice transition-colors duration-200">
            Moon PSR Explorer
          </Link>
          <Nav />
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}
