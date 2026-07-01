"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCostHierarchy } from "@/hooks/useCostHierarchy";
import { BarChart } from "./BarChart";
import { Breadcrumb } from "./Breadcrumb";
import { CostTable } from "./CostTable";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { TimeRangeFilter, TimeRange } from "./TimeRangeFilter";
import { CostNode } from "@/types/cost";
import { tokens } from "@/tokens/tokens";

interface DrillState {
  parentId: string | null;
  trail: { id: string | null; label: string }[];
}

const ROOT_STATE: DrillState = {
  parentId: null,
  trail: [{ id: null, label: "All Clusters" }],
};

export function FeatureSection() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 30 Days");
  const [drill, setDrill] = useState<DrillState>(ROOT_STATE);
  const shouldReduceMotion = useReducedMotion();
  const { data, isLoading, isError } = useCostHierarchy(timeRange);

  const visibleNodes = useMemo(
    () => (data ? data.filter((n) => n.parentId === drill.parentId) : []),
    [data, drill.parentId]
  );

  const totalCost = useMemo(
    () => visibleNodes.reduce((sum, n) => sum + n.metrics.total, 0),
    [visibleNodes]
  );

  const currentLevel = visibleNodes[0]?.level ?? "cluster";

  function handleSelect(node: CostNode) {
    if (node.level === "pod") return;
    setDrill((prev) => ({
      parentId: node.id,
      trail: [...prev.trail, { id: node.id, label: node.name }],
    }));
  }

  function handleBreadcrumbNavigate(id: string | null) {
    setDrill((prev) => {
      const cutIndex = prev.trail.findIndex((seg) => seg.id === id);
      return { parentId: id, trail: prev.trail.slice(0, cutIndex + 1) };
    });
  }

  function handleTimeRangeChange(range: TimeRange) {
    setTimeRange(range);
    setDrill(ROOT_STATE);
  }

  return (
    <section
      aria-labelledby="cost-breakdown-heading"
      className="mx-auto max-w-5xl"
      style={{ padding: tokens.spacing.section }}
    >
      <h2
        id="cost-breakdown-heading"
        className="text-2xl sm:text-3xl font-bold mb-2"
        style={{ color: tokens.colors.textPrimary }}
      >
        Cloud Cost Breakdown
      </h2>
      <p className="mb-6 text-sm" style={{ color: tokens.colors.textSecondary }}>
        Click any bar to drill into namespaces and pods.
      </p>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-[var(--radius-card)] border p-6 sm:p-10"
        style={{
          background: tokens.colors.bgSurface,
          borderColor: tokens.colors.borderSubtle,
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <TimeRangeFilter value={timeRange} onChange={handleTimeRangeChange} />
            <Breadcrumb segments={drill.trail} onNavigate={handleBreadcrumbNavigate} />
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: tokens.colors.textMuted }}>
              Aggregated by: {currentLevel}
            </p>
            {!isLoading && !isError && (
              <p className="text-xl font-bold" style={{ color: tokens.colors.textPrimary }}>
                ${totalCost.toLocaleString()}
                <span className="text-sm font-normal ml-1" style={{ color: tokens.colors.textSecondary }}>
                  total
                </span>
              </p>
            )}
          </div>
        </div>

        {isLoading && <LoadingSkeleton />}
        {isError && (
          <p className="py-8 text-center" style={{ color: tokens.colors.accentError }}>
            Couldn't load cost data — check your connection and refresh.
          </p>
        )}
        {!isLoading && !isError && (
          <>
            <BarChart nodes={visibleNodes} level={currentLevel} onSelect={handleSelect} />
            <div className="my-6 border-t" style={{ borderColor: tokens.colors.borderSubtle }} />
            <CostTable nodes={visibleNodes} />
          </>
        )}
      </motion.div>
    </section>
  );
}