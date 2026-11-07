import { LegalPolicy, legalMetadata } from "../policy-view";

export const revalidate = 3600;
export const metadata = legalMetadata("return-policy");

export default function ReturnPolicyPage() {
  return <LegalPolicy slug="return-policy" />;
}
