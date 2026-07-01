# Atomity — Cloud Cost Breakdown

> Frontend Engineering Challenge Submission
> **Option A** — Drill-down cloud cost breakdown by cluster, namespace, and pod.

**Live Demo:** `https://atomity-cost-breakdown.vercel.app` ← replace with your URL  
**GitHub:** `https://github.com/Manoj-M19/atomity-cost-breakdown`

---

## Feature Chosen — Option A (0:30–0:40)

The segment showed a hierarchical cost breakdown: a bar chart aggregated by Cluster, with a cost table below it. Clicking a bar drills into that cluster's Namespaces, and clicking again goes to Pods. A breadcrumb trail tracks where you are and lets you jump back up.

I chose this over Option B because it has a natural three-level data hierarchy, which gave me room to show real state management decisions (not just UI), meaningful animation choreography at each level transition, and a genuine caching story (one fetch covers all three levels, not a new request per drill).

The brief said "don't give us a pixel-perfect copy — surprise us." My interpretation: instead of using fake company-generated names like "Cluster A / Cluster B," I mapped real JSONPlaceholder company names to Clusters and derived Kubernetes-style identifiers (`ns-sunt`, `pod-1f`) for Namespaces and Pods — which is exactly how real infrastructure platforms name resources. The cost numbers are seeded deterministically per item ID and time range, so they're stable across reloads (which also quietly proves the cache is working — no flicker, no renumbering on revisit).

---

## Approach to Animation

All animations are driven by **Framer Motion**. The key techniques:

**Drill-down transition (`AnimatePresence mode="popLayout"`)**  
When you click a bar to drill down, the old bars shrink/fade out with `scaleY` while the new bars stagger in from 40% height to full. I deliberately did not try to fake a 1:1 morph between bars (the "Cluster A bar morphs into Namespace A bar" effect from the video), because the item count changes drastically at each level — 10 clusters might have 11 namespaces under one of them. Lying about a 1:1 relationship that doesn't exist produces janky animation. Instead, the `popLayout` mode exits old items first and staggers the new ones in — which reads as a smooth transition without misrepresenting the data structure.

**Stagger on entry**  
Each bar delays by `index * 0.04s`, creating a left-to-right cascade that draws the eye across the chart before the table appears.

**Count-up numbers**  
`AnimatedNumber` uses Framer Motion's `animate()` utility (not CSS) to interpolate from 0 to the target value on mount. Since `AnimatePresence` remounts rows on every drill level change, the count-up triggers naturally on each transition with no extra wiring.

**Scroll-triggered entrance**  
The card container uses `whileInView` with `viewport={{ once: true }}` — it animates in when first scrolled into view and never re-triggers. Re-animating every scroll-back is "animation for animation's sake," which the brief specifically calls out as bad.

**`prefers-reduced-motion`**  
All Framer Motion animations check `useReducedMotion()`. When reduced motion is preferred, springs become instant snaps (`duration: 0`), `layout` animations are disabled, and `AnimatedNumber` skips the count-up and displays the final value directly. The CSS `@media (prefers-reduced-motion: reduce)` block covers all CSS transitions (hover effects, theme transitions) separately, since Framer Motion animations bypass CSS.

---

## Token Architecture

Design tokens live in two places that reference each other:

**`src/app/globals.css` — `:root` CSS custom properties**  
This is the single source of truth for every color, radius, and spacing value. Dark mode overrides sit in `[data-theme="dark"]` on the same properties — no separate dark-mode class names or duplicated component logic anywhere.

```css
:root {
  --color-accent-primary: #6ee7a0;
  --radius-card: 1.5rem;
  --space-section: clamp(2rem, 5vw, 4rem);
}

[data-theme="dark"] {
  --color-accent-primary: #4ade80;
}
```

**`src/tokens/tokens.ts` — typed JS references**  
A typed object that maps every token name to its `var(--...)` string. Used anywhere Tailwind classes don't apply — SVG fills, Framer Motion `animate` props, inline `style` objects.

