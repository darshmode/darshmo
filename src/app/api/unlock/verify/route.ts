import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/unlock/token";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  const result = verifyAccessToken(token);
  return NextResponse.json(result, { status: 200 });
}
