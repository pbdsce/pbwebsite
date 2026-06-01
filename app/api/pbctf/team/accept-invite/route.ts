import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import TeamInvite from "@/lib/db/models/TeamInvite";
import CtfRegsModel from "@/lib/db/models/CTFRegs";

export async function POST(
  request: Request
) {

  try {

    await connectDB();
    const body = await request.json();
    const {
      token,
      participant,
    } = body;

    if (!token || !participant) {

      return NextResponse.json(
        {
          error:
            "Invalid request",
        },
        {
          status: 400,
        }
      );
    }

    const invite =
      await TeamInvite.findOne({
        token,
      });

    if (!invite) {

      return NextResponse.json(
        {
          error:
            "Invite expired or invalid",
        },
        {
          status: 404,
        }
      );
    }

    const registration =
      await CtfRegsModel.findById(
        invite.teamId
      );

    if (!registration) {

      return NextResponse.json(
        {
          error: "Team not found",
        },
        {
          status: 404,
        }
      );
    }

    // CHECK TEAM FULL FIRST
    if (
      registration?.participant2?.email
    ) {

      return NextResponse.json(
        {
          error: "Team already full",
        },
        {
          status: 400,
        }
      );
    }

    // VERIFY INVITED EMAIL
    if (
      participant.email !== invite.email
    ) {

      return NextResponse.json(
        {
          error: "Invite email mismatch",
        },
        {
          status: 400,
        }
      );
    }

    // PREVENT DUPLICATE REGISTRATIONS
    const existingUser =
      await CtfRegsModel.findOne({
        $or: [
          {
            "participant1.email":
              participant.email,
          },
          {
            "participant2.email":
              participant.email,
          },
        ],
      });

    if (existingUser) {

      return NextResponse.json(
        {
          error:
            "Email already registered",
        },
        {
          status: 400,
        }
      );
    }

    // ADD PARTICIPANT 2
    await CtfRegsModel.findByIdAndUpdate(
      invite.teamId,
      {
        $set: {
          participant2: {
            ...participant,

            role: "Member",
          },

          participationType:
            "duo",
        },
      }
    );

    // DELETE USED INVITE
    await invite.deleteOne();

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