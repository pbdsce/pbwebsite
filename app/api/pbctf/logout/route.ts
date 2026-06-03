import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/db/connection";
import PBCTFRefreshToken from "@/lib/db/models/CTFRefreshToken";

export async function POST() {
  await connectDB();

  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("pbctf_refresh")?.value;

  if (refreshToken) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await PBCTFRefreshToken.deleteOne({
      tokenHash,
    });
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(
    "pbctf_access",
    "",
    {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    }
  );

  response.cookies.set(
    "pbctf_refresh",
    "",
    {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    }
  );

  return response;
}