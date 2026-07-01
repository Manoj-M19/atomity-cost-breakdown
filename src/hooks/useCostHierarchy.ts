import { useQuery } from "@tanstack/react-query";
import { buildHierarchy } from "@/lib/buildHierarchy";
import { CostNode } from "@/types/cost";

async function fetchCostHierarchy(timeRange: string): Promise<CostNode[]> {
  const [usersRes, postsRes, commentsRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users"),
    fetch("https://jsonplaceholder.typicode.com/posts"),
    fetch("https://jsonplaceholder.typicode.com/comments"),
  ]);

  if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
    throw new Error("Failed to fetch cost data");
  }

  const [users, posts, comments] = await Promise.all([
    usersRes.json(),
    postsRes.json(),
    commentsRes.json(),
  ]);

  return buildHierarchy(users, posts, comments, timeRange);
}

export function useCostHierarchy(timeRange: string) {
  return useQuery({
    queryKey: ["cost-hierarchy", timeRange],
    queryFn: () => fetchCostHierarchy(timeRange),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}