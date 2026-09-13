import { Nutrition } from "@/lib/recipes/types";

const FIELDS: { key: keyof Nutrition; label: string; suffix: string }[] = [
  { key: "caloriesPerServing", label: "Calories", suffix: "" },
  { key: "proteinGramsPerServing", label: "Protein", suffix: "g" },
  { key: "carbsGramsPerServing", label: "Carbs", suffix: "g" },
  { key: "fatGramsPerServing", label: "Fat", suffix: "g" },
];

export default function NutritionPanel({ nutrition }: { nutrition: Nutrition }) {
  return (
    <div className="bg-surface border border-edge rounded-lg px-5 py-4">
      <div className="font-heading text-xs tracking-widest text-muted uppercase mb-3">Nutrition, per serving</div>
      <div className="grid grid-cols-4 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <div className="font-heading text-lg sm:text-xl text-fg tabular-nums">
              {nutrition[f.key]}
              {f.suffix}
            </div>
            <div className="font-body text-xs text-muted">{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
