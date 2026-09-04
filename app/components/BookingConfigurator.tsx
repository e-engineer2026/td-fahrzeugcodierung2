"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, Laptop, MapPin } from "lucide-react";
import { brands, codingCatalog, codingGroups, vehicles, codingsForVehicle, type Coding, type CodingGroup, type Vehicle } from "../data/catalog";

function discountRate(v:number){ return v>=200?.20:v>=150?.15:v>=100?.10:v>=50?.05:0; }
function nextTier(v:number){ return v<50?50:v<100?100:v<150?150:v<200?200:null; }

const emptyVehicle: Vehicle = {
  brand:"",
  model:"",
  startYear:0,
  endYear:0,
  platform:"PQ35",
};

export default function BookingConfigurator(){
  const [mode,setMode]=useState<"remote"|"onsite">("onsite");
  const [brand,setBrand]=useState("");
  const [vehicleModel,setVehicleModel]=useState("");
  const [year,setYear]=useState(0);
  const [vin,setVin]=useState("");
  const [selected,setSelected]=useState<string[]>([]);
  const [search,setSearch]=useState("");
  const [activeGroup,setActiveGroup]=useState<"Alle"|CodingGroup>("Alle");
  const [expandedGroups,setExpandedGroups]=useState<CodingGroup[]>([]);

  const models=brand ? vehicles.filter(v=>v.brand===brand) : [];
  const selectedVehicle=vehicles.find(v=>v.brand===brand&&v.model===vehicleModel);
  const vehicle=selectedVehicle || emptyVehicle;
  const hasVehicle=!!selectedVehicle;
  const years=hasVehicle ? Array.from({length:vehicle.endYear-vehicle.startYear+1},(_,i)=>vehicle.endYear-i) : [];

  const isSfd1 = hasVehicle && !!vehicle.sfd1From && year >= vehicle.sfd1From && year < 2024;
  const isSfd2 = hasVehicle && year >= 2024 && !!vehicle.sfd1From;

  const vehicleCodingIds = hasVehicle ? codingsForVehicle(vehicle) : [];
  const available=!hasVehicle || isSfd2 ? [] : codingCatalog.filter(c=>{
    if(!vehicleCodingIds.includes(c.id)) return false;
    if(!isSfd1 || c.category!=="Assistenzsysteme") return true;
    return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(c.name);
  });

  const shown=available
    .filter(c=>activeGroup==="Alle" || c.uiGroup===activeGroup)
    .filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const hasSearch=search.trim().length>0;

  const displayCodingName = (c: Coding) => {
    if (c.category === "Assistenzsysteme" && isSfd1) {
      const cleaned = c.name
        .replace(/^Anpassung\s+/i, "")
        .replace(/^Freischaltung\s+/i, "")
        .replace(/\s+codieren\s*\/\s*parametrisieren$/i, "")
        .replace(/\s+codieren$/i, "");
      return `Anpassung ${cleaned}`;
    }
    return c.name;
  };

  const subtotal=selected.reduce((s,id)=>s+(codingCatalog.find(c=>c.id===id)?.price||0),0);
  const sfdFee = isSfd1 && selected.length > 0 ? 10 : 0;
  const rate=discountRate(subtotal), discount=subtotal*rate, total=(subtotal-discount)+sfdFee, next=nextTier(subtotal);
  const chosen = selected.map(id=>{const c=codingCatalog.find(c=>c.id===id); return c?displayCodingName(c):null}).filter(Boolean).join(", ");
  const prepay=total*.70, finalpay=total*.30;
  const formattedTotal=total.toFixed(2).replace(".",",");
  const formattedPrepay=prepay.toFixed(2).replace(".",",");
  const bookingDisabled=!hasVehicle || isSfd2 || selected.length===0;
  const paypalUrl=`https://paypal.me/TiDrechsler/${prepay.toFixed(2)}`;

  const calBase=mode==="remote"
    ?"https://cal.com/timo-drechsler-lej6jm/remote-codierung"
    :"https://cal.com/timo-drechsler-lej6jm/vag-codierung-vor-ort";

  const calParams=new URLSearchParams();
  if(hasVehicle){
    calParams.set("fahrzeug",`${brand} ${vehicle.model}`);
    calParams.set("baujahr",String(year));
  }
  if(vin) calParams.set("fin",vin);
  if(chosen) calParams.set("codierungen",chosen);
  calParams.set("gesamtpreis",`${total.toFixed(2)} EUR${sfdFee ? " inkl. 10 EUR SFD1" : ""}`);
  if(mode==="remote") calParams.set("zahlung",`PayPal 70% vorab (${prepay.toFixed(2)} EUR) / 30% danach (${finalpay.toFixed(2)} EUR)`);
  else calParams.set("zahlung","Bar, PayPal oder Sofortüberweisung (beim Termin)");
  const calUrl=`${calBase}?${calParams.toString()}`;

  const savePendingBooking=()=>{
    if(typeof window==="undefined" || mode!=="remote" || !hasVehicle || selected.length===0) return;
    window.localStorage.setItem("td_pending_booking",JSON.stringify({
      vehicle:`${brand} ${vehicle.model}`,
      year,
      vin,
      codings:chosen,
      total:Number(total.toFixed(2)),
      prepay:Number(prepay.toFixed(2)),
      finalpay:Number(finalpay.toFixed(2)),
      paypalUrl,
      savedAt:Date.now()
    }));
  };

  const resetCodingSelection=()=>{
    setSelected([]); setActiveGroup("Alle"); setSearch(""); setExpandedGroups([]);
  };
  const changeBrand=(b:string)=>{
    setBrand(b); setVehicleModel(""); setYear(0); setVin(""); resetCodingSelection();
  };
  const changeModel=(m:string)=>{
    setVehicleModel(m); setVin(""); resetCodingSelection();
    if(!m){ setYear(0); return; }
    const v=vehicles.find(x=>x.brand===brand&&x.model===m);
    setYear(v?.endYear || 0);
  };
  const toggle=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleGroup=(group:CodingGroup)=>setExpandedGroups(groups=>groups.includes(group)?groups.filter(item=>item!==group):[...groups,group]);
  const calButton=(className:string,saveBooking=false)=>bookingDisabled
    ? <button type="button" disabled className={`inline-flex cursor-not-allowed flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-xl border border-slate-300 bg-slate-200 px-5 py-3 font-semibold text-slate-500 shadow-none ${className}`}><CalendarDays className="h-5 w-5 shrink-0"/><span>Termin mit Daten an Cal.com übergeben</span>{mode==="onsite"&&<span className="whitespace-nowrap rounded-lg bg-slate-300 px-2 py-1 text-slate-700">Gesamtsumme: {formattedTotal} €</span>}</button>
    : <a href={calUrl} onClick={saveBooking?savePendingBooking:undefined} target="_blank" rel="noreferrer" className={`btn-primary flex-wrap gap-x-2 gap-y-1 ${className}`}><CalendarDays className="h-5 w-5 shrink-0"/><span>Termin mit Daten an Cal.com übergeben</span>{mode==="onsite"&&<span className="whitespace-nowrap rounded-lg bg-white/15 px-2 py-1">Gesamtsumme: {formattedTotal} €</span>}</a>;
  const mobileCalButtonContent=<><span className="leading-tight">Termin mit Daten an Cal.com übergeben</span>{mode==="onsite"&&<span className="mt-1 text-xs font-black">Gesamtsumme: {formattedTotal} €</span>}</>;
  const mobileCalButton=bookingDisabled
    ? <button type="button" disabled className="inline-flex min-h-16 w-full cursor-not-allowed flex-col items-center justify-center rounded-xl border border-slate-300 bg-slate-200 px-3 py-2 text-center text-[11px] font-semibold text-slate-500">{mobileCalButtonContent}</button>
    : <a href={calUrl} onClick={mode==="remote"?savePendingBooking:undefined} target="_blank" rel="noreferrer" className="inline-flex min-h-16 w-full flex-col items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-center text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700">{mobileCalButtonContent}</a>;

  return <div className="space-y-5 sm:space-y-8">
    <section className="card p-4 sm:p-8">
      <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">1 · Terminart</div>
      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-2">
        <button onClick={()=>setMode("onsite")} className={`min-h-[132px] rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md sm:min-h-[148px] sm:p-5 ${mode==="onsite"?"border-blue-600 bg-blue-50":"border-slate-200 bg-white"}`}>
          <MapPin className="h-7 w-7 text-blue-600"/><b className="mt-3 block">Vor Ort in Leipzig-Süd</b><span className="text-sm text-slate-600">Schenkendorfstraße 33, 04275 Leipzig</span>
        </button>
        <button onClick={()=>setMode("remote")} className={`min-h-[132px] rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md sm:min-h-[148px] sm:p-5 ${mode==="remote"?"border-blue-600 bg-blue-50":"border-slate-200 bg-white"}`}>
          <Laptop className="h-7 w-7 text-blue-600"/><b className="mt-3 block">Remote-Codierung</b><span className="mt-1 block text-sm leading-6 text-slate-600">Mit eigenem Diagnoseinterface, PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software.</span>
        </button>
      </div>
      {mode==="remote"&&<div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700 sm:mt-5 sm:p-5 sm:leading-7">
        <b>Voraussetzungen für Remote:</b> Eigenes kompatibles Diagnoseinterface (z. B. VCP, VCDS oder OBD11), stabile Internetverbindung, Windows-PC/Laptop am Fahrzeug und eine vor dem Termin vereinbarte Remote-Software. Je nach Codierung kann ein bestimmtes Interface oder eine bestimmte Softwareversion erforderlich sein.
      </div>}
    </section>

    <section className="card p-4 sm:p-8">
      <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">2 · Fahrzeug</div>
      <h3 className="mt-2 text-xl font-black leading-tight sm:text-2xl">Marke, Baureihe und Baujahr</h3>
      <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3">
        <label><span className="mb-2 block text-sm font-semibold">Marke</span><select value={brand} onChange={e=>changeBrand(e.target.value)}><option value="" disabled>Marke auswählen</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select></label>
        <label><span className="mb-2 block text-sm font-semibold">Modell / Generation</span><select value={vehicleModel} onChange={e=>changeModel(e.target.value)} disabled={!brand}><option value="">Modell auswählen</option>{models.map(v=><option key={v.model} value={v.model}>{v.model}</option>)}</select></label>
        <label><span className="mb-2 block text-sm font-semibold">Baujahr</span><select value={year||""} onChange={e=>setYear(Number(e.target.value))} disabled={!hasVehicle}><option value="" disabled>Baujahr auswählen</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select></label>
      </div>
      <div className="mt-4 grid gap-3 sm:gap-4 md:grid-cols-[1fr_2fr]">
        <div>
          <input value={vin} onChange={e=>setVin(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g,"").slice(0,17))} maxLength={17} placeholder="FIN optional" disabled={!hasVehicle}/>
          {vin.length>0 && vin.length!==17 && <p className="mt-2 text-xs font-semibold text-amber-600">FIN muss 17 Zeichen enthalten · {vin.length}/17</p>}
          {vin.length===17 && <p className="mt-2 text-xs font-semibold text-emerald-600">FIN vollständig · 17/17</p>}
        </div>
        {hasVehicle ? <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 sm:p-4">Plattform: <strong>{vehicle.platform}</strong>. Die angebotenen Funktionen werden modellbezogen zugeordnet.</div> : <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-500 sm:p-4">Bitte zuerst Marke und Modell auswählen.</div>}
      </div>
      {isSfd1&&<div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 sm:mt-5 sm:p-4">Bei SFD1-Fahrzeugen werden Assistenz-Freischaltungen mit möglichem SVM-/Datensatz-, Parametrierungs- oder Kalibrierungsbedarf nicht regulär angeboten. Reine Anpassungen bleiben nach Vorprüfung auswählbar.</div>}
      {isSfd2 ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-900 sm:p-4"><b>SFD2 / UNECE:</b> Diese Baureihe wird ab Modelljahr 2024 für Codierungsaufträge ausgeschlossen.</div>
      : isSfd1 ? <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900 sm:p-4"><b>SFD1:</b> Für die Freischaltung geschützter Steuergeräte werden einmalig <strong>10,00 €</strong> zum Auftrag addiert.</div>
      : hasVehicle && year===2023 ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900 sm:p-4"><b>Hinweis:</b> Einige VAG-Modelle erhielten SFD2 bereits 2023. Vor Durchführung ist daher ein SFD-Check sinnvoll.</div> : null}
    </section>

    <section className="card p-4 sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">3 · Fahrzeugbezogene Codierungen</div><h3 className="mt-2 text-xl font-black leading-tight sm:text-2xl">{hasVehicle ? `${brand} ${vehicle.model} · ${year}` : "Fahrzeug auswählen"}</h3></div><input className="md:max-w-xs" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Codierung suchen …" disabled={!hasVehicle}/></div>
      {hasVehicle&&!isSfd2&&<div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:mt-5 sm:flex-wrap sm:overflow-visible">
        {["Alle",...codingGroups].map(group=><button type="button" key={group} onClick={()=>setActiveGroup(group as "Alle"|CodingGroup)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${activeGroup===group?"border-blue-600 bg-blue-600 text-white":"border-slate-200 bg-white text-slate-700 hover:border-blue-300"}`}>{group}</button>)}
      </div>}
      {!hasVehicle ? <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">Bitte zuerst Marke, Modell und Baujahr auswählen.</div>
      : isSfd2 ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-900">Für dieses Baujahr werden keine Codierungsleistungen angeboten.</div>
      : shown.length===0 ? <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">Für diesen Filter sind aktuell keine dokumentierten Funktionen hinterlegt. Nutze „Alle“ oder die Machbarkeitsanfrage.</div>
      : <div className="mt-4 space-y-2 sm:mt-5">{codingGroups.map(group=>{
        const list=shown.filter(c=>c.uiGroup===group); if(!list.length) return null;
        const selectedInGroup=list.filter(c=>selected.includes(c.id)).length;
        const isExpanded=activeGroup!=="Alle"||hasSearch||expandedGroups.includes(group);
        const panelId=`coding-group-${group.toLowerCase()}`;
        return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={group}>
          <button type="button" onClick={()=>toggleGroup(group)} aria-expanded={isExpanded} aria-controls={panelId} className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 sm:px-4">
            <span className="min-w-0 font-black text-blue-700">{group} <span className="font-semibold text-slate-400">({list.length})</span></span>
            <span className="flex shrink-0 items-center gap-2">
              {selectedInGroup>0&&<span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-700">{selectedInGroup} gewählt</span>}
              <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isExpanded?"rotate-180":""}`} aria-hidden="true"/>
            </span>
          </button>
          {isExpanded&&<div id={panelId} className="border-t border-slate-200 bg-slate-50/60 p-2 sm:p-3">
            <div className="grid gap-2 lg:grid-cols-2">{list.map(c=><div key={c.id} className={`rounded-lg border px-3 py-2.5 ${selected.includes(c.id)?"border-blue-500 bg-blue-50":"border-slate-200 bg-white"}`}><label className="flex cursor-pointer items-start justify-between gap-2.5"><span className="flex min-w-0 flex-1 items-start text-sm leading-5"><input className="mr-2.5 mt-0.5 h-4 w-4 shrink-0" type="checkbox" checked={selected.includes(c.id)} onChange={()=>toggle(c.id)}/><span>{displayCodingName(c)}</span></span><b className="shrink-0 whitespace-nowrap text-sm leading-5">{c.price} €</b></label>{(c.interfaceInfo||c.hardware||c.requirements)&&<div className="mt-2 space-y-1 border-t border-slate-200 pt-2 text-[11px] leading-4 text-slate-600">{c.hardware&&<div><b>Hardware:</b> {c.hardware}</div>}{c.requirements&&<div><b>Hinweis:</b> {c.requirements}</div>}</div>}</div>)}</div>
          </div>}
        </div>
      })}</div>}
      {hasVehicle&&<div className="mt-4 rounded-xl bg-slate-50 p-3 sm:mt-5 sm:p-4"><div className="flex justify-between text-sm"><span>Zwischensumme</span><b>{subtotal.toFixed(2)} €</b></div><div className="mt-1.5 flex justify-between text-sm text-blue-700"><span>Rabatt ({Math.round(rate*100)} %)</span><b>-{discount.toFixed(2)} €</b></div><div className="mt-3 flex justify-between gap-4 border-t pt-3 text-lg"><b>Gesamt</b><b>{total.toFixed(2)} €</b></div>{next?<p className="mt-2 text-xs leading-5 text-slate-600">Noch {(next-subtotal).toFixed(2)} € bis zur nächsten Rabattstufe ({next===50?5:next===100?10:next===150?15:20} %).</p>:<p className="mt-2 text-xs font-semibold text-blue-700">20 % Maximalrabatt erreicht.</p>}{sfdFee>0&&<div className="mt-2 flex justify-between border-t pt-2 text-sm text-blue-700"><span>SFD1-Freischaltung</span><b>+10,00 €</b></div>}</div>}
    </section>

    {mode==="remote" ? <>
      <section className="card p-4 sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">4 · Termin und Zahlung</div>
        {hasVehicle&&<div className="mt-4 rounded-2xl border border-blue-100 p-4 text-sm leading-6 sm:mt-5 sm:p-5 sm:leading-7"><b>Remote</b> · {brand} {vehicle.model} · Baujahr {year}<br/>{selected.length} Codierung(en) · {Math.round(rate*100)} % Rabatt · <b>{total.toFixed(2)} €</b><br/>70 % vorab: {prepay.toFixed(2)} € · 30 % danach: {finalpay.toFixed(2)} €</div>}
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><b>Ablauf:</b> Termin auswählen, anschließend 70 % vorauszahlen. <strong>Der Termin wird nach Eingang der Vorauszahlung verbindlich bestätigt.</strong></div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700" aria-label="Zahlungsmöglichkeit für Remote-Termine"><span>Zahlungsmöglichkeit: </span><b>PayPal</b></div>
        {!hasVehicle ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">Bitte zuerst ein Fahrzeug auswählen.</div>
        : isSfd2 ? <div className="mt-6 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-500">Terminbuchung für Codierungen deaktiviert</div>
        : selected.length===0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">Bitte zuerst mindestens eine Codierung auswählen.</div>
        : null}
        <div className={`mt-5 grid gap-3 sm:mt-6 ${bookingDisabled?"":"sm:grid-cols-2"}`}>
          {calButton("w-full text-center",true)}
          {!bookingDisabled&&<a href="/zahlung" onClick={savePendingBooking} className="btn-secondary flex w-full flex-col text-center"><span>Termin gebucht? Jetzt 70 % vorauszahlen</span><span className="mt-1 text-sm font-black">Betrag: {formattedPrepay} €</span></a>}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">Cal.com öffnet sich in einem neuen Tab. Nach erfolgreicher Terminbuchung hier zurückkehren und mit Schritt 2 zur Zahlungsseite gehen.</p>
      </section>
    </> : <>
      <section className="card p-4 sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">4 · Zahlungsmöglichkeiten</div>
        <p className="mt-3 text-sm text-slate-600">Die Zahlung erfolgt beim Termin.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Zahlungsmöglichkeiten beim Termin">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><b>Bar</b></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><b>PayPal</b></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><b>Sofortüberweisung</b></div>
        </div>
      </section>
      <section className="card p-4 sm:p-8"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">5 · Termin</div>{hasVehicle&&<div className="mt-4 rounded-2xl border border-blue-100 p-4 text-sm leading-6 sm:mt-5 sm:p-5 sm:leading-7"><b>Vor Ort</b> · {brand} {vehicle.model} · Baujahr {year}<br/>{selected.length} Codierung(en) · {Math.round(rate*100)} % Rabatt · <b>{total.toFixed(2)} €</b></div>}{!hasVehicle?<div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">Bitte zuerst ein Fahrzeug auswählen.</div>:isSfd2?<div className="mt-6 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-500">Terminbuchung für Codierungen deaktiviert</div>:selected.length===0?<div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">Bitte zuerst mindestens eine Codierung auswählen.</div>:null}<div className="mt-5 sm:mt-6">{calButton("w-full text-center sm:w-auto")}</div><p className="mt-3 text-xs leading-5 text-slate-500">Name und E-Mail werden direkt von Cal.com bei der Terminbuchung abgefragt.</p></section>
    </>}
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-blue-100 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[2fr_1fr] gap-2">
        {mobileCalButton}
        <a href="#kontakt" className="inline-flex min-h-16 items-center justify-center rounded-xl border border-blue-200 bg-white px-3 py-2 text-center text-sm font-bold text-blue-700">Direktkontakt</a>
      </div>
    </div>
  </div>
}
