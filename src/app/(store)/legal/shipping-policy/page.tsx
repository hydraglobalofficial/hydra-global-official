import { LegalPolicy, legalMetadata } from "../policy-view";

export const revalidate = 3600;
export const metadata = legalMetadata("shipping-policy");

export default function ShippingPolicyPage() {
  return <LegalPolicy slug="shipping-policy" />;
}
