import Section from "./Section";
import { SocialProofShot, type Shot } from "./SocialProofShot";

export default function WhatsAppTestimonials({
  heading,
  screenshots,
}: {
  heading: string;
  screenshots: Shot[];
}) {
  return (
    <Section className="bg-surface/40">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-center mb-12">{heading}</h2>
        <div className="flex flex-wrap items-start justify-center gap-8">
          {screenshots.map((s) => (
            <SocialProofShot key={s.file} shot={s} size="w-64 sm:w-72 md:w-80" />
          ))}
        </div>
      </div>
    </Section>
  );
}
