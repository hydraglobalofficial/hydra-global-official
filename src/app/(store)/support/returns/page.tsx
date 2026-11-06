import { permanentRedirect } from "next/navigation";

/** The support menu no longer has a separate Returns page. Policy lives under Legal. */
export default function ReturnsPage() {
  permanentRedirect("/legal/return-policy");
}
