"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calendlyUtm, currentSearch, withSearch } from "@/lib/tracking";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        utm?: Record<string, string>;
      }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/darsh-jkyh/30min";
const CALENDLY_ORIGIN = "https://calendly.com";

export default function SchedulePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);
  const redirected = useRef(false);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
    return () => {
      document.body.removeChild(s);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = calendlyRef.current;
    if (!el || !window.Calendly) return;
    window.Calendly.initInlineWidget({
      url: CALENDLY_URL,
      parentElement: el,
      utm: calendlyUtm(currentSearch()),
    });
  }, [ready]);

  // Calendly's inline embed posts progress events to the parent window. The
  // free plan has no redirect setting, so the "booking confirmed" event is
  // what sends people to /booked instead.
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== CALENDLY_ORIGIN) return;
      const event = e.data?.event;
      if (typeof event !== "string" || !event.startsWith("calendly.")) return;
      if (event !== "calendly.event_scheduled") return;

      // The widget can fire more than once; only the first one should navigate.
      if (redirected.current) return;
      redirected.current = true;
      router.push(withSearch("/booked", currentSearch()));
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-16">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/darshmode-logo-transparent.png"
            alt="MODE"
            width={928}
            height={240}
            className="h-8 w-auto object-contain"
          />
        </Link>

        <h1 className="font-heading text-2xl sm:text-3xl tracking-wide mb-2">Thanks, that&rsquo;s noted.</h1>
        <p className="font-body text-muted mb-8">Pick a time below that works for you.</p>

        <div className="bg-white rounded-xl overflow-hidden">
          {/* Calendly lays out vertically on narrow screens, so it needs more
              height on mobile to avoid scrolling inside the iframe. */}
          <div ref={calendlyRef} className="w-full min-w-[280px] h-[1050px] sm:h-[700px]" />
        </div>
      </div>
    </main>
  );
}
