"use client";

import { useEffect, useState } from "react";
import { ScaledIngredient } from "@/lib/recipes/scaling";

function storageKey(recipeSlug: string) {
  return `mode_shopping_${recipeSlug}`;
}

export default function ShoppingList({
  recipeSlug,
  items,
}: {
  recipeSlug: string;
  items: ScaledIngredient[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(recipeSlug));
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
  }, [recipeSlug]);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(storageKey(recipeSlug), JSON.stringify(next));
      } catch {
        // Ignore, ticks just won't persist this session.
      }
      return next;
    });
  }

  return (
    <ul className="space-y-2">
      {items.map((ingredient) => {
        const isChecked = !!checked[ingredient.id];
        const amountLabel = ingredient.pending
          ? "quantity TBC"
          : ingredient.toTaste
            ? "to taste"
            : ingredient.displayAmount;
        return (
          <li key={ingredient.id}>
            <label className="flex items-center gap-3 cursor-pointer group py-1">
              <span
                className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isChecked ? "bg-[#E8862B] border-[#E8862B]" : "border-edge group-hover:border-muted"
                }`}
              >
                {isChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input type="checkbox" checked={isChecked} onChange={() => toggle(ingredient.id)} className="sr-only" />
              <span className={`font-body ${isChecked ? "text-muted line-through" : "text-fg"}`}>
                {ingredient.name}
                {amountLabel ? <span className="text-muted"> &middot; {amountLabel}</span> : null}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
