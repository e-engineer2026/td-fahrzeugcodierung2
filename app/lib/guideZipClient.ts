/** Client-side ZIP reader for TD's PDF bulk import.
 * Only PDFs are returned. Files never leave the browser until the admin submits
 * each document through the existing authenticated draft-upload endpoint.
 * Supports regular ZIP store/deflate; refuses encryption, paths and ZIP64.
 */
export async function extractGuidePdfsFromZip(file: File): Promise<File[]> {
  if (file.size > 45_000_000) throw new Error("ZIP ist zu groß (max. 45 MB).");
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const u16 = (offset: number) => view.getUint16(offset, true);
  const u32 = (offset: number) => view.getUint32(offset, true);
  let end = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65_557); i--) {
    if (u32(i) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new Error("Keine gültige ZIP-Datei.");
  const entries = u16(end + 10);
  const size = u32(end + 12);
  let cursor = u32(end + 16);
  if (entries === 0 || entries > 100 || cursor + size > end)
    throw new Error("ZIP-Verzeichnis ungültig oder enthält zu viele Dateien.");
  const pdfs: File[] = [];
  let total = 0;
  for (let i = 0; i < entries; i++) {
    if (cursor + 46 > buffer.byteLength || u32(cursor) !== 0x02014b50)
      throw new Error("ZIP-Verzeichnis beschädigt.");
    const flags = u16(cursor + 8);
    const compression = u16(cursor + 10);
    const compressed = u32(cursor + 20);
    const uncompressed = u32(cursor + 24);
    const nameLen = u16(cursor + 28);
    const extraLen = u16(cursor + 30);
    const commentLen = u16(cursor + 32);
    const local = u32(cursor + 42);
    const name = new TextDecoder("utf-8").decode(bytes.subarray(cursor + 46, cursor + 46 + nameLen));
    cursor += 46 + nameLen + extraLen + commentLen;
    if (flags & 1) throw new Error("Verschlüsselte ZIP-Dateien werden nicht unterstützt.");
    if (name === "manifest.json" || name.endsWith("/")) continue;
    if (!name.toLowerCase().endsWith(".pdf") || name.includes("/") || name.includes("\\") ||
        name === "." || name === "..")
      throw new Error("ZIP darf nur PDF-Dateien im Hauptverzeichnis enthalten.");
    if (local === 0xffffffff || compressed === 0xffffffff || uncompressed > 3_000_000 ||
        local + 30 > buffer.byteLength || u32(local) !== 0x04034b50)
      throw new Error("ZIP-Dateigröße oder Eintrag ungültig.");
    const offset = local + 30 + u16(local + 26) + u16(local + 28);
    if (offset + compressed > buffer.byteLength) throw new Error("ZIP-Datei abgeschnitten.");
    let data: ArrayBuffer;
    if (compression === 0) {
      data = buffer.slice(offset, offset + compressed);
    } else if (compression === 8) {
      if (typeof DecompressionStream === "undefined")
        throw new Error("Dieser Browser unterstützt ZIP-Entpackung nicht. Bitte ZIP vorher entpacken.");
      try {
        const stream = new Blob([buffer.slice(offset, offset + compressed)]).stream()
          .pipeThrough(new DecompressionStream("deflate-raw" as CompressionFormat));
        data = await new Response(stream).arrayBuffer();
      } catch {
        throw new Error("ZIP-Entpackung fehlgeschlagen. Bitte ZIP vorher entpacken.");
      }
    } else throw new Error("Nicht unterstützte ZIP-Komprimierung.");
    if (data.byteLength !== uncompressed || data.byteLength > 3_000_000 ||
        new TextDecoder("ascii").decode(new Uint8Array(data.slice(0, 5))) !== "%PDF-")
      throw new Error("Ungültige PDF im ZIP: " + name);
    total += data.byteLength;
    if (total > 80_000_000) throw new Error("Zu viele PDF-Daten im ZIP.");
    pdfs.push(new File([data], name, { type: "application/pdf" }));
  }
  if (!pdfs.length) throw new Error("Keine PDFs im ZIP gefunden.");
  return pdfs;
}
