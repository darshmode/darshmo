import Section from "./Section";

const lines = [
  "You still remember when being fit was just… you.",
  "Then life got busy. Work, patients, kids, family, the food you were raised to never waste.",
  "And somewhere along the way, you caught yourself in the mirror and thought, \"How the fuck did I get here?\"",
  "You've tried to sort it out. New program. New diet. \"Right, Monday. I'm locking in this time.\"",
  "The frustrating part? You know what to do. You know how to train. You know your macros. So why can't you make it stick anymore?",
  "That knee you keep saying will sort itself out. The shoulder you've learned to work around. The lower back that's \"just tight.\"",
  "Because deep down, you know you've still got it in you.",
  "You want to look good again. Feel strong. Move without something always hurting.",
  "And this time, you want it to last.",
];

export default function Empathy() {
  return (
    <Section className="bg-surface/40">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-center mb-10">Athletic to Pathetic</h2>
        <div className="space-y-8">
          {lines.map((line) => (
            <p key={line} className="font-body text-lg sm:text-xl leading-relaxed text-fg text-center">
              {line}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
