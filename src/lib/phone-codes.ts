/** Dial codes for checkout contact number — Bangladesh first / default. */
export type DialCode = {
  country: string;
  iso: string;
  dial: string;
  /** Local placeholder after the dial code */
  placeholder: string;
};

export const DEFAULT_DIAL = "+880";

export const dialCodes: DialCode[] = [
  { country: "Bangladesh", iso: "BD", dial: "+880", placeholder: "1XXX XXX XXX" },
  { country: "India", iso: "IN", dial: "+91", placeholder: "98XXX XXXXX" },
  { country: "United States", iso: "US", dial: "+1", placeholder: "415 555 0147" },
  { country: "United Kingdom", iso: "GB", dial: "+44", placeholder: "7400 123456" },
  { country: "United Arab Emirates", iso: "AE", dial: "+971", placeholder: "50 123 4567" },
  { country: "Saudi Arabia", iso: "SA", dial: "+966", placeholder: "50 123 4567" },
  { country: "Singapore", iso: "SG", dial: "+65", placeholder: "8123 4567" },
  { country: "Malaysia", iso: "MY", dial: "+60", placeholder: "12 345 6789" },
  { country: "Pakistan", iso: "PK", dial: "+92", placeholder: "300 1234567" },
  { country: "Nepal", iso: "NP", dial: "+977", placeholder: "98X XXX XXXX" },
  { country: "Sri Lanka", iso: "LK", dial: "+94", placeholder: "71 234 5678" },
  { country: "Canada", iso: "CA", dial: "+1", placeholder: "416 555 0147" },
  { country: "Australia", iso: "AU", dial: "+61", placeholder: "412 345 678" },
  { country: "Germany", iso: "DE", dial: "+49", placeholder: "151 23456789" },
  { country: "France", iso: "FR", dial: "+33", placeholder: "6 12 34 56 78" },
  { country: "Italy", iso: "IT", dial: "+39", placeholder: "312 345 6789" },
  { country: "Spain", iso: "ES", dial: "+34", placeholder: "612 34 56 78" },
  { country: "Netherlands", iso: "NL", dial: "+31", placeholder: "6 12345678" },
  { country: "Japan", iso: "JP", dial: "+81", placeholder: "90 1234 5678" },
  { country: "South Korea", iso: "KR", dial: "+82", placeholder: "10 1234 5678" },
  { country: "China", iso: "CN", dial: "+86", placeholder: "138 0013 8000" },
  { country: "Hong Kong", iso: "HK", dial: "+852", placeholder: "5123 4567" },
  { country: "Thailand", iso: "TH", dial: "+66", placeholder: "81 234 5678" },
  { country: "Indonesia", iso: "ID", dial: "+62", placeholder: "812 3456 7890" },
  { country: "Philippines", iso: "PH", dial: "+63", placeholder: "917 123 4567" },
  { country: "Vietnam", iso: "VN", dial: "+84", placeholder: "91 234 56 78" },
  { country: "Turkey", iso: "TR", dial: "+90", placeholder: "532 123 4567" },
  { country: "Qatar", iso: "QA", dial: "+974", placeholder: "3312 3456" },
  { country: "Kuwait", iso: "KW", dial: "+965", placeholder: "5000 1234" },
  { country: "Oman", iso: "OM", dial: "+968", placeholder: "9212 3456" },
  { country: "Bahrain", iso: "BH", dial: "+973", placeholder: "3600 1234" },
  { country: "Egypt", iso: "EG", dial: "+20", placeholder: "100 123 4567" },
  { country: "Nigeria", iso: "NG", dial: "+234", placeholder: "802 123 4567" },
  { country: "South Africa", iso: "ZA", dial: "+27", placeholder: "82 123 4567" },
  { country: "Brazil", iso: "BR", dial: "+55", placeholder: "11 91234 5678" },
  { country: "Mexico", iso: "MX", dial: "+52", placeholder: "55 1234 5678" },
  { country: "Russia", iso: "RU", dial: "+7", placeholder: "912 345 6789" },
];

/** Map delivery country name → default dial code. */
export function dialForCountry(country: string): string {
  const hit = dialCodes.find((d) => d.country === country);
  return hit?.dial ?? DEFAULT_DIAL;
}

/**
 * Build E.164-ish phone from dial + local national number.
 * Strips spaces/dashes and a leading trunk `0` (common in BD/IN/UK).
 */
export function composePhone(dial: string, local: string): string {
  const code = dial.trim().replace(/\s/g, "");
  let national = local.trim().replace(/[\s()-]/g, "");
  if (national.startsWith("+")) national = national.replace(/^\+\d{1,4}/, "");
  // Drop leading 0 after country code (017… → 17… for +880)
  if (national.startsWith("0")) national = national.slice(1);
  return `${code}${national}`;
}
