import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/pbctf/getCurrentUser";
import PBCTFRefreshToken from "@/lib/db/models/CTFRefreshToken";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized",},
      { status: 401,}
    );
  }

  const registration = user.registration;
  const isLeader = user.isLeader;

  if (isLeader) {
    if (registration.participant2) {
      registration.participant1 = registration.participant2;
      registration.participant2 = undefined;
      registration.participationType = "solo";
      await registration.save();
    } 
    else {
      await registration.deleteOne();
    }
  } 
  else {
    registration.participant2 = undefined;
    registration.participationType = "solo";
    await registration.save();
  }

  await PBCTFRefreshToken.deleteMany({
   email: user.email,
  });

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