import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GoogleOneTapLogin } from "../../components/GoogleOneTapLogin";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: { absolute: "Konto erstellen | TD Fahrzeugcodierung" },
  alternates: { canonical: "/sign-up" },
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 py-10 text-slate-900 sm:py-14">
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <Link href="/" className="mb-6 text-sm font-semibold text-blue-700 hover:underline">
          ← Zurück zu TD Fahrzeugcodierung
        </Link>
        <h1 className="text-center text-2xl font-black tracking-tight sm:text-3xl">Kundenkonto erstellen</h1>
        <p className="mb-6 mt-2 max-w-sm text-center text-sm leading-6 text-slate-600">
          Ein Konto für gespeicherte Fahrzeuge und deine PDF-Anleitungen.
        </p>
        <Suspense fallback={<div className="min-h-80 w-full max-w-md" aria-label="Registrierung wird geladen" />}>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/konto"
            signInFallbackRedirectUrl="/konto"
            appearance={{
              variables: { colorPrimary: "#1d4ed8", borderRadius: "0.75rem" },
              elements: {
                rootBox: "w-full max-w-md",
                cardBox: "w-full",
                card: "border border-slate-200 shadow-sm",
              },
            }}
          />
        </Suspense>
        {process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED === "true" && (
          <Suspense fallback={null}><GoogleOneTapLogin /></Suspense>
        )}
        <p className="mt-6 max-w-sm text-center text-xs leading-5 text-slate-500">
          Bereits registriert? Verwende denselben Zugang, damit deine bisherigen Käufe erhalten bleiben.
        </p>
      </div>
    </main>
  );
}
