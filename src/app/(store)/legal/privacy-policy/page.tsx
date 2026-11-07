import { LegalPolicy, legalMetadata } from "../policy-view";

export const revalidate = 3600;
export const metadata = legalMetadata("privacy-policy");

export default function PrivacyPolicyPage() {
  return <LegalPolicy slug="privacy-policy" />;
}
