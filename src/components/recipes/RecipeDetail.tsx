"use client";

import { useState } from "react";
import { Recipe } from "@/lib/recipes/types";
import { resolveComponent } from "@/lib/recipes/sharedComponents";
import RecipeImage from "./RecipeImage";
import ServingsSelector from "./ServingsSelector";
import NutritionPanel from "./NutritionPanel";
import IngredientList from "./IngredientList";
import ShoppingList from "./ShoppingList";
import CoachingNote from "./CoachingNote";
import { clampServings, scaleComponentIngredients, scaleShoppingListItems } from "@/lib/recipes/scaling";

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.baseServings);
  const [selectedMethod, setSelectedMethod] = useState<Record<string, string>>({});

  function setClamped(next: number) {
    setServings(clampServings(next, recipe.minServings, recipe.maxServings));
  }

  const resolvedComponents = recipe.components.map((component) => {
    const resolved = resolveComponent(component);
    const baseServings = component.kind === "shared" ? resolved.baseServings : recipe.baseServings;
    const activeMethodId = selectedMethod[component.id] ?? resolved.methods[0].id;
    const activeMethod = resolved.methods.find((m) => m.id === activeMethodId) ?? resolved.methods[0];
    return {
      id: component.id,
      title: resolved.title,
      note: resolved.note,
      methods: resolved.methods,
      activeMethod,
      nutritionPerUnit: resolved.nutritionPerUnit,
      unitLabel: resolved.unitLabel,
      scaledIngredients: scaleComponentIngredients(resolved.ingredients, baseServings, servings, component.id),
      shoppingListItems: scaleShoppingListItems(resolved.ingredients, baseServings, servings, component.id),
    };
  });

  const showComponentTitles = resolvedComponents.length > 1;
  const allShoppingItems = resolvedComponents.flatMap((c) => c.shoppingListItems);
  const heroImage = resolvedComponents.find((c) => c.activeMethod.image)?.activeMethod.image ?? recipe.image;

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-6">
        <RecipeImage
          name={recipe.name}
          src={heroImage}
          className="aspect-[4/3] md:aspect-square"
          objectPosition={recipe.imagePosition}
        />
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl text-fg tracking-wide mb-2">{recipe.name}</h2>
          <p className="font-body text-muted leading-relaxed">{recipe.shortDescription}</p>
        </div>
        <NutritionPanel nutrition={recipe.nutrition} />
        {recipe.nutritionNote && <p className="font-body text-xs text-muted -mt-3">{recipe.nutritionNote}</p>}
        <CoachingNote>{recipe.coachingNote}</CoachingNote>
      </div>

      <div className="space-y-8">
        <ServingsSelector
          servings={servings}
          min={recipe.minServings}
          max={recipe.maxServings}
          onChange={setClamped}
        />

        {resolvedComponents.map((component) => (
          <div key={component.id}>
            {showComponentTitles && (
              <h3 className="font-heading text-sm tracking-widest text-muted uppercase mb-1">{component.title}</h3>
            )}
            {component.note && <p className="font-body text-sm text-muted mb-3">{component.note}</p>}
            {!showComponentTitles && (
              <h3 className="font-heading text-sm tracking-widest text-muted uppercase mb-3">Ingredients</h3>
            )}
            <IngredientList items={component.scaledIngredients} />

            <div className="flex items-center justify-between gap-3 mt-5 mb-3">
              <h4 className="font-heading text-sm tracking-widest text-muted uppercase">
                {showComponentTitles ? `${component.title} method` : "Method"}
              </h4>
              {component.methods.length > 1 && (
                <div className="flex gap-2">
                  {component.methods.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedMethod((prev) => ({ ...prev, [component.id]: variant.id }))}
                      className={`font-heading text-xs tracking-wide px-3 py-1.5 rounded-md transition-colors ${
                        component.activeMethod.id === variant.id
                          ? "bg-[#E8862B] text-white"
                          : "bg-surface border border-edge text-muted hover:text-fg"
                      }`}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ol className="space-y-3">
              {component.activeMethod.steps.map((step, i) => (
                <li key={step.id} className="flex gap-3 font-body text-fg leading-relaxed">
                  <span className="shrink-0 font-heading text-sm text-[#E8862B] w-5">{i + 1}</span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>

            {component.nutritionPerUnit && (
              <p className="font-body text-xs text-muted mt-3">
                Per {component.unitLabel}: {component.nutritionPerUnit.caloriesPerServing} kcal &middot;{" "}
                {component.nutritionPerUnit.proteinGramsPerServing}g protein &middot;{" "}
                {component.nutritionPerUnit.fatGramsPerServing}g fat &middot;{" "}
                {component.nutritionPerUnit.carbsGramsPerServing}g carbs
              </p>
            )}
          </div>
        ))}

        {recipe.servingSuggestion && (
          <p className="font-body text-sm text-muted border-t border-edge pt-4">{recipe.servingSuggestion}</p>
        )}

        <div>
          <h3 className="font-heading text-sm tracking-widest text-muted uppercase mb-3">Shopping list</h3>
          <div className="bg-surface border border-edge rounded-lg px-5 py-4">
            <ShoppingList recipeSlug={recipe.slug} items={allShoppingItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
