"use client";

import { useEffect, useRef } from "react";

export default function Capture({ token, automatic }: { token: string; automatic: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);
  useEffect(() => {
    if (automatic && !submitted.current) {
      submitted.current = true;
      form.current?.requestSubmit();
    }
  }, [automatic]);
  return <form ref={form} method="post" action="/api/account/anleitungen">
    <input type="hidden" name="token" value={token} />
    <button className="underline" type="submit">Bestätigte PayPal-Zahlung abschließen</button>
  </form>;
}
