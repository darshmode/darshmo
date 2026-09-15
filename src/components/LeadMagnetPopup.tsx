"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUnlock } from "@/lib/unlock/useUnlock";

const SESSION_KEY = "mode_lead_popup_seen";
const SCROLL_TRIGGER_FRACTION = 0.4;

export default function LeadMagnetPopup() {
  const router = useRouter();
  const { unlocked, submitEmail } = useUnlock();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (unlocked) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // Private browsing / storage disabled: fall through, popup can still show once.
    }

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (fraction >= SCROLL_TRIGGER_FRACTION) {
        setVisible(true);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // ignore
        }
        window.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [unlocked]);

  function close() {
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const result = await submitEmail(email);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }
    router.push("/recipes");
  }

  if (!visible || unlocked) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full sm:max-w-md bg-surface border border-edge rounded-t-2xl sm:rounded-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted hover:text-fg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <h3 className="font-heading text-xl sm:text-2xl text-fg tracking-wide mb-6 pr-8">
          Want 5 high-protein Indian recipes with full macros and calories?
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            autoFocus
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg border border-edge rounded-lg px-4 py-3 font-body text-fg placeholder:text-muted focus:outline-none focus:border-muted"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#E8862B] hover:bg-[#D1751F] disabled:opacity-60 text-white font-heading text-base tracking-wide px-6 py-3 rounded-lg transition-colors duration-150"
          >
            {status === "loading" ? "Unlocking..." : "Send me the recipes"}
          </button>
          {status === "error" && <p className="font-body text-sm text-[#E8862B]">{message}</p>}
        </form>
      </div>
    </div>
  );
}
