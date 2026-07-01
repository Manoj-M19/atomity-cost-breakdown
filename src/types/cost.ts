export type CostLevel = "cluster" | "namespace" |"pod";

export interface CostMetrics {
    cpu: number;
    ram:number;
    storage:number;
    network:number;
    gpu:number;
    efficiency:number;
    total:number;
}

export interface CostNode {
    id: string;
    name:string;
    level:CostLevel;
    parentId:string | null;
    metrics:CostMetrics;
}