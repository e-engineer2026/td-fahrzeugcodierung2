import { permanentRedirect } from "next/navigation";

export default function FlashTestRedirectPage() {
  permanentRedirect("/steuergeraete-flash");
}
