import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/unlock/token";
import { issueAndSendAccess } from "@/lib/unlock/issueAndSend";

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

  const result = await issueAndSendAccess(email);
  return NextResponse.json(result, { status: 200 });
}
