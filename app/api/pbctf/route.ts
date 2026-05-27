import connectDB from "@/lib/db/connection";
import { ratelimiter } from "@/lib/ratelimiter";
import CtfRegsModel, { TempCTFUserModel } from "@/lib/db/models/CTFRegs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


type ParticipantInput = {
    name: string;
    email: string;
    phone: string;
    gender: string;
    experienceLevel: string;
    previousCTF: string;
    ctfNames?: string;
    affiliation: string;
    affiliationName: string;
    howDidYouHear?: string;
  };

type RecaptchaValidationResult =
  | { ok: true }
  | {
      ok: false;
      status: number;
      body: {
        message: string;
        error: string;
      };
    };

const PBCTF_REGISTRATION_FLAG = process.env.PBCTF_REGISTRATION_FLAG;

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Check if a USN is registered
 *     description: This endpoint checks if the provided USN is already registered for a participant.
 *     tags:
 *      - Registration
 *     parameters:
 *       - in: query
 *         name: usn
 *         required: true
 *         schema:
 *           type: string
 *           description: The USN of the participant.
 *     responses:
 *       200:
 *         description: The USN is either not registered or already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usn already exists"
 *                 isUnique:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Missing USN parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "usn is required"
 *       500:
 *         description: Internal server error while fetching data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
//Check if USN exists
export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (identifier && emailRegex.test(identifier)) {
      const existing = await CtfRegsModel.findOne({
        "participant1.email": identifier
      });
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
      const existing = await CtfRegsModel.findOne({
        $or: [
          { "participant1.phone": identifier },
          { "participant2.phone": identifier },
        ],
      });
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
      console.error("Error details:", error.message);
      return NextResponse.json(
        { error: "An error occurred", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Handle registration actions
 *     description: This endpoint handles different registration actions like reCAPTCHA validation, OTP sending, OTP verification, or adding a registration.
 *     tags:
 *      - Registration
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           description: Action to perform (validateRecaptcha, sendOTP, verifyOTP, addRegistration)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recaptcha_token:
 *                 type: string
 *                 description: The reCAPTCHA token for validation.
 *               email:
 *                 type: string
 *                 description: Email for OTP operations.
 *               otp:
 *                 type: string
 *                 description: OTP for verification.
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
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
 
    const { success } = await ratelimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    } 

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "validateRecaptcha") {
      return validateRecaptcha(request);
    } else if (action === "sendOTP") {
      return sendOTP(request);
    } else if (action === "verifyOTP") {
      return verifyOTP(request);
    } else if (action === "validateFlag") {
      return validateFlag(request);
    } else if (action === "addRegistration") {
      return addRegistration(request);
    } else if ( action === "sendLoginOTP") {
      return sendLoginOTP(request);
    } else {
      return NextResponse.json(
        { error: "Invalid action specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred", details: error },
      { status: 500 }
    );
  }
}

