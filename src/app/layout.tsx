
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { rootMetadata, SITE_URL } from "@/lib/seo";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased overflow-x-hidden w-full max-w-full`}>
      <head>
        {/* hreflang — aide Google et les moteurs localisés à cibler la bonne audience */}
        <link rel="alternate" hrefLang="fr-SN" href={SITE_URL} />
        <link rel="alternate" hrefLang="fr-FR" href={SITE_URL} />
        <link rel="alternate" hrefLang="fr" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        {/* Déclaration explicite pour les crawlers IA */}
        <link rel="me" href="https://acceent.org" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden w-full max-w-full relative">
        {children}
      </body>
      <GoogleAnalytics gaId="G-LHX5D4CQ9T" />
    </html>
  );
}
