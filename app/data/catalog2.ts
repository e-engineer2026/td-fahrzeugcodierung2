import { ascodingCodingNames, ascodingModelCodings } from "./ascoding";

export type Coding = {
  id: string;
  name: string;
  price: number;
  category: "Standard-Codierungen" | "Assistenzsysteme";
  interfaceInfo?: string;
  hardware?: string;
  requirements?: string;
  sourceUrl?: string;
};

export type Platform = "PQ35" | "PQ46" | "PQ26" | "MQB" | "MQBevo" | "MLB" | "MLBevo" | "MEB" | "T5" | "PL71" | "PQ25";

export type Vehicle = {
  brand: string;
  model: string;
  startYear: number;
  endYear: number;
  platform: Platform;
  sfd1From?: number;
  sourceUrl?: string;
};

function priceForName(name:string):number {
  const n=name.toLowerCase();

  // Assistenz / höherer Aufwand
  if(n.includes("verkehrszeichen")) return 59;
  if(n.includes("fernlichtassistent")) return 59;
  if(n.includes("lane assist")) return 49;
  if(n.includes("acc ") || n.startsWith("acc")) return 59;
  if(n.includes("rückfahrkamera")) return 49;
  if(n.includes("anhängerkupplung")) return 49;
  if(n.includes("prädiktiven effizienzassistent")) return 59;
  if(n.includes("surround-view")) return 49;

  // Infotainment / Komfort mit mehreren Steuergeräten
  if(n.includes("wireless carplay") || n.includes("carplay / android auto")) return 49;
  if(n.includes("hidden menu") || n.includes("developer mode")) return 25;
  if(n.includes("drive select") || n.includes("fahrprofilauswahl")) return 39;
  if(n.includes("ambientebeleuchtung plus")) return 39;
  if(n.includes("ambientebeleuchtung")) return 29;
  if(n.includes("easy entry")) return 29;
  if(n.includes("elektrische heckklappe") || n.includes("heckklappe per")) return 35;
  if(n.includes("spiegelanklappen")) return 29;
  if(n.includes("elektrisch anklappbare spiegel")) return 29;
  if(n.includes("spiegelabsenkung") || n.includes("bordsteinautomatik")) return 25;
  if(n.includes("reifendruckkontrolle")) return 25;
  if(n.includes("optische anzeige der einparkhilfe")) return 35;
  if(n.includes("einparkhilfe")) return 25;
  if(n.includes("soundaktor")) return 25;
  if(n.includes("batterie nach") || n.includes("batterie anlernen")) return 29;
  if(n.includes("scheinwerferreinigungsanlage")) return 25;

  // Fahrdynamik / Komfort
  if(n.includes("start-stopp")) return 29;
  if(n.includes("xds")) return 25;
  if(n.includes("berganfahrassistent")) return 25;
  if(n.includes("bremsscheibentrocknung")) return 25;
  if(n.includes("esc sport")) return 25;
  if(n.includes("lenkungskennlinie")) return 25;
  if(n.includes("regenschliessen")) return 29;
  if(n.includes("fussraumbeleuchtung")) return 25;
  if(n.includes("sitzheizung")) return 25;
  if(n.includes("offroad-anzeige")) return 25;
  if(n.includes("fahrschulmodus")) return 25;

  // Einfache Anpassungen
  if(n.includes("zeigertest") || n.includes("staging")) return 15;
  if(n.includes("gurtwarner")) return 15;
  if(n.includes("nachtankmenge")) return 15;
  if(n.includes("öltemperatur") || n.includes("laptimer") || n.includes("rundenzähler")) return 19;
  if(n.includes("auto-lock") || n.includes("auto-unlock")) return 15;
  if(n.includes("komfortblinken")) return 15;
  if(n.includes("coming home") || n.includes("leaving home")) return 19;
  if(n.includes("tagfahrlicht")) return 19;
  if(n.includes("heckleuchten")) return 19;
  if(n.includes("tränenwischen") || n.includes("heckwischer")) return 15;
  if(n.includes("komfortöffnung") || n.includes("komfortschliessung") || n.includes("fenster per")) return 19;
  if(n.includes("akustische quittierung") || n.includes("hornquittierung")) return 19;
  if(n.includes("ganganzeige")) return 15;
  if(n.includes("startlogo") || n.includes("tacho-darstellung") || n.includes("skin der")) return 19;
  if(n.includes("verbrauchsanzeige")) return 19;

  return 25;
}

