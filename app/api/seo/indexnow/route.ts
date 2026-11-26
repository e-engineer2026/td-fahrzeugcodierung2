import { timingSafeEqual } from "node:crypto";
import { shopDatabase } from "../../../lib/guideShopDb";
import { publishedGuideCatalog } from "../../../lib/publishedGuideCatalog";
import { changedUrls, type UrlSnapshot } from "../../../lib/indexNowDiff";
import { SEO_ORIGIN, INDEXNOW_KEY, INDEXNOW_KEY_PATH } from "../../../lib/indexNowConfig";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || process.env.VERCEL_ENV !== "production") return false;
  const expected = Buffer.from("Bearer " + secret);
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export async function GET(request: Request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
  const sql = shopDatabase();
  try {
    // Do not turn a failed catalog lookup into a mass removal notification.
    const { links } = await publishedGuideCatalog();
    const current: UrlSnapshot = Object.fromEntries(links.map(link =>
      [SEO_ORIGIN + link.href, link.lastModified?.toISOString() ?? "published"]));
    await sql`CREATE TABLE IF NOT EXISTS td_seo_indexnow_state (
      id text PRIMARY KEY, snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
      last_success_at timestamptz, last_count integer NOT NULL DEFAULT 0,
      last_status integer)`;
    await sql`INSERT INTO td_seo_indexnow_state (id) VALUES ('primary') ON CONFLICT DO NOTHING`;
    const [state] = await sql`SELECT snapshot, last_success_at FROM td_seo_indexnow_state WHERE id='primary'`;
    const previous = (state?.snapshot ?? {}) as UrlSnapshot;
    // Fail closed on an unexpected empty catalog; explicit mass withdrawals can be reviewed manually.
    if (!links.length && Object.keys(previous).length) return Response.json({ error: "Empty catalog; no submission." }, { status: 503 });
    const urls = changedUrls(previous, current);
    if (!urls.length) return Response.json({ submitted: 0 });
    for (let i = 0; i < urls.length; i += 1000) {
      const result = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({host: new URL(SEO_ORIGIN).host, key: INDEXNOW_KEY,
          keyLocation: SEO_ORIGIN + INDEXNOW_KEY_PATH, urlList: urls.slice(i, i + 1000)}),
        signal: AbortSignal.timeout(10000), cache: "no-store",
      });
      if (![200, 202].includes(result.status)) {
        await sql`UPDATE td_seo_indexnow_state SET last_status=${result.status} WHERE id='primary'`;
        return Response.json({ error: "IndexNow rejected submission", status: result.status }, { status: 502 });
      }
      await sql`UPDATE td_seo_indexnow_state SET last_status=${result.status} WHERE id='primary'`;
    }
    await sql`UPDATE td_seo_indexnow_state SET snapshot=${JSON.stringify(current)}::jsonb,
      last_success_at=now(), last_count=${urls.length} WHERE id='primary'`;
    return Response.json({ submitted: urls.length });
  } catch (error) {
    console.error("IndexNow synchronization failed", error instanceof Error ? error.name : "unknown");
    return Response.json({ error: "Synchronization failed" }, { status: 503 });
  }
}
