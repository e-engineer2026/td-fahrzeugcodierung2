/** Minimal PDF/A4 draft renderer without an external service or public file storage.
 * The supplied step values MUST be technically reviewed before publication.
 */
export type CodingStep = {
  ecu: string;
  path: string;
  original: string;
  target: string;
  note: string;
};
export type GuideVariant = {
  slug: string;
  model: string;
  variantNote: string;
  reviewed: boolean;
  steps: CodingStep[];
};
export type GuideMaster = {
  id: string;
  title: string;
  revision: string;
  overview: string;
  safety: string;
  variants: GuideVariant[];
};

const special: Record<string, number> = {
  "€": 0x80, "„": 0x84, "…": 0x85, "Š": 0x8a, "š": 0x9a,
  "“": 0x93, "”": 0x94, "’": 0x92, "–": 0x96, "—": 0x97, "•": 0x95,
};
function asWinAnsi(s: string): string {
  return Array.from(s, c => {
    const n = special[c] ?? c.charCodeAt(0);
    return n < 256 ? String.fromCharCode(n) : "?";
  }).join("");
}
function literalHex(s: string): string {
  return "<" + Buffer.from(asWinAnsi(s), "latin1").toString("hex") + ">";
}
function wrapLine(value: string, max = 84): string[] {
  const result: string[] = [];
  for (const part of value.split(/\r?\n/)) {
    let line = "";
    for (const word of part.split(/\s+/).filter(Boolean)) {
      if (word.length > max) {
        if (line) { result.push(line); line = ""; }
        for (let i = 0; i < word.length; i += max) result.push(word.slice(i, i + max));
        continue;
      }
      if (line && line.length + word.length + 1 > max) { result.push(line); line = ""; }
      line += (line ? " " : "") + word;
    }
    result.push(line);
  }
  return result;
}
function textLines(master: GuideMaster, variant: GuideVariant, title: string): Array<{ text: string; bold?: boolean }> {
  const out: Array<{ text: string; bold?: boolean }> = [];
  const add = (text: string, bold = false) => {
    for (const t of wrapLine(text)) out.push({ text: t, bold });
  };
  add("TD Fahrzeugcodierung | Codieranleitung", true);
  add("PRIVATER ENTWURF - NICHT VEROEFFENTLICHT - NICHT FREIGEGEBEN", true);
  add(title, true);
  add("Baureihe: " + variant.model);
  add("Revision: " + master.revision + " | Vorlage: " + master.id);
  add("Variante fachlich geprueft: " + (variant.reviewed ? "Vom Administrator markiert; Fahrzeug erneut prüfen" : "NEIN"));
  add("Erstellt: " + new Date().toISOString().slice(0, 10));
  add("");
  add("Voraussetzungen und Funktion", true);
  add(master.overview);
  add("Modellvariante: " + variant.variantNote);
  add("Sicherheit: " + master.safety);
  add("Vor jeder Arbeit Auto-Scan und Originalcodierung sichern. FIN, PR-Nummern, Steuergeraete, SWaP/FEC sowie SFD-Schutz pruefen.");
  add("");
  add("CODIERUNG / ANPASSUNG - NUR NACH TECHNISCHER PRUEFUNG", true);
  variant.steps.forEach((step, i) => {
    add((i + 1) + ". Steuergeraet: " + step.ecu, true);
    add("Pfad / Kanal: " + step.path);
    add("Ausgangswert: " + step.original + " | Zielwert: " + step.target);
    if (step.note) add("Hinweis: " + step.note);
    add("");
  });
  add("Funktionskontrolle, Fehlerspeicher, Kalibrierung und Ruecksetzen fahrzeugspezifisch durchfuehren.");
  add("Keine pauschale Zusicherung der Kompatibilitaet. Dieser Entwurf wird erst nach gesonderter Fachfreigabe im Adminbereich veroeffentlicht.");
  return out;
}

