const SKELETON_COUNT = 12;

export function GridSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))' }}
    >
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="h-24 animate-pulse bg-surface-2" />
          <div className="p-3 pt-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-surface-2" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
