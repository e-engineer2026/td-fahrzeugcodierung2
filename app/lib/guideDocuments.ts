import "server-only";
import { createHash } from "node:crypto";
import type { shopDatabase } from "./guideShopDb";

type DocumentRow = { sha256?: unknown; assigned_filename?: unknown; withdrawn?: unknown };

export function isAvailableGuideDocument(
  row: DocumentRow | undefined,
  expectedSha256: string,
  fallback?: () => Buffer | null,
): boolean {
  return row?.withdrawn !== true &&
    (typeof row?.assigned_filename === "string" || (expectedSha256 !== "" && row?.sha256 === expectedSha256) || !!fallback?.());
}

export function isGuidePdf(bytes: Buffer): boolean {
  return bytes.subarray(0, 5).toString("ascii") === "%PDF-" &&
    bytes.subarray(-2048).toString("latin1").includes("%%EOF");
}

export async function readGuidePdf(
  sql: ReturnType<typeof shopDatabase>,
  productId: string,
  expectedSha256: string,
  defaultFilename: string,
  fallback?: () => Buffer | null,
) {
  const [file] = await sql`SELECT encode(file_data,'base64') AS data, sha256, assigned_filename, withdrawn
    FROM td_guide_documents WHERE product_id=${productId}`;
  if (file?.withdrawn === true) return null;
  if (file && isAvailableGuideDocument(file, expectedSha256) && typeof file.data === "string") {
    const bytes = Buffer.from(file.data, "base64");
    if (isGuidePdf(bytes) && createHash("sha256").update(bytes).digest("hex") === file.sha256) {
      return { bytes, filename: typeof file.assigned_filename === "string" ? file.assigned_filename : defaultFilename };
    }
  }
  const bytes = fallback?.();
  return bytes ? { bytes, filename: defaultFilename } : null;
}

export function guidePdfResponse(bytes: Buffer, filename: string, headers: Record<string, string>) {
  const fallback = filename.replace(/[^A-Za-z0-9._-]/g, "_");
  const encoded = encodeURIComponent(filename).replace(/['()*]/g, char =>
    "%" + char.charCodeAt(0).toString(16).toUpperCase());
  return new Response(new Uint8Array(bytes), {
    headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`,
      "Content-Length": String(bytes.length),
    },
  });
}
