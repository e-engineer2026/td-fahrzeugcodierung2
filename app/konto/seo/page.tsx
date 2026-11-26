import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isGuideAdmin } from "../../lib/guideAdmin";
import { shopDatabase } from "../../lib/guideShopDb";
import sitemap from "../../sitemap";
import { publishedGuideCatalog } from "../../lib/publishedGuideCatalog";
import { searchConsoleConfigured, searchConsoleReport } from "../../lib/searchConsoleSeo";
import {auditSeoUrls} from "../../lib/seoAudit";
import { SEO_ORIGIN, INDEXNOW_KEY_PATH } from "../../lib/indexNowConfig";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Interne SEO-Verwaltung",robots:{index:false,follow:false,noarchive:true}};
export default async function SeoAdmin({searchParams}:{searchParams:Promise<{url?:string|string[];audit?:string}>}){
  if(!(await isGuideAdmin())) notFound();
  const params=await searchParams;
  const urls=await sitemap();
  let published: Awaited<ReturnType<typeof publishedGuideCatalog>> | undefined;
  try { published=await publishedGuideCatalog(); } catch {}
  const known=new Set(urls.map(item=>item.url));
  const selected=typeof params.url==="string"&&known.has(params.url)?params.url:undefined;
  const sample=[SEO_ORIGIN,SEO_ORIGIN+"/codieranleitungen",SEO_ORIGIN+"/ratgeber", ...["/fahrzeuge/","/codieranleitungen/themen/","/codieranleitungen/vze-modelle/","/codieranleitungen/mqb-assistenten/","/codieranleitungen/dokument?","/ratgeber/"].flatMap(prefix=>urls.find(item=>item.url.startsWith(SEO_ORIGIN+prefix))?.url??[])].filter(url=>known.has(url));
  const audited=params.audit==="1"?await auditSeoUrls(selected?[selected,...sample]:sample):[];
  const gscConfigured=searchConsoleConfigured();
  let report:Awaited<ReturnType<typeof searchConsoleReport>>|undefined;
  if(gscConfigured){try{report=await searchConsoleReport(selected);}catch{}}
  let indexNow:{last_success_at?:unknown;last_count?:unknown;last_status?:unknown}|undefined;
  try{const sql=shopDatabase();const [row]=await sql`SELECT last_success_at,last_count,last_status FROM td_seo_indexnow_state WHERE id='primary'`;indexNow=row;}catch{}
  const metrics=[
    ["Sitemap-URLs",String(urls.length)],
    ["PDF-Produktseiten",published?String(published.links.length):"Nicht abrufbar"],
    ["Doppelte Sitemap-URLs",String(urls.length-known.size)],
    ["Geschützte API-/Konto-URLs",String(urls.filter(item=>/^\/(api|konto)(\/|$)/.test(new URL(item.url).pathname)).length)],
    ["Google-Klicks",report?String(report.total?.clicks??0):"Nicht verbunden"],
    ["Google-Impressionen",report?String(report.total?.impressions??0):"Nicht verbunden"],
  ];
  return <main className="container-x min-h-screen max-w-5xl py-10"><Link href="/konto" className="text-sm font-bold text-blue-700">← Mein Konto</Link>
  <h1 className="mt-4 text-3xl font-black">SEO-Verwaltung</h1>
  <p className="mt-2 text-sm text-slate-500">Sitemap, Veröffentlichung und Suchleistung. Die Zahl der Sitemap-URLs ist nicht die Zahl der indexierten Seiten.</p>
  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{metrics.map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-4 text-slate-950"><p className="text-xs text-slate-600">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>)}</div>
  {!published&&<p className="mt-3 text-amber-700">PDF-Veröffentlichungsstatus aktuell nicht abrufbar. Die Sitemap kann unvollständig sein.</p>}
  <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-950"><h2 className="text-lg font-bold">IndexNow</h2><p className="mt-2">Zeitplan: täglich · nur Produktionsumgebung. Cron-Zugang: {process.env.CRON_SECRET?"konfiguriert":"nicht konfiguriert"}.</p><p>Letzte erfolgreiche Meldung: {indexNow?.last_success_at?String(indexNow.last_success_at):"Noch keine bestätigt"}</p><p>Gemeldete URLs: {indexNow?.last_count===undefined?"—":String(indexNow.last_count)} · HTTP-Status: {indexNow?.last_status===undefined||indexNow.last_status===null?"—":String(indexNow.last_status)}</p><a className="text-blue-700 underline" href={INDEXNOW_KEY_PATH}>Öffentliche Schlüsseldatei</a></section>
  <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-950"><h2 className="text-lg font-bold">Google Search Console</h2>
  {!report?<p className="mt-2">{gscConfigured?"Zugriff oder API-Abfrage fehlgeschlagen. Berechtigung und Property prüfen.":"Noch nicht verbunden. Ein leseberechtigtes Google-Servicekonto und die Vercel-Umgebungsvariablen GSC_SERVICE_ACCOUNT_EMAIL und GSC_SERVICE_ACCOUNT_PRIVATE_KEY sind erforderlich."}</p>:<>
  <p className="mt-2 text-sm">{report.startDate} bis {report.endDate} · abgeschlossene Suchdaten</p>
  <p className="mt-2">CTR: {report.total? (report.total.ctr*100).toFixed(2)+" %":"—"} · Ø Position: {report.total?report.total.position.toFixed(1):"—"}</p>
  <h3 className="mt-4 font-bold">Suchanfragen</h3><div className="overflow-x-auto"><table className="mt-2 w-full text-sm"><thead><tr className="text-left"><th>Suchanfrage</th><th>Klicks</th><th>Impressionen</th></tr></thead><tbody>{report.queries.map(row=><tr key={row.keys?.join("|")}><td className="py-2">{row.keys?.[0]}</td><td>{row.clicks}</td><td>{row.impressions}</td></tr>)}</tbody></table></div>
  <form method="get" className="mt-6 flex flex-wrap gap-2"><label htmlFor="inspect" className="w-full font-bold">Einzelne URL im Google-Index prüfen</label><select id="inspect" name="url" defaultValue={selected??""} required className="max-w-full rounded-lg border p-2"><option value="">URL auswählen</option>{urls.map(item=><option key={item.url} value={item.url}>{item.url.replace(SEO_ORIGIN,"")||"/"}</option>)}</select><button className="rounded-lg bg-blue-700 px-4 py-2 font-bold text-white">Prüfen</button></form>
  {report.inspectionFailed&&<p className="mt-3">URL-Prüfung fehlgeschlagen.</p>}{report.inspection?.indexStatusResult&&<dl className="mt-3 text-sm"><dt>Indexstatus</dt><dd>{report.inspection.indexStatusResult.coverageState??report.inspection.indexStatusResult.verdict??"Unbekannt"}</dd><dt>Letzter Crawl</dt><dd>{report.inspection.indexStatusResult.lastCrawlTime??"Unbekannt"}</dd><dt>Google-Canonical</dt><dd className="break-all">{report.inspection.indexStatusResult.googleCanonical??"Unbekannt"}</dd></dl>}
  </>}
  <a href="https://search.google.com/search-console" className="mt-3 inline-block text-blue-700 underline">Search Console öffnen</a></section>
  <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-950"><h2 className="text-lg font-bold">URL-Verzeichnis</h2><p className="mt-2 text-sm">HTTP- und Metadatenprüfung der öffentlichen Hauptdomain, maximal zehn Seiten pro Stichprobe. Doppelte Inhalte erfordern eine separate Prüfung.</p>
  <form method="get" className="mt-3 flex flex-wrap gap-2"><input type="hidden" name="audit" value="1"/><select name="url" aria-label="URL zur SEO-Prüfung" className="max-w-full rounded-lg border p-2" defaultValue={selected??""}><option value="">Automatische Stichprobe</option>{urls.map(item=><option key={item.url} value={item.url}>{item.url.replace(SEO_ORIGIN,"")||"/"}</option>)}</select><button className="rounded-lg bg-blue-700 px-4 py-2 font-bold text-white">SEO-Prüfung ausführen</button></form>
  {audited.length>0&&<div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr><th>URL</th><th>HTTP</th><th>Titel</th><th>Beschreibung</th><th>Canonical</th><th>Noindex</th></tr></thead><tbody>{audited.map(row=><tr key={row.url} className="border-t"><td className="break-all py-2">{row.url.replace(SEO_ORIGIN,"")||"/"}</td><td>{row.status??row.error}</td><td>{row.title?(audited.filter(item=>item.title===row.title).length>1?"Doppelt":"OK"):"Fehlt"}</td><td>{row.description?"OK":"Fehlt"}</td><td>{row.canonical===row.url?"OK":"Abweichend"}</td><td>{row.noindex?"Ja":"Nein"}</td></tr>)}</tbody></table></div>}<Link className="text-blue-700 underline" href="/sitemap.xml">Sitemap öffnen</Link><details className="mt-3"><summary className="cursor-pointer">Alle {urls.length} URLs anzeigen</summary><ul className="mt-2 space-y-1 break-all text-sm">{urls.map(item=><li key={item.url}><a href={item.url} className="text-blue-700 underline">{item.url}</a></li>)}</ul></details></section></main>;
}
