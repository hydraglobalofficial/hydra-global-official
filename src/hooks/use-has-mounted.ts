"use client";

import { useEffect, useState } from "react";

/** False on SSR and the first client render; true after mount. Use to avoid motion style hydration mismatches. */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
