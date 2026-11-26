import "server-only";
import { SEO_ORIGIN } from "./indexNowConfig";

export type SeoAuditRow={url:string;status:number|null;title:string;description:string;canonical:string;noindex:boolean;error?:string};
function attr(tag:string,name:string){return tag.match(new RegExp("\\b"+name+"\\s*=\\s*([\"'])(.*?)\\1","i"))?.[2]??"";}
const decode=(value:string)=>value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
export async function auditSeoUrls(urls:string[]):Promise<SeoAuditRow[]>{
 return Promise.all([...new Set(urls)].slice(0,10).map(async url=>{
  const empty={url,status:null,title:"",description:"",canonical:"",noindex:false};
  try{
   if(new URL(url).origin!==SEO_ORIGIN)return {...empty,error:"Unzulässige URL"};
   const res=await fetch(url,{redirect:"manual",cache:"no-store",signal:AbortSignal.timeout(6000),headers:{"User-Agent":"TD-SEO-Check/1.0"}});
   if(!res.ok)return {...empty,status:res.status,error:"HTTP "+res.status};
   if(!res.headers.get("content-type")?.includes("text/html"))return {...empty,status:res.status,error:"Keine HTML-Seite"};
   const html=await res.text();
   const metas=html.match(/<meta\b[^>]*>/gi)??[];
   const links=html.match(/<link\b[^>]*>/gi)??[];
   const title=decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()??"");
   const description=decode(attr(metas.find(tag=>attr(tag,"name").toLowerCase()==="description")??"","content"));
   const canonical=decode(attr(links.find(tag=>attr(tag,"rel").toLowerCase()==="canonical")??"","href"));
   const robots=metas.filter(tag=>["robots","googlebot"].includes(attr(tag,"name").toLowerCase())).map(tag=>attr(tag,"content")).join(" ")+(res.headers.get("x-robots-tag")??"");
   return {url,status:res.status,title,description,canonical,noindex:/\bnoindex\b/i.test(robots)};
  }catch{return {...empty,error:"Abruf fehlgeschlagen"};}
 }));
}
