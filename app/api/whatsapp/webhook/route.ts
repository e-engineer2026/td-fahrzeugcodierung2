import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

function secureEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

function validMetaSignature(rawBody: string, signature: string | null, appSecret: string) {
  if (!signature?.startsWith("sha256=")) return false;

  const expected =
    "sha256=" +
    createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");

  return secureEqual(signature, expected);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    return Response.json(
      { error: "WhatsApp webhook is not configured." },
      { status: 503 },
    );
  }

  if (
    mode === "subscribe" &&
    token &&
    secureEqual(token, verifyToken) &&
    challenge
  ) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return Response.json({ error: "Webhook verification failed." }, { status: 403 });
}

export async function POST(request: Request) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (!appSecret) {
    return Response.json(
      { error: "WhatsApp webhook is not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!validMetaSignature(rawBody, signature, appSecret)) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const event = payload as {
    object?: string;
    entry?: Array<{
      changes?: Array<{ field?: string }>;
    }>;
  };

  // Keep logs intentionally free of message bodies and phone numbers.
  console.info("WhatsApp webhook received", {
    object: event.object ?? "unknown",
    entries: event.entry?.length ?? 0,
    fields:
      event.entry
        ?.flatMap((entry) => entry.changes ?? [])
        .map((change) => change.field ?? "unknown") ?? [],
  });

  return Response.json({ received: true });
}
