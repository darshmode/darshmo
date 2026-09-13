import { Recipe } from "@/lib/recipes/types";
import RecipeImage from "./RecipeImage";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function RecipeCard({
  recipe,
  locked,
  onSelect,
}: {
  recipe: Recipe;
  locked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left group w-full bg-surface border border-edge rounded-xl overflow-hidden hover:border-muted transition-colors"
    >
      <div className="relative">
        <RecipeImage
          name={recipe.name}
          src={recipe.image}
          className="aspect-[4/3]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          objectPosition={recipe.imagePosition}
        />
        {locked && (
          <div className="absolute top-3 right-3 bg-bg/80 backdrop-blur border border-edge rounded-full p-2 text-fg">
            <LockIcon />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg text-fg tracking-wide mb-1">{recipe.name}</h3>
        <p className="font-body text-sm text-muted mb-3 leading-relaxed">{recipe.shortDescription}</p>
        <div className="font-heading text-xs tracking-widest uppercase text-[#E8862B]">
          {recipe.nutrition.caloriesPerServing} kcal / serving
        </div>
      </div>
    </button>
  );
}
