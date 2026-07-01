"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
}

export function AnimatedNumber({ value, format = (n) => `$${Math.round(n).toLocaleString()}` }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);  
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
        setDisplay(value);
        prevValue.current = value;
        return;
    }
    const controls = animate(prevValue.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: setDisplay,
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value,shouldReduceMotion]);

  return <span>{display === value ? format(value) : format(display)}</span>;
}