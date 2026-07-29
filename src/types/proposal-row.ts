import type { Currency, LineItem } from "@/types/proposal";

export type ProposalStatus = "draft" | "sent" | "accepted" | "declined";

export type ProposalRow = {
  id: string;
  user_id: string;
  client_name: string;
  project_name: string;
  line_items: LineItem[];
  notes: string;
  currency: Currency;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export function isCurrency(value: string): value is Currency {
  return value === "USD" || value === "EUR" || value === "GBP";
}
