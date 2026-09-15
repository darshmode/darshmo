import Image from "next/image";
import Section from "./Section";

export type ResultPerson = { name: string; file: string };

export default function ResultsGallery({
  people,
  heading,
  id,
}: {
  people: ResultPerson[];
  heading?: string;
  id?: string;
}) {
  return (
    <Section id={id} className="bg-surface/40">
      <div className="max-w-5xl mx-auto px-6">
        {heading && (
          <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-center mb-12">{heading}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {people.map((p) => (
            <div key={p.name} className="relative aspect-[4/5] rounded-xl overflow-hidden border border-edge bg-surface">
              <Image src={`/gallery/${p.file}`} alt="Transformation result" fill className="object-cover" sizes="(min-width: 640px) 16vw, 45vw" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
