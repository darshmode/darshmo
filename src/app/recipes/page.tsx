import type { Metadata } from "next";
import RecipesPageClient from "./RecipesPageClient";

export const metadata: Metadata = {
  title: "5 High-Protein Indian Recipes | MODE",
  description:
    "5 high-protein Indian recipes under 600 calories. Big on flavour, built for your goals. Try the first one free, right now.",
  openGraph: {
    title: "5 High-Protein Indian Recipes | MODE",
    description: "Under 600 calories. Big on flavour. Built for your goals.",
    url: "https://darshmode.com/recipes",
    siteName: "MODE",
  },
};

export default function RecipesPage() {
  return <RecipesPageClient />;
}
