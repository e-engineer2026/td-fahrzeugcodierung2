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
        <ul className="divide-y">{guides.map((guide) => <li className="py-4" key={guide.sku}>
          <h3 className="font-bold">{guide.title}</h3>
          <p>{guide.tool} · {guide.scope}</p>
          <a className="underline" href={`/konto/anleitungen?sku=${guide.sku}`}>Mit PayPal kaufen · {(guide.cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</a>
        </li>)}</ul>}
    </section>}
  </>;
}
