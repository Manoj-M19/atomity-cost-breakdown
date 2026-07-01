"use client";

import { useCostHierarchy } from "@/hooks/useCostHierarchy";
import type { CostNode } from "@/types/cost";
import { useMemo, useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { BarChart } from "./BarChart";
import { tokens } from "@/tokens/tokens";
import { CostTable } from "./CostTable";
import { motion,useReducedMotion } from "framer-motion";


interface DrillState {
    parentId:string | null;
    trail:{id:string | null; label:string}[];
}

const ROOT_STATE: DrillState = { parentId:null,trail:[{ id:null,label:"All Clusters"}]};

export function FeatureSection() {
    const shouldReduceMotion = useReducedMotion();
    const { data,isLoading,isError} = useCostHierarchy();
    const [drill,setDrill] = useState<DrillState>(ROOT_STATE);

    const visibleNodes = useMemo(
        () => (data ? data.filter((n) => n.parentId === drill.parentId) :[]),
        [data,drill.parentId]
    );
    const currentLevel = visibleNodes[0]?.level ?? "cluster";

    function handleSelect(node:CostNode) {
        if(node.level === "pod") return;
        setDrill((prev) => ({ parentId:node.id, trail:[...prev.trail,{id:node.id, label:node.name}]}));
    }

    function handleBreadcrumbNavigate(id:string | null) {
        setDrill((prev) => {
            const cutIndex = prev.trail.findIndex((seg) => seg.id === id);
            return {parentId:id, trail:prev.trail.slice(0, cutIndex +1)};
        });
    }

    return (
    <section aria-labelledby="cost-breakdown-heading" className="mx-auto max-w-5xl" style={{ padding: tokens.spacing.section }}>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-[var(--radius-card)] border p-6 sm:p-10"
        style={{ background: tokens.colors.bgSurface, borderColor: tokens.colors.borderSubtle }}
      >
        <h2 id="cost-breakdown-heading" className="sr-only">Cloud Cost Breakdown</h2>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <Breadcrumb segments={drill.trail} onNavigate={handleBreadcrumbNavigate} />
          <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: tokens.colors.textMuted }}>
            Aggregated by: {currentLevel}
          </span>
        </div>

        {isLoading && <p style={{ color: tokens.colors.textSecondary }}>Loading cost data…</p>}
        {isError && <p style={{ color: tokens.colors.accentError }}>Couldn't load cost data. Try refreshing.</p>}
        {!isLoading && !isError && <BarChart nodes={visibleNodes} level={currentLevel} onSelect={handleSelect} />}
        {!isLoading && !isError && <CostTable    nodes={visibleNodes} />}
      </motion.div>
    </section>
  );
}