export function createGuideDraftPdf(master: GuideMaster, variant: GuideVariant, title: string): Buffer {
  const lines = textLines(master, variant, title);
  const pageSize = 45;
  const pages: Array<typeof lines> = [];
  for (let i = 0; i < lines.length; i += pageSize) pages.push(lines.slice(i, i + pageSize));
  if (!pages.length || pages.length > 12) throw new Error("Zu viele PDF-Seiten.");
  const objects: string[] = [];
  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  const kids = pages.map((_, i) => (5 + i * 2) + " 0 R").join(" ");
  objects[1] = "<< /Type /Pages /Kids [" + kids + "] /Count " + pages.length + " >>";
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  pages.forEach((page, index) => {
    const pageId = 5 + index * 2;
    const contentId = pageId + 1;
    objects[pageId - 1] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents " + contentId + " 0 R >>";
    const commands = [
      "0.03 0.12 0.29 rg 0 826 595 16 re f",
      "0.05 0.23 0.55 RG 42 804 m 553 804 l S",
    ];
    page.forEach((item, row) => {
      const y = 782 - row * 16;
      commands.push("0 0 0 rg BT /" + (item.bold ? "F2" : "F1") +
        " " + (item.bold ? 11 : 9.5) + " Tf 42 " + y +
        " Td " + literalHex(item.text) + " Tj ET");
    });
    const footer = "TD Fahrzeugcodierung | ENTWURF | Seite " + (index + 1) + " / " + pages.length;
    commands.push("BT /F1 8 Tf 42 25 Td " + literalHex(footer) + " Tj ET");
    const stream = commands.join("\n") + "\n";
    objects[contentId - 1] = "<< /Length " + Buffer.byteLength(stream, "ascii") + " >>\nstream\n" + stream + "endstream";
  });
  const buffers: Buffer[] = [Buffer.from("%PDF-1.4\n%TD-Guide\n", "ascii")];
  const offsets = [0];
  let position = buffers[0].length;
  objects.forEach((obj, index) => {
    offsets.push(position);
    const bytes = Buffer.from((index + 1) + " 0 obj\n" + obj + "\nendobj\n", "latin1");
    buffers.push(bytes); position += bytes.length;
  });
  const xref = position;
  const table = "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n" +
    offsets.slice(1).map(n => String(n).padStart(10, "0") + " 00000 n \n").join("");
  buffers.push(Buffer.from(table + "trailer\n<< /Size " + (objects.length + 1) +
    " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n", "ascii"));
  return Buffer.concat(buffers);
}

export function validateGuideMaster(value: unknown): GuideMaster | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const m = value as Partial<GuideMaster>;
  if (typeof m.id !== "string" || !/^[a-z0-9-]{5,70}$/.test(m.id) ||
      typeof m.title !== "string" || m.title.trim().length < 8 || m.title.length > 150 ||
      typeof m.revision !== "string" || !/^[A-Za-z0-9._-]{1,24}$/.test(m.revision) ||
      typeof m.overview !== "string" || m.overview.trim().length < 20 || m.overview.length > 1500 ||
      typeof m.safety !== "string" || m.safety.trim().length < 15 || m.safety.length > 1500 ||
      !Array.isArray(m.variants) || m.variants.length < 1 || m.variants.length > 12) return null;
  const seen = new Set<string>();
  for (const v of m.variants) {
    if (!v || typeof v.slug !== "string" || v.slug.length > 800 || seen.has(v.slug) ||
        typeof v.model !== "string" || v.model.length < 3 || v.model.length > 150 ||
        typeof v.variantNote !== "string" || v.variantNote.trim().length < 10 || v.variantNote.length > 800 ||
        typeof v.reviewed !== "boolean" || !Array.isArray(v.steps) || !v.steps.length || v.steps.length > 30)
      return null;
    seen.add(v.slug);
    for (const step of v.steps) {
      if (!step || !["ecu","path","original","target","note"].every(key =>
        typeof step[key as keyof CodingStep] === "string" &&
        step[key as keyof CodingStep].length <= 400) ||
        step.ecu.trim().length < 2 || step.path.trim().length < 3 ||
        step.original.trim().length < 1 || step.target.trim().length < 1) return null;
    }
  }
  return m as GuideMaster;
}
