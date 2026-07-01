"use client";

import { tokens } from "@/tokens/tokens";

const TIME_RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days"] as const;
export type TimeRange = typeof TIME_RANGES[number];

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
}

export function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TIME_RANGES.map((range) => {
        const isActive = range === value;
        return (
          <button
            key={range}
            type="button"
            onClick={() => onChange(range)}
            className="px-4 py-1.5 text-sm font-semibold rounded-[var(--radius-pill)] border transition-colors"
            style={{
              borderColor: isActive ? tokens.colors.accentPrimaryStrong : tokens.colors.borderSubtle,
              background: isActive ? tokens.colors.accentPrimary : "transparent",
              color: isActive ? tokens.colors.textPrimary : tokens.colors.textSecondary,
            }}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}