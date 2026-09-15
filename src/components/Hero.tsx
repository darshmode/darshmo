"use client";

import { useRef, useState } from "react";
import CtaButton from "./CtaButton";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-v3.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-bg/70 border border-edge text-fg hover:bg-bg/90 transition-colors"
      >
        {muted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
            <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
            <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/75 to-transparent pt-40 pb-10 sm:pb-14 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl tracking-wide text-fg leading-tight mb-4">
            Doing all the right things, but still not seeing your body change?
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-fg/85 leading-relaxed mb-8">
            Lose fat, build muscle, and move like you&rsquo;re 10 years younger. 1:1 coaching to reveal what
            you&rsquo;re really capable of.
          </p>
          <CtaButton label="Book a Free Discovery Call" variant="amber" />
        </div>
      </div>
    </section>
  );
}
