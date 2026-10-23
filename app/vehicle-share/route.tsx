import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import branding from "../data/vehicle-branding.json";

export const dynamic = "force-static";

export async function GET() {
  const [photo, badge] = await Promise.all([
    readFile(join(process.cwd(), "public/branding/hero-share-background.jpg")),
    readFile(join(process.cwd(), "public/branding/td-chrome-open.png")),
  ]);
  const vehicle = branding["/td-hero-chrome.webp"];
  const [x, y, width, height] = vehicle.front;
  const scale = 1200 / vehicle.width;
  const badgeWidth = width * scale / 0.9;
  const badgeHeight = height * scale / 0.9;

  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
    {/* ImageResponse renders ordinary image elements into the share card. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} alt="" width={1200} height={675} />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`data:image/png;base64,${badge.toString("base64")}`} alt="" width={badgeWidth} height={badgeHeight}
      style={{ position: "absolute", left: x * scale - badgeWidth / 2, top: y * scale - badgeHeight / 2 }} />
  </div>, { width: 1200, height: 675 });
}
