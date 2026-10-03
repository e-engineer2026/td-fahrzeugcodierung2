import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: { absolute: "Konto erstellen | TD Fahrzeugcodierung" },
  alternates: { canonical: "/sign-up" },
  robots: { index: false, follow: false },
};


export default function SignUpPage() {
  return <main className="container-x flex min-h-[70vh] items-center justify-center py-12"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></main>;
}
