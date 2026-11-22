import type { Metadata } from "next";
import GuideCatalogPage from "../components/GuideCatalogPage";
import GuideSelector from "../components/GuideSelector";

export const metadata: Metadata = {
  title: "Professionelle Codier-PDF-Anleitungen | TD Fahrzeugcodierung",
  description: "Professionelle VAG-Codieranleitungen mit Angaben zu geeignetem Interface und Hardwarevoraussetzungen. Für qualifizierte Fachkräfte.",
  alternates: { canonical: "/codieranleitungen" },
  // Erst indexieren, wenn die ersten tatsächlich kaufbaren PDFs bereitstehen.
  robots: { index: false, follow: true },
};

export default function CodieranleitungenPage() {
  return <GuideCatalogPage>
    <section className="container-x py-5 sm:py-7" aria-label="Anleitung und Fahrzeug auswählen">
      <GuideSelector />
    </section>
  </GuideCatalogPage>;
}
