import Image from "next/image";
import CtaButton, { TrustBadges } from "@/components/CtaButton";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Empathy from "@/components/Empathy";
import WhoForNotFor from "@/components/WhoForNotFor";
import Testimonials from "@/components/Testimonials";
import PullUpProgression from "@/components/PullUpProgression";
import WhatsAppTestimonials from "@/components/WhatsAppTestimonials";
import ResultsGallery from "@/components/ResultsGallery";
import ComparisonTable from "@/components/ComparisonTable";
import YourStory from "@/components/YourStory";
import Faq from "@/components/Faq";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import { whatsappShotsBatch1, whatsappShotsBatch2 } from "@/lib/whatsappShots";

const resultsGridA = [
  { name: "Kapil", file: "kapil.png" },
  { name: "Meera", file: "meera.png" },
  { name: "Yury", file: "yury.png" },
  { name: "Rochelle", file: "rochelle.png" },
  { name: "Clint", file: "clint.png" },
  { name: "Krisha", file: "krisha.png" },
];

const resultsGridB = [
  { name: "Jitesh", file: "jitz.png" },
  { name: "Veena", file: "veena.png" },
  { name: "Tim", file: "tim.png" },
  { name: "Sej", file: "sej.png" },
  { name: "Cody", file: "cody.png" },
  { name: "Mariya", file: "mariya.png" },
];

export default function Home() {
  return (
    <main className="noise-bg">
      <Header />
      <Hero />
      <Empathy />
      <WhoForNotFor />
      <Testimonials />
      <PullUpProgression />
      <WhatsAppTestimonials heading="See what my students are saying" screenshots={whatsappShotsBatch1} />
      <YourStory />
      <ResultsGallery id="results" heading="Real Results" people={resultsGridA} />
      <WhatsAppTestimonials heading="More from my students" screenshots={whatsappShotsBatch2} />
      <ResultsGallery people={resultsGridB} />
      <ComparisonTable />
      <div className="py-16 md:py-24 flex justify-center">
        <CtaButton label="Book a Free Discovery Call" variant="amber" />
      </div>
      <Faq />

      <div className="py-14 flex flex-col items-center gap-10">
        <TrustBadges />
        <Image
          src="/darshmode-logo-transparent.png"
          alt="MODE"
          width={928}
          height={240}
          className="h-9 w-auto object-contain opacity-80"
        />
      </div>

      <LeadMagnetPopup />
    </main>
  );
}