```ts
export const tokens = {
  colors: {
    accentPrimary: "var(--color-accent-primary)",
    ...
  }
} as const;
```

Components never contain raw hex values. Every color reference goes through either a Tailwind `bg-[var(--color-...)]` utility or `tokens.colors.*` in an inline style.

**`color-mix()` usage**  
Badge backgrounds are derived at runtime: `color-mix(in srgb, ${color} 16%, transparent)` — so a success badge automatically produces a translucent green from the same token as its text color, with no separate "light green" value to maintain.

---

## Data Fetching and Caching

**API:** JSONPlaceholder (`/users`, `/posts`, `/comments`)

**Strategy:** Fetch all three endpoints in parallel once on mount via `Promise.all`. Reshape the flat arrays into a parent-linked node tree in memory (`buildHierarchy`). All drill-down interactions are then pure in-memory `.filter()` calls — zero additional network requests after the initial fetch.

This means the Network tab shows exactly 3 requests total (one per endpoint), ever. Switching time ranges uses a different `queryKey` and gets its own cached result — switching between ranges after the first visit is instant with no loading state.

**TanStack Query configuration:**
- `staleTime: 5 * 60 * 1000` — data is fresh for 5 minutes, no background refetch
- `gcTime: 30 * 60 * 1000` — cached in memory for 30 minutes after last use
- `refetchOnWindowFocus: false` — a cost dashboard doesn't need to re-request when the user alt-tabs

**Time range differentiation:**  
The time range string is included in the `queryKey` (`["cost-hierarchy", "Last 30 Days"]`) and also baked into the deterministic seed for cost numbers. This means each range has genuinely different numbers, its own cache entry, and shows a loading state only on first visit per range — exactly the expected behaviour for a real API that would accept a date range query parameter.

---

## Libraries Used

| Library | Why |
|---|---|
| **Next.js 15 (App Router)** | Recommended in the brief. Server components for the shell, client components for interactive sections. Built-in fetch caching as an additional layer. |
| **TypeScript** | Catches shape mismatches between API response → `buildHierarchy` → component props. The `CostNode` type is the contract between every layer. |
| **Tailwind CSS v4** | Utility-first layout and spacing. v4's `@import "tailwindcss"` entry point works alongside plain CSS custom properties cleanly. |
| **Framer Motion** | `AnimatePresence`, `layout`, `whileInView`, `useReducedMotion`, and the `animate()` utility for count-up numbers. One library covers every animation requirement in the brief. |
| **TanStack Query v5** | Declarative loading/error/success states, automatic deduplication, configurable staleness, and per-queryKey caching. The brief lists it as preferred and it earns that preference here. |

No pre-built component libraries (MUI, Chakra, shadcn). Every UI element — cards, badges, breadcrumb, time range pills, skeleton, table — is built from scratch.

---

## Project Structure

```
src/
  app/
    globals.css          ← CSS custom properties (token source of truth)
    layout.tsx           ← Theme init script (flash-free dark mode)
    page.tsx
    providers.tsx        ← TanStack Query client provider
  components/
    FeatureSection.tsx   ← Composition root, owns drill state
    BarChart.tsx         ← Chart container, grid lines, scroll wrapper
    Bar.tsx              ← Individual animated bar button
    Breadcrumb.tsx       ← Navigation trail
    CostTable.tsx        ← Animated table with container query layout
    AnimatedNumber.tsx   ← Count-up interpolation
    Badge.tsx            ← Efficiency tone badge
    LoadingSkeleton.tsx  ← Pulse skeleton matching real layout
    TimeRangeFilter.tsx  ← Last 7/30/90 days pills
    ThemeToggle.tsx      ← Dark/light toggle
  hooks/
    useCostHierarchy.ts  ← TanStack Query fetch + reshape
    useTheme.ts          ← DOM attribute sync for dark mode
  lib/
    buildHierarchy.ts    ← Reshapes JSONPlaceholder → CostNode[]
    seededRandom.ts      ← Mulberry32 PRNG for stable cost numbers
    efficiencyTone.ts    ← Maps efficiency % to success/warning/error
  tokens/
    tokens.ts            ← Typed JS references to CSS variables
  types/
    cost.ts              ← CostNode, CostMetrics, CostLevel
```

