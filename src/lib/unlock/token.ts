import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stateless "email as key" tokens. No database: a token is just an email,
 * base64url-encoded, plus an HMAC signature keyed by UNLOCK_SECRET. Anyone
 * holding a valid token proves they were emailed one for that address, and
 * the same email always regenerates the same token (so resending "your link
 * again" needs nothing stored anywhere).
 */

function getSecret(): string {
  const secret = process.env.UNLOCK_SECRET;
  if (!secret) {
    throw new Error("UNLOCK_SECRET is not set. Add it to your environment before using the unlock flow.");
  }
  return secret;
}

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function createAccessToken(email: string): string {
  const normalized = normalizeEmail(email);
  const secret = getSecret();
  const payload = base64url(Buffer.from(normalized, "utf8"));
  const signature = base64url(createHmac("sha256", secret).update(payload).digest());
  return `${payload}.${signature}`;
}

export function verifyAccessToken(token: string): { valid: boolean; email?: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payload, signature] = parts;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return { valid: false };
  }

  const expected = base64url(createHmac("sha256", secret).update(payload).digest());
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false };
  }

  try {
    const email = Buffer.from(payload, "base64url").toString("utf8");
    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}
