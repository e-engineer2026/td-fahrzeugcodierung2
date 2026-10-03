import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: { absolute: "Anmelden | TD Fahrzeugcodierung" },
  alternates: { canonical: "/sign-in" },
  robots: { index: false, follow: false },
};


export default function SignInPage() {
  return <main className="container-x flex min-h-[70vh] items-center justify-center py-12"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /></main>;
}
