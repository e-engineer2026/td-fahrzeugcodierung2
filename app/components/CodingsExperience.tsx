"use client";

import { useState } from "react";
import { Gauge, Lightbulb, LockKeyhole, Palette, SlidersHorizontal } from "lucide-react";
import "./codings-experience.css";

function RearImage({ illuminated = false }: { illuminated?: boolean }) {
  return <div className={`experience-rear ${illuminated ? "is-lit" : ""}`} aria-hidden="true"><span className="experience-rear-light left" /><span className="experience-rear-light right" /></div>;
}

export default function CodingsExperience() {
  const [sweep, setSweep] = useState(0);
  const [lights, setLights] = useState(false);
  const [locked, setLocked] = useState(false);
  const [color, setColor] = useState("blue");
  const [compare, setCompare] = useState(50);
  return <section className="td-container experience" aria-labelledby="experience-title">
    <div className="experience-heading"><div><span className="experience-eyebrow">INTERAKTIV ENTDECKEN</span><h2 id="experience-title">Codierungen erleben.</h2><p>Tippe dich durch die Beispiele und entdecke, was dein Fahrzeug kann.</p></div><span className="experience-tag">5 Funktionen zum Ausprobieren</span></div>
    <div className="experience-grid">
      <article className="experience-card"><div className="experience-top"><span><Gauge size={18} /> COCKPIT</span><span>01</span></div><h3>Zeigertest</h3><p>Ein kurzer Ausschlag beim Einschalten der Zündung.</p><div className="experience-visual experience-dashboard" aria-label="Schematische Darstellung eines Kombiinstruments"><div className="experience-dial"><span>rpm</span><i key={`left-${sweep}`} className={sweep ? "sweep" : ""}/></div><div className="experience-digital"><small>TD</small><b>READY</b><small>ZEIGERTEST</small></div><div className="experience-dial"><span>km/h</span><i key={`right-${sweep}`} className={sweep ? "sweep" : ""}/></div></div><button type="button" className="experience-button" onClick={() => setSweep(n => n + 1)}>Zeigertest starten <span>↗</span></button></article>
      <article className="experience-card"><div className="experience-top"><span><Lightbulb size={18} /> LICHT</span><span>02</span></div><h3>Heckleuchten mit TFL</h3><p>Sieh dir die Lichtwirkung beispielhaft an.</p><div className="experience-visual"><RearImage illuminated={lights}/><span className="experience-badge">{lights ? "Licht an" : "Licht aus"}</span></div><button type="button" className="experience-button" aria-pressed={lights} onClick={() => setLights(v => !v)}>{lights ? "Heckleuchten ausschalten" : "Heckleuchten einschalten"}<span>{lights ? "●" : "○"}</span></button></article>
      <article className="experience-card"><div className="experience-top"><span><LockKeyhole size={18} /> KOMFORT</span><span>03</span></div><h3>Spiegel anklappen</h3><p>Ein Tastendruck zeigt den Unterschied.</p><div className={`experience-visual experience-mirror ${locked ? "is-closed" : ""}`} role="img" aria-label={locked ? "Beispielbild: Spiegel angeklappt" : "Beispielbild: Spiegel ausgeklappt"}><span className="experience-badge">{locked ? "Verriegelt" : "Entriegelt"}</span></div><button type="button" className="experience-button" aria-pressed={locked} onClick={() => setLocked(v => !v)}>{locked ? "Fahrzeug entriegeln" : "Fahrzeug verriegeln"}<span>⌁</span></button></article>
      <article className="experience-card"><div className="experience-top"><span><Palette size={18} /> INNENRAUM</span><span>04</span></div><h3>Ambientebeleuchtung</h3><p>Wähle deine Lieblingsfarbe für den Innenraum.</p><div className={`experience-visual experience-ambient is-${color}`} role="img" aria-label={`Beispiel für Ambientebeleuchtung: ${color === "blue" ? "Blau" : color === "red" ? "Rot" : "Weiß"}`}><span className="experience-badge">FARBE WÄHLEN</span><span className="experience-color-overlay"/></div><div className="experience-colors" role="group" aria-label="Farbe der Ambientebeleuchtung">{[["blue","Blau"],["red","Rot"],["white","Weiß"]].map(([value,label]) => <button key={value} type="button" className={`experience-swatch is-${value}`} aria-label={label} aria-pressed={color === value} onClick={() => setColor(value)} />)}<span>{color === "blue" ? "Blau" : color === "red" ? "Rot" : "Weiß"}</span></div></article>
      <article className="experience-card experience-compare-card"><div className="experience-top"><span><SlidersHorizontal size={18} /> DIREKTVERGLEICH</span><span>05</span></div><h3>Vorher und nachher</h3><p>Bewege den Regler und vergleiche die Lichtwirkung.</p><div className="experience-visual experience-compare"><RearImage/><div className="experience-compare-on" style={{clipPath:`inset(0 ${100-compare}% 0 0)`}}><RearImage illuminated /></div><span className="experience-compare-line" style={{left:`${compare}%`}}/><span className="experience-label before">NACHHER</span><span className="experience-label after">VORHER</span></div><label className="experience-range"><span className="sr-only">Vorher und Nachher vergleichen</span><input type="range" min="0" max="100" value={compare} onChange={e => setCompare(Number(e.target.value))}/></label></article>
    </div><p className="experience-note">Die Darstellungen sind illustrative Beispiele. Ob eine Funktion möglich ist, hängt von Fahrzeug, Ausstattung und Softwarestand ab.</p>
  </section>;
}
