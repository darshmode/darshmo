import Section from "./Section";
import CtaButton from "./CtaButton";

export default function PullUpProgression() {
  return (
    <Section id="pullups">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-center mb-2">Pull-Up Progression</h2>
        <p className="text-center font-body text-muted mb-12">Measurable proof, not just talk.</p>
        <div className="grid sm:grid-cols-2 gap-8 mb-14">
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden border border-edge bg-surface">
              <video className="w-full h-full object-cover" src="/videos/francy-pullup.mp4" poster="/videos/posters/francy-pullup.jpg" controls playsInline preload="metadata" />
            </div>
            <p className="text-center font-body text-sm sm:text-base text-fg/90 leading-relaxed max-w-sm mx-auto">
              Francy&rsquo;s goal was simple, one full pull-up. He couldn&rsquo;t do it. Three months later,
              he&rsquo;s flying over the bar, and now training weighted pull-ups to push even further.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden border border-edge bg-surface">
              <video className="w-full h-full object-cover" src="/videos/cody-pullup.mp4" poster="/videos/posters/cody-pullup.jpg" controls playsInline preload="metadata" />
            </div>
            <p className="text-center font-body text-sm sm:text-base text-fg/90 leading-relaxed max-w-sm mx-auto">
              Cody could barely manage 3 pull-ups. We set the bar high, 12 in 4 months. He didn&rsquo;t just
              hit it, he smashed it.
            </p>
          </div>
        </div>
        <CtaButton label="Book a Free Call" />
      </div>
    </Section>
  );
}
