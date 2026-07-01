import { tokens } from "@/tokens/tokens";

function SkeletonBlock({ width = "100%", height = "1rem", className = "" }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-sm)] ${className}`}
      style={{ width, height, background: `color-mix(in srgb, var(--color-text-muted) 18%, transparent)` }}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading cost data">
      <div className="flex items-center gap-3 mb-8">
        <SkeletonBlock width="8rem" height="2rem" />
        <SkeletonBlock width="5rem" height="1.25rem" />
      </div>
      <div className="h-64 flex items-end gap-4">
        {[70, 55, 40, 25].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 justify-end">
            <SkeletonBlock height={`${h}%`} />
            <SkeletonBlock width="60%" height="0.75rem" />
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <SkeletonBlock width="30%" />
            {Array.from({ length: 5 }).map((_, j) => (
              <SkeletonBlock key={j} className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}