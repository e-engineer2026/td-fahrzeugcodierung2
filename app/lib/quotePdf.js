export async function downloadQuotePdf({ vehicle, entries, selected, sfdFee, subtotal, rate, discount, total }) {
  const encoder = new TextEncoder();
  const bytes = (s) => encoder.encode(s);
  const concat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let i = 0; for (const p of parts) { out.set(p, i); i += p.length; } return out; };
  const winAnsi = (s) => { const special = { '€': 128, '–': 150, '—': 151, '„': 132, '“': 147, '”': 148, '’': 146, 'Š': 138, 'š': 154, '•': 149 }; return Array.from(s, c => { const v = special[c] ?? c.charCodeAt(0); return v <= 255 ? v : 63; }); };
  const hex = (s) => '<' + winAnsi(s).map(n => n.toString(16).padStart(2, '0')).join('') + '>';
  let image = null;
  try {
    const img = new Image(); img.src = '/td-logo-icon.png'; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = 240; canvas.height = 240;
    const context = canvas.getContext('2d'); if (!context) throw new Error('canvas');
    context.fillStyle = '#fff'; context.fillRect(0, 0, 240, 240); context.drawImage(img, 0, 0, 240, 240);
    const data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1]; image = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  } catch { throw new Error('Das Logo konnte nicht geladen werden.'); }
  const today = new Date(); const until = new Date(today); until.setDate(until.getDate() + 14);
  const date = d => d.toLocaleDateString('de-DE');
  const money = n => n.toFixed(2).replace('.', ',') + ' €';
  const pages = []; let ops = []; let y = 0;
  const line = (text, x, yy, size = 10, bold = false) => ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${yy} Td ${hex(text)} Tj ET`);
  const start = () => { ops = []; pages.push(ops); y = 794; if (image) ops.push('q 44 0 0 44 42 778 cm /Logo Do Q'); line('TD Fahrzeugcodierung', image ? 94 : 42, 807, 16, true); line('Schenkendorfstraße 33 · 04275 Leipzig', image ? 94 : 42, 791, 9); line('01556 3047044 · info@td-fahrzeugcodierung.de', image ? 94 : 42, 778, 9); y = 752; };
  const ensure = (space) => { if (y - space < 48) start(); };
  const wrap = (s, max = 77) => { const lines = []; let line = ''; for (const word of s.split(/\s+/)) { if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; } else line += (line ? ' ' : '') + word; } if (line) lines.push(line); return lines.length ? lines : ['']; };
  start(); line('Kostenvoranschlag', 42, y, 18, true); y -= 22;
  line('Fahrzeug: ' + vehicle, 42, y, 11, true); y -= 16;
  line(`Erstellt: ${date(today)}    Gültig bis: ${date(until)}`, 42, y, 10); y -= 23;
  line('Codierungen und Preise', 42, y, 12, true); y -= 18;
  for (const entry of entries) {
    const lines = wrap(entry.name); ensure(lines.length * 13 + 7);
    ops.push(`0.6 w 43 ${y - 1} 9 9 re S`); if (selected.includes(entry.id)) { ops.push(`43 ${y - 1} m 52 ${y + 8} l S 43 ${y + 8} m 52 ${y - 1} l S`); }
    line(lines[0], 60, y, 9); line(money(entry.price), 500, y, 9, true); y -= 13;
    for (const part of lines.slice(1)) { line(part, 60, y, 9); y -= 13; } y -= 5;
  }
  ensure(130); y -= 10; line('Berechnung der ausgewählten Codierungen', 42, y, 12, true); y -= 19;
  if (!selected.length) { line('Noch keine Codierungen ausgewählt.', 42, y, 10); y -= 17; }
  if (sfdFee) { line('SFD1-Freischaltung (einmalig)', 42, y); line(money(sfdFee), 500, y); y -= 16; }
  line('Zwischensumme', 42, y); line(money(subtotal), 500, y); y -= 16;
  line(`Aktionsrabatt (${Math.round(rate * 100)} %)`, 42, y); line('-' + money(discount), 500, y); y -= 18;
  line('Gesamtpreis', 42, y, 12, true); line(money(total), 500, y, 12, true); y -= 23;
  for (const t of wrap('Preis und Durchführbarkeit vorbehaltlich Prüfung von Fahrzeug, Ausstattung und Softwarestand. Kleinunternehmer gemäß § 19 UStG; Umsatzsteuer wird nicht gesondert ausgewiesen.', 98)) { ensure(15); line(t, 42, y, 8); y -= 12; }
  const objects = [null]; const add = data => { objects.push(data); return objects.length - 1; };
  const catalog = add(null), pageTree = add(null), font = add(bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')), bold = add(bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'));
  const logo = image ? add(concat(bytes(`<< /Type /XObject /Subtype /Image /Width 240 /Height 240 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`), image, bytes('\nendstream'))) : null;
  const pageIds = [];
  for (const page of pages) { const stream = bytes(page.join('\n')); const content = add(concat(bytes(`<< /Length ${stream.length} >>\nstream\n`), stream, bytes('\nendstream'))); const pageId = add(bytes(`<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> ${logo ? `/XObject << /Logo ${logo} 0 R >>` : ''} >> /Contents ${content} 0 R >>`)); pageIds.push(pageId); }
  objects[catalog] = bytes(`<< /Type /Catalog /Pages ${pageTree} 0 R >>`); objects[pageTree] = bytes(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`);
  const chunks = [bytes('%PDF-1.4\n')]; const offsets = [0]; let size = chunks[0].length;
  for (let i = 1; i < objects.length; i++) { offsets[i] = size; const item = concat(bytes(`${i} 0 obj\n`), objects[i], bytes('\nendobj\n')); chunks.push(item); size += item.length; }
  const xref = size; chunks.push(bytes(`xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map(n => String(n).padStart(10, '0') + ' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`));
  const url = URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' })); const a = document.createElement('a'); a.href = url; a.download = 'TD-Kostenvoranschlag.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
