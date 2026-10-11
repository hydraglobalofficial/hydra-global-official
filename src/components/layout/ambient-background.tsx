/** Fixed site-wide backdrop — solid theme color only (no aurora / blue washes). */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg" />
  );
}
