"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CtaButton from "@/components/CtaButton";

const VIDEO_ID = "_gs15z1lMTE";
const STORAGE_KEY = "mode_spine_unlock";

export default function SpinePageClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Returning visitors on the same device go straight to the video.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      // Storage blocked (private mode etc). They just see the form again.
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/spine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "Something went wrong. Try again.");
        return;
      }
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Ignore, unlock still works for this visit.
      }
      setUnlocked(true);
      setStatus("idle");
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } catch {
      setStatus("error");
      setError("Something went wrong. Check your connection and try again.");
    }
  }

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Header />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-16 sm:pt-16">
        <h1 className="font-heading text-3xl sm:text-5xl tracking-wide text-center leading-tight">
          The 6 Minute Spine Routine
        </h1>
        <p className="font-heading text-base sm:text-lg text-[#E8862B] tracking-wide text-center mt-4">
          Over 170,000 people watched it on Instagram. Here&rsquo;s the full follow along.
        </p>

        {unlocked ? (
          <>
            <div className="mt-10 aspect-video w-full overflow-hidden rounded-xl border border-edge bg-surface">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
                title="The 6 minute spine routine"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="font-body text-muted text-center mt-6 max-w-xl mx-auto leading-relaxed">
              Do it first thing in the morning or straight after a long stretch of sitting. Most days, for the next
              couple of weeks. I&rsquo;ve also emailed you the link so you&rsquo;ve always got it.
            </p>

            <div className="mt-14 bg-surface border border-edge rounded-2xl px-6 py-10 text-center">
              <h2 className="font-heading text-2xl sm:text-3xl tracking-wide">Want more than six minutes a day?</h2>
              <p className="font-body text-muted mt-3 max-w-lg mx-auto leading-relaxed">
                I coach people one to one and build training, mobility and food around their actual life. Desk,
                drives, family and all.
              </p>
              <CtaButton className="mt-8" />
            </div>
          </>
        ) : (
          <div className="mt-10 bg-surface border border-edge rounded-2xl p-6 sm:p-10">
            <p className="font-body text-fg text-base sm:text-lg leading-relaxed">
              For you if you sit most of the day, wake up stiff, or feel older in your back than you actually are.
            </p>
            <p className="font-body text-muted mt-3 leading-relaxed">
              No kit, just you and the floor. Pop your email in and the video unlocks right here, straight away.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-edge rounded-lg px-4 py-3 font-body text-fg placeholder:text-muted focus:outline-none focus:border-muted"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#E8862B] hover:bg-[#D1751F] disabled:opacity-60 text-white font-heading text-base sm:text-lg tracking-wide px-6 py-3 rounded-lg transition-colors duration-150"
              >
                {status === "loading" ? "Unlocking..." : "Send me the routine"}
              </button>
              {status === "error" && <p className="font-body text-sm text-[#E8862B]">{error}</p>}
            </form>

            <p className="font-body text-xs text-muted mt-4 leading-relaxed">
              You&rsquo;ll also get a few short emails from me on keeping your back feeling good. Unsubscribe any
              time.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
