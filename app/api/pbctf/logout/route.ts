import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/connection";
import PBCTFRefreshToken from "@/lib/db/models/CTFRefreshToken";

export async function POST() {
  await connectDB();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("pbctf_refresh")?.value;

  if (refreshToken) {
    const tokens = await PBCTFRefreshToken.find({});

    for (const tokenDoc of tokens) {
      const matched =
        await bcrypt.compare(
          refreshToken,
          tokenDoc.tokenHash
        );

      if (matched) {
        await tokenDoc.deleteOne();
        break;
      }
    }
  }

  const response =
    NextResponse.json({
      success: true,
    });

  response.cookies.set(
    "pbctf_access",
    "",
    {
      expires: new Date(0),
      path: "/",
    }
  );

  response.cookies.set(
    "pbctf_refresh",
    "",
    {
      expires: new Date(0),
      path: "/",
    }
  );

  return response;
}