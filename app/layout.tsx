import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";
import "./booking-overrides.css";

const siteUrl = "https://td-fahrzeugcodierung.vercel.app";
const gaId = "G-T8R5MJJW2P";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: "TD Fahrzeugcodierung",
      url: siteUrl,
      logo: `${siteUrl}/td-logo-icon.png`,
      description:
        "VAG Fahrzeugcodierung und Fahrzeugdiagnose für Volkswagen, Audi, SEAT, CUPRA und Škoda – persönlich in Leipzig-Süd oder per Remote.",
      telephone: "+4915563047044",
      email: "td.codierung@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Schenkendorfstraße 33",
        postalCode: "04275",
        addressLocality: "Leipzig",
        addressCountry: "DE",
      },
      areaServed: [
        { "@type": "City", name: "Leipzig" },
        { "@type": "Country", name: "Deutschland" },
      ],
      knowsAbout: [
        "VAG Fahrzeugcodierung",
        "Fahrzeugdiagnose",
        "VCDS",
        "VCP",
        "Remote-Codierung",
        "Volkswagen",
        "Audi",
        "SEAT",
        "CUPRA",
        "Škoda",
      ],
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#vehicle-coding-service`,
      name: "VAG Fahrzeugcodierung und Diagnose",
      serviceType: [
        "Fahrzeugcodierung",
        "Fahrzeugdiagnose",
        "Remote-Codierung",
      ],
      provider: { "@id": `${siteUrl}/#business` },
      url: siteUrl,
      areaServed: [
        { "@type": "City", name: "Leipzig" },
        { "@type": "Country", name: "Deutschland" },
      ],
    },
  ],
};

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
    <html lang="de" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
