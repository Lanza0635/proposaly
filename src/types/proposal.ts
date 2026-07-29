export type Currency = "USD" | "EUR" | "GBP";

export type LineItem = {
  id: string;
  serviceName: string;
  quantity: number;
  price: number;
};

export type Proposal = {
  clientName: string;
  projectName: string;
  lineItems: LineItem[];
  notes: string;
  currency: Currency;
};

export const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"];

export function createEmptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    serviceName: "",
    quantity: 1,
    price: 0,
  };
}

export function createEmptyProposal(): Proposal {
  return {
    clientName: "",
    projectName: "",
    lineItems: [createEmptyLineItem()],
    notes: "",
    currency: "USD",
  };
}
