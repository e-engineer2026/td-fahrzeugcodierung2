import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/zahlung" },
  robots: { index: false, follow: false },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
