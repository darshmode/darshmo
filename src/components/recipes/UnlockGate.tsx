"use client";

import { useState } from "react";
import { SubmitResult } from "@/lib/unlock/useUnlock";

export default function UnlockGate({
  open,
  onClose,
  onSubmit,
  onUnlocked,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string, endpoint?: "/api/unlock" | "/api/unlock/resend") => Promise<SubmitResult>;
  onUnlocked: () => void;
}) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"unlock" | "resend">("unlock");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const result = await onSubmit(email, mode === "resend" ? "/api/unlock/resend" : "/api/unlock");
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }
    setStatus("done");
    setMessage(
      result.warning ??
        (mode === "resend"
          ? "Sent. Check your inbox for your access link."
          : "You're in. We've also emailed you a permanent link back to this page.")
    );
    onUnlocked();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-surface border border-edge rounded-t-2xl sm:rounded-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted hover:text-fg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {mode === "unlock" ? (
          <>
            <h3 className="font-heading text-xl sm:text-2xl text-fg tracking-wide mb-2 pr-8">
              Get all 5 recipes, the full shopping list, and the servings calculator.
            </h3>
            <p className="font-body text-sm text-muted mb-6">
              One email. Instant access on this device, plus a permanent link sent to your inbox so you can get back
              in on any device, any time.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-heading text-xl sm:text-2xl text-fg tracking-wide mb-2 pr-8">Get your link again</h3>
            <p className="font-body text-sm text-muted mb-6">
              Enter the email you used before and we'll send your access link again.
            </p>
          </>
        )}

        {status === "done" ? (
          <p className="font-body text-fg bg-bg border border-edge rounded-lg px-4 py-3">{message}</p>
        ) : (
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
              {status === "loading" ? "Unlocking..." : mode === "unlock" ? "Unlock all 5 recipes" : "Send my link"}
            </button>
            {status === "error" && <p className="font-body text-sm text-[#E8862B]">{message}</p>}
          </form>
        )}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "unlock" ? "resend" : "unlock");
            setStatus("idle");
            setMessage(null);
          }}
          className="mt-5 font-body text-xs text-muted hover:text-fg underline underline-offset-2 transition-colors"
        >
          {mode === "unlock" ? "Already unlocked this? Get your link again" : "Back to unlock"}
        </button>
      </div>
    </div>
  );
}
