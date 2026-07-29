"use client";

import { Plus, Trash2 } from "lucide-react";
import type { LineItem } from "@/types/proposal";
import { createEmptyLineItem } from "@/types/proposal";

type LineItemsEditorProps = {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
};

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    if (items.length === 1) {
      onChange([createEmptyLineItem()]);
      return;
    }
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, createEmptyLineItem()]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink-800">Line Items</label>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-accent-dark transition hover:bg-accent-soft"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>

      <div className="hidden grid-cols-[1fr_5rem_7rem_2.5rem] gap-2 px-1 text-xs font-medium uppercase tracking-wide text-ink-400 sm:grid">
        <span>Service name</span>
        <span>Qty</span>
        <span>Price</span>
        <span className="sr-only">Remove</span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_5rem_7rem_2.5rem]"
          >
            <input
              type="text"
              value={item.serviceName}
              onChange={(e) =>
                updateItem(item.id, { serviceName: e.target.value })
              }
              placeholder="Service name"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="number"
              min={0}
              step={1}
              value={item.quantity}
              onChange={(e) =>
                updateItem(item.id, { quantity: Number(e.target.value) })
              }
              placeholder="Qty"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="number"
              min={0}
              step={0.01}
              value={item.price}
              onChange={(e) =>
                updateItem(item.id, { price: Number(e.target.value) })
              }
              placeholder="Price"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label="Remove line item"
              className="inline-flex h-10 w-10 items-center justify-center self-center justify-self-end rounded-lg text-ink-400 transition hover:bg-red-50 hover:text-red-600 sm:h-auto sm:w-auto sm:justify-self-center sm:py-2.5"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
