export default function Loading() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-label="Loading">
      <div className="mb-12 h-12 w-72 animate-pulse rounded-xl bg-surface-2" />
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="aspect-square animate-pulse bg-surface-2" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-16 animate-pulse rounded bg-surface-3" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-3" />
              <div className="h-5 w-20 animate-pulse rounded bg-surface-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
