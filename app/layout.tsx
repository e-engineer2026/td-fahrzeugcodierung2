import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";

const siteUrl = "https://td-fahrzeugcodierung.vercel.app";
const gaId = "G-T8R5MJJW2P";

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
      <head>
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
            gtag('js', new Date());
            gtag('config', '${gaId}', { send_page_view: false });
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
