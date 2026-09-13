"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mode_recipes_unlock";

type StoredUnlock = { token: string };

function readStoredToken(): string | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUnlock;
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

function storeToken(token: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }));
  } catch {
    // Private browsing / storage disabled: unlock still works for this
    // page load, it just won't persist for next time.
  }
}

export type SubmitResult = { ok: true; emailSent: boolean; warning?: string } | { ok: false; error: string };

export function useUnlock() {
  const [unlocked, setUnlocked] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);

  useEffect(() => {
    const existing = readStoredToken();
    if (existing) {
      setUnlocked(true);
      setCheckingLink(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access");
    if (!accessToken) {
      setCheckingLink(false);
      return;
    }

    fetch(`/api/unlock/verify?token=${encodeURIComponent(accessToken)}`)
      .then((res) => res.json())
      .then((data: { valid: boolean }) => {
        if (data.valid) {
          storeToken(accessToken);
          setUnlocked(true);
        }
      })
      .catch(() => {
        // Bad link or offline: fall back to the normal gate below.
      })
      .finally(() => {
        params.delete("access");
        const query = params.toString();
        window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
        setCheckingLink(false);
      });
  }, []);

  const submitEmail = useCallback(async (email: string, endpoint: "/api/unlock" | "/api/unlock/resend" = "/api/unlock"): Promise<SubmitResult> => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error ?? "Something went wrong, try again." };
      }
      storeToken(data.token);
      setUnlocked(true);
      return { ok: true, emailSent: data.emailSent, warning: data.warning };
    } catch {
      return { ok: false, error: "Couldn't reach the server, check your connection and try again." };
    }
  }, []);

  return { unlocked, checkingLink, submitEmail };
}
