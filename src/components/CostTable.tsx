"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CostNode } from "@/types/cost";
import { AnimatedNumber } from "./AnimatedNumber";
import { Badge } from "./Badge";
import { efficiencyTone } from "@/lib/efficiencyTone";
import { tokens } from "@/tokens/tokens";

const COLUMNS = ["Name", "CPU", "RAM", "Storage", "Network", "GPU", "Efficiency", "Total"];

export function CostTable({ nodes }: { nodes: CostNode[] }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="cost-table-shell mt-8" role="table" aria-label="Cost breakdown by resource">
      <div className="cost-table-head text-xs font-semibold uppercase tracking-wide" style={{ color: tokens.colors.textMuted }} role="row">
        {COLUMNS.map((col) => (
          <span key={col} role="columnheader" className={col !== "Name" ? "text-right" : ""}>
            {col}
          </span>
        ))}
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            role="row"
           layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }}
            className="cost-row-grid"
          >
            <span role="cell" className="cost-cell-name font-semibold" style={{ color: tokens.colors.textPrimary }}>
              {node.name}
            </span>
            {(["cpu", "ram", "storage", "network"] as const).map((key) => (
              <span role="cell" key={key} className="text-right" style={{ color: tokens.colors.textSecondary }}>
                <span className="cost-cell-label">{key}</span>
                <AnimatedNumber value={node.metrics[key]} />
              </span>
            ))}
            <span role="cell" className="text-right" style={{ color: tokens.colors.textSecondary }}>
              <span className="cost-cell-label">GPU</span>
              {node.metrics.gpu > 0 ? <AnimatedNumber value={node.metrics.gpu} /> : "—"}
            </span>
            <span role="cell" className="text-right">
              <span className="cost-cell-label">Efficiency</span>
              <Badge tone={efficiencyTone(node.metrics.efficiency)}>{node.metrics.efficiency}%</Badge>
            </span>
            <span role="cell" className="cost-cell-total text-right font-bold" style={{ color: tokens.colors.textPrimary }}>
              <span className="cost-cell-label">Total</span>
              <AnimatedNumber value={node.metrics.total} />
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}