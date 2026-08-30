import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";

const siteUrl = "https://td-fahrzeugcodierung.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VAG Codierung Leipzig & Remote | TD Fahrzeugcodierung",
    template: "%s | TD Fahrzeugcodierung",
  },
  description:
    "VAG Codierung und Fahrzeugdiagnose für VW, Audi, SEAT, CUPRA und Škoda in Leipzig-Süd oder per Remote. Preise direkt berechnen und Termin online buchen.",
  keywords: [
    "VAG Codierung Leipzig",
    "Fahrzeugcodierung Leipzig",
    "VCDS Codierung Leipzig",
    "Remote Codierung VAG",
    "VW Codierung",
    "Audi Codierung",
    "Škoda Codierung",
    "SEAT Codierung",
    "CUPRA Codierung",
    "Fahrzeugdiagnose Leipzig",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "TD Fahrzeugcodierung",
    title: "VAG Codierung Leipzig & Remote | TD Fahrzeugcodierung",
    description:
      "Codierung und Diagnose für VW, Audi, SEAT, CUPRA und Škoda – persönlich in Leipzig-Süd oder per Remote.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: "/td-logo-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
