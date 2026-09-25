export const runtime = "nodejs";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v26.0";

function authorized(request: Request) {
  const expected = process.env.WHATSAPP_INTERNAL_API_SECRET;
  const authorization = request.headers.get("authorization");

  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  return authorization.slice(7) === expected;
}

function normalizeRecipient(value: string) {
  return value.trim().replace(/[^0-9]/g, "");
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    return Response.json(
      { error: "WhatsApp Cloud API is not configured." },
      { status: 503 },
    );
  }

  let body: { to?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const to = typeof body.to === "string" ? normalizeRecipient(body.to) : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!to || !text) {
    return Response.json(
      { error: "Fields 'to' and 'text' are required." },
      { status: 400 },
    );
  }

  if (text.length > 4096) {
    return Response.json(
      { error: "Message text is too long." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const metaError =
      data && typeof data === "object" && "error" in data
        ? (data as { error?: { message?: string; code?: number } }).error
        : undefined;

    return Response.json(
      {
        error: "Meta rejected the WhatsApp message.",
        meta: metaError
          ? { message: metaError.message, code: metaError.code }
          : undefined,
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, result: data });
}
