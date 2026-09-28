/** Fixed, site-wide backdrop: drifting aurora glows, a faint grid, film grain and a vignette. CSS-only. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="absolute -left-[10%] -top-[15%] h-[55vh] w-[55vw] rounded-full bg-accent/[0.09] blur-[120px] animate-aurora-1" />
      <div className="absolute -right-[12%] top-[20%] h-[60vh] w-[50vw] rounded-full bg-accent-2/[0.10] blur-[140px] animate-aurora-2" />
      <div className="absolute bottom-[-20%] left-[25%] h-[50vh] w-[45vw] rounded-full bg-accent-3/[0.05] blur-[130px] animate-aurora-3" />

      <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_20%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgb(61_227_255/0.10),transparent_70%)]" />

      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.75)_100%)]" />
    </div>
  );
}
