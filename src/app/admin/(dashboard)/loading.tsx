export default function AdminLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-white/[0.06]" />
      <div className="h-4 w-72 rounded bg-white/[0.04]" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
    </div>
  );
}
