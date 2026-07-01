"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sync React state with whatever the inline script already set on <html>
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;
    if (current) setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return { theme, toggle };
}