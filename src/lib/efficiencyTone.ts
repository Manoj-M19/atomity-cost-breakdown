export type Tone = "success" | "warning" | "error";

export function efficiencyTone(efficiency: number): Tone {
  if (efficiency >= 45) return "success";
  if (efficiency >= 20) return "warning";
  return "error";
}