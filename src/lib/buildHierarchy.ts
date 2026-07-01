import type { CostMetrics, CostNode } from "@/types/cost";
import { seededRandomRange } from "./seededRandom";

interface JsonPlaceholderUser {
    id:number;
    company:{ name:string};
}
interface JsonPlaceholderPost {
    id:number;
    userId:number;
    title:string;
}
interface JsonPlaceholderComment {
    id:number;
    postId:number;
}

function deriveMetrics(seedKey: string): CostMetrics {
  const cpu = seededRandomRange(`${seedKey}-cpu`, 40, 2600);
  const ram = seededRandomRange(`${seedKey}-ram`, 20, 1400);
  const storage = seededRandomRange(`${seedKey}-storage`, 5, 260);
  const network = seededRandomRange(`${seedKey}-network`, 5, 340);
  const hasGpu = seededRandomRange(`${seedKey}-hasgpu`, 0, 1) === 1;
  const gpu = hasGpu ? seededRandomRange(`${seedKey}-gpu`, 80, 850) : 0;
  const efficiency = seededRandomRange(`${seedKey}-efficiency`, 5, 70);

  return { cpu, ram, storage, network, gpu, efficiency, total: cpu + ram + storage + network + gpu };
}

export function buildHierarchy(
  users: JsonPlaceholderUser[],
  posts: JsonPlaceholderPost[],
  comments: JsonPlaceholderComment[]
): CostNode[] {
  const nodes: CostNode[] = [];

  users.forEach((user) => {
    const clusterId = `cluster-${user.id}`;
    nodes.push({
      id: clusterId,
      name: user.company.name.split(" ")[0].replace(",", ""),
      level: "cluster",
      parentId: null,
      metrics: deriveMetrics(clusterId),
    });

    posts
      .filter((p) => p.userId === user.id)
      .forEach((post) => {
        const namespaceId = `namespace-${post.id}`;
        nodes.push({
          id: namespaceId,
          name: `ns-${post.title.split(" ")[0]}`,
          level: "namespace",
          parentId: clusterId,
          metrics: deriveMetrics(namespaceId),
        });

        comments
          .filter((c) => c.postId === post.id)
          .forEach((comment) => {
            const podId = `pod-${comment.id}`;
            nodes.push({
              id: podId,
              name: `pod-${comment.id.toString(36)}`,
              level: "pod",
              parentId: namespaceId,
              metrics: deriveMetrics(podId),
            });
          });
      });
  });

  return nodes;
}