import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/lib/db/connection";
import PBCTFRefreshToken from "@/lib/db/models/CTFRefreshToken";
import generateAccessToken from "@/lib/pbctf/generateAccessToken";
import generateRefreshToken from "@/lib/pbctf/generateRefreshToken";

type RefreshResult =
  | {
      success: true;
      accessToken: string;
      refreshToken: string;
    }
  | {
      success: false;
      status: number;
      error: string;
    };

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("pbctf_access", "", {
    ...cookieOptions,
    expires: new Date(0),
  });

  response.cookies.set("pbctf_refresh", "", {
    ...cookieOptions,
    expires: new Date(0),
  });

  return response;
}

function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set("pbctf_access", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 10,
  });

  response.cookies.set("pbctf_refresh", refreshToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60,
  });

  return response;
}

async function rotateRefreshToken(): Promise<RefreshResult> {
  await connectDb();

  const cookieStore = await cookies();
  const refreshToken =
    cookieStore.get("pbctf_refresh")?.value;

  if (!refreshToken) {
    return {
      success: false,
      status: 401,
      error: "Refresh token missing",
    };
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
    return {
      success: false,
      status: 401,
      error: "Invalid refresh token",
    };
  }

  if (matchedToken.expiresAt < new Date()) {
    await matchedToken.deleteOne();

    return {
      success: false,
      status: 401,
      error: "Refresh token expired",
    };
  }

  const newAccessToken =
    generateAccessToken(matchedToken.email);
  const newRefreshToken =
    generateRefreshToken();

  const newRefreshHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  matchedToken.tokenHash = newRefreshHash;
  matchedToken.expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await matchedToken.save();

  return {
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

function getSafeNextUrl(request: NextRequest) {
  const next =
    request.nextUrl.searchParams.get("next") ||
    "/pbctf/dashboard";

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/pbctf/dashboard";
  }

  return next;
}

export async function GET(request: NextRequest) {
  try {
    const result = await rotateRefreshToken();

    if (!result.success) {
      const response = NextResponse.redirect(
        new URL("/pbctf/login", request.url)
      );

      return clearAuthCookies(response);
    }

    const response = NextResponse.redirect(
      new URL(getSafeNextUrl(request), request.url)
    );

    return setAuthCookies(
      response,
      result.accessToken,
      result.refreshToken
    );
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(
      new URL("/pbctf/login", request.url)
    );
  }
}

export async function POST() {
  try {
    const result = await rotateRefreshToken();

    if (!result.success) {
      const response = NextResponse.json(
        {
          error: result.error,
        },
        {
          status: result.status,
        }
      );

      return clearAuthCookies(response);
    }

    const response = NextResponse.json({
      success: true,
    });

    return setAuthCookies(
      response,
      result.accessToken,
      result.refreshToken
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
