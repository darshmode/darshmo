"use client";

import { clampServings } from "@/lib/recipes/scaling";

export default function ServingsSelector({
  servings,
  min,
  max,
  onChange,
}: {
  servings: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="font-heading text-xs tracking-widest text-muted uppercase mb-2">Servings</div>
      <div className="inline-flex items-center gap-4 bg-surface border border-edge rounded-lg px-2 py-2">
        <button
          type="button"
          aria-label="Fewer servings"
          onClick={() => onChange(clampServings(servings - 1, min, max))}
          disabled={servings <= min}
          className="w-9 h-9 flex items-center justify-center rounded-md font-heading text-lg text-fg hover:bg-edge disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          &minus;
        </button>
        <span className="font-heading text-xl w-6 text-center tabular-nums">{servings}</span>
        <button
          type="button"
          aria-label="More servings"
          onClick={() => onChange(clampServings(servings + 1, min, max))}
          disabled={servings >= max}
          className="w-9 h-9 flex items-center justify-center rounded-md font-heading text-lg text-fg hover:bg-edge disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
