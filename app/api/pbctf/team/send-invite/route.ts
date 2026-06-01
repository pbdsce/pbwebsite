import crypto from "crypto";
import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/pbctf/getCurrentUser";
import TeamInvite from "@/lib/db/models/TeamInvite";
import connectDB from "@/lib/db/connection";
import nodemailer from "nodemailer";
import CtfRegsModel from "@/lib/db/models/CTFRegs";

export async function POST(
  request: Request
) {

  await connectDB();

  const user =
    await getCurrentUser();

  if (!user) {

    return NextResponse.json(
      {
        error: "Unauthorized",
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
          "Only owner can invite members",
      },
      {
        status: 403,
      }
    );
  }

  const registration = user.registration;
  const body = await request.json();
  const { email } = body;

  if (registration.participant2) {
    return NextResponse.json(
      {
        error:
          "Team already full",
      },
      {
        status: 400,
      }
    );
  }

  const existingUser =
  await CtfRegsModel.findOne({
    $or: [
      {
        "participant1.email":
          email,
      },
      {
        "participant2.email":
          email,
      },
    ],
  });

if (existingUser) {
  return NextResponse.json(
    {
      error:
        "This email is already registered",
    },
    {
      status: 400,
    }
  );
}

  if (!email) {
    return NextResponse.json(
      {
        error:
          "Email required",
      },
      {
        status: 400,
      }
    );
  }
  const existingInvite =
  await TeamInvite.findOne({
    email,
  });
  if (existingInvite) {
    return NextResponse.json(
      {
        error:
          "Invite already sent to this email",
      },
      {
        status: 400,
      }
    );
  }
  
  const token =
    crypto.randomBytes(32)
    .toString("hex");

  await TeamInvite.create({
    teamId:
      registration._id,
      email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const inviteLink =
    `${process.env.NEXT_PUBLIC_BASE_URL}/pbctf/invite/${token}`;

  
const transporter =
  nodemailer.createTransport({
    host: process.env.MAIL_SMTP,

    port: 465,

    secure: true,

    auth: {
      user:
        process.env.MAIL_USER,

      pass:
        process.env.MAIL_PASS,
    },
  });

await transporter.sendMail({
  from:
    `"PBCTF Team Invite" <${process.env.MAIL_USER}>`,
  to: email,
  subject:
    "[PBCTF 5.0] Team Invitation",
  html: `
    <div style="font-family: sans-serif;">
      <h2>
        PBCTF Team Invitation
      </h2>
      <p>
        You have been invited to join a PBCTF team.
      </p>
      <p>
        Click below to accept the invite:
      </p>
      <a href="${inviteLink}">
        Accept Invite
      </a>
      <p>
        This invite expires in 24 hours.
      </p>
      <br />
      <p>
        - PointBlank
      </p>
    </div>
  `,
});
  return NextResponse.json({
    success: true,
  });
}