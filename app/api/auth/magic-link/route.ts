import { NextRequest, NextResponse } from "next/server";
import { verifyLoginToken } from "@/lib/server/auth";
import connectDB from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  await connectDB()
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin?error=missing_token", request.url),
    );
  }

  const sessionToken = await verifyLoginToken(token);

  if (!sessionToken || typeof sessionToken !== "string") {
    return NextResponse.redirect(
      new URL("/admin?error=invalid_token", request.url),
    );
  }

  const response = NextResponse.redirect(
    new URL("/admin", request.url),
  );
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return response;
}