function categoryForName(name:string):Coding["category"] {
  const n=name.toLowerCase();
  return ["verkehrszeichen","lane assist","fernlichtassistent","acc ","rückfahrkamera","effizienzassistent","surround-view"]
    .some(k=>n.includes(k)) ? "Assistenzsysteme" : "Standard-Codierungen";
}

const sourceCodings:Coding[] = ascodingCodingNames.map((name,index)=>(
  {
    id:`asc-${index+1}`,
    name,
    price:priceForName(name),
    category:categoryForName(name),
    interfaceInfo:"VCDS; je nach Steuergerät/Softwarestand ggf. VCP oder ODIS nach Vorprüfung",
    requirements:"Verfügbarkeit abhängig von Ausstattung, Modelljahr, Steuergerät, Softwarestand und vorhandener Hardware."
  }
));

const idByName = new Map(sourceCodings.map(c=>[c.name,c.id]));

export const codingCatalog:Coding[] = [
  {id:"diagnose",name:"Fehlerdiagnose Steuergeräte",price:39,category:"Standard-Codierungen",interfaceInfo:"VCDS / VCP / OBD11 – abhängig vom Fahrzeug",requirements:"Fehlerspeicher auslesen, Steuergeräte prüfen und Fehlerbild vorbewerten."},
  ...sourceCodings,
];

const A="https://www.ascoding.ch";

