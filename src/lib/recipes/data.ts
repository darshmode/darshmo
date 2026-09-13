import { Recipe } from "./types";
import { sharedComponentRef } from "./sharedComponents";

/**
 * Nutrition figures below are final and calculated from the exact ingredient
 * quantities in each recipe, do not recalculate or invent different numbers.
 *
 * Internal note, not for the public page: these are calculated from standard
 * ingredient nutrition data, not from the specific product brands that will
 * actually be used (yoghurt, tandoori powder, and burger buns especially), so
 * treat them as accurate estimates rather than lab-tested figures.
 */

export const recipes: Recipe[] = [
  {
    slug: "darshs-chicken-curry",
    name: "Darsh's Chicken Curry",
    shortDescription: "The original. Kept flexible, kept authentic.",
    image: "/recipes/darshs-chicken-curry.jpg",
    open: true,
    baseServings: 4,
    minServings: 2,
    maxServings: 8,
    components: [
      {
        kind: "custom",
        id: "curry",
        title: "Curry",
        ingredients: [
          { id: "chicken", name: "Chicken breast", amount: 1000, unit: "g", note: "cut into small pieces" },
          { id: "fat", name: "Oil or ghee", amount: 1, unit: "tbsp" },
          { id: "onion", name: "Onion", amount: 2, unit: "onion", note: "medium" },
          { id: "garlic", name: "Garlic", amount: 1, unit: "bulb", note: "minced" },
          { id: "chilli", name: "Fresh chilli", toTaste: true, note: "2 to 3, chopped, to taste", shoppingListAmount: 3, shoppingListUnit: "chilli" },
          { id: "coriander", name: "Fresh coriander", toTaste: true, note: "chopped, a big handful" },
          { id: "cinnamon", name: "Cinnamon stick", amount: 1, unit: "stick" },
          { id: "cloves", name: "Cloves", toTaste: true, note: "4 to 5" },
          { id: "curry-leaves", name: "Curry leaves", toTaste: true, note: "2 to 4", shoppingListLabel: "small pack" },
          { id: "curry-powder", name: "Curry powder", amount: 2, unit: "tbsp" },
          { id: "paprika", name: "Paprika", amount: 1, unit: "tsp" },
          { id: "cumin", name: "Ground cumin", amount: 1, unit: "tsp" },
          { id: "ground-coriander", name: "Ground coriander", amount: 1, unit: "tsp" },
          { id: "garam-masala", name: "Garam masala", amount: 1, unit: "tsp" },
          { id: "tomatoes", name: "Chopped tomatoes", amount: 400, unit: "g", note: "1 tin" },
          { id: "water", name: "Boiling water", toTaste: true, note: "300 to 400ml, added gradually", excludeFromShoppingList: true },
          { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
        ],
        methods: [
          {
            id: "default",
            label: "Method",
            steps: [
              { id: "s1", text: "Heat oil or ghee in a pan on medium heat." },
              { id: "s2", text: "Add cinnamon, cloves, and curry leaves. Cook 30 to 60 seconds until they sizzle and you can smell them." },
              { id: "s3", text: "Add onion and a pinch of salt." },
              { id: "s4", text: "Cook 15 to 30 minutes, stirring often, until deep golden-brown, not just soft. Add a splash of water if it sticks or dries out." },
              { id: "s5", text: "Add garlic and chilli. Cook 1 to 2 minutes, until the raw smell disappears." },
              { id: "s6", text: "Turn the heat to low. Mix the curry powder and paprika with a splash of water into a loose, wet paste, this stops the spices burning the moment they hit the pan." },
              { id: "s7", text: "Add the paste to the pan. Cook 1 to 2 minutes, stirring." },
              { id: "s8", text: "Add the tomatoes. Turn the heat back to medium." },
              { id: "s9", text: "Cook 10 to 15 minutes, stirring every minute or two, until the tomatoes break down completely and the oil starts separating and glistening at the edges of the paste, that's the real sign it's ready." },
              { id: "s10", text: "Add the boiling water gradually, stirring as you go, until you're within that 300 to 400ml range." },
              { id: "s11", text: "Add the chicken." },
              { id: "s12", text: "Lid on, heat medium-low, simmer 12 to 15 minutes." },
              { id: "s13", text: "Lid off, taste." },
              { id: "s14", text: "Adjust salt and chilli." },
              { id: "s15", text: "Stir in the ground cumin, ground coriander, garam masala, and fresh coriander." },
              { id: "s16", text: "Make the flatbread, serve one per portion." },
            ],
          },
        ],
      },
      sharedComponentRef("flatbread", "chickpea-flatbread"),
    ],
    nutritionNote: "Nutrition includes the curry and one chickpea flatbread per serving.",
    coachingNote:
      "Follow the spice measurements, they're a good starting point. But everyone's taste buds and tolerances are different. Needs more salt? Add it. Want more of a kick? Whack in some extra chilli. This is your base, and over time you'll just add as you go until it's exactly how you like it.",
    nutrition: { caloriesPerServing: 525, proteinGramsPerServing: 64, carbsGramsPerServing: 28, fatGramsPerServing: 16 },
  },
  {
    slug: "coconut-king-prawn-curry",
    name: "Coconut King Prawn Curry",
    shortDescription: "The same masala base, turned creamy with coconut.",
    image: "/recipes/coconut-king-prawn-curry.jpg",
    open: false,
    baseServings: 4,
    minServings: 2,
    maxServings: 8,
    components: [
      {
        kind: "custom",
        id: "curry",
        title: "Curry",
        ingredients: [
          { id: "prawns", name: "Raw king prawns", amount: 800, unit: "g", note: "peeled and deveined" },
          { id: "fat", name: "Oil or ghee", amount: 1, unit: "tbsp" },
          { id: "onion", name: "Onion", amount: 2, unit: "onion", note: "medium" },
          { id: "garlic", name: "Garlic", amount: 1, unit: "bulb", note: "minced" },
          { id: "chilli", name: "Fresh chilli", toTaste: true, note: "2 to 3, chopped, to taste", shoppingListAmount: 3, shoppingListUnit: "chilli" },
          { id: "curry-powder", name: "Curry powder", amount: 2, unit: "tbsp" },
          { id: "paprika", name: "Paprika", amount: 1, unit: "tsp" },
          { id: "tomatoes", name: "Chopped tomatoes", amount: 400, unit: "g", note: "1 tin" },
          { id: "coconut-milk", name: "Light coconut milk", amount: 200, unit: "ml" },
          { id: "cumin", name: "Ground cumin", amount: 1, unit: "tsp" },
          { id: "ground-coriander", name: "Ground coriander", amount: 1, unit: "tsp" },
          { id: "garam-masala", name: "Garam masala", amount: 1, unit: "tsp" },
          { id: "coriander", name: "Fresh coriander", toTaste: true, note: "chopped" },
          { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
        ],
        methods: [
          {
            id: "default",
            label: "Method",
            steps: [
              { id: "s1", text: "Heat oil in a pan on medium heat." },
              { id: "s2", text: "Add onion and a pinch of salt." },
              { id: "s3", text: "Cook 15 to 30 minutes, stirring often, until deep golden-brown. Add a splash of water if it sticks or dries out." },
              { id: "s4", text: "Add garlic and chilli. Cook 1 to 2 minutes until the raw smell disappears." },
              { id: "s5", text: "Turn the heat to low. Mix the curry powder and paprika with a splash of water into a loose paste." },
              { id: "s6", text: "Add the paste to the pan. Cook 1 to 2 minutes, stirring." },
              { id: "s7", text: "Add the tomatoes. Turn the heat back to medium." },
              { id: "s8", text: "Cook 10 to 15 minutes, until the tomatoes break down completely and the oil separates and glistens at the edges." },
              { id: "s9", text: "Add the coconut milk. Turn the heat down to medium-low. Simmer 5 minutes." },
              { id: "s10", text: "Add the prawns. Turn the heat down to low." },
              { id: "s11", text: "Cook 2 to 4 minutes only. This is fast, watch closely. The prawns turn pink and curl into a loose C shape when done. If they curl into a tight small circle, they've gone too far. Take off the heat immediately once done." },
              { id: "s12", text: "Stir in the ground cumin, ground coriander, garam masala, and fresh coriander." },
            ],
          },
        ],
      },
      {
        kind: "custom",
        id: "rice",
        title: "Rice",
        ingredients: [
          {
            id: "rice",
            name: "Basmati rice",
            amount: 300,
            unit: "g",
            note: "dry, before cooking, roughly 75g per serving, cooks to roughly 185g per serving",
          },
        ],
        methods: [
          { id: "default", label: "Method", steps: [{ id: "s1", text: "Cook the rice separately per pack instructions while the curry simmers." }] },
        ],
      },
    ],
    nutritionNote: "Nutrition includes the curry and 75g dry rice per serving (roughly 185g cooked).",
    coachingNote:
      "This should feel indulgent, creamy, and a little bit of a treat, while staying high protein and calorie controlled. Watch the prawns closely near the end, thirty seconds is the difference between perfect and rubbery. That's the point: proper flavour and a body that's still moving toward your goal.",
    nutrition: { caloriesPerServing: 534, proteinGramsPerServing: 42, carbsGramsPerServing: 76, fatGramsPerServing: 8 },
  },
  {
    slug: "grilled-chicken-tikka-and-bombay-potatoes",
    name: "Grilled Chicken Tikka and Bombay Potatoes",
    shortDescription: "Quick, easy, and genuinely high protein.",
    image: "/recipes/grilled-chicken-tikka-and-bombay-potatoes.jpg",
    imagePosition: "45% center",
    open: false,
    baseServings: 4,
    minServings: 2,
    maxServings: 8,
    components: [
      {
        kind: "custom",
        id: "chicken",
        title: "Chicken",
        ingredients: [
          { id: "chicken", name: "Chicken breast", amount: 1000, unit: "g", note: "cut into chunks" },
          { id: "tomato-paste", name: "Tomato paste", amount: 2, unit: "tbsp" },
          { id: "yoghurt", name: "Greek yoghurt", amount: 3, unit: "tbsp" },
          { id: "garlic", name: "Garlic", amount: 1, unit: "bulb", note: "minced" },
          { id: "chilli", name: "Fresh chilli", toTaste: true, note: "1 to 2, chopped, to taste", shoppingListAmount: 2, shoppingListUnit: "chilli" },
          { id: "tikka-powder", name: "Chicken tikka powder", amount: 2, unit: "tbsp" },
          { id: "coriander", name: "Fresh coriander", toTaste: true, note: "chopped" },
          { id: "cumin", name: "Ground cumin", amount: 1, unit: "tsp" },
          { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
        ],
        methods: [
          {
            id: "default",
            label: "Method",
            steps: [
              { id: "s1", text: "Mix the chicken with the tomato paste, yoghurt, garlic, chilli, tikka powder, coriander, cumin, and salt." },
              { id: "s2", text: "Marinate for at least 30 minutes, longer in the fridge if possible." },
              { id: "s3", text: "Put the chicken straight into the air fryer, no preheating." },
              { id: "s4", text: "Cook for 15 to 20 minutes total. At the 10 minute mark, turn the pieces over, then keep cooking." },
              { id: "s5", text: "Check the biggest piece is white all the way through, no pink." },
            ],
          },
        ],
      },
      {
        kind: "custom",
        id: "potatoes",
        title: "Bombay potatoes",
        ingredients: [
          {
            id: "potatoes",
            name: "Potatoes",
            amount: 600,
            unit: "g",
            note: "cut into 2-inch chunks, or new potatoes left whole or halved if small",
          },
          { id: "olive-oil", name: "Olive oil", amount: 1, unit: "tbsp" },
          { id: "paprika", name: "Paprika", amount: 1, unit: "tsp" },
          { id: "curry-powder", name: "Curry powder", amount: 1, unit: "tsp" },
          { id: "garlic-powder", name: "Garlic powder", amount: 1, unit: "tsp" },
          { id: "onion-powder", name: "Onion powder", amount: 1, unit: "tsp" },
          { id: "cumin-seeds", name: "Cumin seeds", amount: 1, unit: "tsp" },
          { id: "cumin", name: "Ground cumin", amount: 1, unit: "tsp" },
          { id: "ground-coriander", name: "Ground coriander", amount: 1, unit: "tsp" },
          { id: "turmeric", name: "Turmeric", amount: 1, unit: "tsp" },
          { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
        ],
        methods: [
          {
            id: "default",
            label: "Method",
            steps: [
              { id: "s1", text: "Boil the potato chunks in salted water for 10 to 12 minutes, until a fork goes in easily but they're not falling apart." },
              { id: "s2", text: "Drain." },
              { id: "s3", text: "Put the potatoes back in the pot. Add the olive oil, paprika, curry powder, garlic powder, onion powder, cumin seeds, ground cumin, ground coriander, turmeric, and salt." },
              { id: "s4", text: "Put the lid on and shake well, so every piece is coated evenly." },
              { id: "s5", text: "Tip into the air fryer." },
              { id: "s6", text: "Cook at the highest heat setting for 10 minutes, checking often and shaking every couple of minutes so they crisp evenly." },
            ],
          },
        ],
      },
    ],
    servingSuggestion:
      "Optional, not included in the nutrition above: add a sauce of your choice (chilli sauce, garlic mayo, or similar) plus salad if you like.",
    coachingNote:
      "This is the one for a weeknight. Marinate, air fry, done. Proof that high protein doesn't have to mean high effort.",
    nutrition: { caloriesPerServing: 480, proteinGramsPerServing: 62, carbsGramsPerServing: 30, fatGramsPerServing: 11 },
  },
  {
    slug: "lean-lamb-kebabs-and-mint-chutney",
    name: "Lean Lamb Kebabs and Mint Chutney",
    shortDescription: "Takeaway-style, without the takeaway trade-off.",
    image: "/recipes/lean-lamb-kebabs-and-mint-chutney.jpg",
    open: false,
    baseServings: 4,
    minServings: 2,
    maxServings: 8,
    components: [
      {
        kind: "custom",
        id: "kebabs",
        title: "Kebabs",
        ingredients: [
          { id: "lamb", name: "Lean lamb mince", amount: 800, unit: "g", note: "10% fat or less" },
          { id: "garlic", name: "Garlic", amount: 1, unit: "bulb", note: "minced" },
          { id: "coriander", name: "Fresh coriander", toTaste: true, note: "chopped" },
          { id: "cumin", name: "Ground cumin", amount: 1, unit: "tsp" },
          { id: "ground-coriander", name: "Ground coriander", amount: 1, unit: "tsp" },
          { id: "garam-masala", name: "Garam masala", amount: 1, unit: "tsp" },
          { id: "chilli", name: "Fresh chilli", toTaste: true, note: "1 to 2, chopped, to taste", shoppingListAmount: 2, shoppingListUnit: "chilli" },
          { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
          { id: "smoked-paprika", name: "Smoked paprika", toTaste: true, note: "optional, roughly 1/2 tsp" },
        ],
        methods: [
          {
            id: "air-fryer",
            label: "Air Fryer",
            steps: [
              { id: "s1", text: "Mix the lamb mince with the garlic, coriander, spices, chilli, and salt. Don't overwork it, or it turns dense rather than tender." },
              { id: "s2", text: "Split into 8 equal portions (2 per serving) and shape each into a fat sausage shape, about 100g each." },
              { id: "s3", text: "Put them straight into the air fryer, no preheating." },
              { id: "s4", text: "Cook for 15 to 20 minutes total. Check and turn at the 10 minute mark." },
              { id: "s5", text: "Cut one open in the middle to check there's no pink left." },
              { id: "s6", text: "Make the flatbread, serve one per portion with the mint chutney." },
            ],
          },
          {
            id: "bbq",
            label: "BBQ",
            image: "/recipes/lean-lamb-kebabs-and-mint-chutney.jpg",
            steps: [
              { id: "s1", text: "Mix the lamb mince with the garlic, coriander, spices, chilli, and salt. Don't overwork it, or it turns dense rather than tender." },
              { id: "s2", text: "Split into 8 equal portions (2 per serving) and shape each into a fat sausage shape, about 100g each." },
              { id: "s3", text: "Preheat the BBQ to medium-high heat." },
              { id: "s4", text: "Thread the kebabs onto skewers if not already done." },
              { id: "s5", text: "Place on the BBQ over direct heat." },
              { id: "s6", text: "Cook for 10 to 12 minutes total, turning every few minutes so all sides get colour." },
              { id: "s7", text: "Cut one open in the middle to check there's no pink left, same check as the air fryer method." },
              { id: "s8", text: "Make the flatbread, serve one per portion with the mint chutney." },
            ],
          },
        ],
      },
      sharedComponentRef("flatbread", "chickpea-flatbread"),
      sharedComponentRef("mint-chutney", "mint-chutney"),
    ],
    nutritionNote: "Nutrition includes the kebabs, one flatbread, and mint chutney per serving.",
    coachingNote:
      "This is the one that proves takeaway flavour and progress aren't opposites. Get the seasoning right and you won't miss the version from the shop down the road. Don't overwork the mince, that's the only real technique here.",
    nutrition: { caloriesPerServing: 524, proteinGramsPerServing: 51, carbsGramsPerServing: 19, fatGramsPerServing: 26 },
  },
  {
    slug: "tandoori-chicken-thigh-burger",
    name: "Tandoori Chicken Thigh Burger",
    shortDescription: "Fun, comfort food, still on plan.",
    image: "/recipes/tandoori-chicken-thigh-burger.jpg",
    open: false,
    baseServings: 4,
    minServings: 2,
    maxServings: 8,
    components: [
      {
        kind: "custom",
        id: "burger",
        title: "Burger",
        ingredients: [
          { id: "chicken-thigh", name: "Skinless chicken thigh", amount: 800, unit: "g", note: "raw, 200g per serving" },
          { id: "tandoori-powder", name: "Tandoori powder", amount: 2, unit: "tbsp", note: "shop-bought" },
          { id: "tomato-paste", name: "Tomato paste", amount: 2, unit: "tbsp" },
          { id: "yoghurt", name: "Yoghurt", amount: 3, unit: "tbsp" },
          { id: "garlic", name: "Garlic", amount: 1, unit: "bulb", note: "minced" },
          { id: "chilli", name: "Fresh chilli", toTaste: true, note: "chopped, to taste" },
          { id: "salt", name: "Salt", toTaste: true, excludeFromShoppingList: true },
          { id: "lemon", name: "Lemon", amount: 0.5, unit: "lemon", note: "juice of" },
          { id: "buns", name: "Burger buns", amount: 4, unit: "bun", note: "roughly 70 to 80g each" },
          { id: "salad", name: "Salad or pickled onion", toTaste: true },
        ],
        methods: [
          {
            id: "default",
            label: "Method",
            steps: [
              { id: "s1", text: "Mix the tandoori powder, tomato paste, yoghurt, garlic, chilli, and salt into a thick paste." },
              { id: "s2", text: "Coat the chicken thighs fully in the paste." },
              { id: "s3", text: "Marinate for at least 30 minutes in the fridge." },
              { id: "s4", text: "Put the chicken straight into the air fryer, no preheating." },
              { id: "s5", text: "Cook for 15 to 20 minutes total. Check and turn at the 10 minute mark." },
              { id: "s6", text: "Cut into the thickest piece to check it's cooked through, no pink." },
              { id: "s7", text: "Once cooked, squeeze the lemon juice over the chicken." },
              { id: "s8", text: "Build the burger: bun, chicken, salad or pickled onion, top bun." },
            ],
          },
        ],
      },
    ],
    servingSuggestion:
      "Optional, not included in the nutrition above: add a sauce of your choice (chilli sauce, garlic mayo, or similar) alongside the salad or pickled onion.",
    coachingNote:
      "Chicken thigh is deliberate here, the other recipes lean on breast, and thigh brings more flavour for very little extra cost. This is a burger. It's meant to feel like one.",
    nutrition: { caloriesPerServing: 452, proteinGramsPerServing: 49, carbsGramsPerServing: 40, fatGramsPerServing: 11 },
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export const openRecipe = recipes.find((r) => r.open)!;
export const lockedRecipes = recipes.filter((r) => !r.open);
