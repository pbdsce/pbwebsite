import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/pbctf/getCurrentUser";

export async function DELETE() {
  try {

    const user =
      await getCurrentUser();

    if (!user) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!user.isLeader) {

      return NextResponse.json(
        {
          error:
            "Only leader can remove members",
        },
        {
          status: 403,
        }
      );
    }

    const registration =
      user.registration;

    if (!registration.participant2) {

      return NextResponse.json(
        {
          error:
            "No member to remove",
        },
        {
          status: 400,
        }
      );
    }

    registration.participant2 =
      null;

    registration.participationType =
      "solo";

    await registration.save();

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}