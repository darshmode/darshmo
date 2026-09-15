import Image from "next/image";
import Section from "./Section";

const featured = [
  {
    name: "Riley",
    video: "/videos/riley-testimonial.mp4",
    poster: "/videos/posters/riley-testimonial.jpg",
    photo: "/gallery/riley.png",
    quote:
      "He just helps keep me consistent. He's not around, he's not on board, but we communicate, and he's fantastic. He holds me accountable.",
  },
  {
    name: "Francy",
    video: "/videos/francy-testimonial.mp4",
    poster: "/videos/posters/francy-testimonial.jpg",
    photo: "/gallery/francy.png",
    quote:
      "Everything is custom tailored to you. It doesn't feel like you're going through a regular program, it feels like you're actually being molded.",
  },
];

export default function Testimonials() {
  return (
    <Section id="testimonials" className="bg-surface/40">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-center mb-12">Testimonials</h2>

        <div className="space-y-16">
          {featured.map((t) => (
            <div key={t.name} className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-edge bg-surface">
                <video
                  className="w-full h-full object-cover"
                  src={t.video}
                  poster={t.poster}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="flex gap-6 items-start">
                <div className="relative w-28 sm:w-36 aspect-[4/5] shrink-0 rounded-xl overflow-hidden border border-edge">
                  <Image src={t.photo} alt={`${t.name}'s transformation`} fill className="object-cover" sizes="144px" />
                </div>
                <div>
                  <blockquote className="font-body text-fg/90 text-base leading-relaxed mb-3">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="font-heading text-xs tracking-wide text-muted">{t.name.toUpperCase()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
