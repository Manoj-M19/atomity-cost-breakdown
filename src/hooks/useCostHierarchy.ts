import { CostNode } from "@/types/cost";
import { useQuery } from "@tanstack/react-query";
import { buildHierarchy } from "@/lib/buildHierarchy";


async function fetchCostHierarchy(): Promise<CostNode[]> {
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

  return buildHierarchy(users, posts, comments);
}

export function useCostHierarchy() {
  return useQuery({
    queryKey: ["cost-hierarchy"],
    queryFn: fetchCostHierarchy,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}