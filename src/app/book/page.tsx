"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { currentSearch, withSearch } from "@/lib/tracking";

const TALLY_FORM_ID = "81BMPo";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

export default function BookPage() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function loadEmbeds() {
      if (window.Tally) {
        window.Tally.loadEmbeds();
        return;
      }
      document
        .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
        .forEach((el) => {
          el.src = el.dataset.tallySrc || "";
        });
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://tally.so/widgets/embed.js"]');
    if (existing) {
      loadEmbeds();
    } else {
      const s = document.createElement("script");
      s.src = "https://tally.so/widgets/embed.js";
      s.onload = loadEmbeds;
      s.onerror = loadEmbeds;
      document.body.appendChild(s);
    }
  }, []);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      let data = e.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (data?.event === "Tally.FormSubmitted") {
        // Carry any tracking params on to Calendly and, after that, /booked.
        router.push(withSearch("/schedule", currentSearch()));
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-16">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/darshmode-logo-transparent.png"
            alt="MODE"
            width={928}
            height={240}
            className="h-8 w-auto object-contain"
          />
        </Link>

        <h1 className="font-heading text-2xl sm:text-3xl tracking-wide mb-2">Book Your Free Discovery Call</h1>
        <p className="font-body text-muted mb-8">A few quick questions, then pick a time that works for you.</p>

        <div className="bg-white rounded-xl overflow-hidden">
          <iframe
            ref={iframeRef}
            data-tally-src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&dynamicHeight=1`}
            loading="lazy"
            width="100%"
            height="1400"
            title="MODE Coaching: Discovery Call Application"
          />
        </div>
      </div>
    </main>
  );
}
