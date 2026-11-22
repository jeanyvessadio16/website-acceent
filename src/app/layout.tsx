import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { rootMetadata, SITE_URL } from "@/lib/seo";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-LHX5D4CQ9T";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased overflow-x-hidden w-full max-w-full`}
    >
      <head>
        {/* hreflang — aide Google et les moteurs localisés à cibler la bonne audience */}
        <link rel="alternate" hrefLang="fr-SN" href={SITE_URL} />
        <link rel="alternate" hrefLang="fr-FR" href={SITE_URL} />
        <link rel="alternate" hrefLang="fr" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        {/* Déclaration explicite pour les crawlers IA */}
        <link rel="me" href="https://www.acceent.org" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden w-full max-w-full relative">
        <ThemeProvider nonce={nonce}>
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={GA_ID} nonce={nonce} />
    </html>
  );
}
