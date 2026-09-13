import { MethodVariant, RecipeComponent, SharedComponent, SharedComponentId } from "./types";

/**
 * The sub-recipes reused across multiple recipes. Defined once here so a
 * recipe never duplicates their ingredients/method, it just references the
 * id via sharedComponentRef() below.
 */
export const sharedComponents: Record<SharedComponentId, SharedComponent> = {
  "chickpea-flatbread": {
    id: "chickpea-flatbread",
    title: "Chickpea flour flatbread",
    unitLabel: "piece",
    note: "Makes 4, one per serving.",
    baseServings: 4,
    ingredients: [
      { id: "flour", name: "Chickpea flour", amount: 1, unit: "cup" },
      { id: "water", name: "Water", amount: 1.5, unit: "cups", excludeFromShoppingList: true },
      { id: "coriander", name: "Fresh coriander", toTaste: true, note: "chopped, optional" },
      { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
      { id: "ghee", name: "Ghee", amount: 1, unit: "tsp", note: "for cooking" },
    ],
    method: [
      { id: "s1", text: "Put the chickpea flour, water, coriander if using, and salt into a shake blender. Blend until smooth, no lumps." },
      { id: "s2", text: "Heat a non-stick pan on high heat. Add the teaspoon of ghee, this should be enough for the whole batch, you shouldn't need to add more unless it starts sticking." },
      { id: "s3", text: "Pour in one ladleful. Tip the pan so it spreads thin. Smaller ones are easier to flip." },
      { id: "s4", text: "Watch for small holes appearing on the surface, that's the sign it's ready to flip." },
      { id: "s5", text: "Flip. Cook the other side 2 to 3 minutes, checking it doesn't burn." },
    ],
    nutritionPerUnit: { caloriesPerServing: 124, proteinGramsPerServing: 5, carbsGramsPerServing: 13, fatGramsPerServing: 6 },
  },
  "mint-chutney": {
    id: "mint-chutney",
    title: "Mint chutney",
    unitLabel: "serving",
    baseServings: 1,
    ingredients: [
      { id: "yoghurt", name: "0% fat Greek yoghurt", amount: 50, unit: "g" },
      { id: "mint", name: "Fresh mint", toTaste: true, note: "finely chopped, a small handful" },
    ],
    method: [
      { id: "s1", text: "Finely chop the mint." },
      { id: "s2", text: "Stir into the yoghurt until mixed through." },
    ],
    nutritionPerUnit: { caloriesPerServing: 30, proteinGramsPerServing: 5, carbsGramsPerServing: 2, fatGramsPerServing: 0 },
  },
};

export function sharedComponentRef(id: string, sharedComponentId: SharedComponentId): RecipeComponent {
  return { kind: "shared", id, sharedComponentId };
}

/** Resolves a RecipeComponent to its display data, following shared references. */
export function resolveComponent(component: RecipeComponent): {
  title: string;
  note?: string;
  baseServings: number;
  ingredients: SharedComponent["ingredients"];
  methods: MethodVariant[];
  nutritionPerUnit?: SharedComponent["nutritionPerUnit"];
  unitLabel?: string;
} {
  if (component.kind === "shared") {
    const shared = sharedComponents[component.sharedComponentId];
    return {
      title: shared.title,
      note: shared.note,
      baseServings: shared.baseServings,
      ingredients: shared.ingredients,
      methods: [{ id: "default", label: "Method", steps: shared.method }],
      nutritionPerUnit: shared.nutritionPerUnit,
      unitLabel: shared.unitLabel,
    };
  }
  return {
    title: component.title,
    baseServings: 0, // caller substitutes the recipe's own baseServings
    ingredients: component.ingredients,
    methods: component.methods,
  };
}
