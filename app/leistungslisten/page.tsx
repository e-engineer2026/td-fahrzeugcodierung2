import Link from "next/link";
import { vehicles } from "../data/catalog";
import { resolveHomeVehicleSelection } from "../lib/homeVehicleSelection";
import Results from "./Results";
import "../redesign.css";

export const metadata = { title: "Leistungslisten | TD Fahrzeugcodierung" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const initial = resolveHomeVehicleSelection(await searchParams, vehicles);
  return <main className="td-home"><div className="td-container py-8">
    <Link href="/#fahrzeugauswahl">← Zur Hauptseite</Link>
    <h1 className="my-6 text-3xl font-bold">Nachrüstungen und Codierfunktionen</h1>
    <Results initial={initial} />
  </div></main>;
}
