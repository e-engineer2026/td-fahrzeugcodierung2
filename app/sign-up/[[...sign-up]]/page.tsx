import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <main className="container-x flex min-h-[70vh] items-center justify-center py-12"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></main>;
}
