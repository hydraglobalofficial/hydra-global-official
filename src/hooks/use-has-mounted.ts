"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** False on SSR and first paint; true on the client after hydration. */
export function useHasMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