export const vehicles:Vehicle[] = [
  // Volkswagen
  {brand:"Volkswagen",model:"Polo 6R",startYear:2009,endYear:2017,platform:"PQ25",sourceUrl:`${A}/vw-polo-6r/`},
  {brand:"Volkswagen",model:"Polo AW",startYear:2017,endYear:2026,platform:"MQB",sourceUrl:`${A}/vw-polo-aw/`},
  {brand:"Volkswagen",model:"Golf Plus 5M",startYear:2005,endYear:2014,platform:"PQ35",sourceUrl:`${A}/vw-golf-plus-5m/`},
  {brand:"Volkswagen",model:"Golf 5 (1K)",startYear:2003,endYear:2008,platform:"PQ35",sourceUrl:`${A}/tag/vw-golf-5-1k/`},
  {brand:"Volkswagen",model:"Golf 6 (1K)",startYear:2008,endYear:2012,platform:"PQ35",sourceUrl:`${A}/vw-golf-5-6-1k/`},
  {brand:"Volkswagen",model:"Golf 7 (5G)",startYear:2012,endYear:2020,platform:"MQB",sourceUrl:`${A}/codierungen-fuer-vw-golf-7/`},
  {brand:"Volkswagen",model:"Golf 8 (CD)",startYear:2019,endYear:2026,platform:"MQBevo",sfd1From:2019,sourceUrl:`${A}/vw-golf-8/`},
  {brand:"Volkswagen",model:"Passat B6 (3C)",startYear:2005,endYear:2010,platform:"PQ46",sourceUrl:`${A}/vw-passat-b6-c3/`},
  {brand:"Volkswagen",model:"Passat B7 (3C)",startYear:2010,endYear:2014,platform:"PQ46",sourceUrl:`${A}/vw-passat-b7/`},
  {brand:"Volkswagen",model:"Passat B8 (3G)",startYear:2014,endYear:2023,platform:"MQB",sourceUrl:`${A}/vw-passat-b8/`},
  {brand:"Volkswagen",model:"Passat B9",startYear:2023,endYear:2026,platform:"MQBevo",sfd1From:2023,sourceUrl:`${A}/vw-passat-b9/`},
  {brand:"Volkswagen",model:"T-Roc A11",startYear:2017,endYear:2026,platform:"MQB",sourceUrl:`${A}/vw-t-roc-a11/`},
  {brand:"Volkswagen",model:"Tiguan 5N",startYear:2007,endYear:2016,platform:"PQ35",sourceUrl:`${A}/vw-tiguan-1-5n/`},
  {brand:"Volkswagen",model:"Tiguan II (AD/BW)",startYear:2016,endYear:2023,platform:"MQB",sourceUrl:`${A}/codierungen-fuer-vw-tiguan-2-ad/`},
  {brand:"Volkswagen",model:"Touran 1T",startYear:2003,endYear:2015,platform:"PQ35",sourceUrl:`${A}/vw-touran-1-1t/`},
  {brand:"Volkswagen",model:"Touran 5T",startYear:2015,endYear:2026,platform:"MQB",sourceUrl:`${A}/codierungen-fuer-vw-touran-2-5t/`},
  {brand:"Volkswagen",model:"Touareg 7L",startYear:2002,endYear:2010,platform:"PL71",sourceUrl:`${A}/vw-touareg-1-7l/`},
  {brand:"Volkswagen",model:"Touareg 7P",startYear:2010,endYear:2018,platform:"MLB",sourceUrl:`${A}/vw-touareg-2-7p/`},
  {brand:"Volkswagen",model:"Transporter T5",startYear:2003,endYear:2015,platform:"T5",sourceUrl:`${A}/vw-transporter-t5/`},
  {brand:"Volkswagen",model:"Transporter T6",startYear:2015,endYear:2019,platform:"T5",sourceUrl:`${A}/vw-transporter-t6/`},
  {brand:"Volkswagen",model:"Transporter / Multivan T6.1",startYear:2019,endYear:2024,platform:"T5",sourceUrl:`${A}/vw-multivan-transporter-t6-1/`},

  // Audi
  {brand:"Audi",model:"A1 8X",startYear:2010,endYear:2018,platform:"PQ25",sourceUrl:`${A}/audi-a1-8x/`},
  {brand:"Audi",model:"A1 GB",startYear:2018,endYear:2026,platform:"MQB",sourceUrl:`${A}/audi-a1-gb/`},
  {brand:"Audi",model:"A3 / S3 8P",startYear:2003,endYear:2013,platform:"PQ35",sourceUrl:`${A}/audi-a3-8p/`},
  {brand:"Audi",model:"A3 / S3 8V",startYear:2012,endYear:2020,platform:"MQB",sourceUrl:`${A}/audi-a3-8v/`},
  {brand:"Audi",model:"A3 / S3 8Y",startYear:2020,endYear:2026,platform:"MQBevo",sfd1From:2020,sourceUrl:`${A}/audi-a3-8y/`},
  {brand:"Audi",model:"A4 / S4 8K",startYear:2007,endYear:2015,platform:"MLB",sourceUrl:`${A}/audi-a4-8k/`},
  {brand:"Audi",model:"A4 / S4 B9",startYear:2015,endYear:2024,platform:"MLBevo",sourceUrl:`${A}/audi-a4-8w/`},
  {brand:"Audi",model:"A5 / S5 8T",startYear:2007,endYear:2016,platform:"MLB",sourceUrl:`${A}/audi-a5-8t/`},
  {brand:"Audi",model:"A5 / S5 F5",startYear:2016,endYear:2024,platform:"MLBevo",sourceUrl:`${A}/audi-a5-f5-3/`},
  {brand:"Audi",model:"A5 / S5 FU",startYear:2024,endYear:2026,platform:"MLBevo",sfd1From:2024,sourceUrl:`${A}/audi-a5-fu/`},
  {brand:"Audi",model:"A6 / S6 C6",startYear:2004,endYear:2011,platform:"MLB",sourceUrl:`${A}/audi-a6-c6/`},
  {brand:"Audi",model:"A6 / S6 C7",startYear:2011,endYear:2018,platform:"MLB",sourceUrl:`${A}/audi-a6-c7/`},
  {brand:"Audi",model:"A6 / S6 C8",startYear:2018,endYear:2026,platform:"MLBevo",sourceUrl:`${A}/audi-a6-c8/`},
  {brand:"Audi",model:"A7 / S7 4K",startYear:2018,endYear:2026,platform:"MLBevo",sourceUrl:`${A}/audi-a7-4k/`},
  {brand:"Audi",model:"A7 / S7 4G",startYear:2010,endYear:2018,platform:"MLB",sourceUrl:`${A}/audi-a7-4g/`},
  {brand:"Audi",model:"TT 8J",startYear:2006,endYear:2014,platform:"PQ35",sourceUrl:`${A}/audi-tt-8j/`},
  {brand:"Audi",model:"TT 8S",startYear:2014,endYear:2023,platform:"MQB",sourceUrl:`${A}/audi-tt-8s/`},
  {brand:"Audi",model:"Q3 8U",startYear:2011,endYear:2018,platform:"PQ35",sourceUrl:`${A}/audi-q3-8u/`},
  {brand:"Audi",model:"Q5 8R",startYear:2008,endYear:2017,platform:"MLB",sourceUrl:`${A}/audi-q5-8r/`},
  {brand:"Audi",model:"Q5 FY",startYear:2017,endYear:2024,platform:"MLBevo",sourceUrl:`${A}/audi-q5-fy-n/`},
  {brand:"Audi",model:"Q5 GU",startYear:2024,endYear:2026,platform:"MLBevo",sfd1From:2024,sourceUrl:`${A}/audi-q5-gu/`},
  {brand:"Audi",model:"Q7 4M",startYear:2015,endYear:2026,platform:"MLBevo",sourceUrl:`${A}/audi-q7-4m/`},
  {brand:"Audi",model:"Q7 4L",startYear:2005,endYear:2015,platform:"PL71",sourceUrl:`${A}/audi-q7-4l/`},
  {brand:"Audi",model:"Q8 4M",startYear:2018,endYear:2026,platform:"MLBevo",sourceUrl:`${A}/audi-q8-4m/`},
  {brand:"Audi",model:"e-tron GE",startYear:2018,endYear:2023,platform:"MLBevo",sourceUrl:`${A}/audi_etron/`},
  // Bestehende zusätzliche Modelle
  {brand:"Audi",model:"Q2 GA",startYear:2016,endYear:2026,platform:"MQB",sourceUrl:"https://wiki-online.vcds.de/de/Plattformen/MQB"},
  {brand:"Audi",model:"Q3 F3",startYear:2018,endYear:2026,platform:"MQB",sourceUrl:"https://wiki-online.vcds.de/de/Plattformen/MQB"},

  // Skoda
  {brand:"Škoda",model:"Octavia 2 1Z",startYear:2004,endYear:2013,platform:"PQ35",sourceUrl:`${A}/skoda-octavia-2-1z/`},
  {brand:"Škoda",model:"Octavia 3 5E",startYear:2012,endYear:2020,platform:"MQB",sourceUrl:`${A}/codierungen-fuer-skoda-octavia-3/`},
  {brand:"Škoda",model:"Octavia 3 5E Facelift",startYear:2017,endYear:2020,platform:"MQB",sourceUrl:`${A}/skoda-octavia-3-5e-facelift/`},
  {brand:"Škoda",model:"Octavia 4 NX",startYear:2020,endYear:2026,platform:"MQBevo",sfd1From:2020,sourceUrl:`${A}/skoda-octavia-4-nx/`},
  {brand:"Škoda",model:"Superb 2 3T",startYear:2008,endYear:2015,platform:"PQ46",sourceUrl:`${A}/skoda-superb-2-3t/`},
  {brand:"Škoda",model:"Superb 3V",startYear:2015,endYear:2024,platform:"MQB",sourceUrl:`${A}/skoda-superb-3v/`},
  {brand:"Škoda",model:"Fabia 2 5J",startYear:2007,endYear:2014,platform:"PQ25",sourceUrl:`${A}/skoda-fabia-2-5j/`},
  {brand:"Škoda",model:"Fabia 3 NJ",startYear:2014,endYear:2021,platform:"PQ26",sourceUrl:`${A}/skoda-fabia-3-nj/`},
  {brand:"Škoda",model:"Rapid NH bis MJ 2015",startYear:2012,endYear:2015,platform:"PQ25",sourceUrl:`${A}/skoda-rapid-nh-bis-mj-2015/`},
  {brand:"Škoda",model:"Rapid NH ab MJ 2016",startYear:2016,endYear:2019,platform:"PQ26",sourceUrl:`${A}/skoda-rapid-nh-ab-mj-2016/`},
  {brand:"Škoda",model:"Yeti 5L",startYear:2009,endYear:2017,platform:"PQ35",sourceUrl:`${A}/skoda-yeti-5l/`},
  {brand:"Škoda",model:"Kodiaq NS",startYear:2016,endYear:2024,platform:"MQB",sourceUrl:`${A}/skoda-kodiaq-ns/`},
  {brand:"Škoda",model:"Karoq NU",startYear:2017,endYear:2026,platform:"MQB",sourceUrl:`${A}/skoda-karoq-nu/`},
  {brand:"Škoda",model:"Kamiq NW",startYear:2019,endYear:2026,platform:"MQB",sourceUrl:`${A}/skoda-kamiq-nw/`},
  {brand:"Škoda",model:"Citigo AA",startYear:2011,endYear:2020,platform:"PQ25",sourceUrl:`${A}/skoda-citigo-aa/`},
  {brand:"Škoda",model:"Enyaq 5A",startYear:2020,endYear:2026,platform:"MEB",sfd1From:2020,sourceUrl:`${A}/skoda-enyaq-5a/`},

  // Seat / Cupra
  {brand:"SEAT / CUPRA",model:"SEAT Leon 5F",startYear:2012,endYear:2020,platform:"MQB",sourceUrl:`${A}/seat-leon-3-5f/`},
  {brand:"SEAT / CUPRA",model:"SEAT Ibiza KJ",startYear:2017,endYear:2026,platform:"MQB",sourceUrl:`${A}/seat-ibiza-5-kj/`},
  {brand:"SEAT / CUPRA",model:"SEAT Altea / Altea XL 5P",startYear:2004,endYear:2015,platform:"PQ35",sourceUrl:`${A}/seat-altea-altea-xl-5p/`},
  {brand:"SEAT / CUPRA",model:"SEAT Toledo 4 NH",startYear:2012,endYear:2019,platform:"PQ25",sourceUrl:`${A}/seat-toledo-4-nh/`},
  {brand:"SEAT / CUPRA",model:"SEAT Arona KJ7",startYear:2017,endYear:2026,platform:"MQB",sourceUrl:`${A}/seat-arona-kj7/`},
  {brand:"SEAT / CUPRA",model:"SEAT Tarraco KN2",startYear:2018,endYear:2024,platform:"MQB",sourceUrl:`${A}/seat-tarraco-kn2/`},
  {brand:"SEAT / CUPRA",model:"SEAT Mii AA",startYear:2011,endYear:2021,platform:"PQ25",sourceUrl:`${A}/seat-mii-aa/`},
  {brand:"SEAT / CUPRA",model:"CUPRA Ateca KH7",startYear:2018,endYear:2024,platform:"MQB",sourceUrl:`${A}/cupra-ateca-kh7/`},
  {brand:"SEAT / CUPRA",model:"CUPRA Leon KL",startYear:2020,endYear:2026,platform:"MQBevo",sfd1From:2020,sourceUrl:`${A}/cupra-leon-kl/`},
  {brand:"SEAT / CUPRA",model:"CUPRA Formentor KM",startYear:2020,endYear:2026,platform:"MQBevo",sfd1From:2020,sourceUrl:`${A}/cupra-formentor-km/`},
  {brand:"SEAT / CUPRA",model:"CUPRA Born K11",startYear:2021,endYear:2026,platform:"MEB",sfd1From:2021,sourceUrl:`${A}/cupra-born-k11/`},
];

