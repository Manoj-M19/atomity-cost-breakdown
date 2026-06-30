export const tokens = {
  colors: {
    bgPrimary: "var(--color-bg-primary)",
    bgSurface: "var(--color-bg-surface)",
    borderSubtle: "var(--color-border-subtle)",
    textPrimary: "var(--color-text-primary)",
    textSecondary: "var(--color-text-secondary)",
    textMuted: "var(--color-text-muted)",
    accentPrimary: "var(--color-accent-primary)",
    accentPrimaryStrong: "var(--color-accent-primary-strong)",
    accentSuccess: "var(--color-accent-success)",
    accentError: "var(--color-accent-error)",
    accentWarning: "var(--color-accent-warning)",
  },
  radius: {
    card: "var(--radius-card)",
    pill: "var(--radius-pill)",
    sm: "var(--radius-sm)",
  },
  spacing: {
    section: "var(--space-section)",
  },
} as const;

export type Tokens = typeof tokens;