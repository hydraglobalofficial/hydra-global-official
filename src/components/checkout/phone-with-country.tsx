"use client";

import { useMemo, useState } from "react";
import { Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  DEFAULT_DIAL,
  composePhone,
  dialCodes,
  dialForCountry,
} from "@/lib/phone-codes";

type Props = {
  /** Delivery country — keeps dial code in sync when it changes. */
  country?: string;
  error?: boolean;
  id?: string;
  name?: string;
};

export function PhoneWithCountryCode({
  country = "Bangladesh",
  error,
  id = "phoneLocal",
  name = "phone",
}: Props) {
  const countryDial = dialForCountry(country) || DEFAULT_DIAL;
  const [dialOverride, setDialOverride] = useState<string | null>(null);
  const [syncedCountry, setSyncedCountry] = useState(country);
  const [local, setLocal] = useState("");

  // Adjust during render when delivery country changes (Bangladesh → +880).
  if (country !== syncedCountry) {
    setSyncedCountry(country);
    setDialOverride(null);
  }

  const dial = dialOverride ?? countryDial;
  const meta = useMemo(() => dialCodes.find((d) => d.dial === dial) ?? dialCodes[0], [dial]);
  const full = composePhone(dial, local);

  return (
    <div className="flex gap-2">
      <Select
        id="phoneDial"
        name="phoneDial"
        value={dial}
        onChange={(e) => setDialOverride(e.target.value)}
        aria-label="Country code"
        className={cn(
          "w-[8.25rem] shrink-0 bg-[length:0.65rem] bg-[right_0.55rem_center] pl-2 pr-6 text-[11px] sm:w-[11rem] sm:bg-[right_0.65rem_center] sm:pl-2.5 sm:pr-7 sm:text-[13px]",
        )}
      >
        {dialCodes.map((d) => (
          <option key={`${d.iso}-${d.dial}`} value={d.dial}>
            {d.dial} · {d.country}
          </option>
        ))}
      </Select>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={meta?.placeholder ?? "Mobile number"}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        required
        aria-invalid={error || undefined}
        className="min-w-0 flex-1"
      />
      {/* Combined E.164 value submitted to the server */}
      <input type="hidden" name={name} value={full} />
    </div>
  );
}
