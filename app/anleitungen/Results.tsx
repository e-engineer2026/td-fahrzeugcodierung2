"use client";

import { useState } from "react";
import HomeVehicleFinder from "../components/HomeVehicleFinder";
import type { HomeVehicleSelection } from "../lib/homeVehicleSelection";
import { guidesForVehicle } from "./guides";

export default function Results({ initial }: { initial: HomeVehicleSelection | null }) {
  const [vehicle, setVehicle] = useState(initial);
  const guides = vehicle?.year ? guidesForVehicle(vehicle) : [];
  return <>
    <HomeVehicleFinder initial={initial} onFilter={setVehicle} guides />
    {!!vehicle?.year && <section className="my-8" aria-live="polite">
      <h2 className="mb-4 text-2xl font-bold">{vehicle.brand} {vehicle.model} · {vehicle.year}</h2>
      {guides.length === 0 ? <p>Für diese Auswahl sind noch keine PDF-Anleitungen hinterlegt.</p> :
        <ul className="divide-y">{guides.map((guide) => <li className="py-4" key={guide.pdf}>
          <h3 className="font-bold"><a className="underline" href={guide.pdf}>{guide.title}</a></h3>
          <p>{guide.tool} · {guide.scope}</p>
          <a href={guide.pdf} download aria-label={guide.title + " als PDF herunterladen"}>PDF herunterladen</a>
        </li>)}</ul>}
    </section>}
  </>;
}
