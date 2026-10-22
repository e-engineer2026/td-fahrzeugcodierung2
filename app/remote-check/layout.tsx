import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remote-Codierung prüfen | VCDS, VCP & OBD11 | TD Fahrzeugcodierung",
  description: "Remote-Codierung für VW, Audi, Škoda, SEAT und CUPRA vorprüfen: Fahrzeug, Baujahr, Diagnoseinterface und gewünschte Funktion angeben. Individuelle Machbarkeitsprüfung.",
  alternates: { canonical: "/remote-check" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
