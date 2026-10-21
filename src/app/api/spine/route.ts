import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/unlock/token";
import { subscribeToSpineList } from "@/lib/spine/subscribe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // A Brevo failure is logged but never blocks the video: the visitor asked
  // for the routine and should get it. Worst case they miss the emails.
  try {
    await subscribeToSpineList(email);
    return NextResponse.json({ ok: true, subscribed: true });
  } catch (err) {
    console.error("[spine] Brevo subscribe failed, unlocking video anyway", err);
    return NextResponse.json({ ok: true, subscribed: false });
  }
}
