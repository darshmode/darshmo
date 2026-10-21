import type { Metadata } from "next";
import SpinePageClient from "./SpinePageClient";

export const metadata: Metadata = {
  title: "The 6 Minute Spine Routine | MODE",
  description:
    "The 6 minute spine mobility routine over 170,000 people watched on Instagram. Full follow along video, no kit needed.",
  openGraph: {
    title: "The 6 Minute Spine Routine | MODE",
    description: "Full follow along video. No kit, just you and the floor.",
    url: "https://www.darshmode.com/spine",
    siteName: "MODE",
  },
};

export default function SpinePage() {
  return <SpinePageClient />;
}
