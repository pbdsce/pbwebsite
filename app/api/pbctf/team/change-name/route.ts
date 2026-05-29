import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/pbctf/getCurrentUser";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized",},
      { status: 401,}
    );
  }

  if (!user.isLeader) {
    return NextResponse.json(
      { error: "Only team leader can change team name",},
      { status: 403,}
    );
  }

  const body = await request.json();
  const { teamName } = body;

  user.registration.teamName = teamName;

  await user.registration.save();

  return NextResponse.json({
    success: true,
  });
}