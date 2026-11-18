import "server-only";

// Reporting credentials belong to the PayPal account receiving paypal.me/TiDrechsler payments.
// They are separate from the dormant automated checkout configuration.
export type GuidePayment = {
  id: string; date: string; amount: string; currency: string; status: string;
  note: string; payerEmail: string; productMatch: boolean;
};

export class ReportingError extends Error {
  constructor(public readonly code: string) { super(code); }
}

async function reportingToken(): Promise<string> {
  const id = process.env.PAYPAL_REPORTING_CLIENT_ID;
  const secret = process.env.PAYPAL_REPORTING_CLIENT_SECRET;
  if (!id || !secret) throw new ReportingError("not_configured");
  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new ReportingError(response.status === 401 ? "credentials_rejected" : "oauth_failed");
  const data = await response.json() as { access_token?: string; scope?: string };
  if (!data.access_token) throw new ReportingError("oauth_failed");
  if (!data.scope?.split(" ").includes("https://uri.paypal.com/services/reporting/search/read"))
    throw new ReportingError("reporting_scope_missing");
  return data.access_token;
}

export async function listGuidePayments(): Promise<GuidePayment[]> {
  const token = await reportingToken();
  const end = new Date();
  const start = new Date(end.getTime() - 14 * 86400000);
  const query = new URLSearchParams({
    start_date: start.toISOString(), end_date: end.toISOString(),
    fields: "transaction_info,payer_info", transaction_currency: "EUR",
    transaction_amount: "13.99", page_size: "100", page: "1",
  });
  const response = await fetch("https://api-m.paypal.com/v1/reporting/transactions?" + query, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new ReportingError(response.status === 403 ? "reporting_permission_denied" : "reporting_unavailable");
  const data = await response.json() as {
    total_pages?: number;
    transaction_details?: Array<{
      transaction_info?: { transaction_id?: string; transaction_status?: string;
        transaction_updated_date?: string; transaction_amount?: { value?: string; currency_code?: string };
        transaction_note?: string; transaction_subject?: string; invoice_id?: string };
      payer_info?: { email_address?: string };
    }>;
  };
  if ((data.total_pages ?? 1) > 1) throw new ReportingError("too_many_results");
  return (data.transaction_details ?? []).flatMap(({ transaction_info: info, payer_info: payer }) => {
    if (!info?.transaction_id || !/^[A-Z0-9-]{8,64}$/i.test(info.transaction_id)) return [];
    const amount = info.transaction_amount?.value ?? "";
    const currency = info.transaction_amount?.currency_code ?? "";
    if (Number(amount) !== 13.99 || currency !== "EUR") return [];
    const note = [info.transaction_note, info.transaction_subject, info.invoice_id].filter(Boolean).join(" · ");
    return [{ id: info.transaction_id, date: info.transaction_updated_date ?? "", amount,
      currency, status: info.transaction_status ?? "", note: note.slice(0, 250),
      payerEmail: payer?.email_address ?? "", productMatch: /TD-G7-AS-003|TDG7VZE/i.test(note) }];
  });
}
