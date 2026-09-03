"use client";

import { FormEvent, useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default function ContactBox() {
  const [name, setName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [year, setYear] = useState("");
  const [coding, setCoding] = useState("");
  const [website, setWebsite] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const whatsappNumber = "4915563047044";
  const phoneDisplay = "01556 3047044";
  const email = "td.codierung@gmail.com";

  const whatsappText = encodeURIComponent(
    `Hallo, ich möchte eine Codierung vorprüfen lassen.\n\nName: ${name || "-"}\nFahrzeug: ${vehicle || "-"}\nBaujahr: ${year || "-"}\nCodierung: ${coding || "-"}`
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (website) return;

    setStatus("sending");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Neue Codierungsanfrage: ${vehicle}`,
          _template: "table",
          _captcha: "false",
          _honey: website,
          _replyto: customerEmail,
          _url: "https://td-fahrzeugcodierung.vercel.app/#kontakt",
          Name: name,
          "E-Mail": customerEmail,
          Fahrzeug: vehicle,
          Baujahr: year,
          Codierung: coding,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error("Formularversand fehlgeschlagen");

      setName("");
      setCustomerEmail("");
      setVehicle("");
      setYear("");
      setCoding("");
      setPrivacyAccepted(false);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="card p-4 sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366] text-white">
          <MessageCircle className="h-7 w-7" />
        </div>

        <h3 className="mt-5 text-xl font-black sm:mt-6 sm:text-2xl">Direkt Kontakt aufnehmen</h3>
        <p className="mt-3 leading-7 text-slate-600">
          Schick uns Fahrzeug, Baujahr und Codierung. Wir prüfen vorab, ob die gewünschte Codierung grundsätzlich möglich ist.
        </p>

        <div className="mt-5 space-y-3 sm:mt-6">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:text-base"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp: {phoneDisplay}
          </a>

          <a
            href={`tel:+${whatsappNumber}`}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 sm:text-base"
          >
            <Phone className="h-5 w-5" />
            {phoneDisplay}
          </a>

          <a
            href={`mailto:${email}`}
            className="flex min-w-0 items-center gap-3 break-all rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-base"
          >
            <Mail className="h-5 w-5" />
            {email}
          </a>
        </div>
      </div>

      <form onSubmit={submit} className="card p-4 sm:p-8">
        <h3 className="text-xl font-black sm:text-2xl">Codierung vorprüfen lassen</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Formular ausfüllen und direkt absenden. Wir melden uns per E-Mail zurück.
        </p>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            autoComplete="name"
            required
          />
          <input
            type="email"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            placeholder="E-Mail für Rückmeldung"
            autoComplete="email"
            required
          />
          <input
            value={vehicle}
            onChange={e => setVehicle(e.target.value)}
            placeholder="Fahrzeug, z. B. Audi A4 B9"
            required
          />
          <input
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="Baujahr"
            inputMode="numeric"
            pattern="[0-9]{4}"
            required
          />
          <input
            value={coding}
            onChange={e => setCoding(e.target.value)}
            placeholder="Codierung"
            required
          />
        </div>

        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Website
            <input
              value={website}
              onChange={e => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-600">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={e => setPrivacyAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0"
            required
          />
          <span>
            Ich habe die <a href="/datenschutz" className="font-semibold text-blue-700 hover:underline">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu.
          </span>
        </label>

        <div className="mt-4" aria-live="polite">
          {status === "success" && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              Anfrage erfolgreich gesendet. Wir melden uns schnellstmöglich per E-Mail.
            </p>
          )}
          {status === "error" && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Die Anfrage konnte nicht gesendet werden. Bitte nutze WhatsApp oder schreibe direkt an <a href={`mailto:${email}`} className="font-semibold underline">{email}</a>.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            <Mail className="mr-2 h-4 w-4" />
            {status === "sending" ? "Wird gesendet …" : "Anfrage direkt senden"}
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white transition hover:brightness-95 sm:w-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Per WhatsApp senden
          </a>
        </div>
      </form>
    </div>
  );
}
