export async function downloadQuotePdf({ vehicle, vehicleImage, entries, selected, sfdFee, subtotal, rate, discount, total }) {
  const encoder = new TextEncoder();
  const bytes = (s) => encoder.encode(s);
  const concat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let i = 0; for (const p of parts) { out.set(p, i); i += p.length; } return out; };
  const winAnsi = (s) => { const special = { '€': 128, '–': 150, '—': 151, '„': 132, '“': 147, '”': 148, '’': 146, 'Š': 138, 'š': 154, '•': 149 }; return Array.from(s, c => { const v = special[c] ?? c.charCodeAt(0); return v <= 255 ? v : 63; }); };
  const hex = (s) => '<' + winAnsi(s).map(n => n.toString(16).padStart(2, '0')).join('') + '>';
  const loadImage = async (src, width, height) => {
    const img = new Image(); img.src = src; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d'); if (!context) throw new Error('canvas');
    context.fillStyle = '#fff'; context.fillRect(0, 0, width, height);
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    context.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    const data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    return Uint8Array.from(atob(data), c => c.charCodeAt(0));
  };
  const image = await loadImage('/td-logo-status.webp', 450, 160);
  let car = null;
  if (vehicleImage) { try { car = await loadImage(vehicleImage, 720, 360); } catch { /* Text label remains available if the image fails to load. */ } }
  const today = new Date(); const until = new Date(today); until.setDate(until.getDate() + 14);
  const date = d => d.toLocaleDateString('de-DE');
  const money = n => n.toFixed(2).replace('.', ',') + ' €';
  const pages = []; let ops = []; let y = 0;
  const line = (text, x, yy, size = 10, bold = false) => ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${yy} Td ${hex(text)} Tj ET`);
  const start = () => {
    ops = []; pages.push(ops);
    ops.push('0.06 0.15 0.28 rg 0 830 595 12 re f 0 0 0 rg');
    ops.push('q 112 0 0 40 42 781 cm /Logo Do Q');
    line('TD Fahrzeugcodierung', 165, 807, 15, true);
    line('Schenkendorfstraße 33 · 04275 Leipzig', 165, 792, 9);
    line('01556 3047044 · info@td-fahrzeugcodierung.de', 165, 779, 9);
    ops.push('0.15 0.4 0.8 RG 42 765 m 553 765 l S 0 0 0 RG'); y = 744;
  };
  const ensure = (space) => { if (y - space < 48) start(); };
  const wrap = (s, max = 77) => { const lines = []; let line = ''; for (const word of s.split(/\s+/)) { if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; } else line += (line ? ' ' : '') + word; } if (line) lines.push(line); return lines.length ? lines : ['']; };
  start(); line(selected.length ? 'Kostenvoranschlag' : 'Codierliste und Preise', 42, y, 18, true); y -= 22;
  line('Fahrzeug: ' + vehicle, 42, y, 11, true); y -= 16;
  line(selected.length ? `Erstellt: ${date(today)}    Gültig bis: ${date(until)}` : `Stand: ${date(today)}`, 42, y, 10); y -= 14;
  if (car) { ops.push(`q 210 0 0 105 340 ${y - 105} cm /Car Do Q`); y -= 112; } else { y -= 12; }
  line('Codierungen und Preise', 42, y, 12, true); y -= 18;
  for (const entry of entries) {
    const lines = wrap(entry.name); ensure(lines.length * 13 + 7);
    ops.push(`0.6 w 43 ${y - 1} 9 9 re S`); if (selected.includes(entry.id)) { ops.push(`43 ${y - 1} m 52 ${y + 8} l S 43 ${y + 8} m 52 ${y - 1} l S`); }
    line(lines[0], 60, y, 9); line(money(entry.price), 500, y, 9, true); y -= 13;
    for (const part of lines.slice(1)) { line(part, 60, y, 9); y -= 13; } y -= 5;
  }
  if (selected.length) { ensure(130); y -= 10; line('Berechnung der ausgewählten Codierungen', 42, y, 12, true); y -= 19;
  if (sfdFee) { line('SFD1-Freischaltung (einmalig)', 42, y); line(money(sfdFee), 500, y); y -= 16; }
  line('Zwischensumme', 42, y); line(money(subtotal), 500, y); y -= 16;
  line(`Aktionsrabatt (${Math.round(rate * 100)} %)`, 42, y); line('-' + money(discount), 500, y); y -= 18;
  line('Gesamtpreis', 42, y, 12, true); line(money(total), 500, y, 12, true); y -= 23; }
  for (const t of wrap('Preis und Durchführbarkeit vorbehaltlich Prüfung von Fahrzeug, Ausstattung und Softwarestand. Kleinunternehmer gemäß § 19 UStG; Umsatzsteuer wird nicht gesondert ausgewiesen.', 98)) { ensure(15); line(t, 42, y, 8); y -= 12; }
  const objects = [null]; const add = data => { objects.push(data); return objects.length - 1; };
  const catalog = add(null), pageTree = add(null), font = add(bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')), bold = add(bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'));
  const logo = image ? add(concat(bytes(`<< /Type /XObject /Subtype /Image /Width 450 /Height 160 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`), image, bytes('\nendstream'))) : null;
  const carId = car ? add(concat(bytes(`<< /Type /XObject /Subtype /Image /Width 720 /Height 360 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${car.length} >>\nstream\n`), car, bytes('\nendstream'))) : null;
  const pageIds = [];
  for (const page of pages) { const stream = bytes(page.join('\n')); const content = add(concat(bytes(`<< /Length ${stream.length} >>\nstream\n`), stream, bytes('\nendstream'))); const pageId = add(bytes(`<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> ${logo ? `/XObject << /Logo ${logo} 0 R ${carId ? `/Car ${carId} 0 R` : ''} >>` : ''} >> /Contents ${content} 0 R >>`)); pageIds.push(pageId); }
  objects[catalog] = bytes(`<< /Type /Catalog /Pages ${pageTree} 0 R >>`); objects[pageTree] = bytes(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`);
  const chunks = [bytes('%PDF-1.4\n')]; const offsets = [0]; let size = chunks[0].length;
  for (let i = 1; i < objects.length; i++) { offsets[i] = size; const item = concat(bytes(`${i} 0 obj\n`), objects[i], bytes('\nendobj\n')); chunks.push(item); size += item.length; }
  const xref = size; chunks.push(bytes(`xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map(n => String(n).padStart(10, '0') + ' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`));
  const url = URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' })); const a = document.createElement('a'); a.href = url; a.download = selected.length ? 'TD-Kostenvoranschlag.pdf' : 'TD-Codierliste.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
