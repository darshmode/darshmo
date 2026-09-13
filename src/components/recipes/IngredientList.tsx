import { ScaledIngredient } from "@/lib/recipes/scaling";

export default function IngredientList({ items }: { items: ScaledIngredient[] }) {
  return (
    <ul className="divide-y divide-edge">
      {items.map((ingredient) => (
        <li key={ingredient.id} className="flex items-baseline justify-between gap-4 py-2.5">
          <span className="font-body text-fg">
            {ingredient.name}
            {ingredient.note && <span className="text-muted">, {ingredient.note}</span>}
          </span>
          {ingredient.pending ? (
            <span className="shrink-0 font-body text-xs text-[#E8862B] whitespace-nowrap">quantity TBC</span>
          ) : ingredient.toTaste ? (
            <span className="shrink-0 font-body text-xs text-muted whitespace-nowrap">to taste</span>
          ) : (
            <span className="shrink-0 font-heading text-sm text-fg tabular-nums whitespace-nowrap">
              {ingredient.displayAmount}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
