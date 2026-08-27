import connectDB from "@/lib/db/connection";
import RecruitmentModel, { TempRecruitmentUserModel } from "@/models/Recruitment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";

const OTP_TOKEN_EXPIRY = "10m";
const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCKOUT_MINUTES = 15;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

const transporter = createTransport({
  host: process.env.MAIL_SMTP,
  port: parseInt((process.env.MAIL_SMTP_PORT || "465") as string),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

/**
 * @swagger
 * /api/registration/recruitment:
 *   get:
 *     summary: Check if an email or phone is registered
 *     description: This endpoint checks if the provided email or phone is already registered for recruitment.
 *     tags:
 *      - Recruitment
 *     parameters:
 *       - in: query
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *           description: The email or phone number to check.
 *     responses:
 *       200:
 *         description: The identifier is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "email already exists"
 *                 isUnique:
 *                   type: boolean
 *                   example: false
 *       403:
 *         description: The identifier is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "email not registered"
 *                 isUnique:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 */
export async function GET(request: Request) {
  await connectDB();

  // Wait for connection with timeout
  const connectionTimeout = 10000;
  const startTime = Date.now();

  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - startTime > connectionTimeout) {
      throw new Error("Database connection timeout");
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");
    if (!identifier) {
      return NextResponse.json(
        { error: "identifier query parameter is required" },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (identifier && emailRegex.test(identifier)) {
      const existing = await Promise.race([
        RecruitmentModel.findOne({
          email: identifier,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email check timeout")), 5000)
        ),
      ]);
      if (existing) {
        return NextResponse.json(
          { message: "email already exists", isUnique: false },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "email not registered", isUnique: true },
        { status: 403 }
      );
    } else {
      const existing = await Promise.race([
        RecruitmentModel.findOne({
          whatsapp_number: identifier,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Phone check timeout")), 5000)
        ),
      ]);
      if (existing) {
        return NextResponse.json(
          { message: "phone already exists", isUnique: false },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "phone not registered", isUnique: true },
        { status: 403 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "An error occurred", details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

/**
 * @swagger
 * /api/registration/recruitment:
 *   post:
 *     summary: Handle recruitment actions
 *     description: This endpoint handles different recruitment actions like adding a registration.
 *     tags:
 *      - Recruitment
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           description: Action to perform (addRegistration, sendOTP, verifyOTP, checkDuplicates)
 *               email:
 *                 type: string
 *               whatsapp_number:
 *                 type: string
 *               college_id:
 *                 type: string
 *               year_of_study:
 *                 type: string
 *               branch:
 *                 type: string
 *               about:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation based on action.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operation successful!"
 *       400:
 *         description: Invalid action specified or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid action specified"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!action) {
      return NextResponse.json(
        { error: "Action parameter is required" },
        { status: 400 }
      );
    }

    if (action === "addRegistration") {
      return addRegistration(request);
    } else if (action === "sendOTP") {
      return sendOTP(request);
    } else if (action === "verifyOTP") {
      return verifyOTP(request);
    } else if (action === "checkDuplicates") {
      return checkDuplicates(request);
    } else {
      return NextResponse.json(
        { error: "Invalid action specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function checkDuplicates(request: Request) {
  try {
    await connectDB();

    // Wait for connection with timeout (same as addRegistration)
    const connectionTimeout = 10000;
    const startTime = Date.now();
    while (mongoose.connection.readyState !== 1) {
      if (Date.now() - startTime > connectionTimeout) {
        throw new Error("Database connection timeout");
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const { email, whatsapp_number, college_id } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();
    const normalizedCollegeId = college_id?.toUpperCase().trim();

    const [existingEmail, existingPhone, existingCollegeId] = await Promise.all([
      normalizedEmail
        ? RecruitmentModel.findOne({ email: normalizedEmail }).select("email").lean()
        : null,
      whatsapp_number
        ? RecruitmentModel.findOne({ whatsapp_number }).select("whatsapp_number").lean()
        : null,
      normalizedCollegeId
        ? RecruitmentModel.findOne({ college_id: normalizedCollegeId }).select("college_id").lean()
        : null,
    ]);

    const duplicates: string[] = [];
    if (existingEmail) duplicates.push("email");
    if (existingPhone) duplicates.push("phone");
    if (existingCollegeId) duplicates.push("college_id");

    if (duplicates.length > 0) {
      return NextResponse.json(
        { error: "Already registered", duplicates },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "No duplicates found" });
  } catch {
    return NextResponse.json(
      { error: "Failed to check duplicates" },
      { status: 500 }
    );
  }
}

function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

async function sendOTP(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds between sends per email

    // Per-email rate limit: reject if an OTP was sent recently
    const existingTemp = await TempRecruitmentUserModel.findOne({ email: normalizedEmail });
    if (existingTemp) {
      const elapsed = Date.now() - new Date((existingTemp as unknown as { createdAt: Date }).createdAt).getTime();
      if (elapsed < OTP_COOLDOWN_MS) {
        const retryAfter = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
        return NextResponse.json(
          { error: `Please wait ${retryAfter}s before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await TempRecruitmentUserModel.deleteMany({ email: normalizedEmail });
    await TempRecruitmentUserModel.create({
      email: normalizedEmail,
      otp,
      otpExpiresAt,
    });

    // Send OTP via Nodemailer
    await transporter.sendMail({
      from: `Point Blank <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Point Blank Recruitment - OTP Verification",
      html: `
        <p>Hello,</p>
        <p>Your OTP for recruitment registration is:</p>
        <h2 style="letter-spacing:8px;font-family:monospace;color:#22c55e;">${otp}</h2>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>Team Point Blank</p>
      `,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}

async function verifyOTP(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const tempUser = await TempRecruitmentUserModel.findOne({ email: normalizedEmail });
    if (!tempUser) {
      return NextResponse.json({ error: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
    }

    // Check if the account is locked due to too many failed attempts
    if (tempUser.lockedUntil && new Date() < new Date(tempUser.lockedUntil)) {
      const remaining = Math.ceil((new Date(tempUser.lockedUntil).getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Too many failed attempts. Please wait ${remaining} minute(s) or request a new OTP.` },
        { status: 429 }
      );
    }

    if (new Date() > new Date(tempUser.otpExpiresAt)) {
      await TempRecruitmentUserModel.deleteOne({ email: normalizedEmail });
      return NextResponse.json({ error: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
    }

    if (String(tempUser.otp).trim() !== cleanOtp) {
      // Track failed attempt
      tempUser.failedAttempts = (tempUser.failedAttempts || 0) + 1;

      if (tempUser.failedAttempts >= MAX_OTP_ATTEMPTS) {
        tempUser.lockedUntil = new Date(Date.now() + OTP_LOCKOUT_MINUTES * 60 * 1000);
        await tempUser.save();
        return NextResponse.json(
          { error: `Too many failed attempts. Please wait ${OTP_LOCKOUT_MINUTES} minutes or request a new OTP.` },
          { status: 429 }
        );
      }

      await tempUser.save();
      const remaining = MAX_OTP_ATTEMPTS - tempUser.failedAttempts;
      return NextResponse.json(
        { error: `Invalid OTP. ${remaining} attempt(s) remaining before lockout.` },
        { status: 400 }
      );
    }

    // OTP is correct — mark as verified and issue a single-use JWT token
    tempUser.isVerified = true;
    tempUser.verifiedAt = new Date();
    tempUser.failedAttempts = 0;
    tempUser.lockedUntil = null;
    await tempUser.save();

    const verificationToken = jwt.sign(
      { email: normalizedEmail, purpose: "otp_verified" },
      getJwtSecret(),
      { expiresIn: OTP_TOKEN_EXPIRY }
    );

    return NextResponse.json({ message: "OTP verified successfully", verificationToken });
  } catch {
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}

async function addRegistration(request: Request) {
  try {
    await connectDB();

    // Wait for connection with timeout
    const connectionTimeout = 10000;
    const startTime = Date.now();

    while (mongoose.connection.readyState !== 1) {
      if (Date.now() - startTime > connectionTimeout) {
        throw new Error("Database connection timeout");
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const data = await request.json();

    const { verificationToken, ...registrationData } = data;

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Email verification required. Please verify your OTP before registering." },
        { status: 403 }
      );
    }

    // Verify the JWT token
    let tokenPayload: { email: string; purpose: string };
    try {
      tokenPayload = jwt.verify(verificationToken, getJwtSecret()) as { email: string; purpose: string };
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired verification token. Please verify your OTP again." },
        { status: 403 }
      );
    }

    if (tokenPayload.purpose !== "otp_verified") {
      return NextResponse.json(
        { error: "Invalid verification token." },
        { status: 403 }
      );
    }

    const verifiedEmail = tokenPayload.email;

    // Ensure a verified temp record exists for this email (single-use)
    const verifiedRecord = await TempRecruitmentUserModel.findOne({
      email: verifiedEmail,
      isVerified: true,
    });

    if (!verifiedRecord) {
      return NextResponse.json(
        { error: "Verification record not found. The token may have already been used. Please verify your OTP again." },
        { status: 403 }
      );
    }

    // Delete the temp record to prevent reuse
    await TempRecruitmentUserModel.deleteOne({ email: verifiedEmail });

    // Ensure the email in the registration matches the verified email
    if (registrationData.email?.toLowerCase().trim() !== verifiedEmail) {
      return NextResponse.json(
        { error: "Email mismatch. The registration email must match the verified email." },
        { status: 403 }
      );
    }

    const data2 = registrationData;

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "whatsapp_number",
      "college_id",
      "year_of_study",
      "branch",
      "about",
    ];
    const missingFields = requiredFields.filter((field) => !data2[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate name is not just whitespace
    if (!data2.name || data2.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data2.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data2.whatsapp_number)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Must be 10 digits starting with 6-9",
        },
        { status: 400 }
      );
    }

    // Validate about word count (max 150 words)
    const aboutWordCount = data2.about.trim().split(/\s+/).filter(Boolean).length;
    if (aboutWordCount > 150) {
      return NextResponse.json(
        { error: `About section must be 150 words or less (you have ${aboutWordCount})` },
        { status: 400 }
      );
    }

    // Validate college_id based on year
    if (data2.year_of_study === "1st year") {
      const admissionNumberRegex = /^[1-9][0-9][A-Z]{4}[0-9]{4}$/;
      if (!admissionNumberRegex.test(data2.college_id)) {
        return NextResponse.json(
          {
            error:
              "Invalid Admission Number format for 1st year. Expected format: 19ABCD1234",
          },
          { status: 400 }
        );
      }
    } else {
      const usnRegex = /^[1][D][S][1-3][0-9][A-Z]{2}[0-9]{3}$/;
      if (!usnRegex.test(data2.college_id)) {
        return NextResponse.json(
          {
            error:
              "Invalid USN format for 2nd/3rd/4th year. Expected format: 1DS21CS123",
          },
          { status: 400 }
        );
      }
    }

    // Check if email, phone, or college_id already exists
    const [existingEmail, existingPhone, existingCollegeId] = await Promise.all(
      [
        Promise.race([
          RecruitmentModel.findOne({ email: data2.email }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Email check timeout")), 5000)
          ),
        ]),
        Promise.race([
          RecruitmentModel.findOne({ whatsapp_number: data2.whatsapp_number }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Phone check timeout")), 5000)
          ),
        ]),
        Promise.race([
          RecruitmentModel.findOne({ college_id: data2.college_id }),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("College ID check timeout")),
              5000
            )
          ),
        ]),
      ]
    );

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }

    if (existingCollegeId) {
      return NextResponse.json(
        { error: "College ID already registered" },
        { status: 400 }
      );
    }

    const newDoc = new RecruitmentModel(data2);

    await Promise.race([
      newDoc.save(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Save operation timeout")), 10000)
      ),
    ]);

    return NextResponse.json({ message: "Registration successful!" });
  } catch (error) {
    if (error instanceof Error) {
      // Handle Mongoose validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(
          (error as unknown as { errors: Record<string, { message: string }> }).errors
        ).map((err) => err.message);
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validationErrors,
            type: "validation_error",
          },
          { status: 400 }
        );
      }

      // Handle duplicate key errors
      if (
        error.name === "MongoServerError" &&
        error.message.includes("duplicate key")
      ) {
        return NextResponse.json(
          {
            error: "Duplicate entry detected",
            details: error.message,
            type: "duplicate_error",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to add registration",
        details: error instanceof Error ? error.message : String(error),
        type: "server_error",
      },
      { status: 500 }
    );
  }
}
