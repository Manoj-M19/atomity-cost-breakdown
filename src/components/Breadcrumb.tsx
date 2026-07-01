"use client";

import { tokens } from "@/tokens/tokens";

interface BreadcrumbProps {
  segments: { id: string | null; label: string }[];
  onNavigate: (id: string | null) => void;
}

export function Breadcrumb({ segments, onNavigate }: BreadcrumbProps) {
  return (
    <nav aria-label="Drill-down path" className="flex items-center flex-wrap gap-1 text-sm font-semibold">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        return (
          <span key={segment.id ?? "root"} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => !isLast && onNavigate(segment.id)}
              disabled={isLast}
              className="px-2 py-1 rounded-[var(--radius-sm)] transition-colors"
              style={{
                color: isLast ? tokens.colors.textPrimary : tokens.colors.textSecondary,
                background: isLast ? "color-mix(in srgb, var(--color-accent-primary) 25%, transparent)" : "transparent",
              }}
            >
              {segment.label}
            </button>
            {!isLast && <span style={{ color: tokens.colors.textMuted }}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}