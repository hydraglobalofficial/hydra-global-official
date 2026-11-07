import { LegalPolicy, legalMetadata } from "../policy-view";

export const revalidate = 3600;
export const metadata = legalMetadata("terms");

export default function TermsPage() {
  return <LegalPolicy slug="terms" />;
}
