import "server-only";
import { createDecipheriv, createHash } from "node:crypto";
import { sealedMqbGuides } from "./mqbGuideSealedData";
import type { MQB_GUIDE_PRODUCTS } from "./mqbGuideProducts";

export function readMqbGuideDocument(product: (typeof MQB_GUIDE_PRODUCTS)[number]): Buffer | null {
  const key = Buffer.from(process.env.TD_MQB_GUIDE_DOCUMENT_KEY ?? "", "base64");
  if (key.length !== 32) return null;
  try {
    const source = (sealedMqbGuides as Readonly<Record<string, string | undefined>>)[product.slug];
    if (!source) return null;
    const sealed = Buffer.from(source, "base64");
    const decipher = createDecipheriv("aes-256-gcm", key, sealed.subarray(0, 12));
    decipher.setAAD(Buffer.from(product.slug));
    decipher.setAuthTag(sealed.subarray(12, 28));
    const pdf = Buffer.concat([decipher.update(sealed.subarray(28)), decipher.final()]);
    return createHash("sha256").update(pdf).digest("hex") === product.sha256 ? pdf : null;
  } catch {
    return null;
  }
}