---

## Modern CSS Features Used

| Feature | Where | Why |
|---|---|---|
| `clamp()` | `--space-section` token | Section padding scales fluidly between 2rem and 4rem without breakpoint jumps |
| CSS custom properties | All colors, radii, spacing | The entire token system. Dark mode is just overriding these on `[data-theme="dark"]` |
| `color-mix()` | Badge backgrounds, breadcrumb active state | Derives translucent tints from the same token as the foreground color |
| `@container` queries | `.cost-table-shell` | Table reflows based on its own width, not viewport — works correctly in a narrow sidebar on a wide screen, which `@media` cannot do |
| Logical properties | Table padding (`padding-block`, `border-block-end`) | Layout-direction-agnostic spacing throughout the table |
| CSS nesting | Not used — would have been forced. Opted for explicit class names where specificity is clear |

---

## Tradeoffs and Decisions

**Fake data with a real API** — JSONPlaceholder doesn't have cost data. The tradeoff is that numbers are seeded/derived rather than real. I chose this over hardcoding because it demonstrates the full async data flow (loading, error, success, caching), the component genuinely depends on the fetched shape, and the derivation logic is honest and documented. A real API endpoint would slot in by changing `fetchCostHierarchy` with no component changes.

**No 1:1 bar morph** — The video implies a single bar "transforms" into the next level's bars. This only works cleanly when the item count is identical across levels, which JSONPlaceholder's data doesn't guarantee. I chose a staggered enter/exit instead — honest to the data, still feels like a coherent transition.

**Single fetch, client-side filter** — I could have fetched per drill level (fetch clusters, then on click fetch namespaces for that cluster). The tradeoff against the approach I took is that the initial load is heavier (~500 items). The upside is that drilling is instant — no loading state or skeleton on every click. For a dashboard where users drill repeatedly, perceived performance after the first load matters more than first-byte speed.

**`data-theme` on `<html>` via inline script** — Dark mode preference is applied via a `<script>` tag in `<head>` before React hydrates, which eliminates the flash of wrong theme. The tradeoff is `dangerouslySetInnerHTML`, which is justified here because the script is static, contains no user input, and is the standard Next.js pattern for this exact problem.

---

## What I'd Improve With More Time

**Real sparkline per row** — Each table row could show a tiny 7-day trend line using the same seeded random approach. This would make the table significantly more useful as a dashboard component.

**Sort and filter on the table** — Click a column header to sort by that metric, or filter to only show rows above a cost threshold. The data model supports it with no changes.

**Tooltip on bar hover** — A popover showing the metric breakdown (CPU / RAM / Storage / Network / GPU) before committing to a drill would reduce accidental navigations and match how production tools like Grafana work.

**Real date range API** — The time range filter currently changes the seed, not the data source. A real backend would accept `?from=2026-06-01&to=2026-06-30` and the hook would pass those parameters through.

**URL-synced drill state** — The current drill state lives in React state and is lost on refresh. Encoding `?cluster=romaguera&namespace=ns-sunt` in the URL would make the dashboard shareable and back-button-navigable, which matters for a real product.

**Virtualized table rows** — At the Pod level, a cluster could have 50+ pods. TanStack Virtual would handle this without DOM bloat.

---

## Running Locally

```bash
git clone https://github.com/Manoj-M19/atomity-cost-breakdown
cd atomity-cost-breakdown
npm install
npm run dev
```

Open `http://localhost:3000`.

No environment variables required — uses public JSONPlaceholder API.