import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Remote-Zahlung | TD Fahrzeugcodierung" },
  description: "Zahlungsübersicht für bereits abgestimmte Remote-Aufträge bei TD Fahrzeugcodierung.",
  robots: { index: false, follow: false },
};

export default function ZahlungLayout({ children }: { children: React.ReactNode }) {
  return children;
}
