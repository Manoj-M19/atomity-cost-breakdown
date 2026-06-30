import { tokens } from "@/tokens/tokens";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        className="p-8 rounded-[var(--radius-card)] border"
        style={{
          background: tokens.colors.bgSurface,
          borderColor: tokens.colors.borderSubtle,
        }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: tokens.colors.textPrimary }}
        >
          Tokens wired up ✓
        </h1>
        <p style={{ color: tokens.colors.textSecondary }}>
          If this card has a white surface and the dashed border shows, we're good.
        </p>
      </div>
    </main>
  );
}