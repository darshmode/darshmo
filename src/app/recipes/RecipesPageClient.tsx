"use client";

import { useRef, useState } from "react";
import { recipes, getRecipeBySlug, openRecipe } from "@/lib/recipes/data";
import RecipesHeader from "@/components/recipes/RecipesHeader";
import RecipesHero from "@/components/recipes/RecipesHero";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeDetail from "@/components/recipes/RecipeDetail";
import UnlockGate from "@/components/recipes/UnlockGate";
import RecipesCta from "@/components/recipes/RecipesCta";
import { useUnlock } from "@/lib/unlock/useUnlock";

export default function RecipesPageClient() {
  const { unlocked, checkingLink, submitEmail } = useUnlock();
  const [selectedSlug, setSelectedSlug] = useState(openRecipe.slug);
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const selectedRecipe = getRecipeBySlug(selectedSlug) ?? openRecipe;

  function handleSelect(slug: string, locked: boolean) {
    if (locked) {
      setPendingSlug(slug);
      setGateOpen(true);
      return;
    }
    setSelectedSlug(slug);
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleUnlocked() {
    setJustUnlocked(true);
    if (pendingSlug) {
      setSelectedSlug(pendingSlug);
      setPendingSlug(null);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <RecipesHeader />

      <RecipesHero />

      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => {
            const locked = !recipe.open && !unlocked;
            return (
              <RecipeCard
                key={recipe.slug}
                recipe={recipe}
                locked={locked}
                onSelect={() => handleSelect(recipe.slug, locked)}
              />
            );
          })}
        </div>

        {!unlocked && !checkingLink && (
          <p className="font-body text-sm text-muted text-center mt-6">
            Recipe 1 is fully open, servings calculator and shopping list included. Unlock the rest with your email.
          </p>
        )}

        {justUnlocked && (
          <div className="mt-6 bg-surface border border-[#E8862B]/40 rounded-lg px-5 py-4 text-center">
            <p className="font-body text-fg">
              All 5 recipes are unlocked on this device. Check your email for a permanent link back here.
            </p>
          </div>
        )}
      </div>

      <div ref={detailRef} className="max-w-6xl mx-auto px-6 py-10 md:py-14 border-t border-edge">
        <RecipeDetail key={selectedRecipe.slug} recipe={selectedRecipe} />
      </div>

      <div className="border-t border-edge">
        <RecipesCta />
      </div>

      <UnlockGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onSubmit={submitEmail}
        onUnlocked={handleUnlocked}
      />
    </div>
  );
}
