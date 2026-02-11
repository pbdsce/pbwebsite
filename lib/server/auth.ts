"use server";

import logger from "./logger";
import { createTransport } from "nodemailer";
import { redis } from "@/lib/ratelimiter";
import jwt from "jsonwebtoken";

export type JwtPayload = {
  email: string;
  role: "superadmin" | "admin";
};

export async function sendVerificationEmail(to: string): Promise<boolean> {


  const query = {
    query:
      "query Organization {\r\n  users(first: 250) {\r\n    nodes {\r\n      email\r\n    }\r\n  }\r\n}",
  };



  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.LINEAR_API_KEY as string,
    },
    body: JSON.stringify(query),
  });

  const { data } = await response.json();
  if (!data || !data.users || !data.users.nodes) {

    logger.warn(
      { module: "auth", provider: "linear" },
      "Invalid response from Linear API"
    );

    return false;
  }


  const emails = data.users.nodes.map((user: { email: string }) => user.email);
  if (!emails.includes(to)) {

    logger.warn(
      { module: "auth", email: to, action: "unauthorized_admin_login_attempt" },
      "Email not authorized for admin login"
    );

    return false;
  }


  const token = jwt.sign(
    {
      email: to,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const verificationLink = `${process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"}/admin/login?token=${token}`;
  await redis.set(`admin_login_${to}`, token, { ex: 15 * 60 }); // 15 minutes expiration

  logger.info(
    { module: "auth", provider: "redis", action: "verification_token_stored" },
    "Verification token stored in Redis"
  );

  try {
    const transporter = createTransport({
      host: process.env.MAIL_SMTP,
      pool: true,
      port: parseInt((process.env.MAIL_SMTP_PORT || 465) as string),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify((error: any) => {
      if (error) {
        logger.error(
          { module: "auth", provider: "smtp", err: error },
          "Email transporter verification failed"
        );
      }
    });

    transporter.sendMail(
      {
        to,
        from: `Webadmin - PointBlank <${process.env.MAIL_USER}>`,
        subject: "PointBlank - Login Link",
        html: `<p>Hello,</p>
<p>Click the link below to sign in to the admin panel:</p>
<a href="${verificationLink}">Sign In to Admin Panel</a>
<p>This link will expire in 15 minutes.</p>
<p>If you did not request this, please ignore this email.</p>
<p>Best regards,<br/>Team PointBlank</p>`,
        text: `Hello,\n\nClick the link below to sign in to the admin panel:\n\n${verificationLink}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nTeam PointBlank`,
      },
      (error: any, info: any) => {
        if (error) {
          logger.error(
            {
              module: "auth",
              provider: "smtp",
              action: "verification_email_failed",
              err: error,
            },
            "Failed to send verification email"
          );
        } else {
          logger.info(
            {
              module: "auth",
              provider: "smtp",
              action: "verification_email_sent",
            },
            "Verification email sent"
          );
        }
      }
    );
  } catch (error) {
    logger.error(
      { module: "auth", err: error },
      "Unhandled error during email sending"
    );
    return false;
  }

  return true;
}

export async function verifyLoginToken(
  token: string
): Promise<string | boolean> {
  try {
    const user: JwtPayload | null = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload | null;
    if (!user || !((await redis.get(`admin_login_${user?.email}`)) === token))
      return false;

    await redis.del(`admin_login_${user.email}`);
    return jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      process.env.SESSION_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return false;
    }
    logger.error(
      { module: "auth", err: error },
      "Login token verification failed"
    );

    return false;
  }
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const user: JwtPayload | null = jwt.verify(
      token,
      process.env.SESSION_SECRET as string
    ) as JwtPayload | null;

    if (!user) return null;
    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
    logger.error(
      { module: "auth", err: error },
      "Session token verification failed"
    );

    return null;
  }
}
