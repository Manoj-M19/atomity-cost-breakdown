"use client";

import { useCostHierarchy } from "@/hooks/useCostHierarchy";

export default function Home() {
  const { data, isLoading, isError } = useCostHierarchy();

  if (isLoading) return <main className="p-8">Loading hierarchy…</main>;
  if (isError) return <main className="p-8">Failed to load.</main>;

  const clusters = data!.filter((n) => n.level === "cluster");
  const namespaces = data!.filter((n) => n.level === "namespace");
  const pods = data!.filter((n) => n.level === "pod");

  return (
    <main className="p-8 space-y-2">
      <p>{clusters.length} clusters</p>
      <p>{namespaces.length} namespaces</p>
      <p>{pods.length} pods</p>
      <pre className="text-xs">{JSON.stringify(clusters[0], null, 2)}</pre>
    </main>
  );
}