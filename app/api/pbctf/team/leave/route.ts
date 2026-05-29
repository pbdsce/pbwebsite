import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/pbctf/getCurrentUser";

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

  return NextResponse.json({
    success: true,
  });
}