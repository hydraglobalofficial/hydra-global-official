/** Hairline between sections with a light beam that sweeps across it. */
export function SectionDivider() {
  return (
    <div aria-hidden className="container-page">
      <div className="divider-glow relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-beam" />
      </div>
    </div>
  );
}
