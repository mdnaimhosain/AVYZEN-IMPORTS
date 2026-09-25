"use client";

import React from "react";
import { ProductVariant } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Available Editions / Options
        </label>
        {selectedVariant && (
          <span className="text-zinc-500 font-medium">
            Selected: <strong className="text-zinc-900 dark:text-zinc-100">{selectedVariant.name}</strong>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          const isOutOfStock = v.stock <= 0;

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(v)}
              className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {v.name}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(v.price)}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isOutOfStock ? "Sold Out" : `${v.stock} in stock`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
