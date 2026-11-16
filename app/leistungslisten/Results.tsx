"use client";

import { useState } from "react";
import HomeVehicleFinder from "../components/HomeVehicleFinder";
import type { HomeVehicleSelection } from "../lib/homeVehicleSelection";
import data from "./a4.json";

function List({ title, rows }: { title: string; rows: string[][] }) {
  return <section className="my-6"><h3 className="mb-2 text-xl font-bold">{title}</h3>
    <dl className="divide-y">{rows.map(([name, detail]) => <div className="py-3" key={name}>
      <dt className="font-bold">{name}</dt><dd>{detail}</dd></div>)}</dl></section>;
}

export default function Results({ initial }: { initial: HomeVehicleSelection | null }) {
  const [selection, select] = useState(initial);
  const [transition, choose] = useState("");
  const supported = selection?.brand === "Audi" && /\bA4\b/i.test(selection.model) && /\b(B9|8W)\b/i.test(selection.model);
  const year = selection?.year ?? 0;
  const generation = year === 2019 ? transition : year >= 2020 ? "fl" : "pre";
  return <>
    <HomeVehicleFinder initial={initial} onFilter={(next) => {
      if (next.year !== year || next.model !== selection?.model) choose("");
      select(next);
    }} />
    {!!year && <div className="mt-8" aria-live="polite">
      {!supported ? <p>Für dieses Fahrzeug liegt noch keine Leistungsliste vor.</p> : <>
        {year === 2019 && <label>Modellstand für Baujahr 2019
          <select className="ml-2" value={transition} onChange={(event) => choose(event.target.value)}>
            <option value="">Modellstand wählen</option><option value="pre">Vorfacelift bis MJ 2019</option>
            <option value="fl">Facelift ab MJ 2020</option></select></label>}
        {generation && <>
          <h2 className="my-4 text-2xl font-bold">Audi A4 8W · {generation === "fl" ? "Facelift" : "Vorfacelift"} · {year}</h2>
          {selection?.mode === "onsite" && <List title="Nachrüstungen" rows={data.retro} />}
          {year >= 2023 && selection?.mode === "onsite" && <p>Für einzelne Einparkhilfe-Pakete gelten ab Modelljahr 2023 Einschränkungen nach PR-Code.</p>}
          <List title="Funktionen codieren" rows={[...(generation === "fl" ? data.fl : data.pre), ...data.shared]} />
          <a className="underline" download href="/downloads/TD_Audi_A4_8W_Leistungslisten.pdf">Passwortgeschützte PDF für Vorfacelift und Facelift herunterladen</a>
        </>}
      </>}
    </div>}
  </>;
}
