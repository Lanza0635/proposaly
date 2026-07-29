import type { Currency, LineItem } from "@/types/proposal";

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function lineItemTotal(item: LineItem): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const price = Number.isFinite(item.price) ? item.price : 0;
  return quantity * price;
}

export function proposalTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineItemTotal(item), 0);
}
