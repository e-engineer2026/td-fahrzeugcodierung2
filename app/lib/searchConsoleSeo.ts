import "server-only";
import { createSign } from "node:crypto";
import { SEO_ORIGIN } from "./indexNowConfig";

const property = process.env.GSC_SITE_URL ?? "sc-domain:td-fahrzeugcodierung.de";
export function searchConsoleConfigured() { return Boolean(process.env.GSC_SERVICE_ACCOUNT_EMAIL && process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY); }

async function accessToken(): Promise<string> {
  const email=process.env.GSC_SERVICE_ACCOUNT_EMAIL;
  const key=process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY;
  if(!email||!key) throw new Error("Search Console not configured");
  const now=Math.floor(Date.now()/1000);
  const encode=(value:unknown)=>Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned=encode({alg:"RS256",typ:"JWT"})+"."+encode({iss:email,scope:"https://www.googleapis.com/auth/webmasters.readonly",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600});
  const signature=createSign("RSA-SHA256").update(unsigned).end().sign(key.replace(/\\n/g,"\n")).toString("base64url");
  const result=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:unsigned+"."+signature}),cache:"no-store",signal:AbortSignal.timeout(8000)});
  if(!result.ok) throw new Error("Search Console token failed");
  const data=await result.json() as {access_token?:string};
  if(!data.access_token) throw new Error("Search Console token missing");
  return data.access_token;
}
async function request<T>(url:string,token:string,body:unknown):Promise<T>{
  const response=await fetch(url,{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(8000)});
  if(!response.ok) throw new Error("Search Console API "+response.status);
  return response.json() as Promise<T>;
}
type Row={keys?:string[];clicks:number;impressions:number;ctr:number;position:number};
type Inspection={inspectionResult?:{indexStatusResult?:{verdict?:string;coverageState?:string;lastCrawlTime?:string;googleCanonical?:string}}};

export async function searchConsoleReport(inspectionUrl?:string){
  const token=await accessToken();
  // Recent complete reporting window; Google data can lag.
  const day=(offset:number)=>new Date(Date.now()-offset*86400000).toISOString().slice(0,10);
  const startDate=day(30),endDate=day(3);
  const base="https://searchconsole.googleapis.com/webmasters/v3/sites/"+encodeURIComponent(property)+"/searchAnalytics/query";
  const criteria={startDate,endDate,type:"web",dataState:"final"};
  const [total,queries]=await Promise.all([
    request<{rows?:Row[]}>(base,token,criteria),
    request<{rows?:Row[]}>(base,token,{...criteria,dimensions:["query"],rowLimit:10}),
  ]);
  let inspection: Inspection["inspectionResult"] | undefined;
  let inspectionFailed=false;
  if(inspectionUrl && new URL(inspectionUrl).origin===SEO_ORIGIN){
    try{inspection=(await request<Inspection>("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",token,{inspectionUrl,siteUrl:property,languageCode:"de-DE"})).inspectionResult;}catch{inspectionFailed=true;}
  }
  return {startDate,endDate,total:total.rows?.[0],queries:queries.rows??[],inspection,inspectionFailed};
}
