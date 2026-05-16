import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ACCEENT - Education, Entreprenariat et numérique ",
    template: "%s | ACCEENT",
  },
  description:
    "ACCEENT est une association sénégalaise basée à Ziguinchor dans le quartier de Santhiaba. ACCEENT oeuvre dans les domaines de l'éducation, l'entreprenariat et le numérique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Header */}
        <Header />
        <main>{children}</main>
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
