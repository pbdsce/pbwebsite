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

  if (!user.isLeader) {
    return NextResponse.json(
      { error: "Only leader can transfer leadership",},
      { status: 403,}
    );
  }

  const registration = user.registration;

  if (!registration.participant2) {
    return NextResponse.json(
      { error: "No second participant exists",},
      { status: 400,}
    );
  }

  const oldLeader = registration.participant1;
  const newLeader = registration.participant2;
  oldLeader.role = "MEMBER";
  newLeader.role = "LEADER";
  registration.participant1 = newLeader;
  registration.participant2 = oldLeader;

  await registration.save();

  return NextResponse.json({ success: true,});
}