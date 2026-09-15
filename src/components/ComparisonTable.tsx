import Section from "./Section";

type Cell = boolean | string;

const rows: { label: string; app: Cell; coach: Cell; mode: Cell }[] = [
  {
    label: "Assesses and fixes weak links, not just prescribes exercises",
    app: false,
    coach: false,
    mode: true,
  },
  {
    label: "Includes mobility work, not just lifting/cardio",
    app: false,
    coach: false,
    mode: true,
  },
  {
    label: "Nutrition built around what you actually eat",
    app: false,
    coach: false,
    mode: true,
  },
  {
    label: "Form checked and corrected",
    app: false,
    coach: "Rare",
    mode: true,
  },
  {
    label: "Weekly check-ins with ongoing accountability",
    app: false,
    coach: "Occasional",
    mode: true,
  },
  {
    label: "Builds habits that actually stick, not just a plan",
    app: false,
    coach: false,
    mode: true,
  },
  {
    label: "Investment",
    app: "One-off cost, limited results",
    coach: "Big upfront fee + joining fee",
    mode: "Monthly, no joining fee",
  },
];

function Cell({ value, emphasis = false }: { value: Cell; emphasis?: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={`font-body text-sm ${emphasis ? "text-fg" : "text-muted"}`}>{value}</span>
    );
  }
  return value ? (
    <span className={`text-lg leading-none ${emphasis ? "text-accent" : "text-fg"}`}>&#10003;</span>
  ) : (
    <span className="text-muted text-lg leading-none">&#10007;</span>
  );
}

export default function ComparisonTable() {
  return (
    <Section>
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-center mb-6">
          Why MODE vs. a Cheap App
        </h2>
        <p className="font-body text-muted text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          You&rsquo;ve plan-hopped so many times. You&rsquo;ve tried the rigid meal plans, the fad diets, the
          PT that was so rigid, and so expensive you couldn&rsquo;t justify it over time. Here&rsquo;s
          what&rsquo;s actually different.
        </p>
        {/* Desktop: full table. Mobile: stacked cards, no horizontal scroll. */}
        <div className="hidden sm:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border border-edge">
                <th className="font-heading text-xs tracking-wide text-muted py-4 px-4 w-1/4 border border-edge">WHAT MATTERS</th>
                <th className="font-heading text-xs tracking-wide text-muted py-4 px-4 w-1/4 text-center border border-edge">CHEAP APP</th>
                <th className="font-heading text-xs tracking-wide text-muted py-4 px-4 w-1/4 text-center border border-edge">GENERIC ONLINE COACH</th>
                <th className="font-heading text-sm tracking-wide text-accent py-4 px-4 w-1/4 text-center border border-edge bg-surface/60">MODE</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="font-body text-sm text-fg font-medium py-5 px-4 align-top border border-edge">{r.label}</td>
                  <td className="py-5 px-4 align-top text-center border border-edge">
                    <Cell value={r.app} />
                  </td>
                  <td className="py-5 px-4 align-top text-center border border-edge">
                    <Cell value={r.coach} />
                  </td>
                  <td className="py-5 px-4 align-top text-center border border-edge bg-surface/60">
                    <Cell value={r.mode} emphasis />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-4">
          {rows.map((r) => (
            <div key={r.label} className="rounded-xl border border-edge overflow-hidden">
              <div className="font-body text-sm text-fg font-medium px-4 py-3 bg-surface/60">{r.label}</div>
              <div className="divide-y divide-edge">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-heading text-xs tracking-wide text-muted">CHEAP APP</span>
                  <Cell value={r.app} />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-heading text-xs tracking-wide text-muted">GENERIC ONLINE COACH</span>
                  <Cell value={r.coach} />
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-surface/60">
                  <span className="font-heading text-xs tracking-wide text-accent">MODE</span>
                  <Cell value={r.mode} emphasis />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