async function validateFlag(request: Request) {
  try {
    if (!PBCTF_REGISTRATION_FLAG) {
      return NextResponse.json(
        { valid: false, message: "Flag validation is not configured." },
        { status: 500 }
      );
    }

    const data = await request.json();
    const isValid =
      typeof data.secretFlag === "string" &&
      data.secretFlag === PBCTF_REGISTRATION_FLAG;

    return NextResponse.json(
      {
        valid: isValid,
        message: isValid
          ? "Excellent! You've found the flag!"
          : "Incorrect flag! Keep looking...",
      },
      { status: isValid ? 200 : 400 }
    );
  } catch (error) {
    console.error("Error validating flag:", error);
    return NextResponse.json(
      { valid: false, message: "Unable to check the flag. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/registrations/validateRecaptcha:
 *   post:
 *     summary: Validate reCAPTCHA token
 *     description: This endpoint validates the reCAPTCHA token to verify if the user is human.
 *     tags:
 *      - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recaptcha_token:
 *                 type: string
 *                 description: The reCAPTCHA token for validation.
 *     responses:
 *       200:
 *         description: reCAPTCHA validated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recaptcha validated!"
 *       500:
 *         description: reCAPTCHA validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "reCAPTCHA validation failed"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad Request when reCAPTCHA token is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "reCAPTCHA token not found! Try again"
 */
async function verifyRecaptchaToken(
  recaptchaToken: unknown,
  expectedAction = "submit"
): Promise<RecaptchaValidationResult> {
  if (!recaptchaToken || typeof recaptchaToken !== "string") {
    return {
      ok: false,
      status: 400,
      body: {
        message: "reCAPTCHA token not found! Try again",
        error: "reCAPTCHA token not found!",
      },
    };
  }

  if (
    !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    !process.env.RECAPTCHA_PROJECT ||
    !process.env.RECAPTCHA_API_KEY
  ) {
    return {
      ok: false,
      status: 500,
      body: {
        message: "reCAPTCHA is not configured on the server.",
        error: "Missing reCAPTCHA environment variables",
      },
    };
  }

  const details = {
    event: {
      token: recaptchaToken,
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      expectedAction,
    },
  };

  const recaptchaResponse = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    }
  );

  const recaptchaResult = await recaptchaResponse.json();
  if (!recaptchaResponse.ok) {
    console.error("reCAPTCHA API error:", recaptchaResult);
    return {
      ok: false,
      status: 500,
      body: {
        message: "reCAPTCHA validation failed.",
        error: recaptchaResult.error?.message || "Google reCAPTCHA API error",
      },
    };
  }

  if (!recaptchaResult.tokenProperties?.valid) {
    return {
      ok: false,
      status: 400,
      body: {
        message: "reCAPTCHA token is invalid.",
        error: recaptchaResult.tokenProperties?.invalidReason || "Invalid token",
      },
    };
  }

  if (recaptchaResult.tokenProperties?.action !== expectedAction) {
    return {
      ok: false,
      status: 400,
      body: {
        message: "reCAPTCHA token is invalid.",
        error: "Invalid reCAPTCHA action",
      },
    };
  }

  if ((recaptchaResult.riskAnalysis?.score ?? 0) < 0.7) {
    return {
      ok: false,
      status: 400,
      body: {
        message: "reCAPTCHA validation failed.",
        error: "Low reCAPTCHA score",
      },
    };
  }

  return { ok: true };
}

async function validateRecaptcha(request: Request) {
  try {
    const formData = await request.json();
    const validation = await verifyRecaptchaToken(formData.recaptcha_token);

    if (!validation.ok) {
      return NextResponse.json(validation.body, { status: validation.status });
    }

    return NextResponse.json({ message: "Recaptcha validated!" });
  } catch (error) {
    console.error("Error validating reCAPTCHA:", error);
    return NextResponse.json(
      {
        message: "reCAPTCHA validation failed.",
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/registrations/sendOTP:
 *   post:
 *     summary: Send OTP for registration
 *     description: This endpoint sends an OTP to the provided email and stores registration data temporarily.
 *     tags:
 *      - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to send OTP to.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Missing email or registration data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email and registration data required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
async function sendOTP(request: Request) {
  try {
    await connectDB();
    while (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    const existingReg = await Promise.race([
      CtfRegsModel.findOne({
        $or: [
          { "participant1.email": email },
          { "participant2.email": email },
        ],
      }).lean(), 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 8000)
      )
    ]);

    if (existingReg) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Promise.race([
      TempCTFUserModel.findOneAndUpdate(
        { email },
        { otp, otpExpiresAt },
        { upsert: true }
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OTP save timeout')), 8000)
      )
    ]);
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: `"CTF Registration" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `[PBCTF 5.0] Email Verification OTP: ${otp}`,
      text: `
      Your OTP for PBCTF 5.0 is:

      >>> ${otp} <

      It is valid for 10 minutes before it self-destructs.

      - PointBlank`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error sending PBCTF OTP:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/registrations?action=verifyOTP:
 *   post:
 *     summary: Verify OTP for CTF registration
 *     description: This endpoint verifies the OTP sent to the user's email. It only validates the OTP and does not complete the registration process.
 *     tags:
 *      - Registration
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [verifyOTP]
 *           description: Must be set to "verifyOTP"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address where OTP was sent
 *                 example: "user@domain.com"
 *               otp:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 description: The 6-digit OTP received via email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully!"
 *       400:
 *         description: Bad request - Missing fields or invalid/expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum: 
 *                     - "Email and OTP required"
 *                     - "Invalid or expired OTP"
 *                   examples:
 *                     missing_fields:
 *                       value: "Email and OTP required"
 *                     invalid_otp:
 *                       value: "Invalid or expired OTP"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
async function verifyOTP(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }
    const tempUser = await TempCTFUserModel.findOne({ email });

    if (!tempUser) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    const isOTPValid = tempUser.otp === otp;
    const isOTPExpired = tempUser.otpExpiresAt < new Date();
    if (!isOTPValid || isOTPExpired) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "OTP verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/registrations/addRegistration:
 *   post:
 *     summary: Add a new registration
 *     description: This endpoint allows users to register for the event.
 *     tags:
 *      - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant1:
 *                 type: object
 *                 properties:
 *                   usn:
 *                     type: string
 *                     description: The USN of participant 1.
 *               participationType:
 *                 type: string
 *                 description: Type of participation.
 *     responses:
 *       200:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful!"
 *       400:
 *         description: Invalid data, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid data. Participant1 and participationType are required."
 */
async function addRegistration(request: Request) {
  try {
    const data = await request.json();
    if (!data || !data.participant1 || !data.participationType) {
      return NextResponse.json(
        {
          error:
            "Invalid data. Participant1 and participationType are required.",
        },
        { status: 400 }
      );
    }

    if (!PBCTF_REGISTRATION_FLAG) {
      return NextResponse.json(
        {
          message: "Flag validation is not configured.",
          error: "Missing PBCTF_REGISTRATION_FLAG environment variable",
        },
        { status: 500 }
      );
    }

    if (
      typeof data.secretFlag !== "string" ||
      data.secretFlag !== PBCTF_REGISTRATION_FLAG
    ) {
      return NextResponse.json(
        {
          message: "Incorrect flag! Keep looking...",
          error: "Incorrect flag",
        },
        { status: 400 }
      );
    }

    const recaptchaValidation = await verifyRecaptchaToken(
      data.recaptcha_token
    );

    if (!recaptchaValidation.ok) {
      return NextResponse.json(recaptchaValidation.body, {
        status: recaptchaValidation.status,
      });
    }

    await connectDB();

    const transformParticipant = (p: ParticipantInput) => {
      if (!p) return undefined;

      return {
        name: p.name,
        email: p.email,
        phone: p.phone,
        gender: p.gender,
        background: {
          experienceLevel: p.experienceLevel,
          previousParticipation: p.previousCTF === "Yes",
          participationDetails:
            p.previousCTF === "Yes" ? p.ctfNames : undefined,
          affiliationType: p.affiliation,
          affiliationName: p.affiliationName,
          howDidYouHearAboutUs: p.howDidYouHear,
        },
      };
    };

    const registrationData = {
      participant1: transformParticipant(data.participant1),
      participant2:
        data.participationType === "duo"
          ? transformParticipant(data.participant2)
          : undefined,
      participationType: data.participationType,
    };

    const newDoc = new CtfRegsModel(registrationData);
    await newDoc.save();
    return NextResponse.json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error adding registration:", error);
    return NextResponse.json(
      { error: "Failed to add registration.", details: error },
      { status: 500 }
    );
  }
}

async function sendLoginOTP(request: Request) {
  try {
    await connectDB();

    const { email } =
      await request.json();

    if (!email) {
      return NextResponse.json(
        {error: "Email required",},
        { status: 400 }
      );
    }

    const existingReg =
      await CtfRegsModel.findOne({
        "participant1.email": email,
      });

    if (!existingReg) {
      return NextResponse.json(
        {
          error:
            "User not registered",
        },
        { status: 404 }
      );
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    const otpExpiresAt =
      new Date(
        Date.now() +
          10 * 60 * 1000
      );

    await TempCTFUserModel.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiresAt,
      },
      { upsert: true }
    );

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
      from: `"PBCTF Login" <${process.env.MAIL_USER}>`,
      to: email,
      subject:
        "[PBCTF] Login OTP",
      text: `
Your PBCTF login OTP is:

${otp}

Valid for 10 minutes.
      `,
    });

    return NextResponse.json({
      message:
        "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
