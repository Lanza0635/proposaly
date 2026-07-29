export const FREE_PLAN_PROPOSAL_LIMIT = 3;
export const PRO_PLAN_PRICE_LABEL = "$15/mo";
export const PRO_PLAN_NAME = "Proposaly Pro";

export type SubscriptionStatus = "free" | "pro" | "cancelled";

export function isProPlan(status: string | null | undefined): boolean {
  return (status || "free").toLowerCase() === "pro";
}

export function canCreateProposal(
  status: string | null | undefined,
  currentCount: number
): boolean {
  if (isProPlan(status)) return true;
  return currentCount < FREE_PLAN_PROPOSAL_LIMIT;
}
