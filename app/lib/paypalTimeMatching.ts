/** Ausschliesslich ein Hinweis auf einen moeglichen Treffer, kein Zahlungsnachweis. */
export type PendingPaymentOrder = {
  id: string;
  createdAt: string;
  paypalStartedAt?: string | null;
};

export type PayPalTimeSuggestion =
  | { status: "single"; orderId: string; minutesAfterStart: number }
  | { status: "ambiguous"; orderIds: string[] }
  | { status: "none" };

/**
 * Nur Aufrufe von PayPal.Me zaehlen. Bestellzeit alleine genuegt nicht.
 * 2 Minuten Uhrabweichung und maximal 30 Minuten bis zur Zahlung.
 * Schon zwei moegliche Auftraege => keine automatische Auswahl.
 */
export function suggestPayPalOrderByTime(
  orders: PendingPaymentOrder[],
  paymentTimeMs: number,
): PayPalTimeSuggestion {
  if (!Number.isFinite(paymentTimeMs)) return { status: "none" };
  const matches = orders.flatMap((order) => {
    if (!order.paypalStartedAt) return [];
    const start = Date.parse(order.paypalStartedAt);
    if (!Number.isFinite(start)) return [];
    const elapsed = (paymentTimeMs - start) / 60000;
    return elapsed >= -2 && elapsed <= 30 ? [{ id: order.id, minutesAfterStart: elapsed }] : [];
  });
  if (matches.length === 1) return {
    status: "single", orderId: matches[0].id, minutesAfterStart: matches[0].minutesAfterStart
  };
  if (matches.length > 1) return { status: "ambiguous", orderIds: matches.map((order) => order.id) };
  return { status: "none" };
}
