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
  const from = String(message.getFrom() || "").match(/(?:<)?(service@paypal\.(?:de|com))(?:>)?/i);
  if (!from) return false;
  // Fail closed if Gmail's authenticating results are absent.
  // Not equivalent to payment verification: the backend checks PayPal itself.
  const raw = message.getRawContent();
  const hdr = String(raw).split(/\r?\n\r?\n/)[0].replace(/\r?\n[ \t]+/g, " ");
  const results = [...hdr.matchAll(/^Authentication-Results:\s*([^\r\n]+)/gim)]
    .map(match => match[1]);
  return results.some(value =>
    /\bmx\.google\.com\b/i.test(value) &&
    /\bdkim=pass\b[^;\n]*\bheader\.d=paypal\.(?:com|de)\b/i.test(value) &&
    /\bdmarc=pass\b[^;\n]*\bheader\.from=paypal\.(?:com|de)\b/i.test(value)
  );
}

function extractPayment(message) {
  if (!authenticatedPaypalNotification(message)) return null;
  const subject = message.getSubject();
  if (!/Du hast eine Zahlung erhalten|you(?:'|’)ve (?:received|got) (?:money|a payment)/i.test(subject))
    return null;
  const body = message.getPlainBody();
  const references = [...new Set((body.match(TD_REFERENCE_RE) || []).map(item => item.toUpperCase()))];
  const txn = body.match(TD_TRANSACTION_RE);
  if (references.length !== 1 || !txn) return null;
  return {
    orderReference: references[0],
    paypalTransactionId: txn[1].toUpperCase(),
    gmailMessageId: message.getId(),
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
            // Keep unprocessed for the next run; PayPal reporting may lag.
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
