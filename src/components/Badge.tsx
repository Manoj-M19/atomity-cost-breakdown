import { tokens } from "@/tokens/tokens";
import { Tone } from "@/lib/efficiencyTone";

const toneColorMap: Record<Tone, string> = {
  success: tokens.colors.accentSuccess,
  warning: tokens.colors.accentWarning,
  error: tokens.colors.accentError,
};

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const color = toneColorMap[tone];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-pill)] text-xs font-bold"
      style={{ color, background: `color-mix(in srgb, ${color} 16%, transparent)` }}
    >
      {children}
    </span>
  );
}