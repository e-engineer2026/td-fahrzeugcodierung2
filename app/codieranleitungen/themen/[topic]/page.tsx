import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { seoTopics, matchingTopicLinks, topicHref } from "../../../lib/seoTopics";
import { publishedGuideCatalog } from "../../../lib/publishedGuideCatalog";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}:{params:Promise<{topic:string}>}):Promise<Metadata>{
  const {topic:slug}=await params;
  const topic=seoTopics.find(item=>item.slug === slug);
  if(!topic) return {robots:{index:false}};
  return {title:topic.title+" | PDF-Anleitungen",description:topic.description,alternates:{canonical:topicHref(topic.slug)},robots:{index:true,follow:true}};
}
export default async function TopicPage({params}:{params:Promise<{topic:string}>}){
  const {topic:slug}=await params;
  const topic=seoTopics.find(item=>item.slug===slug);
  if(!topic) notFound();
  let links: Awaited<ReturnType<typeof publishedGuideCatalog>>["links"] = [];
  let failed=false;
  try { links=matchingTopicLinks(topic,(await publishedGuideCatalog()).links); } catch { failed=true; }
  return <main className="min-h-screen bg-slate-50 text-slate-950"><article className="container-x max-w-5xl py-10 sm:py-14">
    <nav className="text-sm text-blue-700"><Link href="/codieranleitungen">PDF-Anleitungen</Link> / Themen</nav>
    <h1 className="mt-4 text-3xl font-black">{topic.title}</h1>
    <p className="mt-3 text-lg text-slate-700">{topic.description}</p>
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">Voraussetzungen und technische Hinweise</h2><p className="mt-2 leading-7">{topic.body}</p><p className="mt-3 text-sm text-slate-600">Die konkrete Hardware, Software und Freigabe am Fahrzeug prüfen. Die Anleitungen richten sich an qualifizierte Fachkräfte.</p><Link className="mt-4 inline-block font-semibold text-blue-700" href={topic.service}>Persönliche Prüfung und Codierdienstleistung</Link></section>
    <h2 className="mt-8 text-xl font-bold">Veröffentlichte passende PDF-Anleitungen</h2>
    {links.length ? <ul className="mt-3 grid gap-2 sm:grid-cols-2">{links.map(link=><li key={link.href}><Link className="block rounded-lg border border-slate-200 bg-white p-3 font-medium text-blue-800 hover:underline" href={link.href}>{link.title}</Link></li>)}</ul> : <p className="mt-3 text-slate-600">{failed?"Der Veröffentlichungsstatus konnte aktuell nicht geladen werden.":"Keine eindeutig zugeordneten Anleitungen in dieser Themenliste. Die Fahrzeugauswahl zeigt weitere veröffentlichte Dokumente."}</p>}
    <Link href="/codieranleitungen" className="mt-6 inline-block font-bold text-blue-700">Alle PDF-Anleitungen nach Fahrzeug</Link>
    <h2 className="mt-10 text-lg font-bold">Weitere Themen</h2><ul className="mt-3 grid gap-2 sm:grid-cols-2">{seoTopics.filter(item=>item.slug!==slug).map(item=><li key={item.slug}><Link className="text-blue-700 hover:underline" href={topicHref(item.slug)}>{item.title}</Link></li>)}</ul>
    <Link href="/ratgeber" className="mt-5 inline-block text-blue-700">Zum Ratgeber</Link>
  </article></main>;
}
