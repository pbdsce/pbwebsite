import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/lib/db/connection";
import PBCTFRefreshToken from "@/lib/db/models/CTFRefreshToken";
import generateAccessToken from "@/lib/pbctf/generateAccessToken";
import generateRefreshToken from "@/lib/pbctf/generateRefreshToken";

export async function POST() {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const refreshToken =
      cookieStore.get("pbctf_refresh")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: "Refresh token missing",
        },
        {
          status: 401,
        }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const matchedToken =
      await PBCTFRefreshToken.findOne({
        tokenHash,
      });

    if (!matchedToken) {
  const response =
    NextResponse.json(
      {
        error:
          "Invalid refresh token",
      },
      {
        status: 401,
      }
    );

  response.cookies.set(
    "pbctf_access",
    "",
    {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure:
        process.env.NODE_ENV ===
        "production",
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
      secure:
        process.env.NODE_ENV ===
        "production",
    }
  );

  return response;
}

    if (
  matchedToken.expiresAt <
  new Date()
) {
  await matchedToken.deleteOne();

  const response =
    NextResponse.json(
      {
        error:
          "Refresh token expired",
      },
      {
        status: 401,
      }
    );

  response.cookies.set(
    "pbctf_access",
    "",
    {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure:
        process.env.NODE_ENV ===
        "production",
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
      secure:
        process.env.NODE_ENV ===
        "production",
    }
  );

  return response;
}

    const newAccessToken =
      generateAccessToken(
        matchedToken.email
      );

    const newRefreshToken =
      generateRefreshToken();

    const newRefreshHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    matchedToken.tokenHash =
      newRefreshHash;

    matchedToken.expiresAt =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

    await matchedToken.save();

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      "pbctf_access",
      newAccessToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 10,
      }
    );

    response.cookies.set(
      "pbctf_refresh",
      newRefreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        path: "/",
        maxAge:
          24 * 60 * 60,
      }
    );

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}