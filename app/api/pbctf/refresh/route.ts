import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db/connection";
import PBCTFRefreshToken from "@/lib/db/models/CTFRefreshToken";
import generateAccessToken from "@/lib/pbctf/generateAccessToken";
import generateRefreshToken from "@/lib/pbctf/generateRefreshToken";
import connectDB from "@/lib/db/connection";

export async function POST() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("pbctf_refresh")?.value;

    if(!refreshToken) {
      return NextResponse.json({
        error: "Refresh token missing"
      },
      {
        status: 401
      }
    );
    }

    const tokens = await PBCTFRefreshToken.find({});
    let matchedToken = null;

    for(const tokenDoc of tokens) {
      const matched = await bcrypt.compare(refreshToken, tokenDoc.tokenHash);
      if(matched) {
        matchedToken = tokenDoc;
        break;
      }
    }
    if(!matchedToken){
      return NextResponse.json({
        error: "Invalid refresh token",
      },
    { status: 401});
    }
    if(matchedToken.expiresAt < new Date()) {
      await matchedToken.deleteOne();
      return NextResponse.json({
        error: "Refresh token expired",
      },
      { status: 401}
      );
    }
    const newAccessToken = generateAccessToken(matchedToken.email);
    const newRefreshToken = generateRefreshToken();
    const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);
    matchedToken.tokenHash = newRefreshHash;
    matchedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 *1000);

    await matchedToken.save();
    const response = NextResponse.json(
      { success : true});
    
    response.cookies.set("pbctf_access", newAccessToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 10,
    });
    response.cookies.set("pbctf_refresh", newRefreshToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7*24*60*60,
    });
    return response;
  }
  catch(error) {
    console.error(error);
    return NextResponse.json({
      error: "Internal server error",
    },
  { status: 500}
 );
}
}