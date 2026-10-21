"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function HomeMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  return <div className="td-mobile-navigation">
    <button type="button" aria-label={open ? "Menü schließen" : "Menü öffnen"} aria-expanded={open} aria-controls="home-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav id="home-mobile-menu" aria-label="Mobile Navigation" onClick={() => setOpen(false)}>
      <a href="#fahrzeugauswahl">Fahrzeug auswählen</a>
      <a href="#leistungen">Leistungen</a>
      <a href="#praxis">Einblicke &amp; Arbeitsweise</a>
      <a href="#ablauf">So funktioniert’s</a>
      <a href="#vorbereitung">Termin vorbereiten</a>
      <Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link>
      <a href="#kontakt">Kontakt</a>
      <Link href="/sign-in?redirect_url=%2Fkonto">Mein Konto / Anmelden</Link>
    </nav>}
  </div>;
}
