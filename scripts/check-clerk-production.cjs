// Check the build environment without logging either credential.
if (process.env.VERCEL_ENV === "production") {
  function mode(value, prefix) {
    if (!value) return "missing";
    if (value.startsWith(`${prefix}_live_`)) return "production";
    if (value.startsWith(`${prefix}_test_`)) return "development";
    return "invalid";
  }

  const publishable = mode(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, "pk");
  const secret = mode(process.env.CLERK_SECRET_KEY, "sk");
  console.log(`[Clerk] Production build: publishable=${publishable}, secret=${secret}`);

  if (publishable !== "production" || secret !== "production") {
    console.error("Production requires live Clerk keys. Check the two Clerk variables in Vercel's Production environment.");
    process.exit(1);
  }
}
