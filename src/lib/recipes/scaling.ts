import { Ingredient } from "./types";

const FRACTIONS: [number, string][] = [
  [0.125, "1/8"],
  [0.25, "1/4"],
  [0.333, "1/3"],
  [0.5, "1/2"],
  [0.667, "2/3"],
  [0.75, "3/4"],
];

/** Snaps a scaled amount to something a person can actually measure. */
function roundForUnit(amount: number, unit?: string): number {
  if (unit === "g" || unit === "ml") {
    return Math.round(amount / 5) * 5;
  }
  if (unit === "cup" || unit === "cups" || unit === "tbsp" || unit === "tsp") {
    return Math.round(amount * 4) / 4;
  }
  // Countable things (onion, bulb, kebab...): keep to quarters, most people round by eye anyway.
  return Math.round(amount * 4) / 4;
}

function formatNumber(n: number): string {
  const whole = Math.floor(n);
  const remainder = Math.round((n - whole) * 1000) / 1000;

  if (remainder === 0) return `${whole}`;

  const match = FRACTIONS.find(([value]) => Math.abs(value - remainder) < 0.02);
  if (match) {
    return whole > 0 ? `${whole} ${match[1]}` : match[1];
  }
  return `${Math.round(n * 100) / 100}`;
}

export function scaleAmount(amount: number, baseServings: number, targetServings: number): number {
  return (amount * targetServings) / baseServings;
}

export type ScaledIngredient = Ingredient & { displayAmount: string | null };

// Countable units that need a plural form when the rounded amount isn't 1.
const PLURALS: Record<string, string> = {
  onion: "onions",
  bulb: "bulbs",
  bun: "buns",
  lemon: "lemons",
  stick: "sticks",
  chilli: "chillies",
};

function unitLabelFor(unit: string, rounded: number): string {
  if (!(unit in PLURALS)) return unit;
  return rounded > 1 ? PLURALS[unit] : unit;
}

/**
 * Scales one ingredient to a target serving count. Anything without a fixed
 * amount (to-taste or pending) is passed through unscaled with its own label.
 */
export function scaleIngredient(
  ingredient: Ingredient,
  baseServings: number,
  targetServings: number
): ScaledIngredient {
  if (ingredient.amount === undefined) {
    return { ...ingredient, displayAmount: null };
  }
  const scaled = scaleAmount(ingredient.amount, baseServings, targetServings);
  const rounded = roundForUnit(scaled, ingredient.unit);
  const unitLabel = ingredient.unit ? unitLabelFor(ingredient.unit, rounded) : "";
  return { ...ingredient, displayAmount: `${formatNumber(rounded)} ${unitLabel}`.trim() };
}

export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
): ScaledIngredient[] {
  return ingredients.map((i) => scaleIngredient(i, baseServings, targetServings));
}

/**
 * Scales a component's ingredients and namespaces their ids with the
 * component id, so ingredients that share a name across components (e.g.
 * "salt" in two sections of the same recipe) don't collide as shopping
 * list / checkbox keys.
 */
export function scaleComponentIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number,
  componentId: string
): ScaledIngredient[] {
  return scaleIngredients(ingredients, baseServings, targetServings).map((i) => ({
    ...i,
    id: `${componentId}__${i.id}`,
  }));
}

export function clampServings(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Builds the shopping list for a component, applying the shopping-list-only
 * quantity rules: excluded items (salt, water) are dropped, a fixed
 * `shoppingListAmount` (e.g. the top of a chilli range) scales as a whole
 * number instead of showing "to taste", and `shoppingListLabel` (e.g. "small
 * pack" for curry leaves) replaces the quantity outright. The recipe's own
 * ingredient list is untouched, this only affects what's shown here.
 */
export function scaleShoppingListItems(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number,
  componentId: string
): ScaledIngredient[] {
  return ingredients
    .filter((i) => !i.excludeFromShoppingList)
    .map((i): ScaledIngredient => {
      if (i.shoppingListLabel) {
        return { ...i, id: `${componentId}__${i.id}`, toTaste: false, pending: false, displayAmount: i.shoppingListLabel };
      }
      if (i.shoppingListAmount !== undefined) {
        const scaled = scaleAmount(i.shoppingListAmount, baseServings, targetServings);
        const rounded = Math.ceil(scaled);
        const unitLabel = i.shoppingListUnit ? unitLabelFor(i.shoppingListUnit, rounded) : "";
        return {
          ...i,
          id: `${componentId}__${i.id}`,
          toTaste: false,
          pending: false,
          displayAmount: `${rounded} ${unitLabel}`.trim(),
        };
      }
      const scaled = scaleIngredient(i, baseServings, targetServings);
      return { ...scaled, id: `${componentId}__${scaled.id}` };
    });
}
