import { permanentRedirect } from "next/navigation";

/** Warranty page removed — send visitors to returns / support. */
export default function WarrantyPage() {
  permanentRedirect("/support/returns");
}
