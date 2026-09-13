export type Ingredient = {
  id: string;
  name: string;
  /** Quantity at the owning component's baseServings. Omit (and set toTaste/pending) when no fixed amount applies. */
  amount?: number;
  unit?: string;
  /** Seasoning-style item, or a stated range (e.g. "2 to 3 chillies"), meant to be adjusted by feel rather than scaled. */
  toTaste?: boolean;
  /** Quantity genuinely not locked yet (shown as a pending pill, not scaled). Unused once a recipe's quantities are final. */
  pending?: boolean;
  note?: string;
  /** Shopping list only: leave this off the checkable list entirely (salt, water, already in the kitchen). */
  excludeFromShoppingList?: boolean;
  /** Shopping list only: a fixed, buyable quantity to show instead of scaling `amount` or showing "to taste"
   *  (e.g. the top of a chilli range as a whole number). Scales with servings like a normal amount. */
  shoppingListAmount?: number;
  shoppingListUnit?: string;
  /** Shopping list only: a literal label instead of a quantity (e.g. "small pack" for curry leaves). Does not scale. */
  shoppingListLabel?: string;
};

export type MethodStep = {
  id: string;
  text: string;
};

/**
 * One way of cooking a component. Most components have exactly one (no
 * toggle shown). A component with more than one (e.g. air fryer vs BBQ)
 * presents them as equal options, not a primary method with a fallback.
 */
export type MethodVariant = {
  id: string;
  label: string;
  steps: MethodStep[];
  /** Falls back to the recipe's own `image` when omitted. */
  image?: string;
};

export type Nutrition = {
  caloriesPerServing: number;
  proteinGramsPerServing: number;
  carbsGramsPerServing: number;
  fatGramsPerServing: number;
};

/**
 * A sub-recipe reused across multiple recipes (the chickpea flour flatbread,
 * the mint chutney). Defined once in sharedComponents.ts and referenced by
 * id from any recipe's `components` array, so the ingredients/method never
 * need to be duplicated.
 */
export type SharedComponentId = "chickpea-flatbread" | "mint-chutney";

export type SharedComponent = {
  id: SharedComponentId;
  title: string;
  /** e.g. "piece" for the flatbread, "serving" for the chutney. */
  unitLabel: string;
  note?: string;
  /** Servings the ingredient amounts below are written for. */
  baseServings: number;
  ingredients: Ingredient[];
  method: MethodStep[];
  nutritionPerUnit: Nutrition;
};

/**
 * One labeled part of a recipe: either its own ingredients/method (e.g. "Bombay
 * potatoes"), or a reference to a SharedComponent (e.g. the flatbread). A
 * single-component recipe still uses this shape, its heading is just hidden
 * when there's only one.
 */
export type RecipeComponent =
  | {
      kind: "custom";
      id: string;
      title: string;
      ingredients: Ingredient[];
      methods: MethodVariant[];
    }
  | {
      kind: "shared";
      id: string;
      sharedComponentId: SharedComponentId;
    };

export type Recipe = {
  slug: string;
  name: string;
  shortDescription: string;
  /** e.g. "/recipes/darshs-chicken-curry.jpg". Omit to show the placeholder card. */
  image?: string;
  /** CSS object-position, for the rare photo whose subject isn't centred in frame. Defaults to "center". */
  imagePosition?: string;
  /** True for the one recipe that is open with no email gate. */
  open: boolean;
  baseServings: number;
  minServings: number;
  maxServings: number;
  components: RecipeComponent[];
  /** Clarifies what the nutrition figures below already include (e.g. "with one flatbread per serving"). */
  nutritionNote?: string;
  /** An optional add-on genuinely not counted in the nutrition figures (e.g. a side sauce). */
  servingSuggestion?: string;
  coachingNote: string;
  nutrition: Nutrition;
};
