"use client";

import { AnimatePresence } from "framer-motion";
import { Bar } from "./Bar";
import { CostNode } from "@/types/cost";
import { tokens } from "@/tokens/tokens";

interface BarChartProps {
  nodes: CostNode[];
  level: CostNode["level"];
  onSelect: (node: CostNode) => void;
}

export function BarChart({ nodes, level, onSelect }: BarChartProps) {
  const maxTotal = Math.max(...nodes.map((n) => n.metrics.total), 1);
  const isInteractive = level !== "pod";

  return (
    <div className="relative h-64 sm:h-72">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-t border-dashed" style={{ borderColor: tokens.colors.borderSubtle }} />
        ))}
      </div>

      <div className="relative h-full flex items-end gap-2 sm:gap-4 px-1">
        <AnimatePresence mode="popLayout">
          {nodes.map((node, index) => (
            <Bar
              key={node.id}
              node={node}
              heightPercent={(node.metrics.total / maxTotal) * 100}
              index={index}
              isInteractive={isInteractive}
              onSelect={onSelect}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}