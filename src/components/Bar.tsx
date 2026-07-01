"use client";

import { motion, useReducedMotion} from "framer-motion";
import { tokens } from "@/tokens/tokens";
import { CostNode } from "@/types/cost";

interface BarProps {
  node: CostNode;
  heightPercent: number;
  index: number;
  isInteractive: boolean;
  onSelect: (node: CostNode) => void;
}

export function Bar({ node, heightPercent, index, isInteractive, onSelect }: BarProps) {
    const shouldReduceMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? false : { opacity: 0, scaleY: 0.4 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleY: 0.4, transition: { duration: 0.16 } }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 280, damping: 26, delay: index * 0.04 }
      }
      onClick={() => isInteractive && onSelect(node)}
      disabled={!isInteractive}
      aria-label={`${node.name}, total cost $${node.metrics.total}${isInteractive ? ", click to drill down" : ""}`}
      className="flex-1 h-full flex flex-col items-center justify-end gap-3 bg-transparent border-0 p-0"
      style={{ transformOrigin: "bottom", cursor: isInteractive ? "pointer" : "default" }}
    >
      <div
        className="w-full rounded-t-xl bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-strong)] transition-colors duration-150"
        style={{ height: `${Math.max(heightPercent, 4)}%`, minWidth: "2.5rem" }}
      />
      <span className="text-xs sm:text-sm font-semibold truncate max-w-full" style={{ color: tokens.colors.textPrimary }}>
        {node.name}
      </span>
    </motion.button>
  );
}