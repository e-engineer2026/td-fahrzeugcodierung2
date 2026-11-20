/**
 * TD Fahrzeugcodierung: Gmail -> PayPal.Me -> Kundenkonto-PDF.
 *
 * Einmalig im Google-Konto mit dem PayPal-Postfach unter script.google.com
 * einrichten. Die Zahlung selbst läuft unverändert über PayPal.Me.
 *
 * Script Properties:
 *   RELEASE_URL = https://td-fahrzeugcodierung.de/api/guide-shop/automations/paypalme-email
 *   RELEASE_SECRET = derselbe lange Zufallsschlüssel wie TD_PAYPALME_GMAIL_SECRET in Vercel
 *
 * Danach installTrigger einmal starten und Google-Gmail/URL-Zugriff bestätigen.
 */
const TD_REFERENCE_RE = /\bTDG7-[A-F0-9]{8}\b/gi;
const TD_TRANSACTION_RE = /\b(?:Transaktionscode|Transaction ID|Transaktionsnummer)\s*[:#]?\s*([A-Z0-9]{17})\b/i;

function authenticatedPaypalNotification(message) {
  const from = String(message.getFrom() || "");
  const address = from.match(/(?:^|[\s<])(service@paypal\.(?:de|com))(?:>|$)/i);
  if (!address) return false;
  // Only receipts delivered directly to the PayPal account's own Gmail inbox.
  if (!/(?:^|[,<\s])timo\.drechsler@gmail\.com(?:[>,\s]|$)/i.test(String(message.getTo() || "")))
    return false;
  const raw = String(message.getRawContent() || "");
  const header = raw.split(/\r?\n\r?\n/)[0].replace(/\r?\n[ \t]+/g, " ");
  const results = [...header.matchAll(/^Authentication-Results:\s*([^\r\n]+)/gim)]
    .map(match => match[1]);
  // Gmail's real PayPal emails use "header.i=@paypal.de", not "header.d=paypal.de".
  // The DMARC check must be aligned with the PayPal From domain.
  return results.some(value =>
    /^mx\.google\.com\s*;/i.test(value) &&
    /\bdkim=pass\b[^;\n]*\bheader\.(?:i|d)=@?paypal\.(?:com|de)\b/i.test(value) &&
    /\bdmarc=pass\b[^;\n]*\bheader\.from=paypal\.(?:com|de)\b/i.test(value)
  );
}

function eurCents(number) {
  if (!/^\d{1,6}(?:\.\d{3})*,\d{2}$/.test(number)) return null;
  const parts = number.replace(/\./g, "").split(",");
  return Number(parts[0]) * 100 + Number(parts[1]);
}

function extractPayment(message) {
  if (!authenticatedPaypalNotification(message)) return null;
  if (!/Du hast eine Zahlung erhalten|you(?:'|’)ve (?:received|got) (?:money|a payment)/i
    .test(message.getSubject())) return null;
  const body = String(message.getPlainBody() || "");
  const detailsAt = body.indexOf("Transaktionsdetails");
  if (detailsAt < 0) return null;

  // Check TWO official receipt fields, not customer-entered free text. Reject
  // a different amount, wrong currency, or an unrecognised email template.
  const introduction = body.slice(0, detailsAt);
  const sent = introduction.match(/\bhat dir\s+([\d.,]+)\s*€\s*EUR\s+gesendet\b/i);
  const details = body.slice(detailsAt, detailsAt + 1600);
  const received = details.match(/\bErhaltener Betrag\s+([\d.,]+)\s*€\s*EUR\b/i);
  if (!sent || !received || eurCents(sent[1]) !== 1399 || eurCents(received[1]) !== 1399)
    return null;

  const references = [...new Set((body.match(TD_REFERENCE_RE) || []).map(item => item.toUpperCase()))];
  const txn = details.match(TD_TRANSACTION_RE);
  if (references.length !== 1 || !txn) return null;
  const at = message.getDate();
  if (!(at instanceof Date) || Number.isNaN(at.getTime())) return null;
  return {
    orderReference: references[0],
    paypalTransactionId: txn[1].toUpperCase(),
    gmailMessageId: message.getId(),
    amountCents: 1399,
    currency: "EUR",
    receivedAt: at.toISOString()
  };
}

function signPayload(timestamp, rawBody, secret) {
  const signature = Utilities.computeHmacSha256Signature(timestamp + "." + rawBody, secret);
  return "sha256=" + signature
    .map(byte => ("0" + (byte & 255).toString(16)).slice(-2)).join("");
}

function checkPayPalMessages() {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty("RELEASE_URL");
  const secret = props.getProperty("RELEASE_SECRET");
  if (url !== "https://td-fahrzeugcodierung.de/api/guide-shop/automations/paypalme-email" ||
      !secret || secret.length < 32) {
    throw new Error("RELEASE_URL und RELEASE_SECRET müssen eingerichtet sein.");
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2000)) return;
  try {
    const query = 'from:(service@paypal.de OR service@paypal.com) newer_than:10d -in:spam -in:trash';
    const threads = GmailApp.search(query, 0, 100);
    for (const thread of threads) {
      for (const message of thread.getMessages()) {
        const key = "td_paid_" + message.getId();
        if (props.getProperty(key)) continue;
        const payment = extractPayment(message);
        if (!payment) continue;
        const body = JSON.stringify(payment);
        const timestamp = String(Math.floor(Date.now() / 1000));
        const signature = signPayload(timestamp, body, secret);
        try {
          const response = UrlFetchApp.fetch(url, {
            method: "post",
            contentType: "application/json",
            payload: body,
            headers: { "X-TD-Timestamp": timestamp, "X-TD-Signature": signature },
            muteHttpExceptions: true,
            followRedirects: false,
          });
          const status = response.getResponseCode();
          const result = JSON.parse(response.getContentText());
          if (status === 200 && result.released === true) {
            // An identical payment is never released a second time.
            props.setProperty(key, String(Date.now()));
            console.log("PDF freigegeben: " + payment.orderReference);
          } else {
            // Keep unmatched, ambiguous or not-yet-active receipts pending for retry.
            console.log("Freigabe noch offen: " + payment.orderReference + ", HTTP " + status);
          }
        } catch (error) {
          console.error("Zahlungsprüfung nicht möglich: " + String(error));
        }
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function installTrigger() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty("RELEASE_SECRET") || !props.getProperty("RELEASE_URL")) {
    throw new Error("Zuerst die Script Properties setzen.");
  }
  for (const trigger of ScriptApp.getProjectTriggers()) {
    if (trigger.getHandlerFunction() === "checkPayPalMessages") ScriptApp.deleteTrigger(trigger);
  }
  ScriptApp.newTrigger("checkPayPalMessages").timeBased().everyMinutes(15).create();
  console.log("PayPal.Me Gmail-Prüfung alle 15 Minuten eingerichtet.");
}