const genericMqbNames = [
  "Zeigertest / Needle Sweep / Staging aktivieren","Laptimer / Rundenzähler aktivieren","Öltemperaturanzeige aktivieren","Nachtankmenge anzeigen","Gurtwarner deaktivieren","Tagfahrlicht im Infotainment aktivieren","Heckleuchten zusammen mit Tagfahrlicht aktivieren","Coming Home aktivieren","Leaving Home aktivieren","Komfortblinken Anzahl Blinkzyklen ändern","Auto-Lock aktivieren","Auto-Unlock aktivieren","Spiegelabsenkung Beifahrer bei Rückwärtsfahrt","Spiegelanklappen per Fernbedienung aktivieren","Reifendruckkontrolle über ABS aktivieren","XDS Stärke anpassen","Berganfahrassistent anpassen","Start-Stopp deaktivieren über Spannungsgrenze"
];

export function codingsForVehicle(vehicle:Vehicle):string[] {
  const key=`${vehicle.brand}|${vehicle.model}`;
  const names=ascodingModelCodings[key];
  if(names){
    // Bei Modellen, für die die Quelle ausdrücklich keine verlässlichen Codierungen nennt,
    // bleibt nur die Diagnose buchbar.
    return ["diagnose",...names.map(n=>idByName.get(n)).filter((v):v is string=>Boolean(v))];
  }
  if(vehicle.platform==="MQB" || vehicle.platform==="MQBevo"){
    return ["diagnose",...genericMqbNames.map(n=>idByName.get(n)).filter((v):v is string=>Boolean(v))];
  }
  return ["diagnose"];
}

export const brands=["Volkswagen","Audi","Škoda","SEAT / CUPRA"];
