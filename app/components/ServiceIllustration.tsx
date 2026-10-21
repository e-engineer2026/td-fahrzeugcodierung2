"use client";

import { useId } from "react";
import type { IllustrationKind } from "../lib/serviceDetails";

export default function ServiceIllustration({ kind, label }: { kind: IllustrationKind; label?: string }) {
  const gradientId = useId().replace(/:/g, "");
  return <svg className={`td-function-art td-function-art-${kind}`} viewBox="0 0 360 190" role="img" aria-label={label || "Schematische Funktionsvorschau"}>
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f2f7ff" /><stop offset="1" stopColor="#e5edf8" /></linearGradient></defs>
    <rect width="360" height="190" rx="16" fill={`url(#${gradientId})`} />
    <circle cx="310" cy="25" r="90" fill="#d8e6ff" opacity=".5" />
    {kind === "tailgate" ? <g>
      <path d="M103 142V83l25-35h104l25 35v59Z" fill="#1d3d69" /><path d="m129 82 14-23h74l14 23Z" fill="#a9cbf8" />
      <path d="m120 94 60-23 60 23v43H120Z" fill="#092348" stroke="#6b9bdc" strokeWidth="2" /><path d="m120 94-15-41 75-22 75 22-15 41" fill="#7599ca" stroke="#a9cbf8" strokeWidth="2" /><path d="m105 105 15 4m135-4-15 4" stroke="#f0838c" strokeWidth="7" /><path d="M143 125h74" stroke="#8db8f8" strokeWidth="3" /><text x="180" y="175" textAnchor="middle" fill="#526984" fontSize="11">Teile, Lernwerte und Funktion prüfen</text>
    </g> : kind === "key" ? <g>
      <rect x="118" y="48" width="76" height="91" rx="19" fill="#1d3d69" /><rect x="130" y="61" width="52" height="23" rx="6" fill="#7ba5dc" /><rect x="140" y="95" width="32" height="23" rx="5" fill="#b2cdf0" /><path d="M194 89h59v18h-12v11h-12v-11h-35" fill="#98b6dd" /><circle cx="89" cy="61" r="17" fill="none" stroke="#075bff" strokeWidth="3" /><path d="m111 61 10 9" stroke="#075bff" strokeWidth="3" /><text x="180" y="171" textAnchor="middle" fill="#526984" fontSize="11">Systemstand und Schlüssel abstimmen</text>
    </g> : kind === "mirror" ? <g>
      <path d="M134 145V72q0-31 46-31t46 31v73Z" fill="#1d3d69" />
      <path d="m149 72 9-17h44l9 17-5 25h-52Z" fill="#b8d7ff" />
      <path d="M150 111h60v24h-60Z" fill="#658bc0" />
      <g className="td-art-mirror-left"><path d="m133 82-27 5-6 15 32-4" fill="#075bff" /><path d="m106 105 11 7" stroke="#75a4ff" strokeWidth="3" /></g>
      <g className="td-art-mirror-right"><path d="m227 82 27 5 6 15-32-4" fill="#075bff" /><path d="m254 105-11 7" stroke="#75a4ff" strokeWidth="3" /></g>
      <path d="m89 70 8-9 9 8m164 1-8-9-9 8" stroke="#8da9cd" strokeWidth="2" fill="none" />
      <text x="180" y="170" textAnchor="middle" fill="#526984" fontSize="11">Komfort beim Abschließen</text>
    </g> : kind === "light" ? <g>
      <path className="td-art-light" d="m116 106-85 41V75l85 16m128 15 85 41V75l-85 16" fill="#c1d8ff" />
      <path d="m98 115 15-37q5-15 25-15h84q20 0 25 15l15 37v24H98Z" fill="#1d3d69" />
      <path d="m128 78 9-6h86l8 6 8 20H120Z" fill="#a8c9f4" />
      <path d="m106 111 36 5m112-5-36 5" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <path d="M156 127h48" stroke="#6d93c9" strokeWidth="6" strokeLinecap="round" />
      <text x="180" y="170" textAnchor="middle" fill="#526984" fontSize="11">Lichtfunktionen passend einstellen</text>
    </g> : kind === "instrument" ? <g>
      <path d="M82 137a98 98 0 0 1 196 0" fill="#1d3d69" />
      <path d="M101 132a79 79 0 0 1 158 0" fill="none" stroke="#8db8f8" strokeWidth="3" strokeDasharray="2 13" />
      <path className="td-art-needle" d="m180 132-58-43" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="180" cy="132" r="7" fill="#075bff" /><rect x="149" y="140" width="62" height="9" rx="4" fill="#b4ccef" />
      <text x="180" y="170" textAnchor="middle" fill="#526984" fontSize="11">Unterstützte Anzeigen entdecken</text>
    </g> : kind === "infotainment" ? <g>
      <rect x="72" y="40" width="216" height="111" rx="12" fill="#1d3d69" />
      <rect x="83" y="51" width="194" height="87" rx="5" fill="#0c2851" />
      {[104,150,196,242].map((x,i)=><g key={x}><rect x={x-12} y="73" width="26" height="26" rx="7" fill={["#3477f5","#60b7ad","#e0a154","#8d93dd"][i]} /><path d={`M${x-7} 114h16`} stroke="#a8c9f4" strokeWidth="3" strokeLinecap="round" /></g>)}
      <path d="M150 151h60l16 10h-92Z" fill="#7d9dc6" />
      <text x="180" y="179" textAnchor="middle" fill="#526984" fontSize="11">Gerät und Software entscheiden</text>
    </g> : kind === "assist" ? <g>
      <path d="m119 161 33-130h56l33 130Z" fill="#d1dce9" /><path d="m134 162 24-130m68 130-24-130" stroke="#fff" strokeWidth="3" />
      <path d="M180 158V32" stroke="#fff" strokeWidth="3" strokeDasharray="12 10" />
      <rect x="162" y="102" width="36" height="52" rx="10" fill="#1d3d69" /><path d="m164 83 16-40 16 40" fill="#075bff" opacity=".17" />
      <path d="m160 91 20-51 20 51" stroke="#075bff" strokeWidth="2" fill="none" />
      <text x="180" y="180" textAnchor="middle" fill="#526984" fontSize="11">Nur mit geeigneter Ausstattung</text>
    </g> : <g>
      <rect x="77" y="39" width="206" height="108" rx="9" fill="#1d3d69" /><rect x="88" y="50" width="184" height="86" rx="4" fill="#f5f9ff" />
      <path d="m101 101 28-8 20 20 21-47 17 35 23-12 15 8h31" fill="none" stroke="#075bff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M61 152h238l-13 12H74Z" fill="#7d9dc6" /><circle cx="245" cy="70" r="12" fill="#cce9de" /><path d="m239 70 4 4 8-9" stroke="#218567" strokeWidth="2" fill="none" />
      <text x="180" y="181" textAnchor="middle" fill="#526984" fontSize="11">Prüfen. Einordnen. Gezielt handeln.</text>
    </g>}
  </svg>;
}
