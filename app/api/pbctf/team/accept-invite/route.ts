import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import TeamInvite from "@/lib/db/models/TeamInvite";
import CtfRegsModel from "@/lib/db/models/CTFRegs";
import { ratelimiter } from "@/lib/ratelimiter";
import { verifyRecaptchaToken } from "@/app/api/pbctf/route";

function getClientIp(request: Request): string {
  const headers = [
    "cf-connecting-ip",
    "x-client-ip",
    "x-real-ip",
    "x-forwarded-for"
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      if (header === "x-forwarded-for") {
        const parts = value.split(",");
        const ip = parts[0]?.trim();
        if (ip) return ip;
      } else {
        const ip = value.trim();
        if (ip) return ip;
      }
    }
  }

  return "127.0.0.1";
}

export async function POST(
  request: Request
) {

  try {
    const ip = getClientIp(request);
 
    let isRateLimited = false;
    if (ratelimiter) {
      try {
        const limitResult = await ratelimiter.limit(ip);
        if (!limitResult.success) {
          isRateLimited = true;
        }
      } catch (limiterError) {
        console.error("Rate limiter error, failing open:", limiterError);
      }
    } else {
      console.warn("Rate limiter not configured, skipping rate limit check.");
    }

    if (isRateLimited) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    await connectDB();
    const body = await request.json();
    const {
      token,
      recaptcha_token,
      participant,
    } = body;

    const recaptchaValidation = await verifyRecaptchaToken(recaptcha_token);
    if (!recaptchaValidation.ok) {
      return NextResponse.json(recaptchaValidation.body, {
        status: recaptchaValidation.status,
      });
    }

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

      status: "pending",

      expiresAt: {
        $gt: new Date(),
      },
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
    await TeamInvite.updateOne(
    {
      _id: invite._id,
    },
    {
      status: "accepted",
    }
  );

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